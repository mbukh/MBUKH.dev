// Ex2.1 - Sum of lowest numbers
// Create a function that returns the sum of the two lowest positive numbers given an array of
// minimum 4 positive integers. No floats or non-positive integers will be passed.
// For example, when an array is passed like [19, 5, 42, 2, 77], the output should be 7.
// [10, 343445353, 3453445, 3453545353453] should return 3453455.
const addTwoMins = (arr) => {
    if (arr.length < 4) return "error";
    const sortedArr = arr.sort((a, b) => a - b); // min to max sort
    return sortedArr[0] + sortedArr[1];
};

// test
let res;
res = addTwoMins([0, 1, 2]);
console.log(res);

res = addTwoMins([19, 5, 42, 2, 77]);
console.log(res);

res = addTwoMins([10, 343445353, 3453445, 3453545353453]);
console.log(res);
