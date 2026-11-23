; =========================================================
; KIDS COMPUTER ADVENTURE ป.1 — โปรแกรมติดตั้ง (Windows)
; build: ใช้ tools/package.sh (สร้าง build/app ก่อน แล้วค่อย makensis)
; =========================================================
Unicode true
!include "MUI2.nsh"

!define APPNAME   "ห้องเกมการศึกษา ครูคอม"
!define OLDNAME   "KIDS COMPUTER ADVENTURE ป.1"
!define APPID     "KidsComputerAdventureP1"
!define VERSION   "2.1.0"
!define SITEURL   "https://gtdce00.github.io/kids-computer-adventure-p1/"
!define PUBLISHER "ครูชลหิรัณย์ พลศักดิ์ โรงเรียนบ้านนาอ่าง"
!define UNINSTKEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPID}"

Name "${APPNAME}"
OutFile "..\build\GameRoom-Setup.exe"
InstallDir "$LOCALAPPDATA\${APPID}"
RequestExecutionLevel user
SetCompressor /SOLID lzma
BrandingText "${APPNAME}"
VIProductVersion "${VERSION}.0"
VIAddVersionKey "ProductName" "${APPNAME}"
VIAddVersionKey "FileDescription" "ติดตั้งห้องเกมการศึกษา ครูคอม"
VIAddVersionKey "FileVersion" "${VERSION}"
VIAddVersionKey "CompanyName" "${PUBLISHER}"
VIAddVersionKey "LegalCopyright" "${PUBLISHER}"

!define MUI_ICON "icon.ico"
!define MUI_UNICON "icon.ico"
!define MUI_ABORTWARNING
!define MUI_WELCOMEPAGE_TITLE "ติดตั้ง ${APPNAME}"
!define MUI_WELCOMEPAGE_TEXT "รวมเกมการเรียนรู้ทุกชั้น ป.1–ม.3 โรงเรียนบ้านนาอ่าง$\r$\n$\r$\nโปรแกรมนี้จะสร้างไอคอนบนหน้าจอ Desktop เปิดห้องเกมออนไลน์ เห็นเกมใหม่ได้ทันทีโดยไม่ต้องติดตั้งซ้ำ$\r$\n$\r$\n• ต้องต่ออินเทอร์เน็ต (ถ้าเน็ตหลุด ใช้ $\"ห้องเกม (ออฟไลน์)$\" ในเมนู Start)$\r$\n• ไม่ต้องใช้สิทธิ์ผู้ดูแลระบบ (Admin)$\r$\n$\r$\nกด ถัดไป เพื่อเริ่มติดตั้ง"
!define MUI_FINISHPAGE_TITLE "ติดตั้งเรียบร้อยแล้ว"
!define MUI_FINISHPAGE_TEXT "ไอคอน ${APPNAME} อยู่บนหน้าจอ Desktop แล้ว$\r$\nกดไอคอนครั้งเดียวเพื่อเข้าห้องเกมออนไลน์ เกมใหม่จะขึ้นให้เอง ไม่ต้องติดตั้งซ้ำ"
!define MUI_FINISHPAGE_RUN
!define MUI_FINISHPAGE_RUN_TEXT "เปิดเกมเลย"
!define MUI_FINISHPAGE_RUN_FUNCTION LaunchApp

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_LANGUAGE "Thai"

Var EDGE

; หาที่อยู่ Microsoft Edge
Function FindEdge
  StrCpy $EDGE ""
  ReadRegStr $EDGE HKLM "Software\Microsoft\Windows\CurrentVersion\App Paths\msedge.exe" ""
  StrCmp $EDGE "" 0 done
  ReadRegStr $EDGE HKCU "Software\Microsoft\Windows\CurrentVersion\App Paths\msedge.exe" ""
  StrCmp $EDGE "" 0 done
  IfFileExists "$PROGRAMFILES32\Microsoft\Edge\Application\msedge.exe" 0 +3
    StrCpy $EDGE "$PROGRAMFILES32\Microsoft\Edge\Application\msedge.exe"
    Goto done
  IfFileExists "$PROGRAMFILES64\Microsoft\Edge\Application\msedge.exe" 0 done
    StrCpy $EDGE "$PROGRAMFILES64\Microsoft\Edge\Application\msedge.exe"
  done:
