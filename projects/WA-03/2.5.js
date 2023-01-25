// Ex2.5 - Summation
// Write a program that finds the summation of every number from 1 to num. The number will always be a positive integer greater than 0.
// For example: summation(2) -> 3 1+2
// summation(8) -> 36 1+2+3+4+5+6+7+8

//assuming the number will always be a positive integer greater than 0
const summation = (num) =>
    [...Array(num + 1).keys()].reduce((sum, n) => sum + n, 0); // keys() for arrays are just integers, spread them to an array

// tests
let res;
res = summation(2); //= -> 3 1+2
console.log(res);
res = summation(8); //= -> 36 1+2+3+4+5+6+7+8
console.log(res);
