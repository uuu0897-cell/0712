@echo off
setlocal

set ROOT=%~dp0
set BACKEND_PORT=4104
set FRONTEND_PORT=5176
set SERVER_LOG=%ROOT%server-preview.log
set CLIENT_LOG=%ROOT%client-preview.log

echo Starting Maple Avatar Studio preview...
echo Backend:  http://127.0.0.1:%BACKEND_PORT%
echo Frontend: http://127.0.0.1:%FRONTEND_PORT%
echo.

start "Maple Avatar Server" cmd /k "cd /d ""%ROOT%server"" && set ""PORT=%BACKEND_PORT%"" && set ""ALLOWED_ORIGINS=http://127.0.0.1:%FRONTEND_PORT%,http://localhost:%FRONTEND_PORT%"" && npm start"
timeout /t 2 /nobreak >nul
start "Maple Avatar Client" cmd /k "cd /d ""%ROOT%client"" && set ""VITE_API_BASE_URL=http://127.0.0.1:%BACKEND_PORT%"" && npm run dev -- --host 127.0.0.1 --port %FRONTEND_PORT%"

echo.
echo Wait until the client window shows "Local: http://127.0.0.1:%FRONTEND_PORT%/"
echo Then open:
echo http://127.0.0.1:%FRONTEND_PORT%/
echo.
pause
