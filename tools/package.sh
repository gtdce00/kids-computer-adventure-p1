#!/bin/bash
# สร้างทุกอย่างสำหรับดาวน์โหลด: ชุดออฟไลน์ (zip) + โปรแกรมติดตั้ง (Setup ใน zip)
# ใช้: bash tools/package.sh   (ต้องมี python3 และ makensis)
set -e
cd "$(dirname "$0")/.."
rm -rf build && mkdir -p build/app/p1 download
python3 tools/build.py p1 build/app/p1/index.html          # เกม ป.1 รวมเป็นไฟล์เดียว
cp index.html build/app/ && cp -r fonts games build/app/ && cp installer/icon.ico build/app/
python3 - <<'PY'
import zipfile, os
def add_dir(z, root, prefix):
    for d, _, fs in os.walk(root):
        for f in fs:
            p = os.path.join(d, f); z.write(p, prefix + os.path.relpath(p, root))
with zipfile.ZipFile('download/GameRoom-Offline.zip', 'w', zipfile.ZIP_DEFLATED) as z:
    add_dir(z, 'build/app', 'GameRoom/')
    z.write('installer/INSTALL-Desktop-Icon.vbs', 'GameRoom/INSTALL-Desktop-Icon.vbs')
    z.write('installer/README.txt', 'GameRoom/README.txt')
PY
makensis -V2 installer/installer.nsi
python3 - <<'PY'
import zipfile
readme = """ห้องเกมการศึกษา ครูคอม — วิธีติดตั้ง
1) คลิกขวาที่ไฟล์ zip นี้ > Extract All (แตกไฟล์ทั้งหมด)
2) ดับเบิลคลิก GameRoom-Setup.exe
3) กด ถัดไป > เสร็จสิ้น  จะได้ไอคอน "ห้องเกมการศึกษา ครูคอม" บน Desktop
ถ้าขึ้น "Windows protected your PC" ให้กด More info > Run anyway
""".replace('\n', '\r\n')
with zipfile.ZipFile('download/GameRoom-Setup.zip', 'w', zipfile.ZIP_DEFLATED) as z:
    z.write('build/GameRoom-Setup.exe', 'GameRoom-Setup.exe')
    z.writestr('README.txt', '﻿' + readme)
PY
ls -la download
