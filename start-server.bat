@echo off
REM 로컬 서버 시작 스크립트 (Windows)

echo 로컬 서버 시작 중...
echo.

REM Python 3 확인
where python >nul 2>&1
if %ERRORLEVEL% == 0 (
    echo Python을 사용하여 서버를 시작합니다.
    python server.py
    goto :end
)

REM Node.js 확인
where node >nul 2>&1
if %ERRORLEVEL% == 0 (
    echo Node.js를 사용하여 서버를 시작합니다.
    if not exist "node_modules" (
        echo 의존성을 설치하는 중...
        call npm install
    )
    call npm start
    goto :end
)

echo 오류: Python 3 또는 Node.js가 설치되어 있지 않습니다.
echo.
echo 설치 방법:
echo   - Python 3: https://www.python.org/downloads/
echo   - Node.js: https://nodejs.org/
pause
exit /b 1

:end




