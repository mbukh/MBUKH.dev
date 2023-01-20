// Ex5.1 - trimming string
// It's pretty straightforward. Your goal is to create a function that removes
// the first and last characters of a string. You're given one parameter, the original string.
// You don't have to worry with strings with less than two characters.

const trimString = (str) =>
    typeof str === "string" ? str.slice(1, -1) : "error";

// Tests
let res;
res = trimString(123);
console.log(res);
res = trimString("0hello");
console.log(res);
