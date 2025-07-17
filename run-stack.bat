@echo off
rem ============================================================
rem  F1-Insights  – one-click local launcher (Windows .bat)
rem  Place this file in the repo root (same level as compose.yml)
rem ============================================================

setlocal ENABLEDELAYEDEXPANSION

rem ── 1. Check Docker is running ───────────────────────────────
docker info >nul 2>&1
if errorlevel 1 (
    echo.
    echo  ❌  Docker Desktop does not appear to be running.
    echo      Please start Docker and try again.
    pause
    exit /b 1
)

rem ── 2. Build + start the full stack ──────────────────────────
echo.
echo  🚀  Building and starting containers …
docker compose up -d --build
if errorlevel 1 (
    echo  ❌  docker compose failed.
    pause
    exit /b 1
)

rem ── 3. Give services a moment to boot ────────────────────────
echo.
echo  ⏳  Waiting 10 seconds for services to come online …
timeout /t 10 >nul

rem ── 4. Launch browser at front-end URL ───────────────────────
echo.
echo  🌐  Opening http://localhost:3000
start "" "http://localhost:3000"

rem ── 5. Helpful tips ──────────────────────────────────────────
echo.
echo  ✔️  Stack is up!
echo  View logs:        docker compose logs -f
echo  Stop everything:  docker compose down
echo.
pause
endlocal
