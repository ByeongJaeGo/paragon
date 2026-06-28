@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo PARAGON 서버 시작 중...
start "" "http://localhost:8080"
python -m http.server 8080
pause
