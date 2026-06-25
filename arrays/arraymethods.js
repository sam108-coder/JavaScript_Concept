let foodItems = ["potato", "apple", "litchi", "tomato"];
console.log(foodItems);
foodItems.push("chips"); // add to end
console.log(foodItems);
foodItems.push("burger", "Panner");
console.log(foodItems);

let deletedItem = foodItems.pop(); // delete form end
console.log(foodItems);
console.log("deleted", deletedItem);

console.log(foodItems.toString());
console.log(foodItems);

console.log("-------------------------------------------");

let marks = [97, 86, 54, 36];
console.log(marks.toString());

console.log("-------------------------------------------");

let marvel_heroes = ["thor", "spiderman", "ironman"];
let dc_heroes = ["superman", "batman"];
let indianHeroes = ["shaktiman", "krish"];

let heroes = marvel_heroes.concat(dc_heroes, indianHeroes); // joins multiple arrays & returns result
console.log(heroes);

console.log("-------------------------------------------");
let val1 = marvel_heroes.unshift("antman");
console.log(val1);
let val = marvel_heroes.shift(); // delete from start & return
console.log("deleted", val);

console.log("-----slice()-----");

let number = [1, 2, 3, 4, 5, 6, 7, 8, 9];
console.log(number);
console.log(number.slice(1, 2));
console.log(number.slice(1));
console.log(number.slice());

console.log("-----Splice()-----");

let number2 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
// number2.splice(2,2,101,102);
console.log(number2);

// Add Element
//number2.splice(2, 0, 101);
console.log(number2);

// Delete Element
//number2.splice(3, 1);
console.log(number2);

// Replace Element
number2.splice(3, 1, 101);
console.log(number2);






