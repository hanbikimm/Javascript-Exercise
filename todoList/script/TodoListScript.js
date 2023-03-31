/*
 문서가 준비되면,
 해당 조건에 따라 메서드가 실행됨
*/
$( document ).ready(function() {
    if(sessionStorage.loginID === undefined){
        alert('로그인이 필요합니다.');
        location.href = 'Login.html';
    }else if(localStorage.updateID !== undefined){
        initLocalStorage();
        getTodoList();
    }else{
        getTodoList();
    }
});

/*
 데이터를 html 요소로 화면에 띄우는 메서드
 데이터에 맞게 할 일을 화면에 띄울 수 있도록 html요소를 설정함
 할 일을 띄우는 화면과, 할 일을 수정하는 화면 2종류를 만들고 수정화면은 hidden함
*/
function makeTodoElement(todoItem){
    $('#todoList').append(
        $('<li>').prop({
            id: todoItem.ID
        })
    );
    $(`#${todoItem.ID}`).append(
        $('<input>').prop({
            className: 'check',
            type: 'checkbox',
            checked: todoItem.TODO_CHECK
        })
    );
    $(`#${todoItem.ID} input[type='checkbox']`).change(event => updateCompleted(event));

    $(`#${todoItem.ID}`).append(
        $('<span>').prop({
            className: 'todoContent',
            innerHTML: todoItem.CONTENTS 
        })
    );
    // 할 일의 체크 여부가 true이면 할 일에 취소선을 그음
    if($(`#${todoItem.ID} :checkbox`).is(':checked')){
        $(`#${todoItem.ID} .todoContent`).css('text-decoration', 'line-through');
    };

    $(`#${todoItem.ID}`).append(
        $('<button>').prop({
            id: 'openUpdate',
            className: 'btn btn-secondary',
            innerHTML: '수정'
        })
    );
    $(`#${todoItem.ID} #openUpdate`).click(event => openUpdateTodo(event));

    $(`#${todoItem.ID}`).append(
        $('<button>').prop({
            id: 'deleteButton',
            className: 'btn btn-secondary',
            innerHTML: '삭제'
        })
    );
    $(`#${todoItem.ID} #deleteButton`).click(event => deleteTodo(event));

    // 숨겨진 수정창
    $('#todoList').append(
        $('<li>').prop({
            id: `${todoItem.ID}update`,
            className: 'd-none'
        })
    );

    $(`#${todoItem.ID}update`).append(
        $('<input>').prop({
            type: 'text',
            id: 'inputUpdate',
            value: todoItem.CONTENTS 
        })
    );
    $(`#${todoItem.ID}update #inputUpdate`).keyup(event => handleEnterKey(event));

    $(`#${todoItem.ID}update`).append(
        $('<button>').prop({
            id: 'updateButton',
            className: 'btn btn-secondary',
            innerHTML: '저장'
        })
    );
    $(`#${todoItem.ID}update #updateButton`).click(event => updateTodo(event));

    $(`#${todoItem.ID}update`).append(
        $('<button>').prop({
            id: 'cancelButton',
            className: 'btn btn-secondary',
            innerHTML: '취소'
        })
    );
    $(`#${todoItem.ID}update #cancelButton`).click(() => checkUpdateIsOpen());
}

/*
 할 일 목록을 화면에 띄우는 메서드
 ajax 요청을 통해 데이터를 가져와 데이터 리스트를 화면에 띄우도록 함.
*/
function getTodoList(){
    const USER = decryptID(sessionStorage.loginID);

    const RESPONSE = boardListAjax(USER);
    if(RESPONSE !== '[]'){
        RESPONSE.forEach(todoItem => makeTodoElement(todoItem));
    }
}

/* 
 할 일을 추가하는 메서드
 할 일을 ajax 요청을 통해 DB에 저장 후
 목록 화면을 초기화하고, 전체 목록을 다시 요청함
*/
function createTodo(){
    checkUpdateIsOpen();
    const TODO_CONT = $('#inputCreate').val();
    const USER = decryptID(sessionStorage.loginID);

    if(TODO_CONT === ''){
        alert('내용을 입력하세요.');
    
    // 수정 필요
    }else if(TODO_CONT.length > 20){
        alert('내용은 20자를 넘길 수 없습니다.');
    }else{
        const RESPONSE = insertBoardAjax(TODO_CONT, USER);
        if(RESPONSE === 1){
            alert('할 일이 추가되었습니다.');
            $('#inputCreate').val('');
            $('#inputCreate').blur();
            $('#todoList').empty();
            getTodoList();
        }
    }
}


/*
 할 일을 삭제하는 메서드
 local storage와 'li'요소의 데이터를 가져와 삭제할 id값의 데이터를 삭제하고
 local storage에 수정된 데이터를 담고, 해당 'li'요소를 지움
*/
function deleteTodo(event){
    if(confirm('정말로 삭제하시겠습니까?')){
        const TODO_ID = $(event.target).parent().attr('id');
        const RESPONSE = DeleteBoardAjax(TODO_ID);
        if(RESPONSE === 1){
            alert('할 일이 삭제되었습니다.');
            $('#todoList').empty();
            getTodoList();
        }else{
            alert('할 일 삭제에 실패하였습니다.');
        }
    }
}

