// String

let str = "Welcome";
let str2 = "JavaScript";
console.log(str.length);
console.log(str2.length);

console.log(str[0]);
console.log(str[1]);
console.log(str[10]); // undefined

// Template Literals in js
// -> A way to have embedded expressions in strings

let specialString = `This is a tempate literal`;
console.log(typeof specialString);

let obj = {
    item: "pen",
    price: 10
};

// ${expression} -> String Interpolation
// `` -> betic
let output = `the cost of ${obj.item} is ${obj.price} rupees.`;
console.log(output);
console.log("the cost of", obj.item, "is", obj.price, "rupees.");

// escape character
console.log("Welcome \n to JavaScript.");
console.log("Welcome\ttoJavaScript.");

let str3 = "Apna\tCollege";
console.log(str3.length);


// String Methods(function)
console.log("-----String Methods(function)-----")

let str4 = "Welcome";

console.log(str4.toUpperCase()); // don't change the original value
console.log(str4.toLocaleLowerCase());
console.log(str4);

let str5 = "     JavaScript  ";
console.log(str5.trim());

console.log(str4.concat(str5));

let str6 = "0123456";
console.log(str6.slice(1, 4));
console.log(str6.slice(1));
console.log(str6.slice());

let str7="hello";
console.log(str7.replace("h","m"));
console.log(str7.replace("lo","p"));
console.log(str7.replaceAll("lo","p"));
console.log(str7.charAt(0));
console.log(str7.charAt(3));

