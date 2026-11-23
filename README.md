# ห้องเกมการศึกษา ครูคอม

รวมเกมการเรียนรู้ทุกชั้น ป.1–ม.3 โรงเรียนบ้านนาอ่าง อำเภอบึงโขงหลง จังหวัดบึงกาฬ
ครูผู้สอน: นายชลหิรัณย์ พลศักดิ์

## เล่นออนไลน์
https://gtdce00.github.io/kids-computer-adventure-p1/ — หน้าห้องเกม เลือกชั้นเรียน/วิชา แล้วกด "เล่นเลย"

## ติดตั้งบนเครื่อง (ไอคอนเดียวบน Desktop)
1. ดาวน์โหลด [`download/GameRoom-Setup.zip`](download/GameRoom-Setup.zip) แล้วคลิกขวา › Extract All
2. ดับเบิลคลิก `GameRoom-Setup.exe` แล้วกด ถัดไป › เสร็จสิ้น
3. กดไอคอน **ห้องเกมการศึกษา ครูคอม** บน Desktop ครั้งเดียว ห้องเกมจะเปิดเป็นหน้าต่างโปรแกรมเต็มจอ

- ไม่ต้องใช้สิทธิ์ Admin · เกม ป.1 เล่นได้โดยไม่ต้องต่ออินเทอร์เน็ต · ถอนการติดตั้งได้ที่ Settings › Apps
- ถ้า Windows ขึ้น "Windows protected your PC" ให้กด **More info › Run anyway**
- แบบไม่ติดตั้ง: [`download/GameRoom-Offline.zip`](download/GameRoom-Offline.zip)

## เกมในห้องเกม
| เกม | ชั้น | อยู่ที่ |
|---|---|---|
| KIDS COMPUTER ADVENTURE ป.1 | ป.1 | `p1/` (ในเว็บนี้) |
| ภารกิจพิชิตเมืองดิจิทัล | ป.6 | ลิงก์ภายนอก |
| Robot Mission 3D – Forest Adventure | ป.6–ม.3 | ลิงก์ภายนอก |

เพิ่มเกม: แก้รายการ `GAMES` ใน `index.html` (1 เกม = 1 บรรทัด)

## โครงสร้าง
| ไฟล์ | หน้าที่ |
|---|---|
| `index.html`, `fonts/` | หน้าห้องเกม (หน้ารวมเกม) ฟอนต์ Mali / Mitr |
| `p1/` | เกม KIDS COMPUTER ADVENTURE ป.1 (index.html, style.css, app.js, teacher.js, games.js, assets/, lessons/) |
| `tools/build.py` | รวมเกมเป็นไฟล์เดียว · `tools/package.sh` สร้างไฟล์ดาวน์โหลดทั้งหมด |
| `installer/` | สคริปต์โปรแกรมติดตั้ง (NSIS) ไอคอน และไฟล์สร้างไอคอนแบบไม่ติดตั้ง |

ข้อมูลนักเรียนและคะแนนเก็บใน localStorage ของเบราว์เซอร์แต่ละเครื่อง (ไม่ส่งขึ้นอินเทอร์เน็ต)

ฟอนต์ Kanit, Sarabun, Mali, Mitr: SIL Open Font License 1.1 (ผ่าน Fontsource)
