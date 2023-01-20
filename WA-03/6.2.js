// reduce via object implementation
const countDuplicates = (str) =>
    str &&
    /^[a-zA-Z0-9]+$/.test(str) &&
    str
        .toLowerCase()
        .split("")
        .reduce(
            (storage, letter) =>
                Object.assign({}, storage, {
                    [letter]: (storage[letter] || 0) + 1,
                    dupCount:
                        storage[letter] === 1
                            ? storage.dupCount + 1
                            : storage.dupCount,
                }),
            { dupCount: 0 }
        ).dupCount;

// Tests
let res;
res = countDuplicates(); //=
res = countDuplicates("abcde"); //=
res = countDuplicates("aabbcde"); //=
res = countDuplicates("aabBcde"); //=
res = countDuplicates("indivisibility"); //=
res = countDuplicates("Indivisibilities"); //=
res = countDuplicates("aA11"); //=
res = countDuplicates("ABBA"); //=
