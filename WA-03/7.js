arr = [0, 1, 2, 3, 4, 5, 6, 7, 105];

Array.prototype.Filter = function (func) {
    let res = [];
    for (el of this) if (func(el)) res = [...res, el];
    return res;
};
let res1;
res1 = arr.Filter((el) => el % 2 !== 0); //=
console.log(res1);

Array.prototype.ForEach = function (func) {
    for (el of this) func(el);
};
let res2;
arr.ForEach((el) => console.log(el));

Array.prototype.Map = function (func) {
    let res = [];
    for (el of this) res = [...res, func(el)];
    return res;
};
let res3;
res3 = arr.slice(0, 5).Map((el) => (el % 2 === 0 ? "❤️‍🔥" : "💩")); //=
console.log(res3);
