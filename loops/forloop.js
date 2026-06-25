/*
for (let i = 1; i <= 10; i++) {
    console.log("Hi");
}
*/

// Calculate sum of 1 to n
/*
let sum = 0;
let n=100;
for (let i = 1; i <= n; i++) {

    sum = sum + i;
}
console.log("Sum = ", sum);
*/

// Infinite loop

/* for (let j = 1; j >= 0; j++) {
    console.log("j =", j);
}

console.log("loop has ended"); */

//  for-of loop
/* let str = "Javascript";

for (let i of str) {  // iterator -> characters
    console.log("i=", i);
} */

/* let str = "JavaScript";
let size = 0;
for (let i of str) {
    console.log("i=", i);
    size++;
}
console.log("String size =", size); */


// for-in loop
let student = {
    name: "Rahul Kumar",
    age: 20,
    cgpa: 7.5,
    isPass: true
}

for (let key in student) {
    // console.log(key)
    console.log("key=", key, "value=", student[key]);
}




