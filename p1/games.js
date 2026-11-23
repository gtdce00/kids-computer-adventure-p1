/* =========================================================
   KIDS COMPUTER ADVENTURE ป.1 — games.js
   เกมกลางที่ใช้ซ้ำได้ทุกบทเรียน:
   clickFind (Click & Find / แบบทดสอบ) · shadowMatch (ลากวางจับคู่ภาพกับเงา)
   pickSort (แยกหมวดหมู่ลงตะกร้า) · end (สรุปผล ดาว คะแนน เล่นใหม่)
   ========================================================= */
(function () {
  'use strict';
  const K = window.KCA, A = window.ART, $ = K.$, $$ = K.$$, UI = K.UI, say = K.say, sfx = K.sfx;
  const shuffle = (a) => a.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
  const starsFromPct = (p) => (p >= 80 ? 3 : p >= 60 ? 2 : 1);
  const face = (it) => `<div class="face" style="background:${it.color}">${A.DEV[it.art]()}</div>`;
  const dots = (n, done) => `<div class="dots" aria-label="ข้อที่ ${Math.min(done + 1, n)} จาก ${n}">${Array.from({ length: n }, (_, i) => `<i class="${i < done ? 'on' : i === done ? 'cur' : ''}"></i>`).join('')}</div>`;

  /* ---------- Click & Find ----------
     mode 'practice' = ตอบได้หลายครั้ง มีคำใบ้ แสดงคำตอบเมื่อผิด 2 ครั้ง
     mode 'test'     = ตอบครั้งเดียว แล้วแสดงคำตอบที่ถูก                    */
  function clickFind(el, o) {
    const { rounds, item, mode, onDone } = o;
    let i = 0;
    const st = { correct: 0, attempts: 0, answers: [] };
    function round() {
      const r = rounds[i], target = item(r.target);
      const opts = shuffle(r.options.slice());
      let wrong = [], solved = false, hinted = false;
      el.innerHTML = `${dots(rounds.length, i)}<div class="cs"></div><div class="sil"></div>
        <div class="answers">${opts.map((id) => `<button class="acard" data-id="${id}" aria-label="ภาพตัวเลือก">${face(item(id))}<span class="lbl hide">${item(id).name}</span></button>`).join('')}</div>`;
      const coach = UI.coach($('.cs', el), { who: o.who || 'robo', mood: 'explaining', text: r.say });
      const silBox = $('.sil', el);
      const showSil = () => { if (r.kind === 'find') silBox.innerHTML = `<div class="silhouette" aria-label="ภาพเงา"><div class="face">${A.DEV[target.art]()}</div></div>`; };
      if (!K.audio.on) showSil();
      if (mode === 'practice') coach.hint(() => {
        hinted = true; showSil();
        const t = r.kind === 'find' ? 'ดูภาพเงาสีดำ แล้วหาภาพที่รูปร่างเหมือนกันนะ' : r.kind === 'odd' ? 'หาสิ่งที่ไม่ได้อยู่กับเครื่องคอมพิวเตอร์' : 'หาสิ่งที่อยู่กับเครื่องคอมพิวเตอร์';
        coach.set(t, 'explaining', 'tono');
      });
      const finish = () => {
        if (i + 1 >= rounds.length) { const score = Math.round((st.correct / rounds.length) * 100); onDone({ correct: st.correct, total: rounds.length, attempts: st.attempts, score, stars: starsFromPct(score), answers: st.answers }); }
        else { i++; round(); }
      };
      $$('.acard', el).forEach((b) => (b.onclick = () => {
        const id = b.dataset.id;
        if (solved || wrong.includes(id)) return;
        const first = wrong.length === 0;
        st.attempts++;
        if (id === r.target) {
          solved = true; sfx.ok(); UI.flash('ok');
          if (first) st.correct++;
          if (first || mode === 'test') st.answers.push({ id: r.id, chosen: id, correct: first });
          b.classList.remove('reveal'); b.classList.add('right'); $('.lbl', b).classList.remove('hide');
          $$('.acard', el).forEach((x) => (x.disabled = true));
          coach.hint(null);
          coach.set('ใช่แล้ว! ' + r.explain, 'happy', o.who || 'robo', false);
          say('ใช่แล้ว! ' + r.explain, () => K.later(finish, 350));
          return;
        }
        sfx.no(); UI.flash('no');
        wrong.push(id); b.classList.add('wrong'); $('.lbl', b).classList.remove('hide');
        if (mode === 'test') {
          solved = true;
          st.answers.push({ id: r.id, chosen: id, correct: false });
          const rb = $(`.acard[data-id="${r.target}"]`, el); rb.classList.add('right'); $('.lbl', rb).classList.remove('hide');
          $$('.acard', el).forEach((x) => (x.disabled = true));
          const t = 'คำตอบที่ถูกคือ ' + target.name;
          coach.set(t, 'thinking', o.who || 'robo', false);
          say(t, () => K.later(finish, 600));
          return;
        }
        if (first) st.answers.push({ id: r.id, chosen: id, correct: false });
        if (wrong.length >= 2) {
          const rb = $(`.acard[data-id="${r.target}"]`, el); rb.classList.add('reveal');
          coach.set('ภาพที่กระพริบสีเหลืองคือ ' + target.name + ' แตะเลย', 'explaining', 'tono');
        } else coach.set('นั่นคือ ' + item(id).name + ' ลองหาใหม่นะ', 'thinking', hinted ? 'tono' : o.who || 'robo');
      }));
    }
    round();
  }

  /* ---------- Picture Matching: ลากภาพไปวางบนเงา (หรือแตะภาพแล้วแตะเงา) ---------- */
  function shadowMatch(el, o) {
    const { sets, item, onDone } = o;
    const total = sets.flat().length;
    let r = 0;
    const st = { correct: 0, attempts: 0 };
    function round() {
      const ids = sets[r], shadows = shuffle(ids.slice()), pieces = shuffle(ids.slice());
      const placed = [], wrongs = {};
      let sel = null;
      el.innerHTML = `${dots(sets.length, r)}<div class="cs"></div>
        <div class="shadow-row">${shadows.map((id) => `<div class="drop" data-drop="${id}" aria-label="ภาพเงา">${A.DEV[item(id).art]().replace('class="art"', 'class="art face"')}</div>`).join('')}</div>
        <div class="piece-row">${pieces.map((id) => `<div class="piece" data-piece="${id}" role="button" tabindex="0" aria-label="${item(id).name}">${face(item(id))}</div>`).join('')}</div>`;
      const coach = UI.coach($('.cs', el), { who: 'robo', mood: 'idle', text: 'ลากภาพ ไปวางบนเงาที่เหมือนกัน' });
      const clearGlow = () => $$('.glow', el).forEach((x) => x.classList.remove('glow'));
      const select = (id) => { sel = sel === id ? null : id; $$('.piece', el).forEach((p) => p.classList.toggle('sel', p.dataset.piece === sel)); if (sel) coach.set('เลือก ' + item(id).name + ' แล้ว แตะเงาที่เหมือนกัน', 'idle', 'robo'); };
      coach.hint(() => {
        const t = sel || ids.find((x) => !placed.includes(x)); if (!t) return;
        clearGlow(); select(t); if (sel !== t) select(t);
        $(`[data-drop="${t}"]`, el).classList.add('glow'); $(`[data-piece="${t}"]`, el).classList.add('glow');
        coach.set(item(t).name + ' อยู่ที่เงาที่กระพริบ', 'explaining', 'tono');
      });
      const attempt = (pid, did) => {
        if (placed.includes(did)) return;
        st.attempts++;
        if (pid === did) {
          sfx.ok(); UI.flash('ok');
          if (!wrongs[pid]) st.correct++;
          placed.push(pid); sel = null; clearGlow();
          $(`[data-drop="${did}"]`, el).classList.add('ok');
          $(`[data-piece="${pid}"]`, el).remove();
          if (placed.length === ids.length) {
            if (r + 1 < sets.length) { coach.set('เก่งมาก! ไปชุดต่อไปกัน', 'happy', 'mimi'); K.later(() => { r++; round(); }, 1300); }
            else { coach.set('ครบแล้ว เยี่ยมไปเลย!', 'celebrating', 'mimi'); const score = Math.round((st.correct / total) * 100); K.later(() => onDone({ correct: st.correct, total, attempts: st.attempts, score, stars: starsFromPct(score) }), 1200); }
          } else coach.set('ถูกต้อง นี่คือ ' + item(pid).name, 'happy', 'robo');
          return;
        }
        sfx.no(); UI.flash('no');
        wrongs[pid] = (wrongs[pid] || 0) + 1;
        if (wrongs[pid] >= 2) { clearGlow(); $(`[data-drop="${pid}"]`, el).classList.add('glow'); coach.set('ดูเงาที่กระพริบ แล้ววางตรงนั้นนะ', 'explaining', 'tono'); }
        else coach.set('ยังไม่ใช่ ดูรูปร่างของเงาอีกครั้งนะ', 'thinking', 'robo');
      };
      $$('.piece', el).forEach((p) => K.draggable(p, (did) => attempt(p.dataset.piece, did), () => { sfx.tap(); select(p.dataset.piece); }));
      $$('.drop', el).forEach((d) => (d.onclick = () => { if (sel) attempt(sel, d.dataset.drop); }));
    }
    round();
  }

  /* ---------- Sorting: แยกภาพลงตะกร้า ---------- */
  function pickSort(el, o) {
    const { yesIds, noIds, item, onDone, yesLabel, noLabel } = o;
    const all = shuffle(yesIds.concat(noIds));
    const st = { correct: 0, attempts: 0 }, wrongs = {};
    let sel = null;
    el.innerHTML = `<div class="cs"></div>
      <div class="piece-row" style="margin-bottom:24px">${all.map((id) => `<div class="piece" data-piece="${id}" role="button" tabindex="0" aria-label="ภาพ ${item(id).name}">${face(item(id)).replace('style="', 'style="width:clamp(86px,11vw,118px);aspect-ratio:1;')}</div>`).join('')}</div>
      <div class="bins">
        <div class="bin drop" data-drop="yes" style="border-color:#42A5F5;background:var(--sky-soft)"><div class="bh"><span class="ico">${A.DEV.monitor()}</span>${yesLabel}</div><div class="got"></div></div>
        <div class="bin drop" data-drop="no" style="border-color:#FF91B8;background:var(--pink-soft)"><div class="bh"><span class="ico" style="color:#E35A8C">${A.ICON.x.replace('width="24" height="24"', 'width="44" height="44"')}</span>${noLabel}</div><div class="got"></div></div>
      </div>`;
    const coach = UI.coach($('.cs', el), { who: 'robo', mood: 'idle', text: 'ลากภาพใส่ตะกร้าให้ถูก อุปกรณ์คอมพิวเตอร์ใส่ตะกร้าสีฟ้า ไม่ใช่ใส่ตะกร้าสีชมพู' });
    const binOf = (id) => (yesIds.includes(id) ? 'yes' : 'no');
    const clearGlow = () => $$('.glow', el).forEach((x) => x.classList.remove('glow'));
    const select = (id) => { sel = sel === id ? null : id; $$('.piece', el).forEach((p) => p.classList.toggle('sel', p.dataset.piece === sel)); if (sel) coach.set('แตะตะกร้าที่ถูกต้อง', 'idle', 'robo'); };
    coach.hint(() => { const left = $$('.piece', el).map((p) => p.dataset.piece); const t = sel || left[0]; if (!t) return; if (sel !== t) select(t); clearGlow(); $(`[data-drop="${binOf(t)}"]`, el).classList.add('glow'); coach.set('ภาพที่เลือก ต้องใส่ตะกร้าที่กระพริบ', 'explaining', 'tono'); });
    const attempt = (id, bin) => {
      st.attempts++;
      if (binOf(id) === bin) {
        sfx.ok(); UI.flash('ok');
        if (!wrongs[id]) st.correct++;
        sel = null; clearGlow();
        $(`[data-piece="${id}"]`, el).remove();
        $(`[data-drop="${bin}"] .got`, el).insertAdjacentHTML('beforeend', `<span>${A.DEV[item(id).art]()}</span>`);
        if (!$$('.piece', el).length) { coach.set('แยกครบแล้ว เก่งมาก!', 'celebrating', 'mimi'); const score = Math.round((st.correct / all.length) * 100); K.later(() => onDone({ correct: st.correct, total: all.length, attempts: st.attempts, score, stars: starsFromPct(score) }), 1200); }
        else coach.set(bin === 'yes' ? 'ถูกต้อง ' + item(id).name + ' เป็นอุปกรณ์คอมพิวเตอร์' : 'ถูกต้อง ' + item(id).name + ' ไม่ใช่อุปกรณ์คอมพิวเตอร์', 'happy', 'robo');
        return;
      }
      sfx.no(); UI.flash('no');
      wrongs[id] = (wrongs[id] || 0) + 1;
      if (wrongs[id] >= 2) { if (sel !== id) select(id); clearGlow(); $(`[data-drop="${binOf(id)}"]`, el).classList.add('glow'); coach.set('ลองตะกร้าที่กระพริบดูนะ', 'explaining', 'tono'); }
      else coach.set(binOf(id) === 'yes' ? 'ภาพนี้อยู่กับเครื่องคอมพิวเตอร์นะ ลองใหม่' : 'ภาพนี้ไม่ได้อยู่กับเครื่องคอมพิวเตอร์ ลองใหม่', 'thinking', 'robo');
    };
    $$('.piece', el).forEach((p) => K.draggable(p, (bin) => attempt(p.dataset.piece, bin), () => { sfx.tap(); select(p.dataset.piece); }));
    $$('.bin', el).forEach((b) => (b.onclick = () => { if (sel) attempt(sel, b.dataset.drop); }));
  }

  /* ---------- สรุปผลเกม ---------- */
  function end(el, r, o) {
    const msg = r.stars === 3 ? 'เยี่ยมไปเลย!' : r.stars === 2 ? 'เก่งมากเลย!' : 'พยายามดีมาก ลองอีกครั้งนะ';
    if (r.stars >= 2) UI.confetti();
    el.innerHTML = `<div class="card narrow center"><div class="big-char">${A.char('mimi', r.stars >= 2 ? 'celebrating' : 'happy')}</div>
      <h2 style="font-size:38px" class="mt-s">${msg}</h2><div class="result-stars mt-s">${UI.stars(r.stars, 3, 60)}</div>
      <p class="mt-s">ถูกครั้งแรก ${r.correct} จาก ${r.total} · ลองทั้งหมด ${r.attempts} ครั้ง · คะแนน ${r.score}</p>
      <div class="row mt"><button class="btn white" data-retry>${A.ICON.retry}เล่นอีกครั้ง</button>${o.onNext ? `<button class="btn mint" data-next>${A.ICON.right}${o.nextLabel || 'ไปต่อ'}</button>` : ''}</div></div>`;
    say(msg);
    $('[data-retry]', el).onclick = () => { K.gen++; o.onRetry(); };
    if (o.onNext) $('[data-next]', el).onclick = o.onNext;
  }

  K.games = { clickFind, shadowMatch, pickSort, end, shuffle, starsFromPct, face };
})();
