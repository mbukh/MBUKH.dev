// Ex3.1 - Growth Of population
// In a small town the population is p0 = 1000 at the beginning of a year. The population regularly increases by 2 percent per year and moreover 50 new inhabitants per year come to live in the town. How many years does the town need to see its population greater or equal to p = 1200 inhabitants?

// At the end of the first year there will be:
// 1000 + 1000 * 0.02 + 50 => 1070 inhabitants
// At the end of the 2nd year there will be:
// 1070 + 1070 * 0.02 + 50 => 1141 inhabitants (number of inhabitants is an integer)
// At the end of the 3rd year there will be:
// 1141 + 1141 * 0.02 + 50 => 1213
// It will need 3 entire years.

// More generally given parameters:
//     -  p0, percent, aug (inhabitants coming or leaving each year), p (population to surpass)
//     -  the function nb_year should return n number of entire years needed to get a population greater or equal to p.
//     -  aug is an integer, percent a positive or null number, p0 and p are positive integers (> 0)
// Examples:
//     nb_year(1500, 5, 100, 5000) -> 15 nb_year(1500000, 2.5, 10000, 2000000) -> 10

// Note: Don't forget to convert the percent parameter as a percentage in the body of your function:
// if the parameter percent is 2 you have to convert it to 0.02.

function nb_year(p0, percent, aug, p) {
    if (
        !(
            Number.isInteger(p0) && p0 > 0 &&
            (percent >= 0 || percent === null) &&
            Number.isInteger(aug) &&
            Number.isInteger(p) && p > 0
        )
    ) return "wrong input";
    // prevent too many loop cycles leave only 4 numbers after the point
    const fixedPercent = percent !== null ? percent.toFixed(4) : 0;
    // growth direction + / - or 0
    const growth = p0 * (fixedPercent / 100) + aug;
    let pCurr = p0;
    let years = 0;
    // prevent infinite loop, provide correct feedback
    if (growth === 0 && p !== p0) return Infinity;
    if (growth > 0 && p < 0) return Infinity;
    if (growth < 0 && p > 0) return Infinity;
    // loop conditions change whether growth + or -
    while (growth > 0 ? pCurr < p : pCurr > p) {
        pCurr = pCurr + pCurr * (fixedPercent / 100) + aug;
        years = years + 1;
    }
    return years;
};

// Tests
let res;

res = nb_year(0, -5, 5, 5000); //= -> wrong input
console.log(res);
res = nb_year(1, null, -10, 100); //= -> Infinity
console.log(res);
res = nb_year(50, 50.00005, -25, 100); //= -> 33
console.log(res);

res = nb_year(1500, 5, 100, 5000); //= -> 15
console.log(res);
res = nb_year(1500000, 2.5, 10000, 2000000); //= -> 10
console.log(res);
