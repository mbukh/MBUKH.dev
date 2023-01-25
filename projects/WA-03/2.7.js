// Your task is to create a function that does four basic .
// The function should take three arguments - operation(string/char), value1(number), value2(number).
// The function should return result of numbers after applying the chosen operation. Examples
// basicOp('+', 4, 7) // Output: 11
// basicOp('-', 15, 18) basicOp('*', 5, 5) basicOp('/', 49, 7)
// // Output: -3 // Output: 25
// // Output: 7

const basicOp = (operation, value1, value2) => {
    if (
        !(
            typeof operation === "string" &&
            typeof value1 === "number" &&
            typeof value2 === "number"
        )
    )
        return null;
    switch (operation) {
        case "+":
            return value1 + value2;
        case "-":
            return value1 - value2;
        case "/":
            return value2 !== 0 ? value1 / value2 : Infinity;
        case "*":
            return value1 * value2;
        default:
            return null;
    }
};

// Tests
let res;
res = basicOp("/", 0, 0); //= Output: 7
console.log(res);

res = basicOp("+", 4, 7); //= OutbasicOpput: 11
console.log(res);
res = basicOp("-", 15, 18); //= Output: -3
console.log(res);
res = basicOp("*", 5, 5); //= Output: 25
console.log(res);
res = basicOp("/", 49, 7); //= Output: 7
console.log(res);
