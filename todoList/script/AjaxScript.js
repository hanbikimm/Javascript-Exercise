/*
 ajax 요청을 보내는 함수
 서비스명, 데이터를 매개변수로 삼아 요청을 보냄
*/
function sendAjax(serviceName, data){
    return $.ajax({
        type: "POST",
        url: `http://newdreams.kr/BootcampusService.asmx/${serviceName}`,
        dataType: "json",
        async: false,
        data: data,
        error: function(xhr){
            alert(`[ERROR]\n${xhr.responseText}`);
        }
    }).responseJSON;
}

// 로그인 요청을 보내는 메서드
function loginAjax(ID, PW){
    const DATA = {
        id: ID,
        password: PW
    };

    return sendAjax('Login', DATA);
}

// 회원가입 시 아이디 중복 확인 요청을 보내는 메서드
function registerCheckAjax(ID){
    const DATA = {
        id: ID
    };

    return sendAjax('RegisterCheck', DATA);
}

// 회원가입 요청을 보내는 메서드
function registerAjax(ID, PW, address, email){
    const DATA = {
        id: ID,
        password: PW,
        address: address,
        email: email
    };

    return sendAjax('Register', DATA);
}

// 할 일 목록 조회 요청을 보내는 메서드
function boardListAjax(user){
    const DATA = {
        create_user: user
    };

    return sendAjax('BoardList', DATA);
}

// 할 일 추가 요청을 보내는 메서드
function insertBoardAjax(contents, user){
    const DATA = {
        todo_check: 0,
        contents: contents,
        create_user: user
    };

    return sendAjax('InsertBoard', DATA);
}

// 할 일 수정 요청을 보내는 메서드
function updateBoardAjax(todoID, check, contents, user){
    const DATA = {
        id: todoID,
        todo_check: check,
        contents: contents,
        update_user: user
    };

    return sendAjax('UpdateBoard', DATA);
}

// 할 일 삭제 요청을 보내는 메서드
function DeleteBoardAjax(todoID){
    const DATA = {
        id: todoID
    };

    return sendAjax('DeleteBoard', DATA);
}