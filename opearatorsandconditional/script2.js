// CONDITIONAL STATEMENT

console.log("-----IF STATEMENT-----")
let age = 16;

if (age >= 18) {
    console.log("You can vote.")
}

if (age < 18) {
    console.log("You can not vote.")
}

let mode = "dark";
let color;

if (mode === "dark") {
    color = "black";
}

if (mode === "light") {
    color = "white";
}

console.log(color);

console.log("-----IF-ELSE STATEMENT-----")

let mode1 = "blue";
let color1;

if (mode1 === "dark") {
    color1 = "black";
}
else {
    color1 = "white";
}
console.log(color1);

let age1 = 25;

if (age1 >= 18) {
    console.log("vote");
}
else {
    console.log("not vote");
}

// Odd or even
let number3 = 10;

if (number3 % 2 === 0) {
    console.log(number3, "is even")
}
else {
    console.log(number3, " is Odd");
}

console.log("-----If -else if -else STATEMENT-----")

let mode2 = "dark";
let color2;

if (mode2 === "dark") {
    color2 = "black";
}
else if (mode2 === "blue") {
    color2 = "blue";
}
else if (mode2 === "pink") {
    color2 = "pink";
}
else {
    color2 = "white";
}

console.log(color2);






