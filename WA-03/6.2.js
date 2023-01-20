const countDuplicates = (str) =>
    /^[a-zA-Z0-9]+$/.test(str) &&
    str
        .toLowerCase()
        .split("")
        .reduce(
            (storage, letter) => {
                // if (storage.hasOwnProperty[letter])
                return Object.assign({}, storage, {
                    [letter]: (storage[letter] || 0) + 1,
                    dupCount:
                        storage[letter] > 1
                            ? storage[dupCount] + 1
                            : storage[dupCount],
                });
            },
            { dupCount: 0 }
        ).dupCount;

// Tests
let res;
res = countDuplicates("aabbcde"); //=
