/* Q. For a given array of numbers, print the square of each value using the forEach loop. */

let number = [11, 24, 36, 48, 55];

number.forEach((val) => {
    console.log(val * val); // val**2
});

console.log("************OR**************")

let calcSquare = (val) => {
    console.log(val * val);
};

number.forEach(calcSquare);
