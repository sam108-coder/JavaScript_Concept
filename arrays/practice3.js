/*
Create an array to store companies → "Bloomberg", "Microsoft", "Uber", "Google", "IBM", "Netflix"

a. Remove the first company from the array
b. Remove Uber & add Ola in its place
c. Add Amazon
*/

let companies=["Bloomberg", "Microsoft", "Uber", "Google", "IBM", "Netflix"];

//companies.shift();
console.log(companies);

//companies.splice(2,1,"Ola");
console.log(companies);

companies.push("Amazon");
console.log(companies);



