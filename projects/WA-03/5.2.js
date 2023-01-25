// Ex5.2 - String Repeat
// Write a function called repeat_str which repeats the given string src exactly count times.
// repeatStr(6, "I") // "IIIIII"
// repeatStr(5, "Hello") // "HelloHelloHelloHelloHello"

const repeatStr = (n, str) =>
    typeof str === "string" && Number.isInteger(n) && n >= 0
        ? str.repeat(n)
        : "error";

// Tests

let res;
res = repeatStr(-1, null); //= "error"
console.log(res);
res = repeatStr(6, "I"); //= "IIIIII"
console.log(res);
res = repeatStr(5, "Hello"); //= "HelloHelloHelloHelloHello"
console.log(res);
