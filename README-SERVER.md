# 로컬 서버 실행 가이드

이 프로젝트는 `file://` 프로토콜로 직접 열면 localStorage가 공유되지 않습니다.
**반드시 로컬 서버를 통해 실행**해야 home.html과 soma2.html 간에 데이터가 공유됩니다.

---

## 🚀 빠른 시작 (가장 간단한 방법)

### 방법 1: Python 사용 (추천 - 가장 간단)

```bash
# 터미널에서 프로젝트 폴더로 이동
cd /Users/yunqhs/Desktop/인터페이스

# 서버 시작
python3 server.py
```

또는 Windows에서:
```cmd
python server.py
```

브라우저에서 자동으로 열리거나, 수동으로 접속:
- **http://localhost:8000/home.html**

---

### 방법 2: Node.js 사용

```bash
# 1. 의존성 설치 (최초 1회만)
npm install

# 2. 서버 시작
npm start
```

또는 http-server 직접 사용:
```bash
npx http-server -p 8000 -o
```

---

### 방법 3: 스크립트 사용 (자동 감지)

**macOS/Linux:**
```bash
chmod +x start-server.sh
./start-server.sh
```

**Windows:**
```cmd
start-server.bat
```

---

## 📋 상세 설명

### 왜 로컬 서버가 필요한가요?

- `file://` 프로토콜로 파일을 열면 각 파일이 **서로 다른 origin**으로 처리됩니다
- localStorage는 **같은 origin**에서만 공유됩니다
- 로컬 서버(`http://localhost`)를 사용하면 모든 파일이 **같은 origin**에서 실행됩니다

### 서버 중지 방법

터미널에서 **Ctrl + C**를 누르면 서버가 종료됩니다.

---

## 🔧 문제 해결

### 포트 8000이 이미 사용 중인 경우

**Python 서버:**
```python
# server.py 파일에서 PORT = 8000을 다른 번호로 변경 (예: 8080)
PORT = 8080
```

**Node.js 서버:**
```bash
# 다른 포트로 실행
PORT=8080 npm start
```

### Python이 설치되어 있지 않은 경우

1. **macOS:** `brew install python3`
2. **Windows:** https://www.python.org/downloads/ 에서 다운로드
3. **Linux:** `sudo apt-get install python3`

### Node.js가 설치되어 있지 않은 경우

1. https://nodejs.org/ 에서 LTS 버전 다운로드
2. 설치 후 터미널에서 `node --version` 확인

---

## ✅ 확인 방법

1. 서버 시작 후 브라우저에서 `http://localhost:8000/home.html` 접속
2. 개발자 도구(F12) → Application → Local Storage 확인
3. `http://localhost:8000`으로 시작하는지 확인
4. home.html에서 소원 저장 후 soma2.html에서 확인

---

## 📝 참고사항

- 서버가 실행 중일 때만 접속 가능합니다
- 서버를 종료하면 접속이 끊깁니다
- 코드 수정 후 브라우저 새로고침(F5)으로 확인 가능합니다
- 서버 재시작 없이 파일 변경사항이 즉시 반영됩니다




