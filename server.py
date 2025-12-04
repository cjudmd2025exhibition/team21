#!/usr/bin/env python3
"""
간단한 로컬 웹 서버
Python 3가 설치되어 있어야 합니다.

사용법:
    python3 server.py
    또는
    python server.py

브라우저에서 http://localhost:8000/home.html 접속
"""

import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # CORS 헤더 추가 (필요한 경우)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def log_message(self, format, *args):
        # 로그 메시지 포맷팅
        print(f"[{self.log_date_time_string()}] {format % args}")

def main():
    # 현재 디렉토리를 서버 루트로 설정
    os.chdir(Path(__file__).parent)
    
    Handler = MyHTTPRequestHandler
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print("=" * 60)
        print(f"로컬 서버가 시작되었습니다!")
        print(f"서버 주소: http://localhost:{PORT}")
        print(f"홈페이지: http://localhost:{PORT}/home.html")
        print("=" * 60)
        print("\n서버를 중지하려면 Ctrl+C를 누르세요.\n")
        
        # 브라우저 자동 열기 (선택사항)
        try:
            webbrowser.open(f'http://localhost:{PORT}/home.html')
        except:
            pass
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n서버가 종료되었습니다.")

if __name__ == "__main__":
    main()




