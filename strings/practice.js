/*Qs1. Prompt the user to enter their full name. Generate a username for them based on the input. Start username with @, followed by their full name and ending with the full name length.
Example:
user name = "shradhakhapra"
Then the username should be @shradhakhapra13
*/

let fullName = prompt("Enter your fullname without spaces");

let username = "@" + fullName + fullName.length;
console.log(username);


