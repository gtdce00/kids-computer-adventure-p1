/* =========================================================
   บทเรียนที่ 1: รู้จักคอมพิวเตอร์
   โลกคอมพิวเตอร์ · หน่วยที่ 1 · สัปดาห์ที่ 1 · 2 ชั่วโมง · ผลการเรียนรู้ข้อ 1
   ========================================================= */
(function () {
  'use strict';
  const K = window.KCA, A = window.ART, $ = K.$, $$ = K.$$, UI = K.UI, say = K.say, sfx = K.sfx, G = K.games, S = K.Store;
  const LID = 1;

  /* ---------- เนื้อหา ---------- */
  const DEVICES = [
    { id: 'monitor', art: 'monitor', name: 'จอภาพ', job: 'ใช้ดูภาพและตัวหนังสือ', color: '#E3F2FD' },
    { id: 'cpu', art: 'cpu', name: 'ซีพียู', job: 'เป็นสมองของคอมพิวเตอร์', color: '#EEE9FF' },
    { id: 'keyboard', art: 'keyboard', name: 'แป้นพิมพ์', job: 'ใช้กดพิมพ์ตัวหนังสือ', color: '#EEF2F8' },
    { id: 'mouse', art: 'mouse', name: 'เมาส์', job: 'ใช้ชี้และคลิก', color: '#FFF6D6' },
    { id: 'speaker', art: 'speaker', name: 'ลำโพง', job: 'ทำให้เราได้ยินเสียง', color: '#E3F7EE' },
    { id: 'headphones', art: 'headphones', name: 'หูฟัง', job: 'ฟังเสียงคนเดียว ไม่รบกวนเพื่อน', color: '#FFEAF2' },
  ];
  const OTHERS = [
    { id: 'ball', art: 'ball', name: 'ลูกบอล', color: '#FFF6D6' },
    { id: 'apple', art: 'apple', name: 'แอปเปิล', color: '#FFEAF2' },
    { id: 'book', art: 'book', name: 'หนังสือ', color: '#E3F2FD' },
    { id: 'flower', art: 'flower', name: 'ดอกไม้', color: '#E3F7EE' },
  ];
  const ITEMS = DEVICES.concat(OTHERS);
  const item = (id) => ITEMS.find((x) => x.id === id);

  // เพลงแต่งขึ้นใหม่สำหรับบทเรียนนี้
  const SONG = [
    ['monitor', 'จอภาพ จอภาพ ไว้ดูภาพสวยใส'],
    ['cpu', 'ซีพียู ซีพียู เป็นสมองทำงานไว'],
    ['keyboard', 'แป้นพิมพ์ แป้นพิมพ์ กดพิมพ์ ก ข ค'],
    ['mouse', 'เมาส์น้อย เมาส์น้อย ชี้แล้วคลิกได้เลย'],
    ['speaker', 'ลำโพง ลำโพง เปิดเพลงฟังกันเพลิน'],
    ['headphones', 'หูฟัง หูฟัง ฟังคนเดียวไม่กวนใคร'],
  ];

  const PRE = [
    { id: 'pre1', kind: 'find', target: 'monitor', say: 'แตะที่ จอภาพ', options: ['monitor', 'keyboard', 'ball', 'speaker'], explain: 'จอภาพ ใช้ดูภาพ' },
    { id: 'pre2', kind: 'find', target: 'mouse', say: 'แตะที่ เมาส์', options: ['mouse', 'apple', 'cpu', 'headphones'], explain: 'เมาส์ ใช้ชี้และคลิก' },
    { id: 'pre3', kind: 'is', target: 'keyboard', say: 'อันไหนเป็นอุปกรณ์คอมพิวเตอร์', options: ['keyboard', 'ball', 'apple', 'book'], explain: 'แป้นพิมพ์ เป็นอุปกรณ์คอมพิวเตอร์' },
  ];
  const QUIZ = [
    { id: 'q1', kind: 'find', target: 'cpu', say: 'แตะที่ ซีพียู', options: ['cpu', 'speaker', 'monitor', 'flower'], explain: 'ซีพียู คือกล่องที่เป็นสมองของคอมพิวเตอร์' },
    { id: 'q2', kind: 'find', target: 'speaker', say: 'แตะที่ ลำโพง', options: ['speaker', 'keyboard', 'mouse', 'book'], explain: 'ลำโพง ทำให้เราได้ยินเสียง' },
    { id: 'q3', kind: 'find', target: 'keyboard', say: 'แตะที่ แป้นพิมพ์', options: ['keyboard', 'monitor', 'headphones', 'apple'], explain: 'แป้นพิมพ์ มีปุ่มเยอะ ๆ ใช้กดพิมพ์' },
    { id: 'q4', kind: 'odd', target: 'apple', say: 'อันไหน ไม่ใช่ อุปกรณ์คอมพิวเตอร์', options: ['apple', 'monitor', 'mouse', 'cpu'], explain: 'แอปเปิลเป็นผลไม้ ไม่ใช่อุปกรณ์คอมพิวเตอร์' },
    { id: 'q5', kind: 'find', target: 'headphones', say: 'แตะที่ หูฟัง', options: ['headphones', 'speaker', 'cpu', 'ball'], explain: 'หูฟัง ใช้ฟังเสียงคนเดียว' },
  ];
  // เกณฑ์: แบบทดสอบ 5 ข้อ → ดาว · ผ่านเมื่อได้ตามเกณฑ์ที่ครูตั้ง (ค่าเริ่มต้น 1 ดาว = 3 ข้อ)
  const starsFromQuiz = (c) => (c >= 5 ? 3 : c === 4 ? 2 : c === 3 ? 1 : 0);

  const FIND_ROUNDS = DEVICES.map((d, i) => {
    const pool = DEVICES.filter((x) => x.id !== d.id).map((x) => x.id);
    return { id: 'f' + i, kind: 'find', target: d.id, say: 'แตะที่ ' + d.name, options: [d.id, pool[i % 5], pool[(i + 2) % 5], pool[(i + 4) % 5]], explain: d.name + ' ' + d.job };
  });
  const MATCH_SETS = [['monitor', 'keyboard', 'mouse'], ['cpu', 'speaker', 'headphones']];

  const GAMES = [
    { id: 'l1-find', title: 'ชี้ภาพตามที่ครูบอก', type: 'Click & Find', pics: ['monitor', 'mouse'],
      start: (el, s, done) => G.clickFind(el, { rounds: FIND_ROUNDS, item, mode: 'practice', onDone: done }) },
    { id: 'l1-match', title: 'จับคู่ภาพกับเงา', type: 'Picture Matching · ลากวาง', pics: ['keyboard', 'speaker'],
      start: (el, s, done) => G.shadowMatch(el, { sets: MATCH_SETS, item, onDone: done }) },
    { id: 'l1-sort', title: 'เลือกอุปกรณ์ให้ถูกต้อง', type: 'Sorting · แยกหมวดหมู่', pics: ['cpu', 'ball'],
      start: (el, s, done) => G.pickSort(el, { yesIds: ['monitor', 'keyboard', 'mouse', 'speaker', 'cpu'], noIds: ['ball', 'apple', 'book', 'flower'], item, onDone: done, yesLabel: 'อุปกรณ์คอมพิวเตอร์', noLabel: 'ไม่ใช่' }) },
  ];
  const saveGame = (s, gid, r) => S.gameResult({ student_id: s.student_id, lesson_id: LID, game_id: gid, score: r.score, attempts: r.attempts, correct_answers: r.correct, total: r.total });

  /* ---------- ① แนะนำ + เกมอุ่นเครื่อง (ประเมินก่อนเรียน) ---------- */
  function computerSet() {
    return `<div style="position:relative;width:100%;max-width:440px;aspect-ratio:4/3;margin:0 auto">
      <div style="position:absolute;left:0;right:0;bottom:8%;height:10%;border-radius:14px;background:#E8C9A0"></div>
      <div style="position:absolute;left:24%;top:0;width:46%">${A.DEV.monitor()}</div>
      <div style="position:absolute;right:2%;top:18%;width:22%">${A.DEV.cpu()}</div>
      <div style="position:absolute;left:2%;top:34%;width:16%">${A.DEV.speaker()}</div>
      <div style="position:absolute;left:25%;top:62%;width:38%">${A.DEV.keyboard()}</div>
      <div style="position:absolute;left:64%;top:64%;width:14%">${A.DEV.mouse()}</div></div>`;
  }
  function intro(el, ctx) {
    el.innerHTML = `<div class="two">
      <div><div class="cs"></div>
        <div class="card"><h3 style="font-size:26px;margin-bottom:12px">วันนี้หนูจะได้…</h3>
          <ul style="list-style:none;padding:0;margin:0;display:grid;gap:12px;font-size:21px">
            <li class="row" style="justify-content:flex-start;flex-wrap:nowrap"><span class="ibtn sky" aria-hidden="true">${A.ICON.eye}</span>ดูภาพอุปกรณ์คอมพิวเตอร์ 6 ชิ้น</li>
            <li class="row" style="justify-content:flex-start;flex-wrap:nowrap"><span class="ibtn" style="background:#B388FF;color:#fff;box-shadow:0 5px 0 #7C4DE0" aria-hidden="true">${A.ICON.music}</span>ร้องเพลงส่วนประกอบคอมพิวเตอร์</li>
            <li class="row" style="justify-content:flex-start;flex-wrap:nowrap"><span class="ibtn sun" aria-hidden="true">${A.ICON.target}</span>ชี้ภาพและบอกชื่ออุปกรณ์</li>
          </ul></div></div>
      <div class="center"><div class="tech-stage">${computerSet()}<p class="head" style="font-size:22px">นี่คือ "คอมพิวเตอร์"</p></div>
        <button class="btn big mint mt" data-pre>${A.ICON.play}เล่นเกมอุ่นเครื่อง</button></div></div>`;
    UI.coach($('.cs', el), { who: 'robo', mood: 'explaining', text: `สวัสดี ${ctx.student.student_name} ฉันชื่อโรโบ วันนี้เราจะไปรู้จักคอมพิวเตอร์กัน` });
    $('[data-pre]', el).onclick = () => {
      sfx.tap();
      el.innerHTML = `<p class="center head" style="font-size:22px;margin-bottom:10px">เกมอุ่นเครื่อง 3 ข้อ</p><div class="tech-stage" id="pre"></div>`;
      G.clickFind($('#pre', el), { rounds: PRE, item, mode: 'test', onDone: (r) => {
        saveGame(ctx.student, 'l1-pre', r);
        S.upsertProgress(ctx.student.student_id, LID, { pre_score: r.correct });
        el.innerHTML = `<div class="card narrow center"><div class="big-char">${A.char('mimi', 'happy')}</div><h2 class="mt-s" style="font-size:32px">อุ่นเครื่องเสร็จแล้ว!</h2>
          <p class="mt-s">หนูรู้จักแล้ว ${r.correct} จาก ${r.total} ภาพ มาเรียนให้รู้จักครบทุกชิ้นกัน</p><button class="btn mint mt" data-n>${A.ICON.right}ไปดูภาพกันเลย</button></div>`;
        say('อุ่นเครื่องเสร็จแล้ว มาเรียนให้รู้จักครบทุกชิ้นกัน');
        $('[data-n]', el).onclick = ctx.next;
      } });
    };
  }

  /* ---------- ② ดูภาพ + ร้องเพลง ---------- */
  function learn(el, ctx) {
    const seen = new Set();
    let tab = 'see';
    function draw() {
      el.innerHTML = `<div class="tabs"><button class="btn ${tab === 'see' ? '' : 'white'}" data-tab="see">${A.ICON.eye}ดูภาพ ${seen.size}/6</button><button class="btn ${tab === 'song' ? 'purple' : 'white'}" data-tab="song">${A.ICON.music}ร้องเพลง</button></div><div id="lt"></div>
        <div class="center mt"><p class="muted ${seen.size === 6 ? 'hidden' : ''}" id="need">แตะดูภาพให้ครบ 6 ภาพก่อนนะ (${seen.size}/6)</p><button class="btn mint mt-s" data-next ${seen.size === 6 ? '' : 'disabled'}>${A.ICON.right}ไปดูวิธีเล่น</button></div>`;
      $$('[data-tab]', el).forEach((b) => (b.onclick = () => { K.gen++; K.stopSpeech(); tab = b.dataset.tab; draw(); }));
      $('[data-next]', el).onclick = ctx.next;
      tab === 'see' ? see($('#lt', el)) : song($('#lt', el));
    }
    function see(box) {
      box.innerHTML = `<div class="cs"></div><div class="learn-grid"><div class="dev-grid">${DEVICES.map((d) => `<button class="acard ${seen.has(d.id) ? 'seen' : ''}" data-d="${d.id}">${G.face(d)}<span class="lbl">${seen.has(d.id) ? '✓ ' : ''}${d.name}</span></button>`).join('')}</div>
        <div class="card detail" id="det"><div class="big-char">${A.char('tono', 'thinking')}</div><p class="head mt-s" style="font-size:22px">แตะภาพเพื่อดูชื่อได้เลย</p></div></div>`;
      const coach = UI.coach($('.cs', box), { who: 'robo', mood: 'explaining', text: 'แตะที่ภาพ เพื่อดูชื่ออุปกรณ์ ให้ครบทุกภาพนะ' });
      $$('[data-d]', box).forEach((b) => (b.onclick = () => {
        const d = item(b.dataset.d);
        sfx.tap(); seen.add(d.id);
        $$('[data-d]', box).forEach((x) => x.classList.remove('cur'));
        b.classList.add('cur', 'seen'); $('.lbl', b).textContent = '✓ ' + d.name;
        $('#det', box).innerHTML = `${G.face(d)}<h3>${d.name}</h3><p style="font-size:20px">${d.job}</p>`;
        coach.set(d.name + ' ' + d.job, 'explaining', 'robo');
        $('[data-tab="see"]', el).innerHTML = `${A.ICON.eye}ดูภาพ ${seen.size}/6`;
        $('#need', el).textContent = `แตะดูภาพให้ครบ 6 ภาพก่อนนะ (${seen.size}/6)`;
        if (seen.size === 6) { $('#need', el).classList.add('hidden'); $('[data-next]', el).disabled = false; }
      }));
    }
    function song(box) {
      box.innerHTML = `<div class="cs"></div><div class="card narrow" style="max-width:820px">${SONG.map(([id, t], i) => `<div class="song-line" data-l="${i}">${G.face(item(id))}<span>${t}</span></div>`).join('')}
        <p class="muted mt-s" style="font-size:14px">เพลงแต่งขึ้นใหม่สำหรับบทเรียนนี้ ครูใช้ทำนองที่นักเรียนคุ้นเคยได้</p></div>
        <div class="center mt"><button class="btn mint" data-sing>${A.ICON.play}ร้องเพลง</button></div>`;
      UI.coach($('.cs', box), { who: 'mimi', mood: 'happy', text: 'กดปุ่มสีเขียว แล้วร้องเพลงตามกันนะ ปรบมือตามจังหวะด้วย' });
      const btn = $('[data-sing]', box);
      btn.onclick = () => {
        btn.disabled = true; btn.innerHTML = A.ICON.music + 'กำลังร้อง…';
        let i = 0;
        const step = () => {
          $$('.song-line', box).forEach((l) => l.classList.remove('now'));
          if (i >= SONG.length) { btn.disabled = false; btn.innerHTML = A.ICON.retry + 'ร้องอีกครั้ง'; sfx.win(); say('เย้ ร้องเพลงเก่งมาก'); return; }
          const ln = $(`[data-l="${i}"]`, box); ln.classList.add('now'); sfx.star();
          say(SONG[i][1], () => { i++; K.later(step, 300); });
        };
        step();
      };
    }
    draw();
  }

  /* ---------- ③ สาธิตวิธีเล่น ---------- */
  const HAND = `<svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true"><path d="M24 6c3 0 5 2 5 5v18l2-1c2-6 9-4 9 1v1c2-4 9-3 9 2v2c2-3 8-2 8 3v13c0 8-6 14-14 14h-6c-5 0-9-2-12-6L13 43c-2-3 0-6 3-6 2 0 4 1 5 3l-2-29c0-3 2-5 5-5z" fill="#FFDCC2" stroke="#253858" stroke-width="3" stroke-linejoin="round"/></svg>`;
  const DEMO = [
    { cap: '1. อ่านคำสั่งและดูภาพเงา: แตะที่ เมาส์', x: '50%', y: '112%' },
    { cap: '2. มองหาภาพที่ถูกต้องทีละภาพ', x: '12%', y: '64%' },
    { cap: '2. มองหาภาพที่ถูกต้องทีละภาพ', x: '37%', y: '64%' },
    { cap: '3. เจอแล้ว! แตะที่ภาพเมาส์', x: '62%', y: '64%', tap: true },
    { cap: '4. ถูกต้อง ได้เครื่องหมายถูกสีเขียว', x: '62%', y: '64%', ok: true },
    { cap: '5. เกมลากภาพ: กดค้างที่ภาพ แล้วลากไปวางบนเงา', drag: 0 },
    { cap: '5. เกมลากภาพ: กดค้างที่ภาพ แล้วลากไปวางบนเงา', drag: 1 },
    { cap: '6. วางตรงเงาแล้วปล่อย ภาพจะเข้าที่', drag: 2 },
  ];
  function demo(el, ctx) {
    el.innerHTML = `<div class="cs"></div><div class="tech-stage" style="max-width:940px;margin:0 auto"><p class="head center" id="cap" style="font-size:24px;min-height:36px;margin-bottom:12px" aria-live="polite"></p><div id="ds"></div></div>
      <div class="row mt"><button class="btn white" data-again>${A.ICON.retry}ดูอีกครั้ง</button><button class="btn mint" data-next>${A.ICON.right}ไปเล่นเกม</button></div>`;
    UI.coach($('.cs', el), { who: 'robo', mood: 'explaining', text: 'ดูโรโบสาธิตวิธีเล่นก่อนนะ', speak: false });
    const cards = ['monitor', 'keyboard', 'mouse', 'speaker'];
    const ds = $('#ds', el), cap = $('#cap', el);
    const drawFind = () => { ds.innerHTML = `<div class="demo-stage"><div class="silhouette" style="width:120px"><div class="face" style="height:84px">${A.DEV.mouse()}</div></div>
      <div class="answers">${cards.map((c) => `<div class="acard" data-c="${c}">${G.face(item(c))}<span class="lbl hide">✓ ${item(c).name}</span></div>`).join('')}</div><div class="demo-hand" style="left:50%;top:112%">${HAND}</div></div>`; };
    const drawDrag = () => { ds.innerHTML = `<div class="demo-drag"><div class="drop" data-x>${A.DEV.mouse().replace('class="art"', 'class="art" style="filter:brightness(0);opacity:.8"')}</div><div class="piece" style="left:8%">${G.face(item('mouse'))}<div class="demo-hand" style="left:55%;top:55%">${HAND}</div></div></div>`; };
    function run() {
      K.gen++;
      let i = 0;
      const tick = () => {
        if (i >= DEMO.length) return;
        const d = DEMO[i]; cap.textContent = d.cap; say(d.cap);
        if (d.drag === undefined) {
          if (!$('.demo-stage', ds)) drawFind();
          const h = $('.demo-hand', ds); h.style.left = d.x; h.style.top = d.y; h.classList.toggle('tap', !!d.tap);
          if (d.ok) { const c = $('[data-c="mouse"]', ds); c.classList.add('right'); $('.lbl', c).classList.remove('hide'); }
        } else {
          if (!$('.demo-drag', ds)) drawDrag();
          const p = $('.demo-drag .piece', ds);
          if (d.drag === 1) { p.style.left = 'calc(92% - 170px + 15px)'; p.style.transform = 'scale(1.06)'; }
          if (d.drag === 2) { p.remove(); const dr = $('[data-x]', ds); dr.classList.add('ok'); dr.innerHTML = A.DEV.mouse(); }
        }
        i++; K.later(tick, i === 1 ? 2600 : 2100);
      };
      ds.innerHTML = ''; tick();
    }
    $('[data-again]', el).onclick = run;
    $('[data-next]', el).onclick = ctx.next;
    run();
  }

  /* ---------- ④ เล่นเกมฝึก 3 เกม ---------- */
  function play(el, ctx) {
    const done = {};
    function menu() {
      K.gen++;
      const all = GAMES.every((g) => done[g.id]);
      el.innerHTML = `<div class="cs"></div><div class="game-menu">${GAMES.map((g, i) => `<button class="gcard" data-g="${g.id}"><div class="gpic">${g.pics.map((p) => `<div>${A.DEV[p]()}</div>`).join('')}</div><h3>${i + 1}. ${g.title}</h3><p class="muted">${g.type}</p><p class="mt-s">${done[g.id] ? UI.stars(done[g.id], 3, 28) : 'ยังไม่ได้เล่น'}</p></button>`).join('')}</div>
        <div class="center mt"><p class="muted ${all ? 'hidden' : ''}">เล่นให้ครบ 3 เกมก่อนนะ (${Object.keys(done).length}/3)</p><button class="btn mint mt-s" data-next ${all ? '' : 'disabled'}>${A.ICON.right}ไปทำแบบทดสอบ</button></div>`;
      UI.coach($('.cs', el), { who: 'robo', mood: 'happy', text: all ? 'เล่นครบแล้ว เก่งมาก ไปทำแบบทดสอบกัน' : 'เลือกเกมที่อยากเล่น เล่นให้ครบ 3 เกมนะ' });
      $$('[data-g]', el).forEach((b) => (b.onclick = () => { sfx.tap(); start(GAMES.find((g) => g.id === b.dataset.g)); }));
      $('[data-next]', el).onclick = ctx.next;
    }
    function start(g) {
      K.gen++;
      el.innerHTML = `<div class="row" style="justify-content:space-between;margin-bottom:12px"><h2 style="font-size:26px">${g.title}</h2><button class="btn sm white" data-back>${A.ICON.left}เลือกเกม</button></div><div class="tech-stage" id="ga"></div>`;
      $('[data-back]', el).onclick = menu;
      const area = $('#ga', el);
      g.start(area, ctx.student, (r) => {
        saveGame(ctx.student, g.id, r);
        done[g.id] = Math.max(done[g.id] || 0, r.stars); sfx.win();
        G.end(area, r, { onRetry: () => start(g), onNext: menu, nextLabel: 'เลือกเกมต่อไป' });
      });
    }
    menu();
  }

  /* ---------- ⑤ แบบทดสอบ + รางวัล + เฉลย + ประเมินตนเอง ---------- */
  const FACES = [[3, 'ชอบมาก', 'happy'], [2, 'ชอบ', 'idle'], [1, 'เฉย ๆ', 'thinking']];
  function quiz(el, ctx) {
    const sid = ctx.student.student_id;
    el.innerHTML = `<div class="card narrow center"><div class="big-char">${A.char('robo', 'explaining')}</div><h2 class="mt-s" style="font-size:32px">แบบทดสอบ 5 ข้อ</h2>
      <p class="mt-s">ไม่จำกัดเวลา ค่อย ๆ ดูภาพให้ดี ดูภาพเงาแล้วแตะภาพที่ถูก (ครูอ่านคำสั่งให้ฟังได้)</p><button class="btn mint mt" data-go-q>${A.ICON.play}เริ่มทดสอบ</button></div>`;
    say('แบบทดสอบห้าข้อ พร้อมแล้วกดเริ่มเลย');
    $('[data-go-q]', el).onclick = () => {
      el.innerHTML = '<div class="tech-stage" id="qa"></div>';
      G.clickFind($('#qa', el), { rounds: QUIZ, item, mode: 'test', onDone: result });
    };
    function result(r) {
      const stars = starsFromQuiz(r.correct), pass = stars >= (S.db.settings.passStars || 1);
      saveGame(ctx.student, 'l1-quiz', { score: r.correct * 20, attempts: r.attempts, correct: r.correct, total: r.total });
      S.upsertProgress(sid, LID, Object.assign({ score: r.correct * 20, stars, status: pass ? 'passed' : 'in_progress' }, pass ? { completed_at: new Date().toISOString() } : {}));
      if (pass) { sfx.win(); if (stars >= 2) UI.confetti(); }
      el.innerHTML = `<section class="card center"><div class="big-char">${A.char(pass ? 'mimi' : 'tono', pass ? 'celebrating' : 'sad')}</div>
          <h2 class="mt-s" style="font-size:40px">${pass ? (stars === 3 ? 'เยี่ยมไปเลย!' : 'เก่งมากเลย!') : 'ลองอีกครั้งนะ'}</h2>
          <div class="result-stars mt-s">${UI.stars(stars, 3, 60)}</div>
          <p class="head mt-s" style="font-size:26px">ได้ ${r.correct} จาก 5 ข้อ · ${r.correct * 20} คะแนน</p>
          ${pass ? `<div class="badge-pill"><span class="b">${A.DEV.monitor()}</span>ได้เหรียญ "นักสำรวจคอมพิวเตอร์"</div>` : '<p class="mt-s">ต้องได้ตามเกณฑ์จึงผ่านด่าน กลับไปดูภาพแล้วลองใหม่ได้เลย</p>'}
        </section>
        <section class="card mt"><h3 style="font-size:26px;margin-bottom:12px">เฉลย</h3><div class="keys">${QUIZ.map((q, i) => {
          const a = r.answers.find((x) => x.id === q.id);
          return `<div class="key ${a && a.correct ? '' : 'bad'}"><p class="head">ข้อ ${i + 1} ${a && a.correct ? '✓ ถูก' : '✗ ผิด'}</p><p>${q.say}</p><div class="face">${A.DEV[item(q.target).art]()}</div><p style="font-size:14px">${q.explain}</p>${a && !a.correct ? `<p class="muted" style="font-size:14px">หนูเลือก: ${item(a.chosen).name}</p>` : ''}</div>`;
        }).join('')}</div></section>
        <section class="card mt center"><h3 style="font-size:26px">หนูชอบบทเรียนนี้แค่ไหน?</h3><div class="faces">${FACES.map(([v, l, m]) => `<button data-att="${v}" aria-label="${l}">${A.char('mimi', m).replace('class="char"', 'class="char" style="width:64px;height:72px;margin:0 auto"')}${l}</button>`).join('')}</div></section>
        <div class="row mt"><button class="btn white" data-again>${A.ICON.retry}ทำแบบทดสอบใหม่</button><button class="btn" data-map>${A.ICON.map}กลับไปบทเรียน</button></div>`;
      say(pass ? (stars === 3 ? 'เยี่ยมไปเลย ได้สามดาว' : 'เก่งมากเลย ผ่านด่านแล้ว') : 'ลองอีกครั้งนะ ดูภาพอีกรอบแล้วมาทำใหม่');
      $$('[data-att]', el).forEach((b) => (b.onclick = () => { $$('[data-att]', el).forEach((x) => x.classList.remove('on')); b.classList.add('on'); S.upsertProgress(sid, LID, { attitude: Number(b.dataset.att) }); sfx.ok(); say(b.getAttribute('aria-label')); }));
      $('[data-again]', el).onclick = () => { K.gen++; quiz(el, ctx); };
      $('[data-map]', el).onclick = ctx.goMap;
    }
  }

  /* ---------- คู่มือครู ---------- */
  const GUIDE = {
    outcome: 'ผลการเรียนรู้ข้อ 1: ชี้และบอกชื่ออุปกรณ์คอมพิวเตอร์จากภาพหรือของจริงได้',
    objectives: {
      K: 'บอกชื่ออุปกรณ์คอมพิวเตอร์พื้นฐาน 6 ชนิด (จอภาพ ซีพียู แป้นพิมพ์ เมาส์ ลำโพง หูฟัง) จากภาพได้',
      P: 'ชี้หรือคลิกเลือกภาพอุปกรณ์คอมพิวเตอร์ตามคำสั่งได้ถูกต้อง และแยกอุปกรณ์คอมพิวเตอร์ออกจากสิ่งของอื่นได้',
      A: 'ตั้งใจฟัง ร่วมร้องเพลงและเล่นเกม รอคิว และจับอุปกรณ์อย่างเบามือ',
    },
    essence: 'คอมพิวเตอร์ประกอบด้วยอุปกรณ์หลายชิ้นที่ทำงานร่วมกัน เช่น จอภาพ ซีพียู แป้นพิมพ์ เมาส์ ลำโพง และหูฟัง การรู้จักชื่ออุปกรณ์ช่วยให้นักเรียนใช้งานและฟังคำสั่งของครูได้ถูกต้อง',
    content: DEVICES.map((d) => d.name + ' — ' + d.job),
    media: ['เครื่องคอมพิวเตอร์ของจริง 1 ชุด', 'บัตรภาพอุปกรณ์ขนาดใหญ่', 'เพลงส่วนประกอบคอมพิวเตอร์ (ในบทเรียน)', 'เว็บ KIDS COMPUTER ADVENTURE บนจอใหญ่/เครื่องนักเรียน'],
    steps: [
      { step: '① ขั้นนำ (Introduction) · 10 นาที', text: 'ครูยกคอมพิวเตอร์ของจริงให้ดู ถาม "นี่คืออะไร" โรโบแนะนำบทเรียน นักเรียนเล่นเกมอุ่นเครื่อง 3 ข้อ (บันทึกเป็นคะแนนก่อนเรียน)' },
      { step: '② ขั้นสอน (Learn) · 20 นาที', text: 'ครูชี้ของจริงทีละชิ้นคู่กับภาพในบทเรียน นักเรียนแตะภาพให้ครบ 6 ชิ้น พูดชื่อตาม แล้วร้องเพลงส่วนประกอบคอมพิวเตอร์พร้อมกัน' },
      { step: '③ ขั้นสาธิต (Demonstration) · 10 นาที', text: 'ดูการสาธิตวิธีเล่นเกมชี้ภาพและเกมลากภาพบนจอใหญ่ ครูให้อาสาสมัคร 1–2 คนออกมาลองทำ' },
      { step: '④ ขั้นฝึกปฏิบัติ (Play & Practice) · 40 นาที', text: 'นักเรียนเล่นเกมฝึก 3 เกม (รายบุคคลหรือเป็นคู่ สลับกันจับเมาส์) ครูเดินสังเกตและบันทึกพฤติกรรม' },
      { step: '⑤ ขั้นสรุป (Quiz & Reward) · 20 นาที', text: 'ทำแบบทดสอบ 5 ข้อ ดูเฉลยพร้อมกัน รับดาวและเหรียญ ประเมินตนเองด้วยหน้ายิ้ม ครูสรุปชื่ออุปกรณ์ทั้ง 6 อีกครั้ง' },
    ],
    hours: 'ชั่วโมงที่ 1: ขั้น ①–③ · ชั่วโมงที่ 2: ขั้น ④–⑤',
    criteria: [
      { aspect: 'K ความรู้', tool: 'แบบทดสอบหลังเรียน 5 ข้อ (เทียบกับเกมอุ่นเครื่อง 3 ข้อ)', rule: '5 ข้อ = ดีมาก ⭐⭐⭐ · 4 ข้อ = ดี ⭐⭐ · 3 ข้อ = พอใช้ ⭐ (ผ่าน) · 0–2 ข้อ = ยังไม่ผ่าน ให้เรียนซ้ำ' },
      { aspect: 'P ทักษะ', tool: 'ผลเกมฝึก 3 เกม + สังเกตการคลิก/ลาก', rule: 'ตอบถูกครั้งแรก ≥ 80% = ดีมาก · 60–79% = ดี · 40–59% = พอใช้ · < 40% = ควรฝึกเพิ่ม' },
      { aspect: 'A คุณลักษณะ', tool: 'ประเมินตนเองด้วยหน้ายิ้ม + แบบสังเกตของครู', rule: 'ตั้งใจฟัง / ร่วมกิจกรรม / รอคิว / ใช้อุปกรณ์เบามือ — 4 ข้อ = ดีมาก, 3 = ดี, 2 = พอใช้, 0–1 = ควรปรับปรุง' },
    ],
  };

  /* ---------- ภารกิจ (ตรวจจากข้อมูลจริง) ---------- */
  const gr = (sid, gid) => S.db.gameResults.some((g) => g.student_id === sid && g.game_id === gid);
  const MISSIONS = [
    { name: 'เข้าเกาะโลกคอมพิวเตอร์', desc: 'เปิดบทเรียนรู้จักคอมพิวเตอร์', check: (sid) => S.db.visits.some((v) => v.student_id === sid && v.lesson_id === LID) },
    { name: 'อุ่นเครื่องให้พร้อม', desc: 'เล่นเกมอุ่นเครื่อง 3 ข้อ', check: (sid) => gr(sid, 'l1-pre') },
    { name: 'นักเล่นเกมตัวจริง', desc: 'เล่นเกมฝึกครบ 3 เกม', check: (sid) => GAMES.every((g) => gr(sid, g.id)) },
    { name: 'ผ่านแบบทดสอบ', desc: 'ผ่านแบบทดสอบท้ายบท', check: (sid) => { const p = S.progress(sid, LID); return !!p && p.status === 'passed'; } },
    { name: 'ดาวครบ 3 ดวง', desc: 'ตอบแบบทดสอบถูกครบ 5 ข้อ', check: (sid) => { const p = S.progress(sid, LID); return !!p && p.stars === 3; } },
    { name: 'บอกความรู้สึก', desc: 'ประเมินตนเองด้วยหน้ายิ้ม', check: (sid) => { const p = S.progress(sid, LID); return !!p && !!p.attitude; } },
  ];

  K.lessons[LID] = {
    steps: { intro, learn, demo, play, quiz },
    games: GAMES, missions: MISSIONS, guide: GUIDE, pre: PRE, quiz: QUIZ, item,
    badge: { name: 'นักสำรวจคอมพิวเตอร์', art: 'monitor' },
  };
})();
