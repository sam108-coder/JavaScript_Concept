// let h2 = document.querySelector("h2");
// console.dir(h2.innerText);
// h2.innerText = h2.innerText + " from Apna College Students";



let divs = document.querySelectorAll(".box");
//console.log(divs[0]);

// divs[0].innerText="new unique value 1";
// divs[1].innerText="new unique value 2";
// divs[2].innerText="new unique value 3";

// or

/* let idx = 1;
for (div of divs) {
    div.innerText = `new unique value ${idx}`;
    idx++;
} */

/* let div = document.querySelector("div");
console.log(div);

let id = div.getAttribute("id");
console.log(id);

let name = div.getAttribute("name");
console.log(name); */

// getAttribute()
/* let para=document.querySelector("p");
console.log(para.getAttribute("class"));

// setAttribute
let para1=document.querySelector("p");
console.log(para1.setAttribute("class","newClass")); */

// style
/* let div = document.querySelector("div");
console.log(div.style);

div.style.backgroundColor="green";
div.style.backgroundColor="purple";
//div.style.visibility="hidden";

div.style.fontSize="26px";

div.innerText="Hello"; */

// DOM manipulation
let newBtn = document.createElement("button");
newBtn.innerText = "click me!";
console.log(newBtn);

let div = document.querySelector("div");
//div.append(newBtn); // adds at the end of the node (inside)

// div.prepend(newBtn); // adds at the start of the node (inside)

//div.before(newBtn); //adds before the node (outside)

//div.after(newBtn); //adds after the node (outside)


//let p = document.querySelector("p");
//p.after(newBtn);

let newHeading = document.createElement("h1");
newHeading.innerHTML = "<i>Hi, I am new!</i>";

document.querySelector("body").prepend(newHeading);

newHeading.remove();


