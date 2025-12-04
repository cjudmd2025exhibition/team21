#!/bin/bash
# 로컬 서버 시작 스크립트 (macOS/Linux)

echo "로컬 서버 시작 중..."
echo ""

# Python 3 확인
if command -v python3 &> /dev/null; then
    echo "Python 3를 사용하여 서버를 시작합니다."
    python3 server.py
elif command -v python &> /dev/null; then
    echo "Python을 사용하여 서버를 시작합니다."
    python server.py
elif command -v node &> /dev/null; then
    echo "Node.js를 사용하여 서버를 시작합니다."
    if [ ! -d "node_modules" ]; then
        echo "의존성을 설치하는 중..."
        npm install
    fi
    npm start
else
    echo "오류: Python 3 또는 Node.js가 설치되어 있지 않습니다."
    echo ""
    echo "설치 방법:"
    echo "  - Python 3: https://www.python.org/downloads/"
    echo "  - Node.js: https://nodejs.org/"
    exit 1
fi




