// Ex2.4 - Unique
// There is an array with some numbers. All numbers are equal except for one. Try to find it! findUniq([ 1, 1, 1, 2, 1, 1 ]) === 2
// findUniq([ 0, 0, 0.55, 0, 0 ]) === 0.55
// It’s guaranteed that array contains at least 3 numbers.

const findUniq = (arr) => {
    // assuming arr contains at lest 3 numbers
    if (arr.some((n) => typeof n !== "number")) return null;
    const uniques = new Set([arr[0]]); // create a set and add the first number from array
    return arr.find((el) => {
        const len = uniques.size;
        uniques.add(el);
        return uniques.size !== len; // stop and return when a new element arrives
    });
};

// Test
let res;

res = findUniq([1, "10", 2]); //=
console.log(res);

res = findUniq([1, 1, 1, 2, 1, 1]); //= === 2;
console.log(res);
res = findUniq([0, 0, 0.55, 0, 0]); //= === 0.55;
console.log(res);
