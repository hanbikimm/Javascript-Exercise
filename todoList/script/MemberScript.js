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
 회원가입 시 아이디 중복, 유효성을 체크하는 메서드
*/
function checkID() {
    let result;
    const REG_ID = /^[a-z]{1}[a-z0-9]{4,19}$/g;
    const ID = $('#registerID').val();
    if(ID === ''){
        $('#resultID').text('필수 정보입니다.');
        $('#resultID').css('color', 'red');
        result = false;
    }else if(ID.match(REG_ID) === null){
        $('#resultID').text('5-20자의 영문 소문자, 숫자를 사용해주세요.');
        $('#resultID').css('color', 'red');
        result = false;
    }else{
        const RESPONSE = registerCheckAjax(ID);
        if(RESPONSE === 1){
            $('#resultID').text('이미 사용 중인 ID입니다.');
            $('#resultID').css('color', 'red');
            result = false;
        }else{
            $('#resultID').text('사용 가능한 ID입니다.');
            $('#resultID').css('color', 'green');
            result = true;
        }
    }
    return result;
}

/*
 회원가입 시 비밀번호의 유효성을 체크하는 메서드
*/
function checkPW(){
    let result;
    let ID = $('#registerID').val();
    let PW = $('#registerPW').val();
    const REG_PW = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/;
    if(PW === ''){
        $('#resultPW').text('필수 정보입니다.');
        $('#resultPW').css('color', 'red');
        result = false;
    }else if(PW.match(REG_PW) === null){
        $('#resultPW').text('8-16자의 영문 대소문자, 숫자, 특수문자를 사용해주세요.');
        $('#resultPW').css('color', 'red');
        result = false;
    }else if(ID === PW){
        $('#resultPW').text('아이디와 비밀번호는 같을 수 없습니다.');
        $('#resultPW').css('color', 'red');
        result = false;
    }else{
        $('#resultPW').text('사용 가능한 비밀번호입니다.');
        $('#resultPW').css('color', 'green');
        result = true;
    }
    return result;
}

/*
 비밀번호 재확인 칸을 초기화하는 메서드
 사용자가 비밀번호를 일치시켰다가, 비밀번호를 변경할 때 자동으로 초기화함
*/
function initChkPW(){
    if($('#chkRegisterPW').val() !== ''){
        $('#chkRegisterPW').val('');
        $('#resultChkPW').text('');
    }
}

/*
 회원가입 시 비밀번호가 일치하는지 체크하는 메서드
*/
function checkChkPW(){
    let PW = $('#registerPW').val();
    let chkPW = $('#chkRegisterPW').val();
    if(chkPW === ''){
        $('#resultChkPW').text('필수 정보입니다.');
        $('#resultChkPW').css('color', 'red');
        result = false;
    }else if(PW !== chkPW){
        $('#resultChkPW').text('비밀번호가 일치하지 않습니다.');
        $('#resultChkPW').css('color', 'red');
        result = false;
    }else{
        $('#resultChkPW').text('비밀번호가 일치합니다.');
        $('#resultChkPW').css('color', 'green');
        result = true;
    }
    return result;
}

/*
 회원가입시 주소의 유효성을 체크하는 메서드
*/
function checkAddress(){
    let result;
    let address = $('#registerAddress').val();
    const REG_ADDRESS = /[ㄱ-힣]{2,10}/;
    if(address === ''){
        $('#resultAddress').text('필수 정보입니다.');
        $('#resultAddress').css('color', 'red');
        result = false;
    }else if(address.match(REG_ADDRESS) === null){
        $('#resultAddress').text('주소는 한글로 "광역시도" 또는 "시군구" 까지만 입력해주세요.');
        $('#resultAddress').css('color', 'red');
        result = false;
    }else{
        $('#resultAddress').text('올바른 주소입니다.');
        $('#resultAddress').css('color', 'green');
        result = true;
    }
    return result;
}

/*
 회원가입시 이메일의 유효성 검사를 하는 메서드
*/
function checkEmail(){
    let result;
    let email = $('#registerEmail').val();
    const REG_EMAIL = /^[a-zA-Z]{2}([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    if(email === ''){
        $('#resultEmail').text('필수 정보입니다.');
        $('#resultEmail').css('color', 'red');
    }else if(email.match(REG_EMAIL) === null){
        $('#resultEmail').text('이메일 형식이 올바르지 않습니다. 다시 입력해주세요.');
        $('#resultEmail').css('color', 'red');
        result = false;
    }else{
        $('#resultEmail').text('올바른 형식입니다.');
        $('#resultEmail').css('color', 'green');
        result = true;
    }
    return result;
}

/*
 회원가입시 필요한 유효성 검사를 모두 한 번 확인하는 메서드
*/
function checkAll(){
    




    let result;
    if(!checkID()){
        alert('회원가입을 진행할 수 없습니다.\n아이디를 올바르게 입력해주세요.');
        $('#registerID').focus();
        result = false;
    }else if(!checkPW()){
        alert('회원가입을 진행할 수 없습니다.\n비밀번호를 올바르게 입력해주세요.');
        $('#registerPW').focus();
        result = false;
    }else if(!checkChkPW()){
        alert('회원가입을 진행할 수 없습니다.\n비밀번호를 일치시켜주세요.');
        $('#chkRegisterPW').focus();
        result = false;
    }else if(!checkAddress()){
        alert('회원가입을 진행할 수 없습니다.\n주소를 올바르게 입력해주세요.');
        $('#registerAddress').focus();
        result = false;
    }else if(!checkEmail()){
        alert('회원가입을 진행할 수 없습니다.\n이메일을 올바르게 입력해주세요.');
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
    let address = $('#registerAddress').val();
    let email = $('#registerEmail').val();

    if(checkAll()){
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