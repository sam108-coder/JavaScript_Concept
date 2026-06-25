const student={
    fullName : "Rahul Kumar",
    age : 20,
    cgpa : 8.2,
    isPass : true,
};

console.log(student);
console.log(typeof(student));
console.log(student["fullName"]);
console.log(student.age);

student["age"]=student["age"]+1;
console.log(student.age);


