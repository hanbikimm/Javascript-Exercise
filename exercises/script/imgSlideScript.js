let time = 3000;
let array = [
    ["엔젤리너스", "img/angelinus.jpg"],
    ["이디야", "img/ediya.jpg"],
    ["할리스","img/hollys.png"],
    ["스타벅스", "img/starbucks.png"],
    ["탐앤탐스", "img/tomntoms.jpg"],
    ["투썸플레이스","img/twosome.jpg"]
];

let title = document.getElementById("title");
let image = document.getElementById("logo");
let index = 0;

function getNextImg(){

    index++;
    if(index >= array.length){
        index = 0;
    }
    title.innerHTML = array[index][0];
    image.setAttribute("src", array[index][1]);
}

setInterval(getNextImg, time);

