/* forEach Loop in Arrays -> Higher order function/methods


arr.forEach(callbackFunction)

CallbackFunction: Here, it is a function to execute for each element in the array.

A callback is a function passed as an argument to another function. */

let arr = [1, 2, 3, 4, 5];
arr.forEach(function printVal(val) { // value at each idx
    console.log(val);
});

console.log("**************************")

// arrow function
arr.forEach((val) => {
    console.log(val);
});

console.log("**************************")

let cities = ["pune", "delhi", "mumbai"];
cities.forEach((val) => {
    console.log(val.toUpperCase());
});

console.log("**************************")

cities.forEach((val, idx) => {
    console.log(val.toUpperCase(), idx);
});

console.log("**************************")

cities.forEach((val, idx, cities) => {
    console.log(val.toUpperCase(), idx, cities);
});

