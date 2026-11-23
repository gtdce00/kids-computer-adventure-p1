# KIDS COMPUTER ADVENTURE ป.1

เว็บเกมการศึกษา วิชาคอมพิวเตอร์ ว11201 ชั้นประถมศึกษาปีที่ 1
โรงเรียนบ้านนาอ่าง อำเภอบึงโขงหลง จังหวัดบึงกาฬ · ภาคเรียนที่ 2 ปีการศึกษา 2569
ครูผู้สอน: นายชลหิรัณย์ พลศักดิ์

## เล่นออนไลน์
เปิดผ่าน GitHub Pages ของ repo นี้ (Settings › Pages)

## ติดตั้งบนเครื่อง (ไอคอนบน Desktop)
1. ดาวน์โหลด [`download/KidsComputerAdventure-Setup.exe`](download/KidsComputerAdventure-Setup.exe)
2. ดับเบิลคลิก แล้วกด ถัดไป › ติดตั้ง › เสร็จสิ้น
3. กดไอคอน **KIDS COMPUTER ADVENTURE ป.1** บน Desktop ครั้งเดียว เกมจะเปิดเป็นหน้าต่างโปรแกรมเต็มจอ

- ไม่ต้องใช้สิทธิ์ Admin · เล่นได้โดยไม่ต้องต่ออินเทอร์เน็ต · ถอนการติดตั้งได้ที่ Settings › Apps
- ถ้า Windows ขึ้น "Windows protected your PC" ให้กด **More info › Run anyway** (โปรแกรมไม่มีใบรับรองแบบเสียเงิน)
- ทางเลือกแบบไม่ติดตั้ง: [`download/KidsComputerAdventure-P1.zip`](download/KidsComputerAdventure-P1.zip)

## โครงสร้าง
| ไฟล์ | หน้าที่ |
|---|---|
| `index.html` | หน้าหลัก |
| `style.css` | หน้าตาเว็บ + ฟอนต์ Kanit / Sarabun |
| `assets/art.js` | ภาพตัวละครและอุปกรณ์ (SVG วาดเอง) |
| `app.js` | ข้อมูลหลักสูตร ฐานข้อมูลในเครื่อง เสียง หน้าเว็บ |
| `teacher.js` | ระบบครู: นักเรียน ผลการเรียน คู่มือ สำรองข้อมูล |
| `games.js` | เกมกลาง: Click & Find, จับคู่เงา, แยกหมวดหมู่ |
| `lessons/lesson01.js` | บทเรียนที่ 1 รู้จักคอมพิวเตอร์ |

ข้อมูลนักเรียนและคะแนนเก็บใน localStorage ของเบราว์เซอร์แต่ละเครื่อง (ไม่ส่งขึ้นอินเทอร์เน็ต)

ฟอนต์ Kanit และ Sarabun: SIL Open Font License 1.1 (ผ่าน Fontsource)
