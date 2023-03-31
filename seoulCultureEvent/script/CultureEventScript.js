/*
 분류와 지역 select의 데이터를 세팅함
*/
$(document).ready(function () {
    setSelections();
});

/*
 ajax 요청을 보내는 함수
 분류(codeName)를 매개변수로 삼아 요청을 보냄
 에러가 난 경우, 에러 메세지를 추출해 알림창으로 띄워줌
*/
function sendAjax(codeName){
    const KEY = '56644d456961736131303448576f447a';
    return $.ajax({
        type: "GET",
        url: `http://openapi.seoul.go.kr:8088/${KEY}/json/culturalEventInfo/1/1000/${codeName}`,
        dataType: "json",
        async: false,
        error: function(xhr){
            let response = xhr.responseText;
            const START_INDEX = response.indexOf('CDATA[') + 6;
            const END_INDEX = response.indexOf('.') + 1;
            alert(`${response.slice(START_INDEX, END_INDEX)}`);
        }
    }).responseJSON;
}

/*
 데이터를 가져와 목록을 보여주는 메서드
 분류, 지역의 값을 가져와 유효성 검사를 하고 ajax 요청을 보냄
 ajax 에러가 나지 않는 경우, 응답의 RESULT.CODE값을 통해 경우를 분류한 후
 데이터가 없는 경우엔 없다는 화면을 그려주는 메서드를 호출하고,
 에러의 경우엔 에러 메세지를 알림창에 띄워주고,
 데이터가 있는 경우엔 데이터를 필터링해 화면을 그려주는 메서드를 호출함
*/
function getEventList(){
    const CODE_NAME = $('#codeName option:selected').val();
    const GU_NAME = $('#guName option:selected').val();

    if(checkValidation(CODE_NAME, GU_NAME)){
        const DATA = sendAjax(CODE_NAME);
        if(DATA !== undefined){
            let result = DATA.RESULT || DATA.culturalEventInfo.RESULT;
            if(result.CODE === 'INFO-200'){
                //데이터가 없는 경우
                showData(null);
            }else if(result.CODE !== 'INFO-000'){
                //에러인 경우
                alert(result.MESSAGE);
                initSelect();
            }else{
                //데이터가 있는 경우
                let eventList = DATA.culturalEventInfo.row;
                eventList = eventList.filter(eventItem => eventItem.GUNAME == GU_NAME);
                showData(eventList);
            }
        }
    }
}

/*
 유효성 검사 메서드
 select 값이 빈값인지를 확인 후, 알림창을 띄워주고 focus함
*/
function checkValidation(codeName, guName){
    let result;
    if(codeName === '선택' && guName === '선택'){
        alert('분류와 지역을 선택해주세요.');
        result = false;
    }else if(codeName === '선택'){
        alert('분류를 선택해주세요.');
        $('.codeName').focus();
        result = false;
    }else if(guName === '선택'){
        alert('지역을 선택해주세요.');
        $('.guName').focus();
        result = false;
    }else{
        result = true;
    }
    return result;
}

/*
 데이터에 맞게 화면을 그려주는 메서드
 목록 화면을 초기화 해준 후, 데이터가 없는 경우 없다는 화면을,
 데이터가 있는 경우 목록을 화면에 그려줌
*/
function showData(data) {
    initList();
    if(data === null || data.length === 0){
        $('#noInfo').append(
            $('<h2>').prop({
                innerHTML: '행사가 없습니다.'
            })
        );
        $('#noInfo').append(
            $('<img>').prop({
                id: 'noList',
                src: 'img/crying.png',
                alt: 'NO LIST IMG'
            })
        );
    }else{
        data.forEach(eventItem =>{
            const newDIV = $('<div class="info"></div>');
    
            newDIV.append(
                $('<img>').prop({
                    src: eventItem.MAIN_IMG,
                    alt: '이미지가 없습니다.'
                })
            );
            newDIV.append($(`<p class="intro">${eventItem.TITLE}</p>`));
            newDIV.append($(`<p class="intro">${eventItem.GUNAME}</p>`));
            newDIV.append($(`<p class="intro">${eventItem.USE_FEE}</p>`));
            newDIV.append($(`<p class="intro">${eventItem.DATE}</p>`));
            newDIV.append($(`<a href="${eventItem.ORG_LINK}" target="_blank">홈페이지 바로가기</a>`));
            $('#contents').append(newDIV);
        })
    }
}

/*
 select의 option을 세팅하는 메서드
 배열에 담긴 각각의 option값을 세팅함
*/
function setSelections(){
    const codeNameList = ['선택', '문화교양/강좌', '전시/미술', '뮤지컬/오페라', '연극', '무용', '영화', '국악', '콘서트', '축제-문화/예술', '축제-전통/역사', '축제-시민화합', '클래식', '축제-기타', '축제-자연/경관', '독주/독창회', '기타'];
    const guList = ['선택', '도봉구', '강북구', '노원구', '성북구', '동대문구', '중랑구', '종로구', '은평구', '서대문구', '마포구', '중구', '용산구', '성동구', '광진구', '강동구', '송파구', '강남구', '서초구', '동작구', '관악구', '금천구', '영등포구', '양천구', '구로구', '강서구'];

    codeNameList.forEach(codeName => {
        $('#codeName').append(
            $('<option>').prop({
                value: codeName,
                innerHTML: codeName
            })
        );
    });

    guList.forEach(guName => {
        $('#guName').append(
            $('<option>').prop({
                value: guName,
                innerHTML: guName
            })
        );
    })
}

/*
 select된 값을 초기화하는 메서드
*/
function initSelect(){
    $('#codeName option:selected').val('선택');
    $('#guName option:selected').val('선택');
}

/*
 화면을 초기화하는 메서드
*/
function initList(){
    $('#noInfo').empty();
    $('#contents').empty();
}

