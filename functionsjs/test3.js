/* Some More Array Methods

Topic:  
map() method in JavaScript

Explanation:

map creates a new array with the results of some operation.

The value its callback returns is used to form the new array.

Syntax:

arr.map( callbackFnx( value, index, array ) )

Example:

let newArr = arr.map( ( val ) => {
    return val * 2;
}); */

let nums = [67, 52, 39];

let newArr = nums.map((val) => {
    return val * val;
});
console.log(newArr);

let calcSquare = (num) => {
    console.log(num * num);
}









