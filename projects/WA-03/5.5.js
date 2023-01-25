// Ex5.5 - Abbreviate two words
// Write a function to convert a name into initials.
// This kata strictly takes two words with one space in between them.
// The output should be two capital letters with a dot separating them.
// It should look like this:
// Sam Harris => S.H
// Patrick Feeney => P.F

const abbreviateName = (name) =>
    typeof name === "string" &&
    name
        .split(" ")
        .map((part) => part[0].toUpperCase() + ".")
        .join("")
        .slice(0, -1); // remove the last dot

// Tests
let res;
res = abbreviateName(Infinity); //=
console.log(res);
res = abbreviateName("Sam Harris"); //=
console.log(res);
res = abbreviateName("Patrick Feeney"); //=
console.log(res);
