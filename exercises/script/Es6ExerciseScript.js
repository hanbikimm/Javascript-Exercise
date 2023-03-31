// 1. 
let add = (num1, num2) => `${num1} + ${num2} = ${num1+num2}`;
let subtract = (num1, num2) => `${num1} - ${num2} = ${num1-num2}`;
const MULTIPLY = (num1, num2) => `${num1} x ${num2} = ${num1*num2}`;
const DIVIDE = (num1, num2) => `${num1} / ${num2} = ${num1/num2}`;

console.log(add(3, 4));
console.log(subtract(5, 2));
console.log(MULTIPLY(2, 6));
console.log(DIVIDE(10, 2));

// 2.
let name = 'John';
let age = 30;
let sentence = `My name is ${name} and I am ${age} years old.`
console.log(sentence);

// 3.
let arr1 = [1, 2, 3];
let arr2 = [4, 5, 6];
let newArr = [...arr1, ...arr2];
console.log(newArr);