$(document).ready(function () {
    getMemberList();
});


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
        error: function(xhr, status, error){
            alert(`${xhr.status}${xhr.responseText}${error}`);
        }
    });
}

/*
 id 중복 확인하는 메서드
 id 값을 가져와 ajax 요청을 통해 중복 여부를 <p>태그에 표시함
*/
function checkID(){
    if($('#id').val() !== ''){
        const DATA = {
            id: $('#id').val()
        };
        let response = sendAjax('CustomerIdCheckServlet', DATA).responseJSON;
        if(response === '사용 가능한 아이디 입니다.'){
            $('#checkID').text(response);
            $('#checkID').css('color', 'black');
        }else if(response === '중복 되었습니다.'){
            $('#checkID').text(response);
            $('#checkID').css('color', 'red');
        }
    }else {
        $('#checkID').text('');
    }
    
    
}

/*
 회원 가입하는 메서드
 유효성 검사를 통과하면, input에 있는 회원 정보로 회원가입 ajax 요청을 보내고,
 성공 시 원래 있던 고객 리스트를 초기화하고 다시 불러옴
*/
function createMember(){
    let ID = $('#id').val();
    let name = $('#name').val();
    let age = $('#age').val();
    let phone = $('#phone').val();
    let address = $('#address').val();

    let response;
    const DATA = {
        id: ID,
        name: name,
        age: age,
        tel: phone,
        address: address
    };
    
    if(checkValidation(ID, name, age, phone, address)){
        response = sendAjax('CustomerInsertServlet', DATA).responseJSON;
        if(response === 1){
            alert('가입에 성공했습니다.');
            initData();
            $('#memberList').empty();
            getMemberList();
        }else{
            alert('가입에 실패했습니다.');
        }
    }
    
}

/*
 유효성 검사 메서드
 모든 항목이 작성되었는지, 형식에 맞게 작성되었는지 확인함
*/
function checkValidation(ID, name, age, phone, address){
    let result;
    const REG_PHONE = /^\d{3}-\d{4}-\d{4}$/;
    const REG_AGE = /^[0-9]+$/; 

    if(ID === '' || name === '' || age === '' || phone === '' || address === ''){
        // if(ID === ''){
        //     $('#result').text('ID를 입력해주세요'); 
        //     $('#id').focus();
        // }else if(name === ''){
        //     $('#result').text('이름을 입력해주세요.');
        //     $('#name').focus();
        // }else if(age === ''){
        //     $('#result').text('나이를 입력해주세요.');
        //     $('#age').focus();
        // }else if(phone === ''){
        //     $('#result').text('전화번호를 입력해주세요.');
        //     $('#phone').focus();
        // }else if(address === ''){
        //     $('#result').text('주소를 입력해주세요.');
        //     $('#address').focus();
        // }
        $('#result').text('모든 항목을 입력해주세요.');
        result = false;
    }else if($('#checkID').text() === '중복 되었습니다.'){
        $('#result').text('ID 중복 확인을 해주세요.');
        $('#id').focus();
        result = false;
    }else if(age.match(REG_AGE) === null || age === '0' || age > 130){
        $('#result').text('나이는 숫자로만 올바르게 입력해주세요.');
        $('#age').focus();
        result = false;
    }else if(phone.match(REG_PHONE) === null){
        $('#result').text('전화번호는 XXX-XXXX-XXXX 형식으로 입력해주세요.');
        $('#phone').focus();
        result = false;
    }else{
        $('#result').text('');
        result = true;
    }
    return result;
}

/*
 데이터 초기화 메서드
 입력된 값, 출력된 값을 모두 초기화함
*/
function initData(){
    $('#id').val('');
    $('#name').val('');
    $('#age').val('');
    $('#phone').val('');
    $('#address').val('');
    $('#result').text('');
    $('#checkID').text('');
}

/*
 고객 리스트를 보여주는 메서드
 ajax 응답으로 온 고객 리스트 데이터를 가져와
 foreach를 통해 화면에 element를 만들어 화면에 띄워줌
*/
function getMemberList(){
    let response = sendAjax('CustomerSelectServlet', '').responseJSON;
    if(response !== '[]'){
        const LIST = response.sort(function(a,b){
            return a.NO - b.NO;
        });
    
        LIST.forEach(member => {
            $('#memberList').append(
                $('<tr>').prop({
                    id: member.NO,
                })
            );
            $(`#${member.NO}`).append(`<td>${member.NO}</td>`);
            $(`#${member.NO}`).append(`<td>${member.ID}</td>`);
            $(`#${member.NO}`).append(`<td>${member.NAME}</td>`);
            $(`#${member.NO}`).append(`<td>${member.AGE}</td>`);
            $(`#${member.NO}`).append(`<td>${member.TEL}</td>`);
            $(`#${member.NO}`).append(`<td>${member.ADDRESS}</td>`);
            $(`#${member.NO}`).append('<td><button>삭제</button></td>');
            $(`#${member.NO} button`).click(event => deleteMember(event));
        });
    }
}

/*
 회원 정보를 삭제하는 메서드
 회원 삭제 여부를 한 번 더 확인 후, ajax 요청을 통해 삭제하고 리스트를 띄움
*/
function deleteMember(event){
    if(confirm('정말로 삭제하시겠습니까?')){
        const DATA = {
            no: $(event.target).parents()[1].id
        };
        let response = sendAjax('CustomerDelServlet', DATA).responseJSON;

        if(response === 1){
            $('#memberList').empty();
            getMemberList();
        }else{
            alert('회원 삭제가 실패했습니다.');
        }
    }
}

