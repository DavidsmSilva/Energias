@echo off
setlocal
set ROOT=%~dp0
cd /d "%ROOT%"
echo Instalando dependencias...
npm install --legacy-peer-deps
echo Iniciando servidor...
npm start
pause
