/* Qs2. Write a code which can give grades to students according to their scores:
1> 90-100, A
2> 70-89, B
3> 60-69, C
4> 50-59, D
5> 0-49, F   */

let score = prompt("Enter Your score(0-100):"); // If we use prompt() then it can take input from user and it take from browser 
// let score = 75;
let grade;
if (score >= 90 && score <= 100) {
    //console.log("Grade A");
    grade = "A";
} else if (score >= 70 && score <= 89) {
    //console.log("Grade B");
    grade = "B";
} else if (score >= 60 && score <= 69) {
    // console.log("Grade C");
    grade = "C";
} else if (score >= 50 && score <= 59) {
    grade = "D";
} else if (score >= 0 && score <= 49) {
    grade = "F";
}

console.log("according to your scores, Your grade was : ", grade);

