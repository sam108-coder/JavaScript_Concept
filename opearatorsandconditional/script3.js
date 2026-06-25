// Ternary Operators
// condition ? true output:false output

const { act } = require("react");

console.log("-----Ternary Operators-----")
let age = 25;
let result = age >= 18 ? "adult" : "not adult";
console.log(result);

age >= 18 ? console.log("adult") : console.log("not adult");

console.log("-----switch statement-----")
const expr = "Papayas";
switch (expr) {
    case "Oranges":
        console.log("Oranges are $0.59 a pound");
        break;
    case "Mangoes":
    case "Papayas":
        console.log("Mangoes and papayas are $2.79 a pound.");
        break;
    default:
        console.log("Sorry, we are out of ${expr}.");
}


console.log("-----EXAMPLE 2-----")
const foo = 0;
switch (foo) {
    case -1:
        console.log("negative 1");
        break;
    case 0:
        console.log(0);  // Forgotten break! Execution falls through
    case 1: // no break statement in 'case 0:' so this case will run as well
        console.log(1);
        break;
    case 2:
        console.log(2);
        break;
    default:
        console.log("default");
}

