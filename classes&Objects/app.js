const student = {
    fullName: "Rahul Kumar",
    marks: 94.4,
    printMarks: function () { },
};


const employee = {
    calcTax1() {
        console.log("tax rate is 10%");
    },
    calcTax2() {
        console.log("tax rate is 20%");
    },
};

const karanArjun = {
    salary: 50000,
};
const karanArjun2 = {
    salary: 50000,
};
const karanArjun3 = {
    salary: 50000,
};
const karanArjun4 = {
    salary: 50000,
};

karanArjun.__proto__ = employee;
karanArjun2.__proto__ = employee;
karanArjun3.__proto__ = employee;
karanArjun4.__proto__ = employee;


