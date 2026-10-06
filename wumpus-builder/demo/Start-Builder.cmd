@echo off
cd /d "%~dp0"
where python >nul 2>nul
if errorlevel 1 goto bundled
python server.py --port 8082
goto done
:bundled
if not exist "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" goto missing
"%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" server.py --port 8082
goto done
:missing
echo Python 3 is required. Install it or use a hosted edition.
:done
pause
