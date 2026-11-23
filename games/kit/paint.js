/* =========================================================
   ห้องเกมการศึกษา ครูคอม — กระดานวาดภาพ (paint.js)
   ใช้ร่วมกันในเกมวาดภาพ · ไม่บันทึกภาพ ไม่เก็บข้อมูลใด ๆ
   ต้องโหลดหลัง kit.js
   ========================================================= */
(function () {
  'use strict';
  const { $, $$ } = KIT;
  const W = 800, H = 500;
  const TOOLS = {
    pencil: { icon: '✏️', name: 'ดินสอ' }, brush: { icon: '🖌️', name: 'พู่กัน' }, fill: { icon: '🪣', name: 'ถังสี' }, eraser: { icon: '🧽', name: 'ยางลบ' },
    line: { icon: '📏', name: 'เส้นตรง' }, rect: { icon: '⬜', name: 'สี่เหลี่ยม' }, circle: { icon: '⚪', name: 'วงกลม' }, tri: { icon: '🔺', name: 'สามเหลี่ยม' },
    stamp: { icon: '🌸', name: 'ตราประทับ' }, mirror: { icon: '🪞', name: 'กระจก' },
    undo: { icon: '↶', name: 'ย้อนกลับ' }, clear: { icon: '🗑️', name: 'ล้างภาพ' },
  };
  const COLORS = [['#E53935', 'แดง'], ['#FB8C00', 'ส้ม'], ['#FDD835', 'เหลือง'], ['#43A047', 'เขียว'], ['#1E88E5', 'ฟ้า'], ['#8E24AA', 'ม่วง'], ['#F06292', 'ชมพู'], ['#8D5524', 'น้ำตาล'], ['#212121', 'ดำ']];
  const hex2rgb = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const CSS = `
  .studio{display:grid;grid-template-columns:auto minmax(0,1fr);gap:14px;align-items:start}
  @media (max-width:760px){.studio{grid-template-columns:1fr}}
  .tools{display:grid;grid-template-columns:repeat(2,74px);gap:8px;align-content:start}
  @media (max-width:760px){.tools{grid-template-columns:repeat(auto-fill,minmax(70px,1fr))}}
  .tool{height:74px;border-radius:16px;background:#fff;border:var(--b);box-shadow:3px 3px 0 var(--ink);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:2px}
  .tool .ti{font-size:30px;line-height:1}.tool .tn{font-size:13px;line-height:1.1}
  .tool.on{background:var(--sun);transform:translate(2px,2px);box-shadow:1px 1px 0 var(--ink)}
  .tool.act{background:#F1F4FF}.tool.toggle.on{background:#CFF5E3}
  .tool.glow{outline:4px solid var(--grape);outline-offset:2px;animation:pop .8s infinite}
  .tool.no{animation:shake .4s;background:var(--no-soft)}
  .canvas-wrap{position:relative;width:100%;aspect-ratio:8/5;border:var(--b);border-radius:18px;overflow:hidden;background:#fff;box-shadow:var(--pop);touch-action:none;cursor:crosshair}
  .canvas-wrap canvas{position:absolute;inset:0;width:100%;height:100%}
  .canvas-wrap canvas.top{pointer-events:none}
  .palette{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;align-items:center}
  .sw{width:46px;height:46px;border-radius:50%;border:3px solid var(--ink);box-shadow:2px 2px 0 var(--ink)}
  .sw.on{transform:scale(1.18);outline:4px solid var(--grape);outline-offset:2px}
  .now{display:flex;align-items:center;gap:8px;margin-left:auto;font-size:15px;color:var(--ink2)}
  .now i{width:26px;height:26px;border-radius:50%;border:2px solid var(--ink);display:inline-block}
  .stamps{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;align-items:center}
  .stp{width:54px;height:54px;border-radius:14px;background:#fff;border:var(--b);font-size:32px;line-height:1}
  .stp.on{background:var(--sun)}
  .tasks{list-style:none;margin:12px 0 0;padding:0;display:flex;flex-wrap:wrap;gap:8px}
  .tasks li{display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:14px;background:#fff;border:2px solid var(--line);font-size:16px}
  .tasks li .dot{width:22px;height:22px;border-radius:50%;border:2px solid var(--ink)}
  .tasks li .big{font-size:26px;line-height:1}
  .tasks li.done{border-color:var(--ok);background:var(--ok-soft)}
  .tasks li.done::after{content:'✓';font:700 18px/1 'Mali';color:var(--ok)}`;
  const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);

  function Paint(host, o) {
    const tools = o.tools || ['pencil', 'brush', 'fill', 'eraser', 'line', 'rect', 'circle', 'tri', 'undo', 'clear'];
    const stamps = o.stamps || [];
    host.innerHTML = `<div class="studio">
      <div class="tools">${tools.map((t) => `<button class="tool ${t === 'undo' || t === 'clear' ? 'act' : ''} ${t === 'mirror' ? 'toggle' : ''}" data-t="${t}" aria-label="${TOOLS[t].name}"><span class="ti">${TOOLS[t].icon}</span><span class="tn">${TOOLS[t].name}</span></button>`).join('')}</div>
      <div><div class="canvas-wrap"><canvas class="bg" width="${W}" height="${H}"></canvas><canvas class="draw" width="${W}" height="${H}"></canvas><canvas class="top" width="${W}" height="${H}"></canvas></div>
        ${stamps.length ? `<div class="stamps">${stamps.map((s) => `<button class="stp" data-s="${s}" aria-label="ตราประทับ ${s}">${s}</button>`).join('')}<button class="stp" data-size="56" aria-label="ตราเล็ก" style="font-size:18px">🔹</button><button class="stp" data-size="110" aria-label="ตราใหญ่" style="font-size:30px">🔷</button></div>` : ''}
        ${o.palette === false ? '' : `<div class="palette">${COLORS.map(([c, n]) => `<button class="sw" data-c="${c}" style="background:${c}" aria-label="สี${n}" title="${n}"></button>`).join('')}<span class="now">สีที่เลือก <i class="nowc"></i></span></div>`}
      </div></div>`;
    const wrap = $('.canvas-wrap', host), [bg, draw, top] = $$('canvas', wrap);
    const bx = bg.getContext('2d'), dx = draw.getContext('2d', { willReadFrequently: true }), tx = top.getContext('2d', { willReadFrequently: true });
    bx.fillStyle = '#fff'; bx.fillRect(0, 0, W, H);
    const st = { tool: o.tool || tools[0], color: o.color || '#E53935', undo: [], shapes: new Set(), fills: new Set(), stampsUsed: new Set(), strokes: 0, locked: !!o.locked, mirror: false, stamp: stamps[0], size: 80 };
    const api = { bx, dx, tx, st, wrap, W, H };
    const pushUndo = () => { st.undo.push(dx.getImageData(0, 0, W, H)); if (st.undo.length > 25) st.undo.shift(); };
    const drawShape = (t, a, b) => {
      dx.save(); dx.globalCompositeOperation = 'source-over'; dx.strokeStyle = st.color; dx.lineWidth = 7; dx.lineJoin = 'round'; dx.lineCap = 'round'; dx.beginPath();
      if (t === 'line') { dx.moveTo(a.x, a.y); dx.lineTo(b.x, b.y); }
      if (t === 'rect') dx.rect(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.abs(b.x - a.x), Math.abs(b.y - a.y));
      if (t === 'circle') dx.ellipse((a.x + b.x) / 2, (a.y + b.y) / 2, Math.abs(b.x - a.x) / 2, Math.abs(b.y - a.y) / 2, 0, 0, Math.PI * 2);
      if (t === 'tri') { dx.moveTo((a.x + b.x) / 2, Math.min(a.y, b.y)); dx.lineTo(Math.max(a.x, b.x), Math.max(a.y, b.y)); dx.lineTo(Math.min(a.x, b.x), Math.max(a.y, b.y)); dx.closePath(); }
      dx.stroke(); dx.restore();
    };
    function flood(px, py, hex) {
      const img = dx.getImageData(0, 0, W, H), d = img.data, m = tx.getImageData(0, 0, W, H).data, i0 = (py * W + px) * 4;
      if (m[i0 + 3] > 80) return false;
      const s = [d[i0], d[i0 + 1], d[i0 + 2], d[i0 + 3]], [r, g, b] = hex2rgb(hex);
      if (s[3] === 255 && Math.abs(s[0] - r) + Math.abs(s[1] - g) + Math.abs(s[2] - b) < 6) return false;
      const ok = (p) => { const i = p * 4; return m[i + 3] <= 80 && Math.abs(d[i] - s[0]) + Math.abs(d[i + 1] - s[1]) + Math.abs(d[i + 2] - s[2]) + Math.abs(d[i + 3] - s[3]) < 120; };
      const seen = new Uint8Array(W * H), stack = [[px, py]];
      while (stack.length) {
        let [x, y] = stack.pop(); let p = y * W + x;
        if (seen[p] || !ok(p)) continue;
        while (x > 0 && !seen[p - 1] && ok(p - 1)) { x--; p--; }
        let up = false, dn = false;
        while (x < W && !seen[p] && ok(p)) {
          seen[p] = 1; const i = p * 4; d[i] = r; d[i + 1] = g; d[i + 2] = b; d[i + 3] = 255;
          if (y > 0) { const q = p - W; if (!seen[q] && ok(q)) { if (!up) { stack.push([x, y - 1]); up = true; } } else up = false; }
          if (y < H - 1) { const q = p + W; if (!seen[q] && ok(q)) { if (!dn) { stack.push([x, y + 1]); dn = true; } } else dn = false; }
          x++; p++;
        }
      }
      dx.putImageData(img, 0, 0); return true;
    }
    const width = (t) => (t === 'pencil' ? 5 : t === 'brush' ? 16 : 28);
    const dot = (x, y, t) => { dx.save(); dx.globalCompositeOperation = t === 'eraser' ? 'destination-out' : 'source-over'; dx.fillStyle = st.color; dx.beginPath(); dx.arc(x, y, width(t) / 2, 0, Math.PI * 2); dx.fill(); dx.restore(); };
    const segment = (a, b, t) => { dx.save(); dx.globalCompositeOperation = t === 'eraser' ? 'destination-out' : 'source-over'; dx.strokeStyle = st.color; dx.lineCap = 'round'; dx.lineJoin = 'round'; dx.lineWidth = width(t); dx.beginPath(); dx.moveTo(a.x, a.y); dx.lineTo(b.x, b.y); dx.stroke(); dx.restore(); };
    const stampAt = (x, y) => { dx.save(); dx.font = `${st.size}px "Segoe UI Emoji","Noto Color Emoji",sans-serif`; dx.textAlign = 'center'; dx.textBaseline = 'middle'; dx.fillText(st.stamp, x, y); dx.restore(); };
    const mx = (p) => ({ x: W - p.x, y: p.y });
    const pos = (e) => { const r = wrap.getBoundingClientRect(); return { x: Math.max(0, Math.min(W - 1, Math.round((e.clientX - r.left) * W / r.width))), y: Math.max(0, Math.min(H - 1, Math.round((e.clientY - r.top) * H / r.height))) }; };
    let down = null, snap = null, last = null;
    wrap.addEventListener('pointerdown', (e) => {
      if (st.locked) return;
      e.preventDefault(); if (wrap.setPointerCapture) wrap.setPointerCapture(e.pointerId);
      const p = pos(e), t = st.tool;
      if (t === 'fill') { pushUndo(); if (flood(p.x, p.y, st.color)) { st.fills.add(st.color); KIT.sfx.tap(); if (o.onFill) o.onFill(p, st.color); } else st.undo.pop(); return; }
      if (t === 'stamp') { pushUndo(); stampAt(p.x, p.y); if (st.mirror) stampAt(W - p.x, p.y); st.stampsUsed.add(st.stamp); KIT.sfx.tap(); if (o.onChange) o.onChange(); return; }
      if (!['pencil', 'brush', 'eraser', 'line', 'rect', 'circle', 'tri'].includes(t)) return;
      pushUndo(); down = p; last = p;
      if (['line', 'rect', 'circle', 'tri'].includes(t)) snap = dx.getImageData(0, 0, W, H);
      else { dot(p.x, p.y, t); if (st.mirror) dot(W - p.x, p.y, t); }
    });
    wrap.addEventListener('pointermove', (e) => {
      if (!down) return;
      const p = pos(e), t = st.tool;
      if (snap) { dx.putImageData(snap, 0, 0); drawShape(t, down, p); return; }
      segment(last, p, t); if (st.mirror) segment(mx(last), mx(p), t); last = p;
      if (o.onMove) o.onMove(p);
    });
    const up = (e) => {
      if (!down) return;
      const t = st.tool;
      if (snap) { const p = pos(e); dx.putImageData(snap, 0, 0); if (Math.abs(p.x - down.x) + Math.abs(p.y - down.y) > 12) { drawShape(t, down, p); st.shapes.add(t); } else st.undo.pop(); snap = null; }
      else if (t !== 'eraser') st.strokes++;
      down = null; if (o.onChange) o.onChange();
    };
    wrap.addEventListener('pointerup', up); wrap.addEventListener('pointercancel', up);
    const setTool = (t) => { st.tool = t; $$('.tool:not(.toggle)', host).forEach((b) => b.classList.toggle('on', b.dataset.t === t)); $$('.stp[data-s]', host).forEach((b) => b.classList.toggle('on', t === 'stamp' && b.dataset.s === st.stamp)); };
    const setColor = (c) => { st.color = c; $$('.sw', host).forEach((b) => b.classList.toggle('on', b.dataset.c === c)); const n = $('.nowc', host); if (n) n.style.background = c; };
    $$('.tool', host).forEach((b) => (b.onclick = () => {
      const t = b.dataset.t;
      if (o.onToolTap && o.onToolTap(t, b) === false) return;
      KIT.sfx.tap();
      if (t === 'undo') { const u = st.undo.pop(); if (u) { dx.putImageData(u, 0, 0); if (o.onChange) o.onChange(); } return; }
      if (t === 'clear') { pushUndo(); dx.clearRect(0, 0, W, H); if (o.onChange) o.onChange(); return; }
      if (t === 'mirror') { st.mirror = !st.mirror; b.classList.toggle('on', st.mirror); if (o.onMirror) o.onMirror(st.mirror); return; }
      setTool(t);
    }));
    $$('.stp[data-s]', host).forEach((b) => (b.onclick = () => { KIT.sfx.tap(); st.stamp = b.dataset.s; setTool('stamp'); }));
    $$('.stp[data-size]', host).forEach((b) => (b.onclick = () => { KIT.sfx.tap(); st.size = Number(b.dataset.size); $$('.stp[data-size]', host).forEach((x) => x.classList.toggle('on', x === b)); }));
    $$('.sw', host).forEach((b) => (b.onclick = () => { KIT.sfx.tap(); setColor(b.dataset.c); if (o.onColor) o.onColor(b.dataset.c); }));
    setTool(st.tool); setColor(st.color);
    Object.assign(api, { setTool, setColor, lock: (v) => { st.locked = v; }, pixel: (x, y) => { const d = dx.getImageData(x, y, 1, 1).data; return [d[0], d[1], d[2], d[3]]; } });
    return api;
  }
  KIT.Paint = Paint; KIT.PAINT_TOOLS = TOOLS; KIT.COLORS = COLORS; KIT.hex2rgb = hex2rgb;
})();
