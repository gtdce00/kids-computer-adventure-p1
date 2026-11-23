/* =========================================================
   KIDS COMPUTER ADVENTURE ป.1 — app.js (Vanilla JavaScript)
   ข้อมูลหลักสูตร · ฐานข้อมูลในเครื่อง · เสียง · ระบบครู · หน้าเว็บทั้งหมด
   ========================================================= */
(function () {
  'use strict';
  const A = window.ART;
  const KCA = (window.KCA = window.KCA || {});
  KCA.lessons = KCA.lessons || {};
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const esc = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  KCA.$ = $; KCA.$$ = $$; KCA.esc = esc;

  /* ---------- ตัวจับเวลาที่ยกเลิกเมื่อเปลี่ยนหน้า ---------- */
  KCA.gen = 0;
  KCA.later = (fn, ms) => { const g = KCA.gen; return setTimeout(() => { if (g === KCA.gen) fn(); }, ms); };
  const newScope = () => { KCA.gen++; stopSpeech(); };

  /* =========================================================
     1) ข้อมูลหลักสูตร — จาก "กำหนดการสอน รวมทุกวิชา ภาคเรียนที่ 2-2569.docx"
        รายวิชาคอมพิวเตอร์ ว11201 ชั้น ป.1 เท่านั้น
     ========================================================= */
  const COURSE = { code: 'ว11201', name: 'คอมพิวเตอร์', grade: 'ป.1', term: 'ภาคเรียนที่ 2 ปีการศึกษา 2569', teacher: 'นายชลหิรัณย์ พลศักดิ์', school: 'โรงเรียนบ้านนาอ่าง อำเภอบึงโขงหลง จังหวัดบึงกาฬ' };
  const OUTCOMES = [
    'ชี้และบอกชื่ออุปกรณ์คอมพิวเตอร์จากภาพหรือของจริงได้',
    'จับเมาส์ คลิก และลากภาพบนหน้าจอได้ถูกต้อง',
    'เรียงลำดับภาพขั้นตอนของกิจกรรมในชีวิตประจำวันได้',
    'แก้ปัญหาอย่างง่ายโดยใช้บัตรภาพลูกศรหรือสัญลักษณ์ได้',
    'วาดภาพและระบายสีด้วยโปรแกรมวาดภาพได้',
    'เล่าหรือนำเสนอผลงานภาพของตนเองด้วยวาจาได้',
    'บอกสิ่งที่ควรทำและไม่ควรทำเมื่อใช้เทคโนโลยีจากภาพสถานการณ์ได้',
    'ดูแลอุปกรณ์และแสดงมารยาทในการใช้คอมพิวเตอร์ได้เหมาะสม',
  ];
  const WORLDS = [
    { id: 1, key: 'computer', name: 'โลกคอมพิวเตอร์', en: 'Computer World', desc: 'รู้จักและใช้คอมพิวเตอร์อย่างถูกต้อง', unit: 'หน่วยที่ 1 รู้จักคอมพิวเตอร์ผ่านภาพ' },
    { id: 2, key: 'thinking', name: 'โลกนักคิด', en: 'Thinking World', desc: 'คิดเป็นขั้นตอน แก้ปัญหาได้', unit: 'หน่วยที่ 2 คิดเป็นขั้นตอนด้วยภาพ' },
    { id: 3, key: 'creative', name: 'โลกสร้างสรรค์', en: 'Creative World', desc: 'ใช้คอมพิวเตอร์สร้างผลงาน', unit: 'หน่วยที่ 3 สร้างภาพด้วยคอมพิวเตอร์' },
    { id: 4, key: 'safety', name: 'โลกปลอดภัย', en: 'Safety World', desc: 'ใช้งานอย่างปลอดภัยและมีมารยาท', unit: 'หน่วยที่ 4 ใช้เทคโนโลยีอย่างปลอดภัย' },
  ];
  const LESSONS = [
    [1, 1, 1, 2, 'รู้จักคอมพิวเตอร์', 'ดูของจริงและภาพขนาดใหญ่ ร้องเพลงส่วนประกอบคอมพิวเตอร์ ชี้ภาพตามที่ครูบอก', [1], 'monitor'],
    [2, 1, 2, 2, 'อุปกรณ์คอมพิวเตอร์', 'บัตรภาพจับคู่อุปกรณ์กับหน้าที่ (จอ = ดู, ลำโพง = ฟัง, เมาส์ = ชี้) ระบายสีใบงานภาพ', [1, 2], 'mouse'],
    [3, 1, 3, 3, 'ฝึกจับและใช้เมาส์', 'จับเมาส์ตามภาพมือ ฝึกคลิกและลากด้วยเกมภาพ (ลากผลไม้ใส่ตะกร้า)', [2], 'apple'],
    [4, 1, 4, 3, 'การดูแลรักษาอุปกรณ์', 'ภาพสถานการณ์ ถูก ✓ / ผิด ✗ และทำข้อตกลงห้องคอมพิวเตอร์เป็นภาพสัญลักษณ์', [2, 8], 'keyboard'],
    [5, 2, 5, 2, 'เรียงลำดับภาพเหตุการณ์', 'บัตรภาพ 3–4 ภาพ เช่น ล้างมือ แปรงฟัน ปลูกต้นไม้ ให้นักเรียนเรียงลำดับ', [3], 'flower'],
    [6, 2, 6, 2, 'บอกทางด้วยบัตรลูกศร', 'บัตรลูกศร ↑ ↓ ← → พาตัวละครไปหาของบนตารางพื้นห้อง (เกมหุ่นยนต์มนุษย์)', [3, 4], null],
    [7, 2, 7, 3, 'การแก้ปัญหาอย่างง่าย', 'หาจุดต่างในภาพ หาเส้นทางในเขาวงกต และแก้ลำดับภาพที่ผิด', [4], null],
    [8, 2, 8, 3, 'เกมฝึกคิดด้วยภาพ', 'เกมบนคอมพิวเตอร์สำหรับเด็กที่ยังอ่านไม่ได้ เช่น Code.org Course A ทำเป็นคู่', [3, 4], null],
    [9, 3, 9, 2, 'รู้จักโปรแกรมวาดภาพ', 'บัตรภาพไอคอนเครื่องมือ (ดินสอ ถังสี ยางลบ) แล้วเปิด Paint หรือ Tux Paint ตามครู', [2, 5], null],
    [10, 3, 10, 2, 'วาดเส้นและรูปทรง', 'วาดวงกลม สี่เหลี่ยม สามเหลี่ยม แล้วต่อเป็นภาพบ้าน รถ หรือหน้าคน', [5], null],
    [11, 3, 11, 3, 'ระบายสีและสร้างภาพ', 'วาดภาพสัตว์หรือครอบครัวของฉัน ใช้ถังสีระบายตามจินตนาการ', [5, 6], null],
    [12, 3, 12, 3, 'นำเสนอผลงาน', 'จัดแกลเลอรีภาพหน้าห้อง เล่าภาพของตนเองให้เพื่อนฟัง ชมผลงานด้วยสติกเกอร์', [5, 6], null],
    [13, 4, 13, 2, 'ข้อมูลส่วนตัวของหนู', 'ภาพสถานการณ์คนแปลกหน้าถามชื่อหรือบ้าน ฝึกตอบ "ไม่บอก แล้วไปบอกครู"', [7], null],
    [14, 4, 14, 2, 'มารยาทในการใช้คอมพิวเตอร์', 'ภาพการกระทำดี–ไม่ดี เช่น รอคิว แบ่งปัน ไม่แย่งเมาส์ แล้วแสดงบทบาทสมมติ', [8], null],
    [15, 4, 15, 3, 'ใช้เทคโนโลยีอย่างปลอดภัย', 'ภาพไฟจราจร เขียว = ใช้ได้, เหลือง = ถามครู, แดง = หยุด รวมถึงท่านั่งที่ถูกต้องและพักสายตา', [7, 8], null],
    [16, 4, 16, 3, 'ทบทวนและสร้างสมุดภาพ', 'ทำสมุดภาพ "หนูใช้คอมพิวเตอร์เก่ง" ประเมินตนเองด้วยหน้ายิ้ม', [6, 7, 8], null],
  ].map(([id, world, week, hours, title, activity, outcomes, thumb]) => ({ id, world, week, hours, title, activity, outcomes, thumb }));
  const lessonById = (id) => LESSONS.find((l) => l.id === Number(id));
  const worldById = (id) => WORLDS.find((w) => w.id === Number(id));
  const isBuilt = (id) => !!KCA.lessons[id];
  Object.assign(KCA, { COURSE, OUTCOMES, WORLDS, LESSONS, lessonById, worldById });

  /* =========================================================
     2) ฐานข้อมูล (localStorage) — Students, Progress, GameResults, Teacher
     ========================================================= */
  const DBKEY = 'kca_vanilla_db_v1';
  const GUEST = 'guest';
  const emptyDb = () => ({ version: 1, teacher: null, settings: { unlockAll: false, passStars: 1 }, students: [], progress: [], gameResults: [], visits: [] });
  let memoryOnly = false;
  let db = (() => { try { const r = localStorage.getItem(DBKEY); return r ? Object.assign(emptyDb(), JSON.parse(r)) : emptyDb(); } catch (e) { memoryOnly = true; return emptyDb(); } })();
  const save = () => { if (memoryOnly) return; try { localStorage.setItem(DBKEY, JSON.stringify(db)); } catch (e) { memoryOnly = true; } };
  const now = () => new Date().toISOString();
  const uid = (p) => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const Store = {
    get db() { return db; },
    memoryOnly: () => memoryOnly,
    addStudent(name, avatar) { const s = { student_id: uid('s'), student_name: name.trim(), class: 'ป.1', avatar }; db.students.push(s); save(); return s; },
    updateStudent(id, patch) { const s = db.students.find((x) => x.student_id === id); if (s) Object.assign(s, patch); save(); },
    deleteStudent(id) { ['students', 'progress', 'gameResults', 'visits'].forEach((k) => { db[k] = db[k].filter((r) => r.student_id !== id); }); save(); },
    student(id) { if (id === GUEST) return { student_id: GUEST, student_name: 'ผู้เล่นทดลอง', class: 'ป.1', avatar: 'a7' }; return db.students.find((s) => s.student_id === id) || null; },
    progress(sid, lid) { return db.progress.find((p) => p.student_id === sid && p.lesson_id === lid) || null; },
    upsertProgress(sid, lid, patch) {
      let p = this.progress(sid, lid);
      if (!p) { p = { student_id: sid, lesson_id: lid, status: 'in_progress', score: 0, stars: 0, pre_score: null, attitude: null, attempts: 0, completed_at: null }; db.progress.push(p); }
      const prev = Object.assign({}, p);
      Object.assign(p, patch, { updated_at: now() });
      p.score = Math.max(prev.score || 0, p.score || 0);
      p.stars = Math.max(prev.stars || 0, p.stars || 0);
      if (prev.status === 'passed') p.status = 'passed';
      if (prev.pre_score != null) p.pre_score = prev.pre_score;
      if (prev.completed_at && !patch.completed_at) p.completed_at = prev.completed_at;
      save(); return p;
    },
    visit(sid, lid) { db.visits.push({ student_id: sid, lesson_id: lid, at: now() }); db.visits = db.visits.slice(-5000); save(); },
    gameResult(r) { db.gameResults.push(Object.assign({}, r, { completed_at: now() })); db.gameResults = db.gameResults.slice(-10000); save(); },
    settings(patch) { Object.assign(db.settings, patch); save(); },
    setTeacher(t) { db.teacher = t; save(); },
    summary(sid) {
      const mine = db.progress.filter((p) => p.student_id === sid);
      return { stars: mine.reduce((a, p) => a + (p.stars || 0), 0), score: mine.reduce((a, p) => a + (p.score || 0), 0), passed: mine.filter((p) => p.status === 'passed').length, total: LESSONS.length, mine };
    },
    unlocked(sid, lid) { if (db.settings.unlockAll || lid === 1) return true; const p = this.progress(sid, lid - 1); return !!p && p.status === 'passed'; },
    exportJson() { return JSON.stringify(db, null, 2); },
    importJson(text) { const d = JSON.parse(text); if (!d || !Array.isArray(d.students) || !Array.isArray(d.progress)) throw new Error('ไฟล์ไม่ถูกต้อง'); db = Object.assign(emptyDb(), d, { teacher: d.teacher || db.teacher }); save(); },
    reset(sid) { const keep = (r) => sid !== undefined && r.student_id !== sid; db.progress = db.progress.filter(keep); db.gameResults = db.gameResults.filter(keep); db.visits = db.visits.filter(keep); save(); },
  };
  KCA.Store = Store; KCA.GUEST = GUEST;

  /* =========================================================
     3) เสียงประกอบ (ไม่มีเสียงพูด) + จังหวะเวลาของคำสั่ง
     ========================================================= */
  const SND = 'kca_sound';
  const audio = { on: true, userSet: false, voice: null, ready: false, last: '' };
  try { const v = localStorage.getItem(SND); if (v !== null) { audio.on = v === '1'; audio.userSet = true; } } catch (e) { /* ignore */ }
  audio.ready = true;
  let spT;
  function say(text, onend) {
    audio.last = text;
    clearTimeout(spT);
    const g = KCA.gen;
    const done = () => { if (g === KCA.gen && onend) onend(); };
    // ไม่มีเสียงพูด: แสดงข้อความในกรอบคำสั่ง แล้วรอเวลาอ่านก่อนไปต่อ
    spT = setTimeout(done, 900 + text.length * 70);
  }
  function stopSpeech() { clearTimeout(spT); }
  let actx;
  function tone(fs, d, type, vol) {
    if (!audio.on) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      fs.forEach((f, i) => { const o = actx.createOscillator(), g = actx.createGain(); o.type = type || 'sine'; o.frequency.value = f; o.connect(g); g.connect(actx.destination); const t = actx.currentTime + i * (d || 0.12); g.gain.setValueAtTime(vol || 0.22, t); g.gain.exponentialRampToValueAtTime(0.001, t + (d || 0.12) * 1.6); o.start(t); o.stop(t + (d || 0.12) * 1.7); });
    } catch (e) { /* ignore */ }
  }
  const sfx = { tap: () => tone([520], 0.06, 'triangle', 0.15), ok: () => tone([660, 880], 0.11), no: () => tone([240, 190], 0.15, 'square', 0.12), win: () => tone([523, 659, 784, 1046], 0.13, 'triangle'), star: () => tone([880, 1175], 0.09, 'triangle') };
  function setSound(on) { audio.on = on; audio.userSet = true; try { localStorage.setItem(SND, on ? '1' : '0'); } catch (e) { /* ignore */ } if (!on) stopSpeech(); refreshSoundUi(); }
  function refreshSoundUi() { $$('[data-sound]').forEach((b) => { b.innerHTML = audio.on ? A.ICON.vol : A.ICON.mute; b.setAttribute('aria-label', audio.on ? 'ปิดเสียง' : 'เปิดเสียง'); }); }
  Object.assign(KCA, { say, stopSpeech, sfx, audio, setSound });

  /* =========================================================
     4) ระบบครู: รหัสผ่านแฮช SHA-256 + salt
     ========================================================= */
  function sha256js(ascii) {
    const rr = (v, a) => (v >>> a) | (v << (32 - a));
    const bytes = new TextEncoder().encode(ascii); const k = [], h = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225];
    let n = 2, c = 0; while (c < 64) { let p = true; for (let i = 2; i * i <= n; i++) if (n % i === 0) { p = false; break; } if (p) k[c++] = (Math.pow(n, 1 / 3) * 4294967296) | 0; n++; }
    const l = bytes.length, pad = new Uint8Array(((l + 9 + 63) >> 6) << 6); pad.set(bytes); pad[l] = 0x80; const dv = new DataView(pad.buffer), bits = l * 8;
    dv.setUint32(pad.length - 4, bits >>> 0); dv.setUint32(pad.length - 8, Math.floor(bits / 4294967296)); const w = []; for (let i = 0; i < pad.length; i += 4) w.push(dv.getUint32(i));
    for (let j = 0; j < w.length; j += 16) { const x = w.slice(j, j + 16), o = h.slice(); for (let i = 0; i < 64; i++) { if (i >= 16) { const a = x[i - 15], b = x[i - 2]; x[i] = (x[i - 16] + (rr(a, 7) ^ rr(a, 18) ^ (a >>> 3)) + x[i - 7] + (rr(b, 17) ^ rr(b, 19) ^ (b >>> 10))) | 0; } const t1 = (h[7] + (rr(h[4], 6) ^ rr(h[4], 11) ^ rr(h[4], 25)) + ((h[4] & h[5]) ^ (~h[4] & h[6])) + k[i] + x[i]) | 0; const t2 = ((rr(h[0], 2) ^ rr(h[0], 13) ^ rr(h[0], 22)) + ((h[0] & h[1]) ^ (h[0] & h[2]) ^ (h[1] & h[2]))) | 0; h.unshift((t1 + t2) | 0); h[4] = (h[4] + t1) | 0; h.pop(); } for (let i = 0; i < 8; i++) h[i] = (h[i] + o[i]) | 0; }
    return h.map((v) => (v >>> 0).toString(16).padStart(8, '0')).join('');
  }
  async function hash(t) { try { if (window.crypto && crypto.subtle) { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t)); return Array.from(new Uint8Array(b)).map((x) => x.toString(16).padStart(2, '0')).join(''); } } catch (e) { /* fallback */ } return sha256js(t); }
  const SESS = 'kca_teacher_session';
  const Auth = {
    has: () => !!db.teacher,
    async create(u, p) { const salt = Math.random().toString(36).slice(2, 10); Store.setTeacher({ teacher_id: 't1', username: u.trim(), password_hash: salt + ':' + (await hash(salt + p)), role: 'teacher' }); this.start(); },
    async login(u, p) { const t = db.teacher; if (!t || t.username !== u.trim()) return false; const [salt, h] = t.password_hash.split(':'); const ok = (await hash(salt + p)) === h; if (ok) this.start(); return ok; },
    start() { try { sessionStorage.setItem(SESS, '1'); } catch (e) { window.__kcaT = true; } },
    isIn() { try { return !!sessionStorage.getItem(SESS); } catch (e) { return !!window.__kcaT; } },
    out() { try { sessionStorage.removeItem(SESS); } catch (e) { window.__kcaT = false; } },
  };
  KCA.Auth = Auth;

  /* =========================================================
     5) ส่วนประกอบ UI ที่ใช้ซ้ำ
     ========================================================= */
  const UI = {
    stars: (n, max, size) => `<span class="stars" aria-label="${n || 0} ดาว">${Array.from({ length: max || 3 }, (_, i) => A.star(i < (n || 0), size || 24)).join('')}</span>`,
    bar: (v, max, cls) => `<div class="bar ${cls || ''}" role="progressbar" aria-valuenow="${max ? Math.round((v / max) * 100) : 0}" aria-valuemin="0" aria-valuemax="100"><i style="width:${max ? Math.round((v / max) * 100) : 0}%"></i></div>`,
    btn: (label, cls, icon, attrs) => `<button class="btn ${cls || ''}" ${attrs || ''}>${icon ? A.ICON[icon] : ''}${label}</button>`,
    flash(kind) {
      const d = document.createElement('div'); d.className = 'flash ' + kind;
      d.innerHTML = `<div><svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">${kind === 'ok' ? '<path d="M5 12.5l4.5 4.5L19 7"/>' : '<path d="M6 6l12 12M18 6L6 18"/>'}</svg></div>`;
      document.body.appendChild(d); setTimeout(() => d.remove(), 800);
    },
    confetti(n) {
      const c = document.createElement('div'); c.className = 'confetti'; const col = ['#42A5F5', '#FFD54F', '#FF91B8', '#81DDB5', '#B388FF'];
      c.innerHTML = Array.from({ length: n || 40 }, (_, i) => `<i style="left:${Math.random() * 100}vw;background:${col[i % 5]};animation-duration:${2.2 + Math.random() * 1.4}s;animation-delay:${Math.random() * 0.7}s"></i>`).join('');
      document.body.appendChild(c); setTimeout(() => c.remove(), 4200);
    },
    modal(title, html, opts) {
      const bg = document.createElement('div'); bg.className = 'modal-bg';
      bg.innerHTML = `<div class="modal ${opts && opts.wide ? 'wide' : ''}" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="modal-head"><h2>${esc(title)}</h2><button class="ibtn" data-close aria-label="ปิด">${A.ICON.x}</button></div><div class="modal-body">${html}</div></div>`;
      const close = () => { bg.remove(); document.removeEventListener('keydown', onKey); };
      const onKey = (e) => { if (e.key === 'Escape') close(); };
      bg.addEventListener('click', (e) => { if (e.target === bg || e.target.closest('[data-close]')) close(); });
      document.addEventListener('keydown', onKey);
      document.body.appendChild(bg); const f = $('button,input,select,textarea', $('.modal-body', bg)); (f || $('[data-close]', bg)).focus();
      return { el: bg, close };
    },
    // ตัวละครพูด + กรอบคำสั่ง + ฟังซ้ำ + คำใบ้
    coach(el, o) {
      el.innerHTML = `<div class="coach"><div class="who-c"></div><div class="bubble"><p aria-live="polite"></p><button class="ibtn sun hidden" data-hint aria-label="คำใบ้">${A.ICON.bulb}</button></div></div>`;
      const who = $('.who-c', el), p = $('p', el), hb = $('[data-hint]', el);
      let cur = {};
      const api = {
        set(text, mood, w, speak) {
          if (w !== undefined || mood !== undefined) { const nw = w || cur.who || 'robo', nm = mood || cur.mood || 'explaining'; if (nw !== cur.who || nm !== cur.mood) { who.innerHTML = A.char(nw, nm); cur = { who: nw, mood: nm }; } }
          if (text != null) { p.textContent = text; if (speak !== false) say(text); }
        },
        hint(fn) { hb.classList.toggle('hidden', !fn); hb.onclick = fn ? () => { sfx.tap(); fn(); } : null; },
      };
      api.set(o.text, o.mood || 'explaining', o.who || 'robo', o.speak);
      api.hint(o.onHint);
      return api;
    },
  };
  KCA.UI = UI;

  /* ---------- ลากวาง (เมาส์ + จอสัมผัส) ---------- */
  KCA.draggable = function (el, onDrop, onTap) {
    el.addEventListener('pointerdown', (e) => {
      if (e.button > 0) return;
      e.preventDefault();
      el.setPointerCapture && el.setPointerCapture(e.pointerId);
      const sx = e.clientX, sy = e.clientY; let moved = false;
      el.classList.add('dragging'); el.style.transition = 'none';
      const under = (ev) => { el.style.pointerEvents = 'none'; const t = document.elementFromPoint(ev.clientX, ev.clientY); el.style.pointerEvents = ''; return t && t.closest('[data-drop]'); };
      const move = (ev) => { const dx = ev.clientX - sx, dy = ev.clientY - sy; if (Math.abs(dx) + Math.abs(dy) > 6) moved = true; el.style.transform = `translate(${dx}px,${dy}px) scale(1.08)`; $$('[data-drop].hover').forEach((d) => d.classList.remove('hover')); const t = under(ev); if (t) t.classList.add('hover'); };
      const up = (ev) => {
        el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up);
        $$('[data-drop].hover').forEach((d) => d.classList.remove('hover'));
        el.classList.remove('dragging'); el.style.transition = 'transform .3s'; el.style.transform = '';
        const t = moved ? under(ev) : null;
        if (t) onDrop(t.dataset.drop); else if (!moved && onTap) onTap();
      };
      el.addEventListener('pointermove', move); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
    });
    el.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && onTap) { e.preventDefault(); onTap(); } });
  };

  /* =========================================================
     6) โครงหน้า: Header + เมนู + แถบล่างมือถือ
     ========================================================= */
  const CUR = 'kca_current_student';
  let studentId = (() => { try { return localStorage.getItem(CUR); } catch (e) { return null; } })();
  const student = () => (studentId ? Store.student(studentId) : null);
  function chooseStudent(id) { studentId = id; try { id ? localStorage.setItem(CUR, id) : localStorage.removeItem(CUR); } catch (e) { /* ignore */ } }
  KCA.student = student; KCA.chooseStudent = chooseStudent; KCA.studentId = () => studentId;

  const NAV = [['home', 'หน้าแรก', 'home'], ['lessons', 'บทเรียน', 'book'], ['games', 'เกม', 'game'], ['missions', 'ภารกิจ', 'trophy'], ['results', 'ผลการเรียน', 'chart']];
  const LAPTOP = `<svg viewBox="0 0 64 52" class="lap" aria-hidden="true"><rect x="8" y="4" width="48" height="34" rx="6" fill="#42A5F5"/><rect x="12" y="8" width="40" height="26" rx="3" fill="#BFE3FF"/><path d="M22 18 l-5 4 5 4 M42 18 l5 4 -5 4" stroke="#1976D2" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M2 40 h60 l-4 8 h-52z" fill="#B388FF"/><circle cx="54" cy="8" r="5" fill="#FFD54F"/></svg>`;
  function shell(active, inner) {
    const s = student();
    const stars = s ? Store.summary(s.student_id).stars : 0;
    return `
<header class="topbar"><div class="wrap">
  <a class="hub-link" href="../index.html" title="กลับไปห้องเกมการศึกษา (รวมเกมทุกชั้น)" aria-label="กลับไปห้องเกมการศึกษา">${A.ICON.left}<span>ห้องเกม</span></a>
  <a class="logo" href="#home" aria-label="KIDS COMPUTER ADVENTURE ป.1 หน้าแรก">${LAPTOP}<span class="txt"><span class="k">KIDS</span><span class="c">COMPUTER</span><span class="a">ADVENTURE ป.1</span></span></a>
  <nav class="nav" aria-label="เมนูหลัก"><ul>${NAV.map(([r, l, i]) => `<li><a href="#${r}" ${active === r ? 'aria-current="page"' : ''}>${A.ICON[i]}${l}</a></li>`).join('')}</ul></nav>
  <a class="who" href="#profile" title="โปรไฟล์นักเรียน" style="text-decoration:none;color:inherit">
    ${s ? A.avatar(s.avatar) : `<span class="avatar" style="background:#E3F2FD;display:grid;place-items:center;color:#1976D2">${A.ICON.user}</span>`}
    <span class="nm">${s ? esc(s.student_name) : 'เลือกผู้เรียน'}</span>
    <span class="starpill">${A.star(true, 28)}${stars}</span>
  </a>
  <button class="ibtn" data-sound aria-label="ปิดเสียง">${audio.on ? A.ICON.vol : A.ICON.mute}</button>
</div></header>
<main id="main">${inner}</main>
<footer class="footer">วิชา${COURSE.name} ${COURSE.code} ชั้น ${COURSE.grade} · ${COURSE.term} · ${COURSE.school}<br><button data-go="teacher">สำหรับครู</button> · <button data-help>วิธีใช้งาน</button></footer>
<nav class="tabbar" aria-label="เมนูหลัก">${NAV.map(([r, l, i]) => `<a href="#${r}" ${active === r ? 'aria-current="page"' : ''}>${A.ICON[i]}${l}</a>`).concat(`<a href="#profile" ${active === 'profile' ? 'aria-current="page"' : ''}>${A.ICON.user}โปรไฟล์</a>`).join('')}</nav>`;
  }
  function helpModal() {
    UI.modal('วิธีใช้งาน', `
      <ol class="guide" style="padding:0">
        <li class="step">1. กด <b>เริ่มผจญภัย</b> แล้วแตะรูปของตัวเอง</li>
        <li class="step">2. เลือกเกาะและด่านใน <b>บทเรียน</b></li>
        <li class="step">3. ทำตามทีละขั้น: แนะนำ → ดูภาพ → ดูวิธีเล่น → เล่นเกม → ทดสอบ</li>
        <li class="step">4. ได้ดาว เหรียญ และ Badge เมื่อผ่านด่าน ดูได้ที่ <b>ผลการเรียน</b> และ <b>ภารกิจ</b></li>
      </ol>
      <p class="mt-s"><b>ปุ่มช่วยเหลือ:</b> หลอดไฟสีเหลือง = คำใบ้จากโทโน่ · ปุ่มลำโพงมุมขวาบน = เปิด/ปิดเสียงประกอบ</p>
      <p class="mt-s muted">สำหรับครู: เกมไม่มีเสียงพูด คำสั่งแสดงเป็นตัวหนังสือในกรอบคำพูดและมีภาพเงาช่วย ครูอ่านคำสั่งให้นักเรียนที่ยังอ่านไม่คล่องฟังได้</p>`, { wide: true });
  }

  /* =========================================================
     7) หน้าเว็บ
     ========================================================= */
  function lessonState(sid, l) {
    const p = sid ? Store.progress(sid, l.id) : null;
    if (!isBuilt(l.id)) return { kind: 'soon', p };
    if (sid && !Store.unlocked(sid, l.id)) return { kind: 'locked', p };
    if (p && p.status === 'passed') return { kind: 'passed', p };
    return { kind: 'open', p };
  }
  const nextLesson = (sid) => LESSONS.find((l) => lessonState(sid, l).kind === 'open');
  KCA.lessonState = lessonState;

  function islandCard(w, sid) {
    const ls = LESSONS.filter((l) => l.world === w.id);
    const passed = sid ? ls.filter((l) => lessonState(sid, l).kind === 'passed').length : 0;
    const built = ls.filter((l) => isBuilt(l.id)).length;
    const status = passed === 4 ? 'ผ่านครบแล้ว' : passed > 0 ? 'กำลังผจญภัย' : built ? 'พร้อมเริ่มเรียน' : 'กำลังสร้างบทเรียน';
    return `<a class="isle w-${w.key}" href="#lessons-${w.id}">
      <div class="pic">${A.island(w.key)}</div>
      <span class="tag">${w.name}</span>
      <p class="desc">${w.desc}</p>
      <div class="meta">${A.star(true, 24)}${UI.bar(passed, 4)}<span>${passed} / 4</span></div>
      <p class="status">${ls.length} บทเรียน · ${status}</p>
    </a>`;
  }
  function sidebar(sid) {
    const sum = sid ? Store.summary(sid) : { stars: 0, passed: 0, total: 16, mine: [] };
    const badges = KCA.achievements(sum.mine).filter((a) => a.got).length;
    const nx = sid ? nextLesson(sid) : LESSONS[0];
    return `<aside class="sidebar">
      <section class="panel"><h2 class="panel-title">${A.star(true, 34)}ความก้าวหน้า</h2>
        <p class="stat-row">${A.star(true, 26)} ${sum.passed} / ${sum.total} บทเรียน</p>
        <div class="row mt-s" style="justify-content:space-between;flex-wrap:nowrap">${UI.bar(sum.passed, sum.total, 'big')}<b class="head">${Math.round((sum.passed / sum.total) * 100)}%</b></div>
      </section>
      <section class="panel"><h2 class="panel-title">${A.badge()}รางวัลของฉัน</h2>
        <div class="rewards">
          <div>${A.star(true, 40)}<b>${sum.stars}</b><span>ดาวสะสม</span></div>
          <div>${A.medal()}<b>${sum.passed}</b><span>เหรียญรางวัล</span></div>
          <div>${A.badge()}<b>${badges}</b><span>Badge</span></div>
        </div>
      </section>
      <section class="panel continue">
        <div class="char-sm">${A.char('tono', 'explaining')}</div>
        <div style="flex:1">
          <p class="head" style="font-size:18px">${nx ? 'ด่านต่อไปของหนู' : 'ผ่านทุกด่านที่เปิดแล้ว!'}</p>
          <p class="muted" style="font-size:15px">${nx ? `ด่าน ${nx.id}: ${esc(nx.title)}` : 'ด่านใหม่กำลังสร้าง'}</p>
          ${nx ? `<button class="btn sm mint mt-s" data-go="lesson-${nx.id}">${A.ICON.play}เรียนเลย</button>` : ''}
        </div>
      </section>
    </aside>`;
  }

  /* ---------- หน้าแรก / Dashboard ---------- */
  function pageHome() {
    const s = student();
    const sid = s && s.student_id;
    render('home', `
<section class="hero">
  ${A.cloud().replace('class="cloud"', 'class="cloud c1"')}${A.cloud().replace('class="cloud"', 'class="cloud c2"')}${A.cloud().replace('class="cloud"', 'class="cloud c3"')}
  <div class="mini-island float d2">${A.island('computer')}</div>
  <div class="wrap">
    <button class="robo-big float" data-talk="robo" aria-label="โรโบ">${A.char('robo', 'explaining')}</button>
    <div class="hero-title">
      <h1 class="wordmark"><span class="w1">KIDS</span><span class="w2">COMPUTER</span><span class="w3">ADVENTURE ป.1</span></h1>
      <p class="ribbon">ผจญภัยโลกคอมพิวเตอร์กับน้องโรโบ</p>
      <div class="hero-cta"><button class="btn big sun" data-start>${A.ICON.play}เริ่มผจญภัย</button></div>
    </div>
    <div class="kids">
      <button class="float d3" data-talk="tono" aria-label="โทโน่">${A.char('tono', 'happy')}</button>
      <button class="float d2" data-talk="mimi" aria-label="มีมี่">${A.char('mimi', 'celebrating')}</button>
    </div>
  </div>
</section>
<div class="wrap"><div class="dash">
  <section class="panel">
    <h2 class="panel-title">${A.ICON.pin}แผนที่การเรียนรู้</h2>
    <div class="islands">${WORLDS.map((w) => islandCard(w, sid)).join('')}</div>
  </section>
  ${sidebar(sid)}
</div></div>`);
    const talks = { robo: 'สวัสดีจ้า ฉันชื่อโรโบ มาผจญภัยโลกคอมพิวเตอร์ด้วยกันนะ', tono: 'ฉันชื่อโทโน่ ถ้าทำไม่ได้ กดหลอดไฟ ฉันจะช่วยให้คำใบ้', mimi: 'ฉันชื่อมีมี่ เป็นกำลังใจให้นะ สู้ ๆ' };
    $$('[data-talk]').forEach((b) => (b.onclick = () => { sfx.tap(); say(talks[b.dataset.talk]); }));
    $('[data-start]').onclick = () => { sfx.ok(); const st = student(); if (!st) { pendingRoute = 'next'; go('profile'); } else { const n = nextLesson(st.student_id); go(n ? 'lesson-' + n.id : 'lessons'); } };
  }

  /* ---------- บทเรียน / Learning Map ---------- */
  function lessonCard(l, sid) {
    const w = worldById(l.world), st = lessonState(sid, l);
    const play = st.kind === 'open' || st.kind === 'passed';
    const thumb = l.thumb && isBuilt(l.id) ? A.DEV[l.thumb]() : A.island(w.key);
    return `<article class="lcard w-${w.key} ${play ? '' : 'dim'}">
      <div class="thumb">${thumb}</div>
      <p class="no">ด่านที่ ${l.id} · สัปดาห์ที่ ${l.week} · ${l.hours} ชม.</p>
      <h3>${esc(l.title)}</h3>
      <div class="foot">
        <div>${UI.stars(st.p ? st.p.stars : 0, 3, 22)}<p class="best">คะแนนสูงสุด ${st.p ? st.p.score : 0}</p></div>
        ${st.kind === 'soon' ? `<span class="chip">${A.ICON.tool}กำลังสร้าง</span>` : st.kind === 'locked' ? `<span class="chip">${A.ICON.lock}ล็อก</span>` : `<button class="btn sm ${st.kind === 'passed' ? 'mint' : ''}" data-go="lesson-${l.id}">${st.kind === 'passed' ? A.ICON.check + 'เล่นอีก' : A.ICON.play + 'เริ่มเล่น'}</button>`}
      </div>
    </article>`;
  }
  function pageLessons(focus) {
    const s = student(); const sid = s && s.student_id;
    render('lessons', `<div class="wrap">
      <div class="page-head"><h1>บทเรียน · แผนที่การเรียนรู้ 4 เกาะ 16 ด่าน</h1></div>
      ${!s ? `<p class="card" style="padding:14px 18px;margin-bottom:18px">แตะ "เริ่มเล่น" แล้วระบบจะให้เลือกรูปของตัวเองก่อน</p>` : ''}
      ${WORLDS.map((w) => `<section class="world-band w-${w.key}" id="world-${w.id}">
        <div class="world-head"><div class="pic">${A.island(w.key)}</div><div><h2>เกาะที่ ${w.id}: ${w.name}</h2><p>${w.unit}</p><p class="muted" style="font-size:15px">${w.en}</p></div></div>
        <div class="lessons">${LESSONS.filter((l) => l.world === w.id).map((l) => lessonCard(l, sid)).join('')}</div>
      </section>`).join('')}
    </div>`);
    if (focus) { const el = $('#world-' + focus); if (el) el.scrollIntoView({ behavior: 'smooth' }); }
  }

  /* ---------- เกม (รวมเกมของบทเรียนที่เปิดแล้ว) ---------- */
  function pageGames(gameId) {
    const s = student();
    if (!s) { pendingRoute = 'games'; return go('profile'); }
    const all = [];
    Object.keys(KCA.lessons).forEach((lid) => (KCA.lessons[lid].games || []).forEach((g) => all.push(Object.assign({ lid: Number(lid) }, g))));
    if (gameId) {
      const g = all.find((x) => x.id === gameId);
      if (!g) return go('games');
      render('games', `<div class="wrap"><div class="page-head"><button class="ibtn" data-go="games" aria-label="ย้อนกลับ">${A.ICON.left}</button><h1>${esc(g.title)}</h1></div><div class="tech-stage" id="gameArea"></div></div>`);
      const area = $('#gameArea');
      const run = () => {
        KCA.gen++;
        g.start(area, s, (r) => {
          Store.gameResult({ student_id: s.student_id, lesson_id: g.lid, game_id: g.id, score: r.score, attempts: r.attempts, correct_answers: r.correct, total: r.total });
          sfx.win();
          KCA.games.end(area, r, { onRetry: run, onNext: () => go('games'), nextLabel: 'เกมอื่น' });
        });
      };
      run();
      return;
    }
    render('games', `<div class="wrap">
      <div class="page-head"><h1>เกมฝึกทักษะ</h1></div>
      <div class="coach-slot"></div>
      <div class="game-menu">${all.map((g) => {
        const best = Store.db.gameResults.filter((r) => r.student_id === s.student_id && r.game_id === g.id).reduce((a, r) => Math.max(a, r.score), -1);
        const open = Store.unlocked(s.student_id, g.lid);
        return `<button class="gcard" ${open ? `data-go="games-${g.id}"` : 'disabled'}>
          <div class="gpic">${g.pics.map((p) => `<div>${A.DEV[p]()}</div>`).join('')}</div>
          <h3>${esc(g.title)}</h3><p class="muted">ด่าน ${g.lid} · ${esc(g.type)}</p>
          <p class="mt-s">${best >= 0 ? `คะแนนสูงสุด ${best}` : open ? 'ยังไม่ได้เล่น' : 'ผ่านด่านก่อนหน้าก่อน'}</p>
        </button>`;
      }).join('')}</div>
      <p class="muted center mt">เกมของด่านอื่นจะเพิ่มเมื่อสร้างบทเรียนเสร็จ</p>
    </div>`);
    UI.coach($('.coach-slot'), { who: 'mimi', mood: 'happy', text: 'เลือกเกมที่อยากเล่นได้เลย' });
  }

  /* ---------- ภารกิจ ---------- */
  KCA.achievements = function (mine) {
    const passed = mine.filter((p) => p.status === 'passed');
    const stars = mine.reduce((a, p) => a + (p.stars || 0), 0);
    return [
      { id: 'first', name: 'ก้าวแรก', desc: 'ผ่านด่านแรก', got: passed.length >= 1 },
      { id: 'perfect', name: 'ดาวเต็ม', desc: 'ได้ 3 ดาวในด่านใดก็ได้', got: mine.some((p) => p.stars === 3) },
      { id: 'stars10', name: 'นักสะสมดาว', desc: 'สะสมครบ 10 ดาว', got: stars >= 10 },
    ].concat(WORLDS.map((w) => ({ id: 'w' + w.id, name: 'พิชิต' + w.name, desc: `ผ่านครบ 4 ด่านของ${w.name}`, got: LESSONS.filter((l) => l.world === w.id).every((l) => passed.some((p) => p.lesson_id === l.id)) })))
      .concat([{ id: 'all', name: 'ฮีโร่คอมพิวเตอร์', desc: 'ผ่านครบ 16 ด่าน', got: passed.length >= 16 }]);
  };
  function pageMissions() {
    const s = student();
    if (!s) { pendingRoute = 'missions'; return go('profile'); }
    const sid = s.student_id;
    const missions = [];
    Object.keys(KCA.lessons).forEach((lid) => (KCA.lessons[lid].missions || []).forEach((m) => missions.push(Object.assign({ lid: Number(lid) }, m))));
    const ach = KCA.achievements(Store.summary(sid).mine);
    render('missions', `<div class="wrap">
      <div class="page-head"><h1>ภารกิจของ${esc(s.student_name)}</h1></div>
      <div class="dash" style="margin-top:0">
        <section class="panel"><h2 class="panel-title">${A.ICON.flag}ภารกิจในบทเรียน</h2>
          <div style="display:grid;gap:12px">${missions.map((m) => { const d = m.check(sid); return `<div class="mission ${d ? 'done' : ''}"><div class="mi" style="${d ? '' : 'background:var(--bg);color:var(--ink-2)'}">${d ? A.ICON.check : A.ICON.target}</div><div style="flex:1"><h3>${esc(m.name)}</h3><p class="muted" style="font-size:15px">ด่าน ${m.lid} · ${esc(m.desc)}</p></div>${d ? '<span class="chip" style="background:var(--mint-soft);color:var(--mint-dark)">สำเร็จ</span>' : `<button class="btn sm" data-go="lesson-${m.lid}">ไปทำ</button>`}</div>`; }).join('')}</div>
        </section>
        <aside class="sidebar"><section class="panel"><h2 class="panel-title">${A.badge()}Badge ความสำเร็จ</h2>
          <div style="display:grid;gap:10px">${ach.map((a) => `<div class="mission ${a.got ? 'done' : ''}" style="box-shadow:none;background:var(--bg)"><div class="mi" style="${a.got ? 'background:#FFF6D6' : 'filter:grayscale(1);opacity:.5'}">${A.badge()}</div><div><h3 style="font-size:18px">${esc(a.name)}</h3><p class="muted" style="font-size:14px">${a.got ? 'ได้รับแล้ว ✓' : esc(a.desc)}</p></div></div>`).join('')}</div>
        </section></aside>
      </div></div>`);
  }

  /* ---------- ผลการเรียน (ของนักเรียน) ---------- */
  function pageResults() {
    const s = student();
    if (!s) { pendingRoute = 'results'; return go('profile'); }
    const sid = s.student_id; const sum = Store.summary(sid);
    const BADGES = {}; Object.keys(KCA.lessons).forEach((id) => { if (KCA.lessons[id].badge) BADGES[id] = KCA.lessons[id].badge; });
    render('results', `<div class="wrap">
      <div class="page-head"><h1>ผลการเรียนของ${esc(s.student_name)}</h1></div>
      <section class="panel" style="display:flex;flex-wrap:wrap;gap:22px;align-items:center;justify-content:center;text-align:center;margin-bottom:22px">
        <div style="width:120px;height:134px">${A.char('mimi', sum.stars ? 'celebrating' : 'happy')}</div>
        <div>${A.star(true, 54)}<p class="head" style="font-size:36px">${sum.stars}</p><p>ดาวสะสม</p></div>
        <div>${A.medal()}<p class="head" style="font-size:36px">${sum.passed}</p><p>เหรียญรางวัล</p></div>
        <div style="min-width:220px;flex:1;max-width:380px"><p class="head">ความก้าวหน้า ${Math.round((sum.passed / 16) * 100)}%</p>${UI.bar(sum.passed, 16, 'big')}<p class="muted mt-s">ผ่าน ${sum.passed} จาก 16 บทเรียน</p></div>
      </section>
      <section class="panel" style="margin-bottom:22px"><h2 class="panel-title">${A.ICON.chart}ดาวแต่ละบทเรียน</h2>
        <div class="lessons">${LESSONS.map((l) => { const st = lessonState(sid, l), w = worldById(l.world); return `<div class="lcard w-${w.key} ${st.p && st.p.stars ? '' : 'dim'}" style="border-top-width:5px"><p class="no">ด่าน ${l.id}</p><h3 style="font-size:18px">${esc(l.title)}</h3><div>${UI.stars(st.p ? st.p.stars : 0, 3, 22)}</div><p class="best">${st.p ? `ก่อนเรียน ${st.p.pre_score ?? '–'} · หลังเรียน ${st.p.score} คะแนน` : st.kind === 'soon' ? 'กำลังสร้าง' : 'ยังไม่ได้เรียน'}</p></div>`; }).join('')}</div>
      </section>
      <section class="panel"><h2 class="panel-title">${A.medal()}ตู้รางวัล</h2>
        <div class="lessons">${Object.keys(BADGES).map((id) => { const b = BADGES[id]; const got = sum.mine.some((p) => p.lesson_id === Number(id) && p.status === 'passed'); return `<div class="mission ${got ? 'done' : ''}" style="background:var(--bg);box-shadow:none"><div class="mi" style="width:72px;height:72px;${got ? 'background:#E3F2FD' : 'filter:grayscale(1);opacity:.45'}">${A.DEV[b.art]()}</div><div><h3>${esc(b.name)}</h3><p class="muted" style="font-size:14px">${got ? 'ได้รับแล้ว ✓' : 'ผ่านด่าน ' + id + ' เพื่อรับ'}</p></div></div>`; }).join('')}</div>
      </section>
    </div>`);
  }

  /* ---------- โปรไฟล์นักเรียน (เลือกผู้เรียน) ---------- */
  let pendingRoute = null;
  function pageProfile() {
    const s = student();
    render('profile', `<div class="wrap">
      <div class="page-head"><h1>โปรไฟล์นักเรียน · หนูคือใคร?</h1></div>
      <div class="coach-slot"></div>
      ${s ? `<section class="panel" style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:20px"><span style="width:90px;height:90px">${A.avatar(s.avatar).replace('class="avatar"', 'class="avatar" style="width:90px;height:90px"')}</span><div style="flex:1"><p class="muted">ตอนนี้กำลังเรียนคือ</p><h2 style="font-size:30px">${esc(s.student_name)}</h2><p>ชั้นประถมศึกษาปีที่ 1</p></div><button class="btn mint" data-go="home">${A.ICON.home}ไปหน้าแรก</button></section>` : ''}
      ${db.students.length === 0 ? `<section class="card narrow center"><h2>ยังไม่มีรายชื่อนักเรียน</h2><p class="mt-s muted">ครูเพิ่มรายชื่อได้ที่หน้า "สำหรับครู" หรือเล่นแบบผู้เล่นทดลองไปก่อน (ผลจะไม่ปนกับนักเรียน)</p><div class="row mt"><button class="btn mint" data-pick="${GUEST}">${A.ICON.play}ผู้เล่นทดลอง</button><button class="btn white" data-go="teacher">${A.ICON.teacher}ไปหน้าครู</button></div></section>`
        : `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:16px">${db.students.map((x) => `<button class="gcard" data-pick="${x.student_id}" style="padding:14px"><span style="display:block;width:100px;height:100px;margin:0 auto">${A.avatar(x.avatar).replace('class="avatar"', 'class="avatar" style="width:100px;height:100px"')}</span><span class="head" style="display:block;font-size:20px;margin-top:8px">${esc(x.student_name)}</span></button>`).join('')}</div>
           <p class="center mt"><button class="btn white sm" data-pick="${GUEST}">เล่นแบบผู้เล่นทดลอง</button></p>`}
    </div>`);
    UI.coach($('.coach-slot'), { who: 'robo', mood: 'happy', text: 'แตะที่รูปของหนูได้เลย' });
    $$('[data-pick]').forEach((b) => (b.onclick = () => {
      sfx.ok(); chooseStudent(b.dataset.pick);
      const st = student(); const pr = pendingRoute; pendingRoute = null;
      if (pr === 'next') { const n = nextLesson(st.student_id); go(n ? 'lesson-' + n.id : 'lessons'); }
      else go(pr || 'home');
    }));
  }

  /* ---------- หน้าบทเรียน (5 ขั้นตอน) ---------- */
  const STEPS = [['intro', 'แนะนำ', 'info'], ['learn', 'ดูภาพ', 'eye'], ['demo', 'ดูวิธีเล่น', 'play'], ['play', 'เล่นเกม', 'game'], ['quiz', 'ทดสอบ', 'trophy']];
  function pageLesson(id) {
    const s = student();
    if (!s) { pendingRoute = 'lesson-' + id; return go('profile'); }
    const l = lessonById(id), mod = KCA.lessons[id];
    const w = l && worldById(l.world);
    if (!l || !mod || !Store.unlocked(s.student_id, id)) {
      render('lessons', `<div class="wrap"><section class="card narrow center mt"><div class="big-char">${A.char('tono', 'thinking')}</div><h2 class="mt-s">${!l ? 'ไม่พบด่านนี้' : !mod ? 'ด่านนี้กำลังสร้าง รอหน่อยนะ' : 'ต้องผ่านด่านก่อนหน้าก่อนนะ'}</h2><button class="btn mt" data-go="lessons">${A.ICON.map}กลับไปบทเรียน</button></section></div>`);
      return;
    }
    Store.visit(s.student_id, id);
    const p0 = Store.progress(s.student_id, id);
    Store.upsertProgress(s.student_id, id, { attempts: ((p0 && p0.attempts) || 0) + 1 });
    let step = 0, reached = 0;
    render('lessons', `<div class="lesson-bg w-${w.key}"><div class="wrap">
      <div class="page-head"><button class="ibtn" data-go="lessons-${w.id}" aria-label="กลับไปบทเรียน">${A.ICON.left}</button><div><p class="muted" style="font-size:15px">${w.name} · ${w.unit}</p><h1>ด่านที่ ${l.id}: ${esc(l.title)}</h1></div></div>
      <ol class="stepper" aria-label="ขั้นตอนบทเรียน"></ol>
      <div id="stepArea"></div>
    </div></div>`);
    const stepper = $('.stepper'), area = $('#stepArea');
    const drawStepper = () => {
      stepper.innerHTML = STEPS.map(([k, label, icon], i) => `<li><button ${i > reached ? 'disabled' : ''} data-step="${i}" class="${i === step ? 'now' : ''} ${i < reached || (i <= reached && i < step) ? 'done' : ''}" ${i === step ? 'aria-current="step"' : ''}><span class="dot">${i < reached && i !== step ? A.ICON.check : A.ICON[icon]}</span>${i + 1}. ${label}</button></li>${i < STEPS.length - 1 ? `<li aria-hidden="true"><span class="line ${i < reached ? 'on' : ''}"></span></li>` : ''}`).join('');
      $$('[data-step]', stepper).forEach((b) => (b.onclick = () => { const i = Number(b.dataset.step); if (i <= reached) show(i); }));
    };
    const ctx = { student: s, lesson: l, world: w, next: () => show(Math.min(step + 1, 4), true), goMap: () => go('lessons-' + w.id) };
    function show(i, adv) {
      newScope();
      step = i; if (adv) reached = Math.max(reached, i);
      drawStepper();
      area.innerHTML = '';
      mod.steps[STEPS[i][0]](area, ctx);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    show(0);
  }

  /* =========================================================
     8) Router
     ========================================================= */
  const app = () => $('#app');
  function render(active, inner) {
    app().innerHTML = shell(active, inner);
    $$('[data-sound]').forEach((b) => (b.onclick = () => setSound(!audio.on)));
    $('[data-help]').onclick = helpModal;
    refreshSoundUi();
  }
  // ปุ่ม data-go ทั้งเว็บ
  document.addEventListener('click', (e) => { const b = e.target.closest('[data-go]'); if (b && !b.disabled) { e.preventDefault(); sfx.tap(); go(b.dataset.go); } });
  function go(r) { if (location.hash.slice(1) === r) route(); else location.hash = r; }
  KCA.go = go; KCA.render = render;
  function route() {
    newScope();
    $$('.modal-bg').forEach((m) => m.remove());
    const r = location.hash.slice(1) || 'home';
    window.scrollTo(0, 0);
    if (r === 'home') pageHome();
    else if (r === 'lessons' || r.startsWith('lessons-')) pageLessons(r.split('-')[1]);
    else if (r === 'games' || r.startsWith('games-')) pageGames(r.slice(6) || null);
    else if (r === 'missions') pageMissions();
    else if (r === 'results') pageResults();
    else if (r === 'profile') pageProfile();
    else if (r === 'teacher') KCA.pageTeacher();
    else if (r.startsWith('lesson-')) pageLesson(Number(r.split('-')[1]));
    else pageHome();
  }
  window.addEventListener('hashchange', route);
  document.addEventListener('DOMContentLoaded', route);
})();
