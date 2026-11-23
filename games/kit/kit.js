/* =========================================================
   ห้องเกมการศึกษา ครูคอม — ชุดเกมสั้น (kit.js)
   กฎ: เกมเพื่อเรียนรู้อย่างเดียว
   - ไม่ถามชื่อ ไม่มีบัญชี ไม่มีโปรไฟล์นักเรียน
   - ไม่เก็บข้อมูลใด ๆ (ไม่ใช้ localStorage / sessionStorage / cookie)
   - ไม่ส่งข้อมูลออกนอกเครื่อง
   คะแนนอยู่ในหน้าจอระหว่างเล่นเท่านั้น ปิดหน้าแล้วหายไป
   ========================================================= */
(function () {
  'use strict';
  const KIT = (window.KIT = {});
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const esc = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const shuffle = (a) => a.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
  Object.assign(KIT, { $, $$, esc, shuffle });

  /* ---------- ตัวจับเวลาที่ยกเลิกได้เมื่อเริ่มใหม่ ---------- */
  KIT.gen = 0;
  KIT.later = (fn, ms) => { const g = KIT.gen; return setTimeout(() => { if (g === KIT.gen) fn(); }, ms); };

  /* ---------- เสียง (เปิด/ปิดเฉพาะรอบนี้ ไม่บันทึก) ---------- */
  let soundOn = true, actx;
  function tone(fs, d, type, vol) {
    if (!soundOn) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      fs.forEach((f, i) => { const o = actx.createOscillator(), g = actx.createGain(); o.type = type || 'sine'; o.frequency.value = f; o.connect(g); g.connect(actx.destination); const t = actx.currentTime + i * (d || 0.12); g.gain.setValueAtTime(vol || 0.2, t); g.gain.exponentialRampToValueAtTime(0.001, t + (d || 0.12) * 1.6); o.start(t); o.stop(t + (d || 0.12) * 1.7); });
    } catch (e) { /* ไม่มีเสียงก็เล่นได้ */ }
  }
  KIT.sfx = { tap: () => tone([520], 0.06, 'triangle', 0.14), ok: () => tone([660, 880], 0.11), no: () => tone([240, 190], 0.15, 'square', 0.1), win: () => tone([523, 659, 784, 1046], 0.13, 'triangle'), step: () => tone([440], 0.05, 'triangle', 0.1) };
  // ไม่มีเสียงพูด (ตามที่ครูกำหนด) — มีแค่เสียงประกอบ ถูก/ผิด/ชนะ
  KIT.say = function () {};
  KIT.hush = function () {};

  /* ---------- คะแนนบนหน้าจอ ---------- */
  let score = 0;
  KIT.addScore = (n) => { score += n; const s = $('#kScore'); if (s) s.textContent = score; };
  KIT.resetScore = () => { score = 0; const s = $('#kScore'); if (s) s.textContent = 0; };

  /* ---------- โครงหน้า ---------- */
  KIT.opts = {};
  KIT.init = function (o) {
    KIT.opts = o;
    document.title = o.title + ' · ห้องเกมการศึกษา ครูคอม';
    if (o.color) document.documentElement.style.setProperty('--c', o.color);
    if (o.soft) document.documentElement.style.setProperty('--c-soft', o.soft);
    document.body.innerHTML = `
<header class="kbar"><div class="wrap">
  <a class="kback" href="../../index.html" aria-label="กลับไปห้องเกม">←<span>ห้องเกม</span></a>
  <div class="kttl"><b>${esc(o.title)}</b><span>${esc(o.grade)} · ${esc(o.subject)}</span></div>
  <span class="kscore" aria-label="คะแนน">⭐ <span id="kScore">0</span></span>
  <button class="ksound" id="kSound" aria-label="ปิดเสียง">🔊</button>
</div></header>
<main class="wrap stage" id="stage"></main>`;
    $('#kSound').onclick = () => { soundOn = !soundOn; $('#kSound').textContent = soundOn ? '🔊' : '🔇'; $('#kSound').setAttribute('aria-label', soundOn ? 'ปิดเสียง' : 'เปิดเสียง'); if (!soundOn) KIT.hush(); };
    KIT.intro();
  };
  KIT.stage = () => $('#stage');

  KIT.intro = function () {
    const o = KIT.opts; KIT.gen++; KIT.hush(); KIT.resetScore();
    KIT.stage().innerHTML = `<section class="card intro">
      <div class="bigicon" aria-hidden="true">${o.icon || '🎮'}</div>
      <h1>${esc(o.title)}</h1>
      <span class="pill">${esc(o.grade)} · ${esc(o.subject)}${o.topic ? ' · ' + esc(o.topic) : ''}</span>
      <ul class="howto">${(o.howto || []).map((h, i) => `<li><b>${i + 1}</b><span>${h}</span></li>`).join('')}</ul>
      <div class="row mt"><button class="btn big go" id="kStart">▶ เริ่มเล่น</button></div>
      <p class="privacy">เกมนี้ไม่ถามชื่อและไม่เก็บข้อมูลใด ๆ ของผู้เล่น เล่นเพื่อเรียนรู้ได้เลย</p>
    </section>`;
    KIT.say(o.title + ' ' + (o.howto || []).join(' '));
    $('#kStart').onclick = () => { KIT.sfx.tap(); KIT.gen++; KIT.hush(); KIT.resetScore(); o.start(KIT.stage()); };
  };

  KIT.dots = (n, i, results) => `<div class="dots" aria-label="ข้อที่ ${Math.min(i + 1, n)} จาก ${n}">${Array.from({ length: n }, (_, k) => `<i class="${k < i ? (results && results[k] === false ? 'bad' : 'on') : k === i ? 'cur' : ''}"></i>`).join('')}</div>`;

  /* แถบบอกถูก/ผิด + ปุ่มไปต่อ */
  KIT.feedback = function (host, ok, title, text, nextLabel, onNext) {
    const d = document.createElement('div');
    d.className = 'fb ' + (ok ? 'ok' : 'no');
    d.innerHTML = `<span class="ic" aria-hidden="true">${ok ? '✓' : '✗'}</span><div class="tx"><b>${title}</b>${text ? `<span>${text}</span>` : ''}</div>${onNext ? `<button class="btn sm ${ok ? 'ok' : 'white'}">${nextLabel || 'ข้อต่อไป →'}</button>` : ''}`;
    host.appendChild(d);
    if (onNext) { const b = $('button', d); b.onclick = () => { KIT.sfx.tap(); onNext(); }; b.focus({ preventScroll: true }); }
    d.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    (ok ? KIT.sfx.ok : KIT.sfx.no)();
    KIT.say(title + ' ' + (text || ''));
    return d;
  };

  KIT.confetti = function () {
    const c = document.createElement('div'); c.className = 'confetti'; const col = ['#5B8CFF', '#FFC93C', '#FF6F91', '#2FBF71', '#8B6CFF'];
    c.innerHTML = Array.from({ length: 44 }, (_, i) => `<i style="left:${Math.random() * 100}vw;background:${col[i % 5]};animation-duration:${2 + Math.random() * 1.4}s;animation-delay:${Math.random() * 0.6}s"></i>`).join('');
    document.body.appendChild(c); setTimeout(() => c.remove(), 4000);
  };

  /* ---------- จบเกม ---------- */
  KIT.end = function (o) {
    KIT.gen++;
    const pct = o.total ? o.correct / o.total : 0;
    const stars = pct >= 0.9 ? 3 : pct >= 0.6 ? 2 : 1;
    const msg = stars === 3 ? 'เยี่ยมมาก! เก่งสุด ๆ' : stars === 2 ? 'เก่งมาก! เกือบเต็มแล้ว' : 'พยายามดีมาก ลองอีกครั้งนะ';
    if (stars >= 2) KIT.confetti();
    KIT.sfx.win();
    KIT.stage().innerHTML = `<section class="card end">
      <div class="bigicon" style="font-size:72px" aria-hidden="true">${stars === 3 ? '🏆' : stars === 2 ? '🎉' : '💪'}</div>
      <h2 style="font-size:36px">${msg}</h2>
      <div class="stars" aria-label="${stars} ดาว">${[1, 2, 3].map((s) => `<span class="${s <= stars ? '' : 'off'}">⭐</span>`).join('')}</div>
      <p class="head" style="font-size:22px">${o.label || 'ทำถูก'} ${o.correct} จาก ${o.total}</p>
      ${o.lesson ? `<div class="card mt" style="box-shadow:none;background:var(--c-soft);text-align:left"><b class="head">สรุปความรู้</b><p class="mt-s">${o.lesson}</p></div>` : ''}
      ${o.review && o.review.length ? `<ul class="review">${o.review.map((r) => `<li class="${r.ok ? 'ok' : 'no'}">${r.ok ? '✓' : '✗'} ${r.text}</li>`).join('')}</ul>` : ''}
      <div class="row mt"><button class="btn white" id="kAgain">↻ เล่นอีกครั้ง</button><a class="btn" href="../../index.html">← กลับห้องเกม</a></div>
    </section>`;
    KIT.say(msg);
    $('#kAgain').onclick = () => { KIT.sfx.tap(); KIT.intro(); };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ---------- เกมเลือกคำตอบ (ใช้ซ้ำได้) ----------
     rounds: [{ q: 'คำถาม (HTML ได้)', choices: ['ก', 'ข', ...], answer: 0, explain: 'เหตุผล', short: 'ข้อความสั้นสำหรับสรุป' }]  */
  KIT.mcq = function (host, o) {
    const rounds = o.shuffleRounds === false ? o.rounds : shuffle(o.rounds.slice()).slice(0, o.count || o.rounds.length);
    const results = []; let i = 0;
    const keys = ['ก', 'ข', 'ค', 'ง', 'จ'];
    function show() {
      const r = rounds[i];
      const order = r.keepOrder ? r.choices.map((_, k) => k) : shuffle(r.choices.map((_, k) => k));
      host.innerHTML = `<section class="card">
        ${KIT.dots(rounds.length, i, results)}<p class="qtag">ข้อ ${i + 1} / ${rounds.length}</p>
        <div class="prompt">${r.q}</div>
        <div class="choices ${o.oneCol || r.oneCol ? 'one' : ''}">${order.map((k, n) => `<button class="choice" data-k="${k}"><span class="k">${keys[n]}</span><span>${r.choices[k]}</span></button>`).join('')}</div>
        <div class="fbhost"></div></section>`;
      KIT.say(r.q);
      $$('.choice', host).forEach((b) => (b.onclick = () => {
        const k = Number(b.dataset.k), ok = k === r.answer;
        $$('.choice', host).forEach((x) => { x.disabled = true; if (Number(x.dataset.k) === r.answer) x.classList.add('right'); });
        if (!ok) b.classList.add('wrong');
        results.push(ok); if (ok) KIT.addScore(10);
        KIT.feedback($('.fbhost', host), ok, ok ? (o.okWord || 'ถูกต้อง!') : 'ยังไม่ถูกนะ', r.explain, i + 1 < rounds.length ? 'ข้อต่อไป →' : 'ดูผล →', () => { i++; i < rounds.length ? show() : finish(); });
      }));
    }
    function finish() {
      const correct = results.filter(Boolean).length;
      KIT.end({ correct, total: rounds.length, lesson: o.lesson, review: rounds.map((r, k) => ({ ok: results[k], text: r.short || r.q.replace(/<[^>]+>/g, ' ').slice(0, 80) })) });
    }
    show();
  };

  /* ---------- เกมคัดแยกลงตะกร้า (ใช้ซ้ำได้) ----------
     items: [{ icon, name, bin, why }]  bins: [{ id, label, icon, color }]
     ลากไปวาง หรือแตะภาพแล้วแตะตะกร้า · นับถูกครั้งแรก  */
  KIT.sortGame = function (host, o) {
    const items = shuffle(o.items.slice());
    const wrong = {}; let sel = null, done = 0, correct = 0; const review = [];
    host.innerHTML = `<section class="card">
      ${o.tag ? `<p class="qtag">${o.tag}</p>` : ''}<div class="prompt">${o.prompt}</div>
      <div class="sort-items">${items.map((it, k) => `<div class="sitem" data-i="${k}" role="button" tabindex="0" aria-label="${esc(it.name)}"><span class="em">${it.icon}</span><span class="nm">${esc(it.name)}</span></div>`).join('')}</div>
      <div class="bins">${o.bins.map((b) => `<div class="bin" data-drop="${b.id}" style="--bc:${b.color || 'var(--c)'}"><div class="bh"><span class="em">${b.icon}</span>${esc(b.label)}</div><div class="got"></div></div>`).join('')}</div>
      <div class="fbhost"></div></section>`;
    KIT.say(o.prompt);
    const fbh = $('.fbhost', host);
    const select = (k) => { sel = sel === k ? null : k; $$('.sitem', host).forEach((x) => x.classList.toggle('sel', Number(x.dataset.i) === sel)); };
    const attempt = (k, binId) => {
      const it = items[k], el = $(`.sitem[data-i="${k}"]`, host);
      if (!el) return;
      fbh.innerHTML = '';
      if (it.bin === binId) {
        if (!wrong[k]) { correct++; KIT.addScore(10); }
        review.push({ ok: !wrong[k], text: `${it.icon} ${it.name} → ${o.bins.find((b) => b.id === binId).label}` });
        el.remove(); sel = null; done++;
        $(`[data-drop="${binId}"] .got`, host).insertAdjacentHTML('beforeend', `<span title="${esc(it.name)}">${it.icon}</span>`);
        const last = done === items.length;
        KIT.feedback(fbh, true, 'ถูกต้อง! ' + it.name, it.why || '', last ? 'ไปต่อ →' : null, last ? () => o.onDone(correct, items.length, review) : null);
      } else {
        wrong[k] = true;
        el.classList.add('shake'); setTimeout(() => el.classList.remove('shake'), 400);
        KIT.feedback(fbh, false, 'ลองใหม่นะ', o.hint ? o.hint(it) : (it.why || ''));
      }
    };
    $$('.sitem', host).forEach((el) => KIT.draggable(el, (t) => attempt(Number(el.dataset.i), t.dataset.drop), () => { KIT.sfx.tap(); select(Number(el.dataset.i)); }));
    $$('.bin', host).forEach((b) => (b.onclick = () => { if (sel !== null) attempt(sel, b.dataset.drop); }));
  };

  /* ---------- ลากวาง (เมาส์ + จอสัมผัส) ----------
     ลากไปวางบน [data-drop] หรือแตะเพื่อเลือก (onTap)  */
  KIT.draggable = function (el, onDrop, onTap) {
    el.classList.add('drag');
    el.addEventListener('pointerdown', (e) => {
      if (e.button > 0) return;
      e.preventDefault();
      if (el.setPointerCapture) el.setPointerCapture(e.pointerId);
      const sx = e.clientX, sy = e.clientY; let moved = false;
      el.classList.add('dragging'); el.style.transition = 'none';
      const under = (ev) => { el.style.pointerEvents = 'none'; const t = document.elementFromPoint(ev.clientX, ev.clientY); el.style.pointerEvents = ''; return t && t.closest('[data-drop]'); };
      const move = (ev) => { const dx = ev.clientX - sx, dy = ev.clientY - sy; if (Math.abs(dx) + Math.abs(dy) > 6) moved = true; el.style.transform = `translate(${dx}px,${dy}px) scale(1.08)`; $$('[data-drop].hover').forEach((d) => d.classList.remove('hover')); const t = under(ev); if (t) t.classList.add('hover'); };
      const up = (ev) => {
        el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up);
        $$('[data-drop].hover').forEach((d) => d.classList.remove('hover'));
        el.classList.remove('dragging'); el.style.transition = 'transform .25s'; el.style.transform = '';
        const t = moved ? under(ev) : null;
        if (t) onDrop(t); else if (!moved && onTap) onTap();
      };
      el.addEventListener('pointermove', move); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
    });
    el.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && onTap) { e.preventDefault(); onTap(); } });
  };
})();
