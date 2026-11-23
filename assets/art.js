/* =========================================================
   KIDS COMPUTER ADVENTURE ป.1 — ภาพประกอบต้นฉบับ (SVG)
   ตัวละคร: Robo (หุ่นยนต์ขาวฟ้า), Mimi (เด็กหญิง), Tono (เด็กชาย)
   อารมณ์: idle | happy | sad | thinking | celebrating | explaining
   ========================================================= */
(function () {
  'use strict';
  let uid = 0;
  const id = (p) => p + (++uid);

  /* ---------- ส่วนใบหน้า ---------- */
  function eyes(mood, lx, rx, y, color, r) {
    r = r || 8;
    if (mood === 'happy' || mood === 'celebrating')
      return `<g stroke="${color}" stroke-width="5" fill="none" stroke-linecap="round"><path d="M${lx - 9} ${y + 3} q9 -13 18 0"/><path d="M${rx - 9} ${y + 3} q9 -13 18 0"/></g>`;
    if (mood === 'sad')
      return `<circle cx="${lx}" cy="${y + 3}" r="${r - 1}" fill="${color}"/><circle cx="${rx}" cy="${y + 3}" r="${r - 1}" fill="${color}"/>
        <g stroke="${color}" stroke-width="4" stroke-linecap="round"><path d="M${lx - 10} ${y - 8} L${lx + 7} ${y - 14}"/><path d="M${rx + 10} ${y - 8} L${rx - 7} ${y - 14}"/></g>`;
    if (mood === 'thinking')
      return `<circle cx="${lx}" cy="${y}" r="${r}" fill="${color}"/><circle cx="${lx + 3}" cy="${y - 3}" r="${r / 3}" fill="#fff"/>
        <path d="M${rx - 9} ${y} h18" stroke="${color}" stroke-width="5" stroke-linecap="round"/>
        <path d="M${rx - 10} ${y - 14} q10 -7 20 0" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    return `<circle cx="${lx}" cy="${y}" r="${r}" fill="${color}"/><circle cx="${rx}" cy="${y}" r="${r}" fill="${color}"/>
      <circle cx="${lx + 3}" cy="${y - 3}" r="${r / 2.6}" fill="#fff"/><circle cx="${rx + 3}" cy="${y - 3}" r="${r / 2.6}" fill="#fff"/>`;
  }
  function mouth(mood, cx, y, color) {
    if (mood === 'happy' || mood === 'celebrating') return `<path d="M${cx - 13} ${y - 2} q13 16 26 0 z" fill="${color}"/>`;
    if (mood === 'sad') return `<path d="M${cx - 11} ${y + 6} q11 -9 22 0" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    if (mood === 'thinking') return `<path d="M${cx - 8} ${y + 2} q6 -3 16 1" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    if (mood === 'explaining') return `<ellipse cx="${cx}" cy="${y + 2}" rx="8" ry="6" fill="${color}"/>`;
    return `<path d="M${cx - 11} ${y} q11 9 22 0" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  }
  function extras(mood) {
    if (mood === 'thinking')
      return `<g><circle cx="178" cy="36" r="20" fill="#fff" stroke="#253858" stroke-width="3"/><circle cx="158" cy="66" r="5" fill="#fff" stroke="#253858" stroke-width="2"/>
        <text x="178" y="45" text-anchor="middle" font-size="26" font-weight="700" fill="#253858" font-family="Kanit,sans-serif">?</text></g>`;
    if (mood === 'celebrating')
      return `<g fill="#FFD54F">${[[20, 30], [180, 24], [12, 128], [190, 118]].map(([x, y]) => `<path d="M${x} ${y - 10} l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z"/>`).join('')}</g>`;
    return '';
  }
  const ARMS = { idle: [16, -16], happy: [45, -45], sad: [6, -6], thinking: [16, -150], celebrating: [155, -155], explaining: [16, -110] };

  /* ---------- ROBO: หุ่นยนต์สีขาวฟ้า หน้าจอแสดงสีหน้า ไฟ LED ---------- */
  function robo(mood) {
    mood = mood || 'idle';
    const g1 = id('rh'), g2 = id('rb'), g3 = id('rv');
    const [la, ra] = ARMS[mood] || ARMS.idle;
    const arm = (x, a) => `<g transform="rotate(${a} ${x} 146)"><rect x="${x - 8}" y="146" width="16" height="40" rx="8" fill="url(#${g2})" stroke="#BFD6EE" stroke-width="2"/><circle cx="${x}" cy="148" r="7" fill="#42A5F5"/><circle cx="${x}" cy="190" r="11" fill="#fff" stroke="#BFD6EE" stroke-width="2"/></g>`;
    return `<svg viewBox="0 0 200 230" class="char" role="img" aria-label="โรโบ">
<defs>
 <linearGradient id="${g1}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D9E8F8"/></linearGradient>
 <linearGradient id="${g2}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#CFE1F5"/></linearGradient>
 <linearGradient id="${g3}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#26385F"/><stop offset="1" stop-color="#132342"/></linearGradient>
</defs>
<ellipse cx="100" cy="222" rx="52" ry="7" fill="#253858" opacity=".12"/>
${arm(58, la)}${arm(142, ra)}
<rect x="74" y="196" width="20" height="20" rx="9" fill="#fff" stroke="#BFD6EE" stroke-width="2"/>
<rect x="106" y="196" width="20" height="20" rx="9" fill="#fff" stroke="#BFD6EE" stroke-width="2"/>
<rect x="60" y="136" width="80" height="66" rx="26" fill="url(#${g2})" stroke="#BFD6EE" stroke-width="2"/>
<rect x="80" y="150" width="40" height="30" rx="8" fill="url(#${g3})"/>
<rect x="87" y="156" width="26" height="15" rx="3" fill="none" stroke="#5EF0FF" stroke-width="2.5"/><path d="M95 176 h10" stroke="#5EF0FF" stroke-width="2.5" stroke-linecap="round"/>
<circle cx="70" cy="190" r="3.5" fill="#81DDB5"/><circle cx="130" cy="190" r="3.5" fill="#FF91B8"/>
<line x1="100" y1="34" x2="100" y2="18" stroke="#BFD6EE" stroke-width="5"/><circle cx="100" cy="14" r="8" fill="#FFD54F"/><circle cx="98" cy="12" r="3" fill="#fff" opacity=".8"/>
<circle cx="36" cy="88" r="17" fill="#42A5F5"/><circle cx="36" cy="88" r="9" fill="#1976D2"/><circle cx="36" cy="88" r="4" fill="#5EF0FF"/>
<circle cx="164" cy="88" r="17" fill="#42A5F5"/><circle cx="164" cy="88" r="9" fill="#1976D2"/><circle cx="164" cy="88" r="4" fill="#5EF0FF"/>
<rect x="40" y="32" width="120" height="106" rx="44" fill="url(#${g1})" stroke="#BFD6EE" stroke-width="2"/>
<path d="M62 48 q20 -12 46 -8" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".9"/>
<rect x="54" y="56" width="92" height="64" rx="28" fill="url(#${g3})"/>
<rect x="60" y="61" width="40" height="8" rx="4" fill="#fff" opacity=".12"/>
<g filter="drop-shadow(0 0 3px #5EF0FF)">${eyes(mood, 80, 120, 84, '#5EF0FF', 9)}${mouth(mood, 100, 104, '#5EF0FF')}</g>
<circle cx="64" cy="106" r="5" fill="#FF91B8" opacity=".85"/><circle cx="136" cy="106" r="5" fill="#FF91B8" opacity=".85"/>
${extras(mood)}
</svg>`;
  }

  /* ---------- เด็กนักเรียน (ใช้ร่วม Mimi/Tono) ---------- */
  function kid(kind, mood) {
    mood = mood || 'idle';
    const girl = kind === 'mimi';
    const skin = '#FFDCC2', skinD = '#F5C3A2', hair = '#6B4128', hairD = '#4E2D1A';
    const accent = girl ? '#FF91B8' : '#1976D2';
    const bag = girl ? '#FF91B8' : '#42A5F5';
    const [la, ra] = ARMS[mood] || ARMS.idle;
    const arm = (x, a) => `<g transform="rotate(${a} ${x} 150)"><rect x="${x - 9}" y="146" width="18" height="18" rx="8" fill="#fff" stroke="#DCE6F2" stroke-width="2"/><rect x="${x - 6}" y="160" width="12" height="26" rx="6" fill="${skin}"/><circle cx="${x}" cy="190" r="9" fill="${skin}"/></g>`;
    const legs = girl
      ? `<rect x="82" y="196" width="11" height="22" rx="5" fill="${skin}"/><rect x="107" y="196" width="11" height="22" rx="5" fill="${skin}"/>
         <rect x="80" y="207" width="15" height="8" fill="#fff"/><rect x="105" y="207" width="15" height="8" fill="#fff"/>
         <ellipse cx="86" cy="220" rx="11" ry="6" fill="#253858"/><ellipse cx="114" cy="220" rx="11" ry="6" fill="#253858"/>
         <path d="M70 176 h60 l10 26 h-80z" fill="${accent}"/><path d="M84 176 l-4 26 M100 176 v26 M116 176 l4 26" stroke="#E86E9B" stroke-width="2.5"/>`
      : `<rect x="84" y="194" width="11" height="22" rx="5" fill="${skin}"/><rect x="105" y="194" width="11" height="22" rx="5" fill="${skin}"/>
         <rect x="82" y="208" width="15" height="7" fill="#fff"/><rect x="103" y="208" width="15" height="7" fill="#fff"/>
         <ellipse cx="88" cy="220" rx="11" ry="6" fill="#253858"/><ellipse cx="112" cy="220" rx="11" ry="6" fill="#253858"/>
         <path d="M72 174 h56 v24 h-24 l-4 -8 -4 8 h-24z" fill="${accent}"/>`;
    const hairBack = girl
      ? `<path d="M44 96 q-6 60 26 70 l6 -40z" fill="${hair}"/><path d="M156 96 q6 60 -26 70 l-6 -40z" fill="${hair}"/>
         <path d="M150 66 q40 6 34 58 q-4 22 -18 30 q10 -36 -18 -60z" fill="${hair}"/>`
      : '';
    const hairFront = girl
      ? `<path d="M42 92 q0 -58 58 -58 q58 0 58 58 q-18 -24 -40 -28 q-8 14 -30 18 q10 -12 8 -18 q-30 4 -54 28z" fill="${hair}"/>
         <g transform="translate(150 50) rotate(20)"><path d="M0 0 l-18 -12 v24z" fill="#FF91B8"/><path d="M0 0 l18 -12 v24z" fill="#FF91B8"/><circle r="6" fill="#E86E9B"/></g>`
      : `<path d="M40 96 q-4 -64 60 -64 q64 0 60 64 q-12 -20 -26 -26 l-6 12 -10 -16 -12 14 -8 -16 -14 14 -6 -12 q-22 8 -38 30z" fill="${hair}"/>
         <path d="M96 30 q10 -12 22 -6 q-12 2 -14 10z" fill="${hairD}"/>`;
    const tie = girl
      ? `<path d="M100 146 l-10 -6 v12z M100 146 l10 -6 v12z" fill="#FF91B8"/><circle cx="100" cy="146" r="3.5" fill="#E86E9B"/>`
      : `<rect x="110" y="156" width="14" height="12" rx="2" fill="none" stroke="#1976D2" stroke-width="2"/><path d="M113 160 h8" stroke="#1976D2" stroke-width="2"/>`;
    return `<svg viewBox="0 0 200 230" class="char" role="img" aria-label="${girl ? 'มีมี่' : 'โทโน่'}">
<ellipse cx="100" cy="224" rx="50" ry="6" fill="#253858" opacity=".12"/>
${hairBack}
<rect x="62" y="138" width="76" height="52" rx="16" fill="${bag}"/>
${legs}
${arm(64, la)}${arm(136, ra)}
<path d="M72 140 q28 -8 56 0 l4 38 h-64z" fill="#fff" stroke="#DCE6F2" stroke-width="2"/>
<path d="M88 138 l12 12 12 -12" fill="none" stroke="#DCE6F2" stroke-width="3"/>
<path d="M76 142 l4 34 M124 142 l-4 34" stroke="${bag}" stroke-width="6" stroke-linecap="round"/>
${tie}
<circle cx="42" cy="98" r="11" fill="${skinD}"/><circle cx="158" cy="98" r="11" fill="${skinD}"/>
<circle cx="100" cy="92" r="58" fill="${skin}"/>
${eyes(mood, 78, 122, 98, '#3A2418', 10)}
${mouth(mood, 100, 120, '#C2410C')}
<circle cx="64" cy="114" r="9" fill="#FF91B8" opacity=".45"/><circle cx="136" cy="114" r="9" fill="#FF91B8" opacity=".45"/>
${hairFront}
${extras(mood)}
</svg>`;
  }

  const CHAR_NAMES = { robo: 'โรโบ', mimi: 'มีมี่', tono: 'โทโน่' };
  function char(who, mood) { return who === 'robo' ? robo(mood) : kid(who, mood); }

  /* ---------- อุปกรณ์คอมพิวเตอร์ ---------- */
  const S = (label, inner) => `<svg viewBox="0 0 120 120" class="art" role="img" aria-label="${label}"><ellipse cx="60" cy="113" rx="40" ry="5" fill="#253858" opacity=".1"/>${inner}</svg>`;
  const DEV = {
    monitor: () => { const a = id('m'), b = id('s'); return S('จอภาพ', `<defs><linearGradient id="${a}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#56628E"/><stop offset="1" stop-color="#2F3A63"/></linearGradient><linearGradient id="${b}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B5E8FF"/><stop offset="1" stop-color="#5DBDF8"/></linearGradient></defs>
      <rect x="52" y="84" width="16" height="18" fill="#8E9AC4"/><ellipse cx="60" cy="104" rx="28" ry="6" fill="#6E7BA6"/><rect x="8" y="12" width="104" height="76" rx="12" fill="url(#${a})"/><rect x="15" y="19" width="90" height="58" rx="6" fill="url(#${b})"/><circle cx="86" cy="34" r="7" fill="#FFD54F"/><path d="M15 66 l22 -18 16 12 14 -10 38 22 v5 a6 6 0 0 1 -6 6 h-78 a6 6 0 0 1 -6 -6z" fill="#81DDB5"/><rect x="19" y="22" width="34" height="5" rx="2.5" fill="#fff" opacity=".55"/>`); },
    cpu: () => { const a = id('c'); return S('ซีพียู', `<defs><linearGradient id="${a}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9E8CFF"/><stop offset="1" stop-color="#6A5AE0"/></linearGradient></defs>
      <rect x="32" y="6" width="56" height="104" rx="11" fill="url(#${a})"/><rect x="76" y="10" width="8" height="96" rx="4" fill="#4C3FB8" opacity=".5"/><rect x="41" y="20" width="32" height="7" rx="3.5" fill="#E2DCFF"/><rect x="41" y="33" width="32" height="7" rx="3.5" fill="#E2DCFF"/><circle cx="57" cy="80" r="11" fill="#F1EEFF"/><circle cx="57" cy="80" r="4.5" fill="#81DDB5"/><rect x="36" y="9" width="24" height="5" rx="2.5" fill="#fff" opacity=".45"/>`); },
    keyboard: () => { const a = id('k'); let keys = ''; for (let r = 0; r < 3; r++) for (let c = 0; c < 9; c++) keys += `<rect x="${13 + c * 10.6}" y="${44 + r * 11}" width="8.4" height="8.4" rx="2" fill="${r === 1 && c === 4 ? '#42A5F5' : '#fff'}" stroke="#B9C3DB"/>`;
      return S('แป้นพิมพ์', `<defs><linearGradient id="${a}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2F5FB"/><stop offset="1" stop-color="#C3CCE2"/></linearGradient></defs><rect x="5" y="36" width="110" height="56" rx="12" fill="url(#${a})" stroke="#A7B2CF" stroke-width="2"/>${keys}<rect x="32" y="78" width="56" height="8" rx="3" fill="#fff" stroke="#B9C3DB"/>`); },
    mouse: () => { const a = id('ms'); return S('เมาส์', `<defs><linearGradient id="${a}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#C6CFE3"/></linearGradient></defs>
      <path d="M60 30 C60 14 74 14 78 6" stroke="#8E9AC4" stroke-width="3.5" fill="none" stroke-linecap="round"/><rect x="33" y="28" width="54" height="80" rx="27" fill="url(#${a})" stroke="#A7B2CF" stroke-width="2"/><path d="M60 29 V62 M34 62 H86" stroke="#A7B2CF" stroke-width="2"/><rect x="56" y="38" width="8" height="16" rx="4" fill="#42A5F5"/><path d="M40 46 q2 -12 14 -14" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>`); },
    speaker: () => { const a = id('sp'); return S('ลำโพง', `<defs><linearGradient id="${a}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#66729E"/><stop offset="1" stop-color="#343E66"/></linearGradient></defs>
      <rect x="30" y="6" width="60" height="104" rx="13" fill="url(#${a})"/><circle cx="60" cy="32" r="11" fill="#253858" stroke="#8E9AC4" stroke-width="3"/><circle cx="60" cy="76" r="23" fill="#253858" stroke="#8E9AC4" stroke-width="4"/><circle cx="60" cy="76" r="9" fill="#56628E"/><path d="M98 58 q8 18 0 36 M106 50 q14 26 0 52" stroke="#42A5F5" stroke-width="4" fill="none" stroke-linecap="round"/>`); },
    headphones: () => S('หูฟัง', `<path d="M22 72 A38 38 0 0 1 98 72" stroke="#7E6BF0" stroke-width="10" fill="none" stroke-linecap="round"/><rect x="12" y="62" width="24" height="40" rx="11" fill="#FF91B8"/><rect x="84" y="62" width="24" height="40" rx="11" fill="#FF91B8"/><rect x="28" y="66" width="10" height="32" rx="5" fill="#E86E9B"/><rect x="82" y="66" width="10" height="32" rx="5" fill="#E86E9B"/><rect x="16" y="66" width="6" height="16" rx="3" fill="#fff" opacity=".5"/>`),
    ball: () => S('ลูกบอล', `<circle cx="60" cy="62" r="42" fill="#FFD54F"/><path d="M60 20 a42 42 0 0 1 0 84 a24 42 0 0 0 0 -84" fill="#FF91B8"/><path d="M60 20 a24 42 0 0 0 0 84 a42 42 0 0 1 0 -84" fill="#42A5F5"/><ellipse cx="44" cy="40" rx="10" ry="5" fill="#fff" opacity=".6"/>`),
    apple: () => S('แอปเปิล', `<path d="M60 36 C40 22 14 34 18 64 C22 96 44 108 60 98 C76 108 98 96 102 64 C106 34 80 22 60 36Z" fill="#F06A6A"/><path d="M60 36 q-2 -16 8 -24" stroke="#7A5230" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M66 22 q18 -12 26 4 q-16 8 -26 -4" fill="#81DDB5"/><ellipse cx="38" cy="54" rx="7" ry="12" fill="#fff" opacity=".45"/>`),
    book: () => S('หนังสือ', `<path d="M14 28 q24 -10 46 4 v74 q-22 -14 -46 -4z" fill="#42A5F5"/><path d="M106 28 q-24 -10 -46 4 v74 q22 -14 46 -4z" fill="#1976D2"/><path d="M22 40 q16 -6 30 2 M22 52 q16 -6 30 2 M68 42 q14 -8 30 -2" stroke="#fff" stroke-width="3" fill="none" opacity=".7" stroke-linecap="round"/>`),
    flower: () => S('ดอกไม้', `<path d="M60 60 V92" stroke="#3FAE7E" stroke-width="5"/><path d="M60 80 q-18 -4 -20 -16 q16 0 20 16" fill="#81DDB5"/>${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="60" cy="30" rx="11" ry="16" fill="#FF91B8" transform="rotate(${a} 60 46)"/>`).join('')}<circle cx="60" cy="46" r="10" fill="#FFD54F"/><path d="M38 92 h44 l-6 18 h-32z" fill="#E8915A"/>`),
  };

  /* ---------- เกาะลอยฟ้า 4 โลก ---------- */
  const tree = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-3" y="-4" width="6" height="16" rx="3" fill="#8D6E63"/><circle cx="0" cy="-14" r="14" fill="${c}"/><circle cx="-6" cy="-19" r="6" fill="#fff" opacity=".25"/></g>`;
  const FEATURE = {
    computer: () => `<g transform="translate(94 26)"><rect x="30" y="58" width="12" height="14" fill="#8E9AC4"/><ellipse cx="36" cy="74" rx="20" ry="5" fill="#6E7BA6"/><rect x="0" y="0" width="72" height="58" rx="9" fill="#3D4A7A"/><rect x="5" y="5" width="62" height="44" rx="5" fill="#7FD0FF"/><rect x="18" y="16" width="36" height="22" rx="3" fill="#fff" opacity=".85"/><path d="M26 24 l-5 4 5 4 M46 24 l5 4 -5 4" stroke="#1976D2" stroke-width="3" fill="none" stroke-linecap="round"/></g>`,
    thinking: () => {
      const gear = (cx, cy, r, c, n) => { let t = ''; for (let i = 0; i < n; i++) t += `<rect x="${cx - r * 0.18}" y="${cy - r - r * 0.28}" width="${r * 0.36}" height="${r * 0.5}" rx="3" fill="${c}" transform="rotate(${(360 / n) * i} ${cx} ${cy})"/>`; return `<g>${t}<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}"/><circle cx="${cx}" cy="${cy}" r="${r * 0.42}" fill="#fff"/></g>`; };
      return `<g class="spin-slow" style="transform-origin:152px 58px">${gear(152, 58, 30, '#FFA726', 10)}</g><g class="spin-rev" style="transform-origin:108px 82px">${gear(108, 82, 20, '#42A5F5', 8)}</g>`;
    },
    creative: () => `<g transform="translate(96 30)"><path d="M10 50 C-8 20 30 -6 58 6 C80 16 76 40 60 40 C48 40 52 54 40 60 C28 66 18 62 10 50Z" fill="#FFE7C2" stroke="#E0B984" stroke-width="2"/>
      <circle cx="22" cy="36" r="6" fill="#FF5C8A"/><circle cx="30" cy="20" r="6" fill="#FFD54F"/><circle cx="48" cy="14" r="6" fill="#42A5F5"/><circle cx="62" cy="26" r="6" fill="#81DDB5"/>
      <rect x="54" y="30" width="44" height="36" rx="5" fill="#fff" stroke="#B388FF" stroke-width="4" transform="rotate(10 76 48)"/><path d="M60 62 l12 -14 9 9 6 -6 9 12z" fill="#81DDB5" transform="rotate(10 76 48)"/><circle cx="84" cy="40" r="4" fill="#FFD54F" transform="rotate(10 76 48)"/>
      <rect x="34" y="-14" width="8" height="52" rx="4" fill="#8D6E63" transform="rotate(30 38 12)"/><path d="M50 -22 l8 4 -4 10 -8 -2z" fill="#FF5C8A" transform="rotate(30 38 12)"/></g>`,
    safety: () => `<g transform="translate(104 18)"><path d="M36 0 L72 12 V40 C72 64 54 78 36 86 C18 78 0 64 0 40 V12Z" fill="#42A5F5" stroke="#1976D2" stroke-width="4"/><path d="M36 8 L64 18 V40 C64 58 50 70 36 76Z" fill="#fff" opacity=".2"/>
      <rect x="22" y="38" width="28" height="22" rx="5" fill="#FFD54F"/><path d="M27 38 v-6 a9 9 0 0 1 18 0 v6" stroke="#FFD54F" stroke-width="5" fill="none"/><circle cx="36" cy="48" r="3.5" fill="#B7791F"/><rect x="34.5" y="49" width="3" height="6" fill="#B7791F"/></g>`,
  };
  const ISLAND = {
    computer: { top: '#8EE07A', topL: '#B6F0A2', rock: '#A7836B', rockD: '#7E5F4C', tree: '#5CC463' },
    thinking: { top: '#FFCF5C', topL: '#FFE49C', rock: '#D9A066', rockD: '#B07A44', tree: '#F6A23A' },
    creative: { top: '#C9A7FF', topL: '#E2D1FF', rock: '#9C7FD6', rockD: '#7A5DB8', tree: '#A77BF2' },
    safety: { top: '#8CCBFF', topL: '#BFE3FF', rock: '#6E9BD8', rockD: '#4F7AB8', tree: '#4FB0E8' },
  };
  function island(key) {
    const c = ISLAND[key], gr = id('ig');
    return `<svg viewBox="0 0 260 190" class="island" role="img" aria-hidden="true">
<defs><linearGradient id="${gr}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.rock}"/><stop offset="1" stop-color="${c.rockD}"/></linearGradient></defs>
<ellipse cx="130" cy="184" rx="60" ry="5" fill="#253858" opacity=".08"/>
<path d="M28 112 C40 150 90 160 110 176 C120 184 140 184 150 176 C170 160 220 150 232 112 Z" fill="url(#${gr})"/>
<path d="M60 130 l10 12 M190 128 l-12 14 M120 160 l8 10" stroke="#fff" stroke-width="3" opacity=".25" stroke-linecap="round"/>
<ellipse cx="130" cy="110" rx="106" ry="30" fill="${c.top}"/>
<ellipse cx="130" cy="104" rx="98" ry="22" fill="${c.topL}"/>
${tree(46, 104, 1, c.tree)}${tree(66, 112, 0.75, c.tree)}${tree(212, 104, 1.05, c.tree)}${tree(194, 114, 0.7, c.tree)}
${FEATURE[key]()}
</svg>`;
  }

  /* ---------- เมฆ / ดาว / ไอคอน ---------- */
  const cloud = () => `<svg viewBox="0 0 160 70" class="cloud" aria-hidden="true"><path d="M30 60 a22 22 0 0 1 4 -43 a30 30 0 0 1 56 -6 a24 24 0 0 1 42 16 a18 18 0 0 1 -2 33z" fill="#fff"/></svg>`;
  const star = (on, size) => `<svg viewBox="0 0 24 24" width="${size || 24}" height="${size || 24}" aria-hidden="true"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" fill="${on ? '#FFD54F' : '#E3E9F2'}" stroke="${on ? '#F2A900' : '#CBD5E3'}" stroke-width="1.3" stroke-linejoin="round"/></svg>`;
  const medal = () => `<svg viewBox="0 0 48 48" width="40" height="40" aria-hidden="true"><path d="M14 4h8l4 14h-8z" fill="#42A5F5"/><path d="M34 4h-8l-4 14h8z" fill="#FF91B8"/><circle cx="24" cy="30" r="13" fill="#FFD54F" stroke="#F2A900" stroke-width="2.5"/><path d="M24 23l2.2 4.5 5 .7-3.6 3.4.9 4.9L24 34.2l-4.5 2.3.9-4.9-3.6-3.4 5-.7z" fill="#fff"/></svg>`;
  const badge = () => `<svg viewBox="0 0 48 48" width="40" height="40" aria-hidden="true"><path d="M24 3l17 6v12c0 12-8 20-17 24C15 41 7 33 7 21V9z" fill="#FFD54F" stroke="#F2A900" stroke-width="2.5"/><path d="M24 14l3 6 6.5.9-4.7 4.5 1.1 6.4L24 28.8l-5.9 3 1.1-6.4-4.7-4.5 6.5-.9z" fill="#fff"/></svg>`;

  const I = (p, extra) => `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra || ''}>${p}</svg>`;
  const ICON = {
    home: I('<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>'),
    book: I('<path d="M2 5c3-1.5 7-1.5 10 1v14c-3-2.5-7-2.5-10-1z"/><path d="M22 5c-3-1.5-7-1.5-10 1v14c3-2.5 7-2.5 10-1z"/>'),
    game: I('<rect x="2" y="7" width="20" height="11" rx="5.5"/><path d="M7 10.5v4M5 12.5h4"/><circle cx="15.5" cy="11.5" r="1" fill="currentColor"/><circle cx="18" cy="13.5" r="1" fill="currentColor"/>'),
    trophy: I('<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>'),
    chart: I('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),
    user: I('<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4.5-6 8-6s7 2 8 6"/>'),
    teacher: I('<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>'),
    play: I('<path d="M7 4l13 8-13 8z" fill="currentColor"/>'),
    right: I('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    left: I('<path d="M19 12H5M11 6l-6 6 6 6"/>'),
    vol: I('<path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>'),
    mute: I('<path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M17 9l5 6M22 9l-5 6"/>'),
    bulb: I('<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c1 1 1.5 2 1.5 3.5h5c0-1.5.5-2.5 1.5-3.5A6 6 0 0 0 12 3z"/>'),
    retry: I('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>'),
    check: I('<path d="M5 12.5l4.5 4.5L19 7"/>'),
    x: I('<path d="M6 6l12 12M18 6L6 18"/>'),
    lock: I('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
    tool: I('<path d="M14 6a4 4 0 0 0 5 5l-9 9-3-3 9-9a4 4 0 0 0-2-2z"/>'),
    map: I('<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>'),
    out: I('<path d="M9 21H5V3h4M16 17l5-5-5-5M21 12H9"/>'),
    pencil: I('<path d="M4 20h4L19 9l-4-4L4 16z"/>'),
    trash: I('<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>'),
    download: I('<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>'),
    upload: I('<path d="M12 21V9M7 14l5-5 5 5M4 3h16"/>'),
    copy: I('<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V4H3v13h5"/>'),
    print: I('<path d="M6 9V3h12v6M6 18H4v-7h16v7h-2"/><rect x="6" y="14" width="12" height="7"/>'),
    music: I('<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>'),
    eye: I('<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
    users: I('<circle cx="9" cy="8" r="3.5"/><path d="M2 20c.5-3.5 3.5-5 7-5s6.5 1.5 7 5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 15c2 .6 3.6 2 4 5"/>'),
    target: I('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>'),
    info: I('<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>'),
    pin: I('<path d="M12 22s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>'),
    flag: I('<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>'),
    save: I('<path d="M5 3h11l3 3v15H5z"/><path d="M8 3v6h8M8 21v-7h8v7"/>'),
    help: I('<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.7v.5M12 17v.5"/>'),
  };

  /* ---------- อวาตาร์นักเรียน (วาดเอง) ---------- */
  const AV = [
    { id: 'a1', bg: '#E3F2FD', kind: 'tono', hair: '#6B4128' }, { id: 'a2', bg: '#FCE4EC', kind: 'mimi', hair: '#6B4128' },
    { id: 'a3', bg: '#EDE7F6', kind: 'tono', hair: '#2E2A28' }, { id: 'a4', bg: '#FFF8E1', kind: 'mimi', hair: '#2E2A28' },
    { id: 'a5', bg: '#E0F7EF', kind: 'tono', hair: '#8D5A3B' }, { id: 'a6', bg: '#FFF0E6', kind: 'mimi', hair: '#8D5A3B' },
    { id: 'a7', bg: '#E8F0FE', kind: 'robo' }, { id: 'a8', bg: '#F3E5F5', kind: 'mimi', hair: '#4A3426' },
  ];
  function avatar(aid) {
    const a = AV.find((x) => x.id === aid) || AV[0];
    let svg = char(a.kind, 'happy');
    if (a.hair) svg = svg.split('#6B4128').join(a.hair);
    return `<span class="avatar" style="background:${a.bg}">${svg}</span>`;
  }

  window.ART = { char, robo, kid, CHAR_NAMES, DEV, island, cloud, star, medal, badge, ICON, avatar, AVATARS: AV };
})();
