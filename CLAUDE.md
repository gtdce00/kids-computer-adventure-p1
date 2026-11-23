# กฎของ repo นี้ (KIDS COMPUTER ADVENTURE ป.1)

## กฎข้อ 1: แก้ไขเว็บทุกครั้ง ต้องสร้างและอัปโหลดขึ้น GitHub
หลังแก้ไฟล์เว็บใด ๆ (index.html, style.css, app.js, teacher.js, games.js, assets/, lessons/) ให้ทำครบทุกขั้น:
1. ทดสอบเปิดเว็บ ต้องไม่มี error
2. สร้างไฟล์โปรแกรมรวมไฟล์เดียวใหม่ (`tools/build.py`): รวม style.css + ฟอนต์ (base64) + สคริปต์
   ตามลำดับ art.js → app.js → teacher.js → games.js → lessons/lessonXX.js
   แล้วเรียกไฟล์ผลลัพธ์ว่า `KidsComputerAdventure.html`
3. อัปเดต `download/KidsComputerAdventure-P1.zip` (KidsComputerAdventure.html, INSTALL-Desktop-Icon.vbs, icon.ico, README.txt)
4. commit แล้ว push ขึ้น `main` ของ gtdce00/kids-computer-adventure-p1 (GitHub Pages จะอัปเดตเว็บตามเอง)

ถ้ามีบทเรียนใหม่ ให้เพิ่ม `<script src="lessons/lessonXX.js">` ใน index.html และเพิ่มในลำดับการรวมไฟล์ของ build.py ด้วย
