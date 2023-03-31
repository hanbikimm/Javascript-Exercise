// 1. 현재 시간 출력
let time = new Date();
let hours = time.getHours();
let minutes = time.getMinutes();
let seconds = time.getSeconds();

console.log(`현재시간: ${hours}시 ${minutes}분 ${seconds}초`);

// 2. 브라우저 창의 뷰포트 크기 출력
let width = innerWidth;
let height = innerHeight;

console.log(`가로: ${width} 세로: ${height}`);

// 3. 새창 열어 네이버로 이동
let link = "http://www.naver.com";

window.open(link);

// 4. 브라우저 창을 2초 후에 자동으로 닫기
setTimeout(() => window.close(), 2000);