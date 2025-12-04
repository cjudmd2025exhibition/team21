/**
 * Express 기반 로컬 개발 서버
 * 
 * 사용법:
 *   1. npm install (최초 1회)
 *   2. npm start
 * 
 * 브라우저에서 http://localhost:8000/home.html 접속
 */

const express = require('express');
const path = require('path');
const open = require('open');

const app = express();
const PORT = 8000;

// 정적 파일 서빙 (현재 디렉토리)
app.use(express.static(__dirname));

// 모든 경로에 대해 CORS 헤더 추가
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// 루트 경로 리다이렉트
app.get('/', (req, res) => {
  res.redirect('/home.html');
});

// 서버 시작
app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('로컬 서버가 시작되었습니다!');
  console.log(`서버 주소: http://localhost:${PORT}`);
  console.log(`홈페이지: http://localhost:${PORT}/home.html`);
  console.log('='.repeat(60));
  console.log('\n서버를 중지하려면 Ctrl+C를 누르세요.\n');
  
  // 브라우저 자동 열기
  setTimeout(() => {
    open(`http://localhost:${PORT}/home.html`).catch(() => {
      console.log('브라우저를 자동으로 열 수 없습니다. 수동으로 접속해주세요.');
    });
  }, 1000);
});




