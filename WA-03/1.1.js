// Ex1.1 - Yes or No 
// Complete the method that takes a boolean value and return a "Yes" string for true, or a "No" 
// string for false
const stringBoolean = (boolValue) => typeof boolValue === 'boolean' ? boolValue ? 'Yes' : 'No' : null;

// test
let res;
res = stringBoolean( stringBoolean(false) === 'No' );
console.log(res);

res = stringBoolean('not boolean');
console.log(res);
