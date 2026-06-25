
let marks = [97, 82, 75, 64, 36];
console.log(marks);
console.log(marks.length);

let heroes = ["ironman", "thor", "hulk", "shaktiman", "spiderman", "antman"];
console.log(heroes);
console.log(typeof (heroes));

console.log(heroes[0]);
console.log(heroes[10]);

console.log("-----Iterate Through for loop-----")
for (let idx = 0; idx < heroes.length; idx++) {
    console.log(heroes[idx]);
}

console.log("-----Iterate Through for-of loop-----")
for (let item of heroes) {
    console.log(item);
}

console.log("-----Example 1-----")
let cities = ["delhi", "pune", "mumbai", "hyderabad", "gurugram"];

for (let city of cities) {
    console.log(city.toUpperCase());
}








