/* console.log("hello");
alert("apna college"); */

let heading = document.getElementById("myId");
console.dir(heading);

let headings = document.getElementsByClassName("myClass");
console.dir(headings);
console.log(headings);

let parahs = document.getElementsByTagName("p");
console.dir(parahs);

let firstEl = document.querySelector("p"); // 1st element
console.dir(firstEl);

let allEl = document.querySelectorAll("p");
console.dir(allEl);


let firstEl1 = document.querySelector(".myClass"); // 1st element
console.dir(firstEl1);

let allEl2 = document.querySelectorAll(".myClass");
console.dir(allEl2);

let firstEl3 = document.querySelector("#myId"); // 1st element
console.dir(firstEl3);

let div = document.querySelector("div");
console.dir(div);


