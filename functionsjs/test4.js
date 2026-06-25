/*
Some More Array Methods

Topic:

Filter

Explanation:

Creates a new array of elements that give true for a condition/filter.

Example: all even elements.

Code Example:

javascript
let newArr = arr.filter( (val) => {
    return val % 2 === 0;
})
This demonstrates how the filter() method works: it loops through each element of the array, applies the condition, and only keeps the elements that satisfy it (in this case, even numbers). */

let arr = [1, 2, 3, 4, , 5, 6, 7];

let evenArr = arr.filter((val) => {
    //return val % 2 === 0;
    return val > 3;
});
console.log(evenArr);











