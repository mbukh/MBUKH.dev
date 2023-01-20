const longest = (s1, s2) =>
    s1 &&
    s2 &&
    [...new Set(s1 + s2)]
        .sort(Intl.Collator().compare) // international case insensitive
        .join("");

// Tests
let res;
// longest();
// longest(123);
// longest("123");
res = longest("abc", 123);
console.log(res); //=
res = longest("abc", "def"); //=
console.log(res);
res = longest("cba", "cbafed"); //=
console.log(res);
res = longest("ЕдГ", "вбА"); //=
console.log(res);
