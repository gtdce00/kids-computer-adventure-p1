# กฎของ repo นี้ (ห้องเกมการศึกษา ครูคอม)

โครงสร้าง: `index.html` = หน้าห้องเกม (รวมเกมทุกชั้น ป.1–ม.3) · `p1/` = เกม KIDS COMPUTER ADVENTURE ป.1
เกมของชั้นอื่นในอนาคต ให้ทำเป็นโฟลเดอร์ใหม่ (เช่น `p2/`) มีปุ่ม "ห้องเกม" ลิงก์ `../index.html` และเพิ่มในรายการ `GAMES` ของ `index.html`

## กฎข้อ 1: แก้ไขเว็บทุกครั้ง ต้องสร้างและอัปโหลดขึ้น GitHub
หลังแก้ไฟล์เว็บใด ๆ (index.html, fonts/, p1/ หรือโฟลเดอร์เกมอื่น) ให้ทำครบทุกขั้น:
1. ทดสอบเปิดเว็บ ต้องไม่มี error และกดไป-กลับระหว่างห้องเกมกับเกมได้
2. รัน `bash tools/package.sh` ซึ่งจะ
   - รวมเกม ป.1 เป็นไฟล์เดียว (`tools/build.py`: style.css + ฟอนต์ base64 + art.js → app.js → teacher.js → games.js → lessons/lesson*.js)
   - สร้าง `download/GameRoom-Offline.zip` (ห้องเกม + เกม + INSTALL-Desktop-Icon.vbs)
   - สร้างโปรแกรมติดตั้ง `GameRoom-Setup.exe` ด้วย makensis แล้วใส่ใน `download/GameRoom-Setup.zip` (ไฟล์ .exe ดาวน์โหลดตรง ๆ ไม่ได้)
   - เมื่อมีการเปลี่ยนแปลงสำคัญ ให้เพิ่ม VERSION ใน `installer/installer.nsi`
3. commit แล้ว push ขึ้น `main` ของ gtdce00/kids-computer-adventure-p1 (GitHub Pages จะอัปเดตเว็บตามเอง)

ถ้ามีบทเรียนใหม่ของ ป.1 ให้เพิ่ม `<script src="lessons/lessonXX.js">` ใน `p1/index.html` (build.py รวม lessons/lesson*.js ให้อัตโนมัติ)