/*
 수정창을 여는 메서드
 다른 수정창이 열려있는지 확인 후, 수정창을 열고 수정하려는 할 일의 
 id값을 local storage에 저장 후 수정창을 열어 input에 focus 해줌
*/
function openUpdateTodo(event){
    checkUpdateIsOpen();
    const TODO_ID = $(event.target).parent().attr('id');
    const TODO_CONT = $(`#${TODO_ID} span`).text();
    localStorage.setItem('updateID', TODO_ID);
    localStorage.setItem('updateContent', TODO_CONT);
    handleUpdateInput();
    $(`#${TODO_ID}update #inputUpdate`).focus();
}

/*
 수정창 열기/닫기를 컨트롤하는 메서드
 할 일의 id값을 가져와 수정창이 열려있으면 닫고, 닫혀있으면 열어줌
*/
function handleUpdateInput(){
    const TODO_ID = localStorage.updateID;
    if($(`#${TODO_ID}`).hasClass('d-none')){
        $(`#${TODO_ID}`).toggleClass("d-none", false);
        $(`#${TODO_ID}update`).toggleClass("d-none", true);
    }else{
        $(`#${TODO_ID}`).toggleClass("d-none", true);
        $(`#${TODO_ID}update`).toggleClass("d-none", false);
    }
    
}

/*
 수정창이 열려있는지 확인하는 메서드
 할 일 추가/수정/삭제를 하기 전, 다른 수정창이 열려있는지 확인하고,
 열려있다면 수정창을 닫은 후, input box의 값을 원본데이터로 돌려놓고,
 local storage에 저장된 수정 id, content 값을 삭제함
*/
function checkUpdateIsOpen(){
    if(localStorage.updateID !== undefined){
        handleUpdateInput();
        $(`#${localStorage.updateID}update #inputUpdate`)
            .val(localStorage.updateContent);
        initLocalStorage();
    }
}

/*
 할 일 체크 여부를 수정하는 메서드
 체크 여부가 변경된 경우, 'li'에 저장된 할 일의 id값을 가져와
 local storage에 저장된 해당 id값의 todo_check값을 수정
*/
function updateCompleted(event){
    const TODO_ID = $(event.target).parent().attr('id');
    const USER = decryptID(sessionStorage.loginID);
    const TODO_CHECK = setChkValue($(`#${TODO_ID} :checkbox`).is(':checked'));
    const TODO_CONT = $(`#${TODO_ID} span`).text();

    const RESPONSE = updateBoardAjax(TODO_ID, TODO_CHECK, TODO_CONT, USER);
    if(RESPONSE === 1){
        $('#todoList').empty();
        getTodoList();
    }
}

/*
 할 일을 수정하는 메서드
 local storage와 'li'요소의 데이터를 가져와 수정할 id값의 데이터를 수정하고
 local storage에 수정된 데이터를 담고, 해당 'li'요소를 수정 후 수정창을 닫음
*/
function updateTodo(){
    const TODO_ID = localStorage.updateID;
    const USER = decryptID(sessionStorage.loginID);
    const TODO_CHECK = setChkValue($(`#${TODO_ID} :checkbox`).is(':checked'));
    const TODO_CONT = $(`#${TODO_ID}update input`).val();

    if(TODO_CONT === ''){
        alert('내용을 입력하세요.');
    }else{
        const RESPONSE = updateBoardAjax(TODO_ID, TODO_CHECK, TODO_CONT, USER);
        if(RESPONSE === 1){
            alert('할 일이 수정되었습니다.');
            handleUpdateInput();
            initLocalStorage();
            $('#todoList').empty();
            getTodoList();
        }
    }
}

function logout(){
    sessionStorage.removeItem('loginID');
    alert('로그아웃 되었습니다.')
    location.href = 'Login.html';
}
/*
 입력창의 엔터키를 감지하는 메서드
 입력창에서 엔터키가 눌렸을 때, 각각 입력창의 id값에 따라 메서드를 실행
*/
function handleEnterKey(event){
    if(event.key == 'Enter'){
        switch(event.target.id){
            case 'inputUpdate':
                updateTodo(event);
                break;
            case 'inputCreate':  
                createTodo();
                break;
        }
    }
}

/*
 local storage를 초기화하는 메서드
*/
function initLocalStorage(){
    localStorage.removeItem('updateID');
    localStorage.removeItem('updateContent');
}

/*
 ajax 요청시 보낼 checkbox값을 세팅하는 메서드
*/
function setChkValue(chkValue){
    if(chkValue === true){
        return 1;
    }else if(chkValue === false){
        return 0;
    }
}