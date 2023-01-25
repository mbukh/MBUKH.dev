const longest = (s1, s2) => {
    if (!s1?.length || !s2?.length) return "two string are required";
    return [...new Set(s1 + s2)]
        .sort(Intl.Collator().compare) // international case insensitive
        .join("");
};

// Tests
let res;
res = longest(); //=
console.log(res);
res = longest(123); //=
console.log(res);
res = longest("123"); //=
console.log(res);
res = longest("abc", 123); //=
console.log(res);

console.log(res);
res = longest("abc", "def"); //=
console.log(res);
res = longest("cba", "cbfed"); //=
console.log(res);
res = longest("ЕдГ", "вбА"); //=
console.log(res);
res = longest("אאאמת", "שקררררר"); //=
console.log(res);
