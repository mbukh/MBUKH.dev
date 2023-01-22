// Ex2.4 - Unique
// There is an array with some numbers. All numbers are equal except for one. Try to find it! findUniq([ 1, 1, 1, 2, 1, 1 ]) === 2
// findUniq([ 0, 0, 0.55, 0, 0 ]) === 0.55
// It’s guaranteed that array contains at least 3 numbers.

// The original idea didn't work. Recreated from Artyom Ribakov
const findUniq = (arr) => {
    // assuming arr contains at lest 3 numbers
    if (arr.some((n) => typeof n !== "number")) return null;
    const sortedArr = arr.sort((a, b) => a - b);
    return sortedArr.lastIndexOf(sortedArr[0]) > 0
        ? sortedArr.slice(-1)
        : sortedArr[0];
};

// Test
let res;

res = findUniq([1, "10", 2]); //=
console.log(res);

res = findUniq([1, 1, 1, 2, 1, 1]); //= === 2;
console.log(res);
res = findUniq([0, 0, 0.55, 0, 0]); //= === 0.55;
console.log(res);

res = findUniq([-1, 1, 1, 1, 1, 1]); //= === 2;
console.log(res);
