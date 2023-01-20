// reduce via object implementation
const countDuplicates = (str) =>
    str &&
    /^[a-zA-Z0-9]+$/.test(str) &&
    str?.toLowerCase()
        .split("")
        .reduce(
            (acc, ch) =>
                Object.assign({}, acc, {
                    [ch]: (acc[ch] || 0) + 1,
                    dCnt: acc[ch] === 1 ? acc.dCnt + 1 : acc.dCnt,
                }),
            { dCnt: 0 }
        ).dCnt;

// Easier String.match implementation
// ? before . means optional chaining  operator
// it returns undefined if null or undefined stands before it
const countDuplicates2 = (str) =>
    [...new Set(str?.toLowerCase())]
    .reduce(
        (cnt, ch) =>
            str.match(new RegExp(ch, "gi"))?.length > 1 ? ++cnt : cnt,
        0
    );

// Tests
let res;
res = countDuplicates(); //=
res = countDuplicates("abcde"); //=
res = countDuplicates("aabbcde"); //=
res = countDuplicates("aabBcde"); //=
res = countDuplicates("indivisibility"); //=
res = countDuplicates("Indivisibilities"); //=
res = countDuplicates("aA11"); //=
res = countDuplicates("ABBA"); //=

let res2;
res2 = countDuplicates2(); //=
res2 = countDuplicates2("abcde"); //=
res2 = countDuplicates2("aabbcde"); //=
res2 = countDuplicates2("aabBcde"); //=
res2 = countDuplicates2("indivisibility"); //=
res2 = countDuplicates2("Indivisibilities"); //=
res2 = countDuplicates2("aA11"); //=
res2 = countDuplicates2("ABBA"); //=
