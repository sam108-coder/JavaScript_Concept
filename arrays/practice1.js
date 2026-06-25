// Q. For a given array with marks of student -> [85,97,44,37,76,60]
// Find the average marks of the entire class.

let marks = [85, 97, 44, 37, 76, 60];
let sum = 0;
for (let mark of marks) {
    sum = sum + mark;
}
let avg = sum / marks.length;
console.log(`avg marks of thr class=${avg}`)