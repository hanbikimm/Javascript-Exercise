/*
 로그인시 유효성 검사를 하는 메서드
*/
function checkLogin(ID, PW){
    let result;
    if(ID === '' && PW === ''){
        alert('아이디와 비밀번호를 입력해주세요.');
        $('#loginID').focus();
        result = false;
    }else if(ID === ''){
        alert('아이디를 입력해주세요.');
        $('#loginID').focus();
        result = false;
    }else if(PW === ''){
        alert('비밀번호를 입력해주세요.');
        $('#loginPW').focus();
        result = false;
    }else{
        result = true;
    }
    return result;
}

/*
 로그인 메서드
 입력창의 id,pw 값을 가져와 ajax 요청을 보냄
 로그인 id,pw가 맞다면 알림창을 띄우고, 
 id를 암호화해 session storage에 저장 후 todo 화면으로 넘어감
*/
function login(){
    const LOGIN_ID = $('#loginID').val();
    const LOGIN_PW = $('#loginPW').val();

    if(checkLogin(LOGIN_ID, LOGIN_PW)){
        const RESPONSE = loginAjax(LOGIN_ID, LOGIN_PW);
        if(RESPONSE == true){
            alert(`환영합니다 ${LOGIN_ID}님!`);
            sessionStorage.setItem('loginID', encryptID(LOGIN_ID));
            initInput();
            location.href = 'TodoList.html';
            
        }else{
            alert("ID 또는 비밀번호를 다시 확인해주세요.");
            initInput();
            $('#loginID').focus();
        }
    }
    
}

/*
 회원가입 시 아이디 중복을 체크하는 메서드
 아이디 값을 가져와 중복 여부를 확인함
*/
function checkID() {
    const CHECK_ID = $('#registerID').val();
    if(CHECK_ID === ''){
        alert('ID를 입력해주세요!');
        $('#registerID').focus();
    }else{
        const RESPONSE = registerCheckAjax(CHECK_ID);
        if(RESPONSE === 0){
            alert('사용 가능한 ID입니다.');
            sessionStorage.setItem('checkID', 'done');
        }else{
            alert('이미 사용 중인 ID입니다.');
            $('#registerID').val('');
            $('#registerID').focus();
        }
    }
}

/*
 회원가입시 유효성 검사를 하는 메서드
*/
function checkRegister(ID, PW, chkPW, address, email){
    let result;
    const REG_EMAIL = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    const REG_ID = /^[a-z]+[a-z0-9]{4,19}$/g;
    const REG_PW = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/;
    const REG_ADDRESS = /[ㄱ-힣]/;
    if(ID === '' || PW === '' || chkPW === '' || address === '' || email === ''){
        alert('항목을 모두 작성하였는지 확인해주세요.');
        result = false;
    }else if(sessionStorage.checkID === undefined){
        alert('ID 중복 확인을 해주세요.');
        $('#registerCheck').focus();
        result = false;
    }else if(ID === PW){
        alert('ID와 비밀번호는 같을 수 없습니다.');
        $('#registerID').focus();
        result = false;
    }else if(PW !== chkPW){
        alert('비밀번호가 맞지 않습니다. 다시 입력해주세요.');
        $('#chkRegisterPW').focus();
        result = false;
    }else if(email.match(REG_EMAIL) === null){
        alert('이메일 형식이 올바르지 않습니다. 다시 입력해주세요.');
        $('#registerEmail').focus();
        result = false;
    }else{
        result = true;
    }
    return result;
}

/*
 회원가입 메서드
 각각의 값에 대해 유효성 검사를 진행하고, 통과하면
 회원가입 요청을 보내고 응답에 따라 알림창을 띄우고 이동함
*/
function register() {
    let ID = $('#registerID').val();
    let PW = $('#registerPW').val();
    let chkPW = $('#chkRegisterPW').val();
    let address = $('#registerAddress').val();
    let email = $('#registerEmail').val();

    if(checkRegister(ID, PW, chkPW, address, email)){
        const RESPONSE = registerAjax(ID, PW, address, email);
        if(RESPONSE == true){
            alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
            sessionStorage.removeItem('checkID');
            location.href = 'Login.html';
        }else{
            alert('회원가입에 실패하였습니다. 다시 시도해주세요.');
        }
    }
}

/*
 입력창의 엔터키를 감지하는 메서드
 입력창에서 엔터키가 눌렸을 때, 각각 입력창의 id값에 따라 메서드를 실행
*/
function handleEnterKey(event){
    if(event.key == 'Enter'){
        switch(event.target.id){
            case 'loginPW':
                login();
                break;
            case 'registerEmail':
                register();
                break;
        }
    }
}

/*
 input 창을 초기화하는 메서드
*/
function initInput() {
    $('#loginID').val('');
    $('#loginPW').val('');
}