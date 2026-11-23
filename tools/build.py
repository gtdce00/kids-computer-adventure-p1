# ใช้: python3 tools/build.py . KidsComputerAdventure.html  (สร้างโปรแกรมรวมไฟล์เดียวจากเว็บใน repo)
import base64, re, sys, pathlib
src = pathlib.Path(sys.argv[1]); fonts = [src/'assets'/'fonts']; out = pathlib.Path(sys.argv[2])
def font(name):
    for d in fonts:
        f = d / name
        if f.exists(): return 'data:font/woff2;base64,' + base64.b64encode(f.read_bytes()).decode()
    raise SystemExit('missing font ' + name)
css = (src/'style.css').read_text(encoding='utf-8')
css = re.sub(r'url\(assets/fonts/([^)]+)\)', lambda m: 'url(' + font(m.group(1)) + ')', css)
order = ['assets/art.js','app.js','teacher.js','games.js'] + sorted(str(p.relative_to(src)) for p in (src/'lessons').glob('lesson*.js'))
js = [(src/p).read_text(encoding='utf-8') for p in order]
for j in js: assert '</script' not in j.lower()
icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 52"><rect x="8" y="4" width="48" height="34" rx="6" fill="#42A5F5"/><rect x="12" y="8" width="40" height="26" rx="3" fill="#BFE3FF"/><path d="M22 18 l-5 4 5 4 M42 18 l5 4 -5 4" stroke="#1976D2" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M2 40 h60 l-4 8 h-52z" fill="#B388FF"/><circle cx="54" cy="8" r="5" fill="#FFD54F"/></svg>'
fav = 'data:image/svg+xml;base64,' + base64.b64encode(icon.encode()).decode()
html = f'''<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>KIDS COMPUTER ADVENTURE ป.1</title>
<meta name="description" content="เว็บเกมการศึกษาวิชาคอมพิวเตอร์ ว11201 ชั้นประถมศึกษาปีที่ 1 โรงเรียนบ้านนาอ่าง">
<link rel="icon" href="{fav}">
<style>
{css}
</style>
</head>
<body>
<div id="app"><p style="padding:40px;text-align:center;font-family:sans-serif">กำลังโหลด…</p></div>
<noscript><p style="padding:20px;text-align:center">กรุณาเปิดใช้ JavaScript เพื่อเล่นเกม</p></noscript>
''' + ''.join(f'<script>\n{j}\n</script>\n' for j in js) + '</body>\n</html>\n'
out.write_text(html, encoding='utf-8')
print(out, len(html)//1024, 'KB')
