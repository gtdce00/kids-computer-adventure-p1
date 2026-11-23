; =========================================================
; KIDS COMPUTER ADVENTURE ป.1 — โปรแกรมติดตั้ง (Windows)
; build: makensis installer/installer.nsi  (ต้องมี ../KidsComputerAdventure.html ก่อน)
; =========================================================
Unicode true
!include "MUI2.nsh"

!define APPNAME   "KIDS COMPUTER ADVENTURE ป.1"
!define APPID     "KidsComputerAdventureP1"
!define VERSION   "1.0.0"
!define PUBLISHER "ครูชลหิรัณย์ พลศักดิ์ โรงเรียนบ้านนาอ่าง"
!define UNINSTKEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPID}"

Name "${APPNAME}"
OutFile "..\download\KidsComputerAdventure-Setup.exe"
InstallDir "$LOCALAPPDATA\${APPID}"
RequestExecutionLevel user
SetCompressor /SOLID lzma
BrandingText "${APPNAME}"
VIProductVersion "${VERSION}.0"
VIAddVersionKey "ProductName" "${APPNAME}"
VIAddVersionKey "FileDescription" "ติดตั้งเกมการศึกษา วิชาคอมพิวเตอร์ ป.1"
VIAddVersionKey "FileVersion" "${VERSION}"
VIAddVersionKey "CompanyName" "${PUBLISHER}"
VIAddVersionKey "LegalCopyright" "${PUBLISHER}"

!define MUI_ICON "icon.ico"
!define MUI_UNICON "icon.ico"
!define MUI_ABORTWARNING
!define MUI_WELCOMEPAGE_TITLE "ติดตั้ง ${APPNAME}"
!define MUI_WELCOMEPAGE_TEXT "เกมการศึกษา วิชาคอมพิวเตอร์ ว11201 ชั้น ป.1$\r$\n$\r$\nโปรแกรมนี้จะติดตั้งเกมลงในเครื่อง และสร้างไอคอนบนหน้าจอ Desktop ให้กดเข้าเล่นได้ทันที$\r$\n$\r$\n• เล่นได้โดยไม่ต้องต่ออินเทอร์เน็ต$\r$\n• ไม่ต้องใช้สิทธิ์ผู้ดูแลระบบ (Admin)$\r$\n$\r$\nกด ถัดไป เพื่อเริ่มติดตั้ง"
!define MUI_FINISHPAGE_TITLE "ติดตั้งเรียบร้อยแล้ว"
!define MUI_FINISHPAGE_TEXT "ไอคอน ${APPNAME} อยู่บนหน้าจอ Desktop แล้ว$\r$\nกดไอคอนครั้งเดียวเพื่อเข้าเล่นได้เลย"
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

; สร้างไอคอน: เปิดด้วย Edge แบบหน้าต่างโปรแกรม (ไม่มีแถบที่อยู่เว็บ) เต็มจอ
!macro MakeShortcut LNK
  StrCmp $EDGE "" +3
    CreateShortcut "${LNK}" "$EDGE" '--app="file:///$INSTDIR\KidsComputerAdventure.html" --start-maximized' "$INSTDIR\icon.ico" 0 SW_SHOWMAXIMIZED "" "เกมการศึกษา วิชาคอมพิวเตอร์ ป.1"
    Goto +2
    CreateShortcut "${LNK}" "$INSTDIR\KidsComputerAdventure.html" "" "$INSTDIR\icon.ico" 0
!macroend

Function LaunchApp
  ExecShell "open" "$DESKTOP\${APPNAME}.lnk"
FunctionEnd

Section "Install"
  SetOutPath "$INSTDIR"
  File "..\KidsComputerAdventure.html"
  File "icon.ico"
  WriteUninstaller "$INSTDIR\Uninstall.exe"
  Call FindEdge
  !insertmacro MakeShortcut "$DESKTOP\${APPNAME}.lnk"
  CreateDirectory "$SMPROGRAMS\${APPNAME}"
  !insertmacro MakeShortcut "$SMPROGRAMS\${APPNAME}\${APPNAME}.lnk"
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
  Delete "$INSTDIR\KidsComputerAdventure.html"
  Delete "$INSTDIR\icon.ico"
  Delete "$INSTDIR\Uninstall.exe"
  RMDir "$INSTDIR"
  DeleteRegKey HKCU "${UNINSTKEY}"
SectionEnd
