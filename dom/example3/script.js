let newBtn = document.createElement("button");
newBtn.innerHTML = "click me!";

newBtn.style.color = "white";
newBtn.style.backgroundColor = "red";

document.querySelector("body").prepend(newBtn);

let para=document.querySelector("p");
para.classList.add("newClass");

console.log(para.classList);






