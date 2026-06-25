/* Q. Take a number n as input from user.
Tasks:
Create an array of numbers from 1 to n.
Use the reduce method to calculate the sum of all numbers in the array.
Use the reduce method to calculate the product of all numbers in the array. */

let n = prompt("enter a number : ");
let arr = [];
for (let i = 1; i <= n; i++) {
    arr[i - 1] = i; // 1(0)
}
console.log(arr);

let sum = arr.reduce((res, curr) => {
    return res + curr;
});
console.log("sum = ", sum);

let factorial = arr.reduce((res, curr) => {
    return res * curr;
});
console.log("factorial = ", factorial);




