// Ex5.3 - To Camel Case
// Complete the method/function so that it converts dash/underscore delimited words into camel casing.
// The first word within the output should be capitalized only if the original word was capitalized
// (known as Upper Camel Case, also often referred to as Pascal case).
// Examples
// toCamelCase("the-stealth-warrior") // returns "theStealthWarrior"
// toCamelCase("The_Stealth_Warrior") // returns "TheStealthWarrior"

const toCamelCase = (str) =>
    typeof str === "string" &&
    str
        .replace(/_/g, "-")
        .split("-")
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join("");

        
// Tests
let res;
res = toCamelCase(NaN); //=
console.log(res);
res = toCamelCase("the-stealth-warrior"); //= returns "theStealthWarrior"
console.log(res);
res = toCamelCase("The_Stealth_Warrior"); //= returns "TheStealthWarrior"
console.log(res);
