// Ex4.1 - Fibonacci -
// “Write a function to return an n element in Fibonacci sequence”
// is one of the most common questions you can hear during the coding challenge interview part.
// In this blogpost I’m going to walk through the two of the most typical solutions
// for this problem and also cover a dreadful (for most of novice developers) topic of time complexity.
// So what is a Fibonacci sequence? According to ​Wikipedia​:
// “In mathematics, the Fibonacci numbers are the numbers in the following integer sequence,
// called the Fibonacci sequence, and characterized by the fact that every number after the first two
// is the sum of the two preceding ones.”
// Depending on the chosen starting point of the sequence (0 or 1) the sequence would look like this:
// 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, ...
// or this:
// 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, ...

const getFibonacciRecursive = (n) => {
    if (n === 0 || !Number.isInteger(n)) {
        return 0;
    } else if (n === 1) {
        return 1;
    } else {
        return getFibonacciRecursive(n - 1) + getFibonacciRecursive(n - 2);
    }
};

const getFibonacciByFormula = (n) => {
    if (!Number.isInteger(n)) return 0;
    // This formula is attributed to Binet in 1843, though known by Euler before him.
    // https://math.hmc.edu/funfacts/fibonacci-number-formula/
    const Phi = (1 + Math.sqrt(5)) / 2;
    const phi = -1 / Phi;
    return Math.round((Phi ** n - phi ** n) / Math.sqrt(5));
};

// Tests

console.log(getFibonacciRecursive("15"));
for (let i = 0; i < 15; i++) {
    console.log(getFibonacciRecursive(i));
}

console.log(getFibonacciByFormula("15"));
for (let i = 0; i < 15; i++) {
    console.log(getFibonacciByFormula(i));
}
