// 가위, 바위, 보 중 랜덤으로 선택하는 함수
function getRandomHandShape(){
    const HANDSHAPE = ['가위', '바위', '보'];
    let index = Math.floor(Math.random() * HANDSHAPE.length);

    return HANDSHAPE[index];
}

// 가위, 바위, 보 게임의 결과를 화면에 띄우는 함수
function getGameResult(person){
    let result;
    let computer = getRandomHandShape();
    console.log(computer);

    if(person == computer){
        result = '비겼습니다!';
    }else{
        switch(person){
            case '가위':
                computer == '바위' ? result='졌습니다!' : result='이겼습니다!';
                break;
            case '바위':
                computer == '보' ? result='졌습니다!' : result='이겼습니다!';
                break;
            case '보':
                computer == '가위' ? result='졌습니다!' : result='이겼습니다!';
                break;
            default:
                result = '잘못된 입력입니다.';
                break;
        }
    }

    const COMPUTERELEMENT = document.getElementById("computer");
    const RESULTELEMENT = document.getElementById("result");
    COMPUTERELEMENT.innerText = `상대는 ${computer}, `;
    RESULTELEMENT.innerText = result;
}