arr = [0, 1, 2, 3, 4, 5, 6, 7, 105];

// use of [...] spread operator is determined by the task,
// quote: "without other js methods"

Array.prototype.Filter = function (func) {
    let res = [];
    for (el of this) if (func(el)) res = [...res, el]; // no push method
    return res;
};
let res1 = arr.Filter((el) => el % 2 !== 0);
console.log(res1);

Array.prototype.ForEach = function (func) {
    for (el of this) func(el);
};
let res2;
arr.ForEach((el) => console.log(el));

Array.prototype.Map = function (func) {
    let res = [];
    for (el of this) res = [...res, func(el)]; // no push method
    return res;
};
const superNice = (el) => (el % 2 === 0 ? "❤️‍🔥" : "💩");
let res3 = arr.slice(0, 5).Map(superNice);
console.log(res3);
