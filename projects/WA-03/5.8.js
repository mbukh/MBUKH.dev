// Ex5.8 - shortest words version 2
// Given a string of words, return the longest word[s].
// String will never be empty and you do not need to account for different data types.

const shortestWord = (str) =>
    str && str.split(" ").reduce((a, b) => (a.length > b.length ? a : b));

// Tests
let res;
res = shortestWord();
console.log(res);
res = shortestWord("");
console.log(res);
res = shortestWord("Hello is that possible oy");
console.log(res);
res = shortestWord("bcd a sf!4");
console.log(res);
