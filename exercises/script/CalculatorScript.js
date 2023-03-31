/*
 계산하는 함수
 operation의 종류에 맞는 URL로 계산 요청을 보냄
 요청을 보내기 전, 숫자가 4자리 이하인지, 숫자를 입력했는지 유효성 검사를 하고,
 검사를 통과하면 요청을 보내고 결과값을 화면에 출력 후 입력된 값은 초기화함
*/
function calculate() {
    const OPERATION = document.getElementById('operation').value;
    let serviceName;
    switch(OPERATION){
        case '+':
            serviceName = 'PlusService';
            break;
        case '-':
            serviceName = 'MiunsService';
            break;
        case '*':
            serviceName = 'MulitplyService';
            break;
        case '/':
            serviceName = 'DivideService';
            break;
    };

    const NUM1 = document.getElementById('num1').value;
    const NUM2 = document.getElementById('num2').value;

    if(checkValidation(NUM1, NUM2)){
        $.ajax({
            type: "POST",
            url: `http://newdreams.kr/BootcampusService.asmx/${serviceName}`,
            dataType: "json",
            data: {
                num1: Number(NUM1),
                num2: Number(NUM2)
            },
            success: function(res){
                let result = document.getElementById("result");
                result.innerHTML = `${NUM1} ${OPERATION} ${NUM2} = ${res}`;
    
                init();
            },
            error: function(xhr, status, error){
                alert(xhr.status, xhr.responseText, error);
            }
        });
    }
}

/*
 유효성 검사 메서드
 한글을 입력했는지 또는 빈칸을 입력했는지를 확인하고,
 숫자를 4자리 이하로 입력했는지 확인 후 boolean 값을 return 함
*/
function checkValidation(num1, num2){
    if(num1 == '' || num2 == ''){
        alert('숫자를 입력해주세요.');
        return false;
    }else if(num1.length > 4 || num2.length > 4){
        alert('숫자는 4자리까지만 입력이 가능합니다.');
        return false;
    }else{
        return true;
    }
}

/*
 초기화 메서드
 선택된, 입력된 값을 초기화함
*/
function init(){
    let num1 = document.getElementById('num1');
    let num2 = document.getElementById('num2');
    let operation = document.getElementById('operation');

    num1.value = '';
    num2.value = '';
    operation.value = '+';
}

/*
 엔터키를 다루는 메서드
 첫번째 숫자에서 엔터키가 눌리면 두번째 숫자 입력창으로,
 두번째 숫자에서 엔터키가 눌리면 계산하기 버튼을 누르게 됨
*/
function handleEnterKey(event){
    if(event.key == 'Enter'){
        switch(event.target.id){
            case 'num1':
                //debugger
                document.getElementById('num2').focus();
                break;
            case 'num2':  
                calculate();
                break;
        }
        
    }
}