const isIsogram = (s) => {
    if (typeof s !== "string") return undefined;
    if (!s?.length) return true;
    return new Set(s.toLowerCase() + "").size === (s + "").length
        ? true
        : false;
};

// Tests
let res;
res = isIsogram();
console.log(res);

res = isIsogram("");
console.log(res);
res = isIsogram("Dermatoglyphics");
console.log(res);
res = isIsogram("aba");
console.log(res);
res = isIsogram("moOse");
console.log(res);
