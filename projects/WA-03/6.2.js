// reduce via object implementation
// ? before . means optional chaining  operator
// it returns undefined if null or undefined stands before it
const countDuplicates = (str) =>
    str &&
    typeof str === "string" &&
    /^[a-zA-Z0-9]+$/.test(str) &&
    str
        ?.toLowerCase()
        .split("")
        .reduce(
            (acc, ch) =>
                Object.assign({}, acc, {
                    [ch]: (acc[ch] || 0) + 1,
                    // check for 1 cuz acc is still not updated
                    dCnt: acc[ch] === 1 ? acc.dCnt + 1 : acc.dCnt,
                }),
            { dCnt: 0 }
        ).dCnt;

// Easier String.match implementation
const countDuplicates2 = (str) =>
    typeof str === "string" &&
    [...new Set(str.toLowerCase())].reduce(
        (cnt, ch) => (str.match(new RegExp(ch, "gi")).length > 1 ? ++cnt : cnt),
        0
    );

// Tests
let res;
res = countDuplicates(); //=
console.log(res);
res = countDuplicates(123); //=
console.log(res);
res = countDuplicates("abcde"); //=
console.log(res);
res = countDuplicates("aabbcde"); //=
console.log(res);
res = countDuplicates("aabBcde"); //=
console.log(res);
res = countDuplicates("indivisibility"); //=
console.log(res);
res = countDuplicates("Indivisibilities"); //=
console.log(res);
res = countDuplicates("aA11"); //=
console.log(res);
res = countDuplicates("ABBA"); //=
console.log(res);

let res2;
res2 = countDuplicates2(); //=
console.log(res);
res2 = countDuplicates2(123); //=
console.log(res);
res2 = countDuplicates2("abcde"); //=
console.log(res);
res2 = countDuplicates2("aabbcde"); //=
console.log(res);
res2 = countDuplicates2("aabBcde"); //=
console.log(res);
res2 = countDuplicates2("indivisibility"); //=
console.log(res);
res2 = countDuplicates2("Indivisibilities"); //=
console.log(res);
res2 = countDuplicates2("aA11"); //=
console.log(res);
res2 = countDuplicates2("ABBA"); //=
console.log(res);
