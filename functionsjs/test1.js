/*
function myFunction(){
    console.log("Welcome to My House!");
    console.log("We are learning JS :");
}
myFunction();

*/

/*
function myFunction1(msg){
    console.log(msg);
}
myFunction1("I love JS");

*/

// Function -> 2 number, sum

/* function myFunction2(num1, num2) {
    sum = num1 + num2;
    console.log(sum);
}
myFunction2(12, 13);
myFunction2(23, 67); */

/* function sum(x, y) {
    // local variable -> scope
    s = x + y;
    return s;
}

let val = sum(3, 4);
console.log(val);
 */

// sum function
function sum(a, b) {
    return a + b;
}

// arrow function
const arrowSum = (a, b) => {
    console.log(a + b);
};
arrowSum(5, 7);


// multiplication function
function mul(a, b) {
    return a * b;
}

const arrowMul = (a, b) => {
    console.log(a * b);
};
arrowMul(7, 9);

const printHello = () => {
    console.log("hello");
};


function abc(){
    console.log("Hello");
}

function myFunc(abc){
    return abc;
}