FunctionEnd

; ไอคอนหลัก: เปิดห้องเกมออนไลน์ด้วย Edge แบบหน้าต่างโปรแกรม (ไม่มีแถบที่อยู่เว็บ) เต็มจอ
!macro MakeShortcut LNK
  StrCmp $EDGE "" +3
    CreateShortcut "${LNK}" "$EDGE" '--app="${SITEURL}" --start-maximized' "$INSTDIR\icon.ico" 0 SW_SHOWMAXIMIZED "" "ห้องเกมการศึกษา ครูคอม (ออนไลน์)"
    Goto +2
    CreateShortcut "${LNK}" "$WINDIR\explorer.exe" '"${SITEURL}"' "$INSTDIR\icon.ico" 0
!macroend

; ไอคอนสำรอง: เปิดไฟล์ในเครื่อง ใช้ตอนไม่มีอินเทอร์เน็ต
!macro MakeOfflineShortcut LNK
  StrCmp $EDGE "" +3
    CreateShortcut "${LNK}" "$EDGE" '--app="file:///$INSTDIR\index.html" --start-maximized' "$INSTDIR\icon.ico" 0 SW_SHOWMAXIMIZED "" "ห้องเกมการศึกษา ครูคอม (ออฟไลน์)"
    Goto +2
    CreateShortcut "${LNK}" "$INSTDIR\index.html" "" "$INSTDIR\icon.ico" 0
!macroend

Function LaunchApp
  ExecShell "open" "$DESKTOP\${APPNAME}.lnk"
FunctionEnd

Section "Install"
  SetOutPath "$INSTDIR"
  ; ลบของเวอร์ชันเก่า (เกม ป.1 อย่างเดียว)
  Delete "$DESKTOP\${OLDNAME}.lnk"
  RMDir /r "$SMPROGRAMS\${OLDNAME}"
  Delete "$INSTDIR\KidsComputerAdventure.html"
  File /r "..\build\app\*.*"
  WriteUninstaller "$INSTDIR\Uninstall.exe"
  Call FindEdge
  !insertmacro MakeShortcut "$DESKTOP\${APPNAME}.lnk"
  CreateDirectory "$SMPROGRAMS\${APPNAME}"
  !insertmacro MakeShortcut "$SMPROGRAMS\${APPNAME}\${APPNAME}.lnk"
  !insertmacro MakeOfflineShortcut "$SMPROGRAMS\${APPNAME}\ห้องเกม (ออฟไลน์).lnk"
  CreateShortcut "$SMPROGRAMS\${APPNAME}\ถอนการติดตั้ง.lnk" "$INSTDIR\Uninstall.exe"
  ; แสดงใน แอป > แอปที่ติดตั้ง (ถอนการติดตั้งได้)
  WriteRegStr HKCU "${UNINSTKEY}" "DisplayName" "${APPNAME}"
  WriteRegStr HKCU "${UNINSTKEY}" "DisplayVersion" "${VERSION}"
  WriteRegStr HKCU "${UNINSTKEY}" "Publisher" "${PUBLISHER}"
  WriteRegStr HKCU "${UNINSTKEY}" "DisplayIcon" "$INSTDIR\icon.ico"
  WriteRegStr HKCU "${UNINSTKEY}" "InstallLocation" "$INSTDIR"
  WriteRegStr HKCU "${UNINSTKEY}" "UninstallString" '"$INSTDIR\Uninstall.exe"'
  WriteRegDWORD HKCU "${UNINSTKEY}" "NoModify" 1
  WriteRegDWORD HKCU "${UNINSTKEY}" "NoRepair" 1
SectionEnd

Section "Uninstall"
  Delete "$DESKTOP\${APPNAME}.lnk"
  RMDir /r "$SMPROGRAMS\${APPNAME}"
  Delete "$INSTDIR\index.html"
  Delete "$INSTDIR\icon.ico"
  RMDir /r "$INSTDIR\p1"
  RMDir /r "$INSTDIR\fonts"
  RMDir /r "$INSTDIR\games"
  Delete "$INSTDIR\Uninstall.exe"
  RMDir "$INSTDIR"
  DeleteRegKey HKCU "${UNINSTKEY}"
SectionEnd
