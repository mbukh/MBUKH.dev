const findPerimeter = (a, b) =>
    typeof a === "number" && typeof b === "number" ? a + a + b + b : "error";

// Tests
let res;
res = findPerimeter();
console.log(res);
res = findPerimeter(5);
console.log(res);
res = findPerimeter(5, "10");
console.log(res);

res = findPerimeter(5, 10);
console.log(res);
res = findPerimeter(50, 200);
console.log(res);
