const accum = (str) =>
    /^[a-zA-Z]+$/.test(str) &&
    str
        .split("")
        .map((char, index) => char.toUpperCase() + char.repeat(index))
        .join("-");

let res;
res = accum("abcd"); //=
console.log(res);
res = accum("RqaEzty"); //=
console.log(res);
res = accum("cwat"); //=
console.log(res);
