// Ex2.6 - Years and Centuries
// The first century spans from the year 1 up to and including the year 100,
// The second - from the year 101 up to and including the year 200, etc.
// Task :
// Given a year, return the century it is in.
// Input , Output Examples :: centuryFromYear(1705) returns (18) centuryFromYear( 1900) returns (19) centuryFromYear(1601) returns (17) centuryFromYear(2000) returns (20)

const centuryFromYear = (year) => {
    if (typeof year !== "number" || !Number.isInteger(year)) return null;
    if (year > 0) return Math.floor((year - 1) / 100) + 1;
    if (year < 0) return Math.ceil((year + 1) / 100) - 1;
    return 0;
};

// Tests
let res;

res = centuryFromYear("500.5"); //= === 18
console.log(res);
res = centuryFromYear(0); //= === 18
console.log(res);
res = centuryFromYear(-101); //= === 18
console.log(res);

res = centuryFromYear(1705); //= === 18
console.log(res);
res = centuryFromYear(1900); //= === 19
console.log(res);
res = centuryFromYear(1601); //= === 17
console.log(res);
res = centuryFromYear(2000); //= === 20
console.log(res);
