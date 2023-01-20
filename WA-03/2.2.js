// Ex2.2 - One and Zero - Binary
// Given an array of ones and zeroes, convert the equivalent binary value to an integer. Eg: [0, 0, 0, 1] is treated as 0001 which is the binary representation of 1.
// Examples:
// Testing: [0, 0, 0, 1] ==> 1
// Testing: [0, 0, 1, 0] ==> 2
// Testing: [0, 1, 0, 1] ==> 5
// Testing: [1, 0, 0, 1] ==> 9
// Testing: [0, 0, 1, 0] ==> 2
// Testing: [0, 1, 1, 0] ==> 6
// Testing: [1, 1, 1, 1] ==> 15
// Testing: [1, 0, 1, 1] ==> 11
// However, the arrays can have varying lengths, not just limited to 4.

const binaryArrayToInt = (binaryArr) => {
    if (!binaryArr.length) return null;
    if (binaryArr.some((n) => Number(n) !== 0 && Number(n) !== 1)) return null;
    return parseInt(binaryArr.join(""), 2); // base = 2 means binary, converts ot decimal
};

// test
let res;
res = binaryArrayToInt([]); //= null
console.log(res);
res = binaryArrayToInt([0, 5, 1]); //= null
console.log(res);

res = binaryArrayToInt([0, 0, 0, 1]); //= ==> 1
console.log(res);
res = binaryArrayToInt([0, 0, 1, 0]); //= ==> 2
console.log(res);
res = binaryArrayToInt([0, 1, 0, 1]); //= ==> 5
console.log(res);
res = binaryArrayToInt([1, 0, 0, 1]); //= ==> 9
console.log(res);
res = binaryArrayToInt([0, 0, 1, 0]); //= ==> 2
console.log(res);
res = binaryArrayToInt([0, 1, 1, 0]); //= ==> 6
console.log(res);
res = binaryArrayToInt([1, 1, 1, 1]); //= ==> 15
console.log(res);
res = binaryArrayToInt([1, 0, 1, 1]); //= ==> 11
console.log(res);
