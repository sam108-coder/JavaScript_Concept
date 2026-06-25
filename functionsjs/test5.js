/* Some More Array Methods

Topic:  
Reduce

Explanation:

Performs some operations & reduces the array to a single value.

It returns that single value.

JavaScript Demo: Array.reduce()

javascript
const array1 = [1, 2, 3, 4];

// 0 + 1 + 2 + 3 + 4
const initialValue = 0;
const sumWithInitial = array1.reduce(
  (accumulator, currentValue) => accumulator + currentValue,
  initialValue,
);

console.log(sumWithInitial);
// Expected output: 10 */

let arr = [1, 2, 3, 4];
const output = arr.reduce((prev, curr) => {
    //return prev + curr;
    return prev > curr ? prev : curr;
});
console.log(output);





