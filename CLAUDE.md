# กฎของ repo นี้ (ห้องเกมการศึกษา ครูคอม)

โครงสร้าง: `index.html` = หน้าห้องเกม (รวมเกมทุกชั้น ป.1–ม.3) · `p1/` = เกม KIDS COMPUTER ADVENTURE ป.1
· `games/<id>/` = เกมสั้น 1 เรื่องต่อเกม (ใช้ `games/kit/kit.css` + `kit.js` ร่วมกัน) ปุ่ม "ห้องเกม" ลิงก์ `../../index.html`
เกมใหม่ ให้ทำเป็นโฟลเดอร์ใน `games/` และเพิ่มในรายการ `GAMES` ของ `index.html` (ใส่ชั้น วิชา และหัวข้อจากกำหนดการสอน)

## กฎข้อ 2: เกมห้ามมีชื่อนักเรียน ห้ามยุ่งกับข้อมูลเด็กเด็ดขาด
เกมใหม่ทุกเกมให้เข้าเล่นเพื่อเรียนรู้อย่างเดียว:
- ไม่ถามชื่อ ไม่มีบัญชี/ล็อกอิน/โปรไฟล์ ไม่มีช่องกรอกข้อมูลส่วนตัว
- ไม่เก็บข้อมูลใด ๆ (ไม่ใช้ localStorage, sessionStorage, cookie, IndexedDB) คะแนนอยู่บนหน้าจอระหว่างเล่นเท่านั้น
- ไม่ส่งข้อมูลออกนอกเครื่อง ไม่โหลดอะไรจากอินเทอร์เน็ต (ทุกไฟล์อยู่ใน repo)
- ทดสอบทุกครั้ง: เล่นจนจบแล้วตรวจว่า storage = 0 และไม่มี network request

## กฎข้อ 1: แก้ไขเว็บทุกครั้ง ต้องสร้างและอัปโหลดขึ้น GitHub
หลังแก้ไฟล์เว็บใด ๆ (index.html, fonts/, p1/ หรือโฟลเดอร์เกมอื่น) ให้ทำครบทุกขั้น:
1. ทดสอบเปิดเว็บ ต้องไม่มี error และกดไป-กลับระหว่างห้องเกมกับเกมได้ (เกมใน games/ ต้องผ่านกฎข้อ 2 ด้วย)
2. รัน `bash tools/package.sh` ซึ่งจะ
   - รวมเกม ป.1 เป็นไฟล์เดียว (`tools/build.py`: style.css + ฟอนต์ base64 + art.js → app.js → teacher.js → games.js → lessons/lesson*.js)
   - สร้าง `download/GameRoom-Offline.zip` (ห้องเกม + p1 + games/ + INSTALL-Desktop-Icon.vbs)
   - สร้างโปรแกรมติดตั้ง `GameRoom-Setup.exe` ด้วย makensis แล้วใส่ใน `download/GameRoom-Setup.zip` (ไฟล์ .exe ดาวน์โหลดตรง ๆ ไม่ได้)
   - ไอคอนบน Desktop ของตัวติดตั้งเปิดเว็บออนไลน์ (SITEURL) ไม่ต้องให้ครูติดตั้งซ้ำเมื่อเพิ่มเกม · ไอคอนออฟไลน์อยู่ในเมนู Start
   - เมื่อมีการเปลี่ยนแปลงสำคัญ ให้เพิ่ม VERSION ใน `installer/installer.nsi`
3. commit แล้ว push ขึ้น `main` ของ gtdce00/kids-computer-adventure-p1 (GitHub Pages จะอัปเดตเว็บตามเอง)

ถ้ามีบทเรียนใหม่ของ ป.1 ให้เพิ่ม `<script src="lessons/lessonXX.js">` ใน `p1/index.html` (build.py รวม lessons/lesson*.js ให้อัตโนมัติ)
