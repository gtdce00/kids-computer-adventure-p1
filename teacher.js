/* =========================================================
   KIDS COMPUTER ADVENTURE ป.1 — teacher.js
   ระบบครู: เข้าสู่ระบบ · นักเรียน · ผลการเรียน · คู่มือบทเรียน · ตั้งค่า/สำรองข้อมูล
   ========================================================= */
(function () {
  'use strict';
  const K = window.KCA, A = window.ART, $ = K.$, $$ = K.$$, esc = K.esc, UI = K.UI;
  const Store = K.Store, Auth = K.Auth, GUEST = K.GUEST, COURSE = K.COURSE, OUTCOMES = K.OUTCOMES, LESSONS = K.LESSONS;
  const lessonById = K.lessonById, isBuilt = (id) => !!K.lessons[id], render = (a, h) => K.render(a, h);
  const D = () => Store.db;
  /* ---------- สำหรับครู ---------- */
  function download(name, text, type) {
    try { const url = URL.createObjectURL(new Blob(['﻿' + text], { type: type || 'text/plain' })); const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 2000); } catch (e) { /* ใช้ปุ่มคัดลอกแทน */ }
  }
  async function copyText(t, btn) { try { await navigator.clipboard.writeText(t); const o = btn.innerHTML; btn.textContent = 'คัดลอกแล้ว ✓'; setTimeout(() => (btn.innerHTML = o), 1500); } catch (e) { /* ignore */ } }
  let tTab = 'students';
  function pageTeacher() {
    if (!Auth.isIn()) return teacherAuth();
    render('teacher', `<div class="wrap">
      <div class="page-head"><h1 style="flex:1">สำหรับครู · Teacher Dashboard</h1><button class="btn white sm no-print" data-logout>${A.ICON.out}ออกจากระบบ</button></div>
      <nav class="tabs-t no-print" role="tablist">${[['students', 'นักเรียน'], ['results', 'ผลการเรียน'], ['guide', 'คู่มือบทเรียน'], ['settings', 'ตั้งค่า']].map(([k, l]) => `<button role="tab" aria-selected="${tTab === k}" data-tab="${k}">${l}</button>`).join('')}</nav>
      <div id="tArea"></div></div>`);
    $('[data-logout]').onclick = () => { Auth.out(); pageTeacher(); };
    $$('[data-tab]').forEach((b) => (b.onclick = () => { tTab = b.dataset.tab; pageTeacher(); }));
    ({ students: tStudents, results: tResults, guide: tGuide, settings: tSettings })[tTab]($('#tArea'));
  }
  function teacherAuth() {
    const first = !Auth.has();
    render('teacher', `<div class="wrap"><form class="card narrow mt" id="authForm" style="display:grid;gap:12px">
      <div class="row" style="justify-content:flex-start"><div style="width:80px;height:90px">${A.char('robo', 'idle')}</div><h2>${first ? 'ตั้งค่าบัญชีครูครั้งแรก' : 'เข้าสู่ระบบครู'}</h2></div>
      ${first ? '<p class="muted">ตั้งชื่อผู้ใช้และรหัสผ่านสำหรับครู นักเรียนจะเข้าหน้านี้ไม่ได้ (รหัสผ่านเก็บแบบเข้ารหัสในเครื่องนี้)</p>' : ''}
      <label class="f">ชื่อผู้ใช้<input class="input" name="u" autocomplete="username"></label>
      <label class="f">รหัสผ่าน<input class="input" type="password" name="p" autocomplete="${first ? 'new-password' : 'current-password'}"></label>
      ${first ? '<label class="f">ยืนยันรหัสผ่าน<input class="input" type="password" name="p2" autocomplete="new-password"></label>' : ''}
      <p class="err" role="alert" style="color:var(--error);font-weight:600"></p>
      <button class="btn" type="submit">${first ? 'สร้างบัญชีและเข้าสู่ระบบ' : 'เข้าสู่ระบบ'}</button>
    </form></div>`);
    const f = $('#authForm'), err = $('.err', f);
    f.onsubmit = async (e) => {
      e.preventDefault(); err.textContent = '';
      const u = f.u.value, p = f.p.value;
      if (first) {
        if (u.trim().length < 3) return (err.textContent = 'ชื่อผู้ใช้อย่างน้อย 3 ตัวอักษร');
        if (p.length < 4) return (err.textContent = 'รหัสผ่านอย่างน้อย 4 ตัวอักษร');
        if (p !== f.p2.value) return (err.textContent = 'รหัสผ่านทั้งสองช่องไม่ตรงกัน');
        await Auth.create(u, p); pageTeacher();
      } else if (await Auth.login(u, p)) pageTeacher(); else err.textContent = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
    };
  }
  const avPick = (val) => `<div class="avpick">${A.AVATARS.map((a) => `<button type="button" data-av="${a.id}" class="${val === a.id ? 'on' : ''}" aria-label="อวาตาร์ ${a.id}">${A.avatar(a.id)}</button>`).join('')}</div>`;
  const bindAv = (root, cb) => $$('[data-av]', root).forEach((b) => (b.onclick = () => { $$('[data-av]', root).forEach((x) => x.classList.remove('on')); b.classList.add('on'); cb(b.dataset.av); }));
  function tStudents(el) {
    let av = 'a1';
    el.innerHTML = `<div class="tgrid">
      <div style="display:grid;gap:18px;align-content:start">
        <form class="card" id="addOne" style="display:grid;gap:12px"><h3>เพิ่มนักเรียนทีละคน</h3><input class="input" name="n" placeholder="ชื่อเล่นหรือชื่อจริง" aria-label="ชื่อนักเรียน">${avPick(av)}<button class="btn sm" type="submit">${A.ICON.users}เพิ่ม</button></form>
        <div class="card" style="display:grid;gap:12px"><h3>เพิ่มหลายคน</h3><textarea class="input" id="bulk" placeholder="พิมพ์ชื่อบรรทัดละ 1 คน หรือวางจาก Excel" aria-label="รายชื่อหลายคน"></textarea><button class="btn sm mint" id="addBulk">${A.ICON.users}เพิ่มทั้งหมด</button></div>
      </div>
      <div class="card"><h3 style="margin-bottom:12px">รายชื่อนักเรียน ป.1 (${D().students.length} คน)</h3>
        ${D().students.length ? `<ul class="slist">${D().students.map((s, i) => `<li><span class="muted" style="width:24px;text-align:right">${i + 1}</span>${A.avatar(s.avatar)}<span class="n">${esc(s.student_name)}</span><button data-edit="${s.student_id}" aria-label="แก้ไข ${esc(s.student_name)}">${A.ICON.pencil}</button><button data-del="${s.student_id}" aria-label="ลบ ${esc(s.student_name)}" style="color:var(--error)">${A.ICON.trash}</button></li>`).join('')}</ul>` : '<p class="muted">ยังไม่มีรายชื่อ</p>'}
      </div></div>`;
    bindAv($('#addOne'), (v) => (av = v));
    $('#addOne').onsubmit = (e) => { e.preventDefault(); const n = e.target.n.value.trim(); if (!n) return; Store.addStudent(n, av); pageTeacher(); };
    $('#addBulk').onclick = () => { $('#bulk').value.split('\n').map((x) => x.trim()).filter(Boolean).forEach((n, i) => Store.addStudent(n, A.AVATARS[(D().students.length + i) % A.AVATARS.length].id)); pageTeacher(); };
    $$('[data-edit]', el).forEach((b) => (b.onclick = () => {
      const s = Store.student(b.dataset.edit); let av2 = s.avatar;
      const m = UI.modal('แก้ไขข้อมูลนักเรียน', `<div style="display:grid;gap:12px"><input class="input" id="en" value="${esc(s.student_name)}" aria-label="ชื่อ">${avPick(s.avatar)}<div class="row" style="justify-content:flex-start"><button class="btn sm" id="es">${A.ICON.save}บันทึก</button><button class="btn sm sun" id="er">${A.ICON.retry}ล้างผลการเรียนของคนนี้</button></div></div>`);
      bindAv(m.el, (v) => (av2 = v));
      $('#es', m.el).onclick = () => { const n = $('#en', m.el).value.trim(); if (n) Store.updateStudent(s.student_id, { student_name: n, avatar: av2 }); m.close(); pageTeacher(); };
      $('#er', m.el).onclick = () => { Store.reset(s.student_id); m.close(); pageTeacher(); };
    }));
    $$('[data-del]', el).forEach((b) => (b.onclick = () => {
      const s = Store.student(b.dataset.del);
      const m = UI.modal('ยืนยันการลบ', `<p>ลบ <b>${esc(s.student_name)}</b> และผลการเรียนทั้งหมดของนักเรียนคนนี้? การลบย้อนกลับไม่ได้</p><div class="row mt" style="justify-content:flex-start"><button class="btn sm danger" id="dy">${A.ICON.trash}ลบ</button><button class="btn sm white" data-close>ยกเลิก</button></div>`);
      $('#dy', m.el).onclick = () => { Store.deleteStudent(s.student_id); if (K.studentId() === s.student_id) K.chooseStudent(null); m.close(); pageTeacher(); };
    }));
  }
  function teacherRows() {
    const people = D().students.slice();
    if (D().progress.some((p) => p.student_id === GUEST)) people.push(Store.student(GUEST));
    return people.map((s) => ({
      s, visits: D().visits.filter((v) => v.student_id === s.student_id).length,
      lessons: LESSONS.map((l) => {
        const p = Store.progress(s.student_id, l.id);
        const games = D().gameResults.filter((g) => g.student_id === s.student_id && g.lesson_id === l.id && !/-(pre|quiz)$/.test(g.game_id));
        return { l, p, plays: games.length, practice: games.length ? Math.round(games.reduce((a, g) => a + g.score, 0) / games.length) : null };
      }),
    }));
  }
  function teacherCsv(rows) {
    const built = LESSONS.filter((l) => isBuilt(l.id));
    const head = ['ลำดับ', 'ชื่อ', 'จำนวนครั้งที่เข้าเรียน'].concat(...built.map((l) => [`ด่าน${l.id} สถานะ`, `ด่าน${l.id} ก่อนเรียน(เต็ม3)`, `ด่าน${l.id} หลังเรียน(เต็ม100)`, `ด่าน${l.id} ดาว`, `ด่าน${l.id} เกมฝึกเฉลี่ย%`, `ด่าน${l.id} ประเมินตนเอง(1-3)`]));
    const lines = rows.map((r, i) => [i + 1, r.s.student_name, r.visits].concat(...built.map((l) => { const x = r.lessons.find((y) => y.l.id === l.id); return [x.p ? (x.p.status === 'passed' ? 'ผ่าน' : 'กำลังเรียน') : 'ยังไม่เรียน', x.p && x.p.pre_score != null ? x.p.pre_score : '', x.p ? x.p.score : '', x.p ? x.p.stars : '', x.practice ?? '', x.p && x.p.attitude ? x.p.attitude : '']; })));
    return [head].concat(lines).map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\r\n');
  }
  const FACE = { 3: 'ชอบมาก', 2: 'ชอบ', 1: 'เฉย ๆ' };
  function tResults(el) {
    const rows = teacherRows(), real = rows.filter((r) => r.s.student_id !== GUEST), built = LESSONS.filter((l) => isBuilt(l.id)), csv = teacherCsv(rows);
    el.innerHTML = built.map((l) => {
      const rs = real.map((r) => r.lessons.find((x) => x.l.id === l.id));
      const tried = rs.filter((x) => x.p), passed = rs.filter((x) => x.p && x.p.status === 'passed'), post = tried.filter((x) => x.p.score);
      const avg = post.length ? Math.round(post.reduce((a, x) => a + x.p.score, 0) / post.length) : 0;
      const notYet = real.filter((r) => { const x = r.lessons.find((y) => y.l.id === l.id); return !x.p || x.p.status !== 'passed'; });
      return `<section class="card" style="margin-bottom:18px"><h3 style="margin-bottom:12px">ด่าน ${l.id}: ${esc(l.title)} — สรุปรายห้อง</h3>
        <div class="kpis"><div style="background:var(--sky-soft)"><b>${real.length}</b><span>นักเรียนทั้งหมด</span></div><div style="background:var(--sun-soft)"><b>${tried.length}</b><span>เข้าเรียนแล้ว</span></div><div style="background:var(--mint-soft)"><b>${passed.length}</b><span>ผ่านแล้ว</span></div><div style="background:var(--pink-soft)"><b>${avg}</b><span>คะแนนหลังเรียนเฉลี่ย</span></div></div>
        <p><b>ยังไม่ผ่าน (${notYet.length}):</b> ${notYet.length ? notYet.map((r) => esc(r.s.student_name)).join(', ') : '—'}</p></section>`;
    }).join('') + `<section class="card"><div class="row" style="justify-content:flex-start;margin-bottom:12px"><h3 style="flex:1">ผลรายบุคคล</h3>
        <button class="btn sm" id="csvDl">${A.ICON.download}ส่งออก CSV (Excel)</button><button class="btn sm white" id="csvCp">${A.ICON.copy}คัดลอกตาราง</button><button class="btn sm white" id="prt">${A.ICON.print}พิมพ์รายงาน</button></div>
      ${rows.length ? `<div class="scroll"><table class="t"><thead><tr><th>ที่</th><th>ชื่อ</th><th class="num">เข้าเรียน (ครั้ง)</th>${built.map((l) => `<th>ด่าน ${l.id}: สถานะ · ก่อน → หลัง · ดาว · เกมฝึก · ประเมินตนเอง</th>`).join('')}</tr></thead><tbody>
        ${rows.map((r, i) => `<tr><td>${i + 1}</td><td><b>${esc(r.s.student_name)}</b></td><td class="num">${r.visits}</td>${built.map((l) => { const x = r.lessons.find((y) => y.l.id === l.id); return `<td>${x.p ? `<span class="pill" style="background:${x.p.status === 'passed' ? 'var(--mint-soft)' : 'var(--sun-soft)'}">${x.p.status === 'passed' ? 'ผ่าน' : 'กำลังเรียน'}</span> <span class="num">${x.p.pre_score ?? '–'}/3 → ${x.p.score}</span> ${UI.stars(x.p.stars, 3, 16)} ${x.practice != null ? `${x.practice}% (${x.plays} เกม)` : 'ยังไม่เล่นเกม'} ${x.p.attitude ? '· ' + FACE[x.p.attitude] : ''}` : '<span class="muted">ยังไม่เรียน</span>'}</td>`; }).join('')}</tr>`).join('')}
      </tbody></table></div>` : '<p class="muted">ยังไม่มีข้อมูลการเรียน</p>'}
      <p class="muted mt-s" style="font-size:14px">ก่อนเรียน = เกมอุ่นเครื่อง (เต็ม 3) · หลังเรียน = แบบทดสอบท้ายบท (เต็ม 100) · เกมฝึก = ค่าเฉลี่ยการตอบถูกครั้งแรก · ประเมินตนเอง = หน้ายิ้มท้ายบท</p></section>`;
    $('#csvDl').onclick = () => download(`ผลการเรียน_คอมพิวเตอร์ป1_${new Date().toISOString().slice(0, 10)}.csv`, csv, 'text/csv');
    $('#csvCp').onclick = (e) => copyText(csv, e.currentTarget);
    $('#prt').onclick = () => { try { window.print(); } catch (e) { /* ignore */ } };
  }
  function tGuide(el) {
    const built = LESSONS.filter((l) => isBuilt(l.id));
    const id = Number(el.dataset.lid || built[0].id);
    const l = lessonById(id), L = KCA.lessons[id], G = L.guide, item = L.item;
    const qs = (list, t) => `<h4>${t}</h4><ol style="padding:0">${list.map((q, i) => `<li class="q"><b>ข้อ ${i + 1}.</b> ${esc(q.say)} — ตัวเลือก: ${q.options.map((o) => item(o).name).join(' / ')}<br><span style="color:var(--mint-dark);font-weight:600">เฉลย: ${item(q.target).name}</span> · ${esc(q.explain)}</li>`).join('')}</ol>`;
    el.innerHTML = `<div class="card guide">
      <div class="row no-print" style="justify-content:flex-start;margin-bottom:14px"><select class="input" id="gsel" style="max-width:360px" aria-label="เลือกบทเรียน">${built.map((x) => `<option value="${x.id}" ${x.id === id ? 'selected' : ''}>ด่าน ${x.id}: ${esc(x.title)}</option>`).join('')}</select><button class="btn sm white" id="gprt">${A.ICON.print}พิมพ์คู่มือ</button></div>
      <h3>บทเรียนที่ ${l.id} ${esc(l.title)}</h3>
      <p class="muted">${COURSE.name} ${COURSE.code} ${COURSE.grade} · สัปดาห์ที่ ${l.week} · ${l.hours} ชั่วโมง · ${esc(G.hours)}</p>
      <h4>มาตรฐาน/ผลการเรียนรู้</h4><p>${esc(G.outcome)}</p><p class="muted" style="font-size:15px">กิจกรรมตามกำหนดการสอน: ${esc(l.activity)}</p>
      <h4>จุดประสงค์การเรียนรู้</h4><ul><li><b>K ความรู้:</b> ${esc(G.objectives.K)}</li><li><b>P ทักษะ:</b> ${esc(G.objectives.P)}</li><li><b>A คุณลักษณะ:</b> ${esc(G.objectives.A)}</li></ul>
      <h4>สาระสำคัญ</h4><p>${esc(G.essence)}</p>
      <h4>เนื้อหาการเรียนรู้</h4><ul>${G.content.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
      <h4>สื่อและอุปกรณ์</h4><ul>${G.media.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
      <h4>ขั้นตอนการจัดการเรียนรู้</h4><ol style="padding:0">${G.steps.map((s) => `<li class="step"><b>${esc(s.step)}</b><br>${esc(s.text)}</li>`).join('')}</ol>
      <h4>กิจกรรมเกม</h4><ul>${L.games.map((g) => `<li>${esc(g.title)} (${esc(g.type)})</li>`).join('')}</ul>
      ${qs(L.pre, 'ประเมินก่อนเรียน (เกมอุ่นเครื่อง) และเฉลย')}${qs(L.quiz, 'แบบทดสอบหลังเรียน และเฉลย')}
      <h4>เกณฑ์การประเมิน 3 ด้าน</h4><div class="scroll"><table class="t" style="min-width:560px"><thead><tr><th>ด้าน</th><th>เครื่องมือ</th><th>เกณฑ์</th></tr></thead><tbody>${G.criteria.map((c) => `<tr><td style="white-space:nowrap"><b>${esc(c.aspect)}</b></td><td>${esc(c.tool)}</td><td>${esc(c.rule)}</td></tr>`).join('')}</tbody></table></div>
    </div>`;
    $('#gsel').onchange = (e) => { el.dataset.lid = e.target.value; tGuide(el); };
    $('#gprt').onclick = () => { try { window.print(); } catch (e) { /* ignore */ } };
  }
  function tSettings(el) {
    el.innerHTML = `<div class="tgrid" style="grid-template-columns:repeat(auto-fit,minmax(320px,1fr))">
      <section class="card" style="display:grid;gap:14px;align-content:start"><h3>การเล่น</h3>
        <label style="display:flex;gap:10px;align-items:center"><input type="checkbox" id="ua" style="width:24px;height:24px" ${D().settings.unlockAll ? 'checked' : ''}> ปลดล็อกทุกด่าน (ไม่ต้องเรียนตามลำดับ)</label>
        <label class="f">เกณฑ์ผ่านด่าน<select class="input" id="ps"><option value="1">1 ดาวขึ้นไป (ตอบถูก 3/5 ข้อ)</option><option value="2">2 ดาวขึ้นไป (ตอบถูก 4/5 ข้อ)</option><option value="3">3 ดาว (ตอบถูก 5/5 ข้อ)</option></select></label>
        <h3 class="mt-s">ผลการเรียนรู้ของรายวิชา ${COURSE.code}</h3><ol style="margin:0;padding-left:22px;font-size:16px">${OUTCOMES.map((o) => `<li>${esc(o)}</li>`).join('')}</ol>
      </section>
      <section class="card" style="display:grid;gap:12px;align-content:start"><h3>สำรองและกู้คืนข้อมูล</h3>
        <p class="muted">ข้อมูลเก็บในเบราว์เซอร์ของเครื่องนี้ ควรสำรองเป็นไฟล์ทุกสัปดาห์ หรือก่อนล้างเครื่อง/เปลี่ยนเครื่อง</p>
        ${Store.memoryOnly() ? '<p style="color:var(--error);font-weight:600">เบราว์เซอร์นี้ไม่อนุญาตให้บันทึกข้อมูล ผลจะหายเมื่อปิดหน้าเว็บ</p>' : ''}
        <div class="row" style="justify-content:flex-start"><button class="btn sm" id="bk">${A.ICON.download}สำรองข้อมูล (JSON)</button><button class="btn sm white" id="bc">${A.ICON.copy}คัดลอกข้อมูล</button><label class="btn sm mint" style="cursor:pointer">${A.ICON.upload}กู้คืนจากไฟล์<input type="file" id="rf" accept=".json,application/json" hidden></label></div>
        <p id="smsg" role="status" style="font-weight:600"></p>
        <h3 class="mt-s">รีเซ็ต</h3><button class="btn sm danger" id="rs">${A.ICON.retry}ล้างผลการเรียนของทุกคน</button>
      </section></div>`;
    $('#ps').value = String(D().settings.passStars);
    $('#ua').onchange = (e) => Store.settings({ unlockAll: e.target.checked });
    $('#ps').onchange = (e) => Store.settings({ passStars: Number(e.target.value) });
    $('#bk').onclick = () => download(`สำรองข้อมูล_KCA_${new Date().toISOString().slice(0, 10)}.json`, Store.exportJson(), 'application/json');
    $('#bc').onclick = (e) => copyText(Store.exportJson(), e.currentTarget);
    $('#rf').onchange = (e) => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { try { Store.importJson(String(r.result).replace(/^﻿/, '')); $('#smsg').textContent = 'กู้คืนข้อมูลเรียบร้อย'; } catch (er) { $('#smsg').textContent = 'กู้คืนไม่สำเร็จ: ' + er.message; } }; r.readAsText(f); e.target.value = ''; };
    $('#rs').onclick = () => { const m = UI.modal('ยืนยันการล้างผลการเรียน', `<p>ผลการเรียน ดาว และผลเกมของนักเรียนทุกคนจะถูกลบ (รายชื่อนักเรียนยังอยู่) แนะนำให้กด "สำรองข้อมูล" ก่อน</p><div class="row mt" style="justify-content:flex-start"><button class="btn sm danger" id="ry">ล้างทั้งหมด</button><button class="btn sm white" data-close>ยกเลิก</button></div>`); $('#ry', m.el).onclick = () => { Store.reset(); m.close(); $('#smsg').textContent = 'ล้างผลการเรียนแล้ว'; }; };
  }


  K.pageTeacher = pageTeacher;
})();
