/* Create a function using the function keyword that takes 
a String as an argument and returns the number of vowels 
in the string. */

/* function countVowels(str) {
    let count = 0;
    for (const char of str) {
        if (char === "a" || char == "e" || char === "i" || char === "o" || char === "u" || char === "A" || char === "E" || char === "I" || char === "O" || char === "U") {
            count++;
        }
    }
}
countVowels("abc");
countVowels("Aeiou"); */


const countVow = (str) => {
    let count = 0;
    for (const char of str) {
        if (char === "a" || char == "e" || char === "i" || char === "o" || char === "u" || char === "A" || char === "E" || char === "I" || char === "O" || char === "U") {
            count++;
        }
    }
    return count;
};
console.log(countVow("sammy"));




