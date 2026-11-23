# KIDS COMPUTER ADVENTURE ป.1

เว็บเกมการศึกษา วิชาคอมพิวเตอร์ ว11201 ชั้นประถมศึกษาปีที่ 1
โรงเรียนบ้านนาอ่าง อำเภอบึงโขงหลง จังหวัดบึงกาฬ · ภาคเรียนที่ 2 ปีการศึกษา 2569
ครูผู้สอน: นายชลหิรัณย์ พลศักดิ์

## เล่นออนไลน์
เปิดผ่าน GitHub Pages ของ repo นี้ (Settings › Pages)

## เล่นแบบออฟไลน์ / ติดตั้งบน Desktop
ดาวน์โหลด [`download/KidsComputerAdventure-P1.zip`](download/KidsComputerAdventure-P1.zip)
แตกไฟล์ แล้วดับเบิลคลิก `INSTALL-Desktop-Icon.vbs` ครั้งเดียว จะได้ไอคอนบน Desktop

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
