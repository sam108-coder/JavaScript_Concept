# JavaScript: From Beginner to Professional

A comprehensive guide covering all JavaScript concepts from foundational basics to advanced professional-level topics.

---

## Table of Contents

1. [Beginner Concepts](#1-beginner-concepts)
   - [1.1 Variables and Data Types](#11-variables-and-data-types)
   - [1.2 Operators](#12-operators)
   - [1.3 Control Flow](#13-control-flow)
   - [1.4 Functions](#14-functions)
   - [1.5 Arrays](#15-arrays)
   - [1.6 Objects](#16-objects)
   - [1.7 Loops](#17-loops)
   - [1.8 Scope](#18-scope)
   - [1.9 DOM (Document Object Model)](#19-dom-document-object-model)

2. [Intermediate Concepts](#2-intermediate-concepts)
   - [2.1 Closures](#21-closures)
   - [2.2 Higher-Order Functions](#22-higher-order-functions)
   - [2.3 Callbacks](#23-callbacks)
   - [2.4 Promises](#24-promises)
   - [2.5 Async/Await](#25-asyncawait)
   - [2.6 Prototypes and Prototypal Inheritance](#26-prototypes-and-prototypal-inheritance)
   - [2.7 Classes and OOP](#27-classes-and-oop)
   - [2.8 Error Handling](#28-error-handling)
   - [2.9 ES6+ Features](#29-es6-features)
   - [2.10 Modules](#210-modules)

3. [Advanced Concepts](#3-advanced-concepts)
   - [3.1 Event Loop](#31-event-loop)
   - [3.2 Execution Context and Call Stack](#32-execution-context-and-call-stack)
   - [3.3 Hoisting](#33-hoisting)
   - [3.4 The `this` Keyword](#34-the-this-keyword)
   - [3.5 Call, Apply, and Bind](#35-call-apply-and-bind)
   - [3.6 Currying](#36-currying)
   - [3.7 Memoization](#37-memoization)
   - [3.8 Debounce and Throttle](#38-debounce-and-throttle)
   - [3.9 Generators and Iterators](#39-generators-and-iterators)
   - [3.10 Proxies and Reflect](#310-proxies-and-reflect)
   - [3.11 Symbols](#311-symbols)
   - [3.12 WeakMap and WeakSet](#312-weakmap-and-weakset)
   - [3.13 Map and Set](#313-map-and-set)

4. [Professional Concepts](#4-professional-concepts)
   - [4.1 Design Patterns](#41-design-patterns)
   - [4.2 Functional Programming](#42-functional-programming)
   - [4.3 Memory Management and Garbage Collection](#43-memory-management-and-garbage-collection)
   - [4.4 Performance Optimization](#44-performance-optimization)
   - [4.5 Web APIs and Browser APIs](#45-web-apis-and-browser-apis)
   - [4.6 Service Workers](#46-service-workers)
   - [4.7 Web Workers](#47-web-workers)
   - [4.8 Testing](#48-testing)
   - [4.9 TypeScript Fundamentals](#49-typescript-fundamentals)
   - [4.10 Build Tools and Bundlers](#410-build-tools-and-bundlers)

---

## 1. Beginner Concepts

### 1.1 Variables and Data Types

**Definition:**
- **Variable:** A named container used to store and reference data values in memory. It acts as a labeled box where you can put, retrieve, and modify values.
- **Data Type:** A classification that specifies what kind of value a variable holds and what operations can be performed on it. JavaScript has primitive types (stored directly) and reference types (stored as references to objects in memory).

JavaScript has three ways to declare variables: `var`, `let`, and `const`.

```javascript
// var - function-scoped, can be redeclared and updated
var name = "John";

// let - block-scoped, can be updated but not redeclared in same scope
let age = 25;

// const - block-scoped, cannot be updated or redeclared
const PI = 3.14159;
```

**Primitive Data Types:**
- `string` - Text data
- `number` - Integer and floating-point numbers
- `bigint` - Integers larger than 2^53 - 1
- `boolean` - true or false
- `undefined` - Variable declared but not assigned
- `null` - Intentional absence of value
- `symbol` - Unique identifier (ES6)

```javascript
typeof "Hello"        // "string"
typeof 42             // "number"
typeof 10n            // "bigint"
typeof true           // "boolean"
typeof undefined      // "undefined"
typeof null           // "object" (historical bug)
typeof Symbol()       // "symbol"
typeof {}             // "object"
typeof []             // "object"
typeof function(){}   // "function"
```

### 1.2 Operators

**Definition:** Operators are special symbols or keywords that perform operations on one or more values (operands) and produce a result. They are the building blocks of expressions in JavaScript.
- **Unary operators:** Work on a single operand (e.g., `!`, `typeof`, `-`)
- **Binary operators:** Work on two operands (e.g., `+`, `-`, `===`)
- **Ternary operator:** Works on three operands (`condition ? true : false`)

**Arithmetic Operators:**
```javascript
+   // Addition
-   // Subtraction
*   // Multiplication
/   // Division
%   // Modulus (remainder)
**  // Exponentiation
++  // Increment
--  // Decrement
```

**Comparison Operators:**
```javascript
==   // Equal to (loose, performs type coercion)
===  // Strict equal (no type coercion)
!=   // Not equal
!==  // Strict not equal
>    // Greater than
<    // Less than
>=   // Greater than or equal
<=   // Less than or equal
```

**Logical Operators:**
```javascript
&&   // Logical AND
||   // Logical OR
!    // Logical NOT
??   // Nullish coalescing (ES2020)
```

**Assignment Operators:**
```javascript
=    // Assignment
+=   // Add and assign
-=   // Subtract and assign
*=   // Multiply and assign
/=   // Divide and assign
```

### 1.3 Control Flow

**Definition:** Control flow refers to the order in which individual statements, instructions, or function calls are executed or evaluated in a program. By default, code runs top-to-bottom, but control flow structures allow you to make decisions, repeat actions, and branch to different code paths based on conditions.

**If-Else Statements:**
```javascript
if (condition) {
  // executes if condition is true
} else if (anotherCondition) {
  // executes if anotherCondition is true
} else {
  // executes if no condition is true
}
```

**Ternary Operator:**
```javascript
const result = condition ? valueIfTrue : valueIfFalse;
```

**Switch Statement:**
```javascript
switch (expression) {
  case value1:
    // code block
    break;
  case value2:
    // code block
    break;
  default:
    // default code block
}
```

### 1.4 Functions

**Definition:** A function is a reusable block of code designed to perform a specific task. Functions accept input (parameters), process it, and optionally return output. They promote code reusability, modularity, and abstraction by encapsulating logic under a single name that can be called multiple times from different parts of a program.

**Function Declaration:**
```javascript
function greet(name) {
  return `Hello, ${name}!`;
}
```

**Function Expression:**
```javascript
const greet = function(name) {
  return `Hello, ${name}!`;
};
```

**Arrow Functions (ES6):**
```javascript
const greet = (name) => `Hello, ${name}!`;
const add = (a, b) => a + b;
```

**Default Parameters:**
```javascript
function greet(name = "Guest") {
  return `Hello, ${name}!`;
}
```

### 1.5 Arrays

**Definition:** An array is an ordered, indexed collection of values where each element is accessed by a numeric index starting from 0. Arrays are a special type of object in JavaScript and can hold values of any type, including other arrays. They provide built-in methods for adding, removing, iterating, and transforming elements efficiently.

Arrays are ordered collections of values.

```javascript
// Creating arrays
const fruits = ["apple", "banana", "orange"];
const mixed = [1, "hello", true, null];

// Common array methods
fruits.push("grape");          // Add to end
fruits.pop();                  // Remove from end
fruits.unshift("mango");       // Add to beginning
fruits.shift();                // Remove from beginning

fruits.indexOf("banana");      // Find index
fruits.includes("apple");      // Check existence
fruits.slice(1, 3);            // Extract portion
fruits.splice(1, 2);           // Add/remove elements
fruits.join(", ");             // Join to string
fruits.reverse();              // Reverse array
fruits.sort();                 // Sort array

// Iteration methods
fruits.forEach(fruit => console.log(fruit));
const mapped = fruits.map(fruit => fruit.toUpperCase());
const filtered = fruits.filter(fruit => fruit.startsWith("a"));
const reduced = fruits.reduce((acc, fruit) => acc + fruit.length, 0);
const found = fruits.find(fruit => fruit.length > 5);
const every = fruits.every(fruit => fruit.length > 0);
const some = fruits.some(fruit => fruit.startsWith("a"));
```

### 1.6 Objects

**Definition:** An object is a collection of key-value pairs (properties) where each key is a string (or Symbol) and each value can be any data type, including functions (called methods when stored in objects). Objects represent real-world entities and are the fundamental building block of JavaScript, used to group related data and behavior together under a single reference.

Objects store key-value pairs.

```javascript
// Creating objects
const person = {
  name: "John",
  age: 30,
  greet: function() {
    return `Hello, I'm ${this.name}`;
  }
};

// Accessing properties
person.name;           // Dot notation
person["age"];         // Bracket notation

// Adding/updating properties
person.email = "john@example.com";
person.age = 31;

// Deleting properties
delete person.age;

// Object methods
Object.keys(person);           // Get all keys
Object.values(person);         // Get all values
Object.entries(person);        // Get key-value pairs
Object.assign({}, person);     // Shallow copy
Object.freeze(person);         // Prevent modifications
Object.seal(person);           // Prevent adding/removing properties
```

### 1.7 Loops

**Definition:** A loop is a control flow statement that allows a block of code to be executed repeatedly based on a specified condition. Loops automate repetitive tasks by iterating over data structures or executing code a set number of times, eliminating the need to write the same code multiple times.

```javascript
// for loop
for (let i = 0; i < 5; i++) {
  console.log(i);
}

// while loop
let i = 0;
while (i < 5) {
  console.log(i);
  i++;
}

// do...while loop
let j = 0;
do {
  console.log(j);
  j++;
} while (j < 5);

// for...in (objects)
for (let key in person) {
  console.log(`${key}: ${person[key]}`);
}

// for...of (arrays, strings, maps, sets)
for (let fruit of fruits) {
  console.log(fruit);
}
```

### 1.8 Scope

**Definition:** Scope defines the accessibility or visibility of variables, functions, and objects within specific regions of your code during runtime. It determines where a variable can be referenced and prevents naming conflicts. JavaScript has three scope types: global (accessible everywhere), function (accessible only within the function), and block (accessible only within `{}` curly braces for `let` and `const`).

- **Global Scope:** Variables declared outside any function/block
- **Function Scope:** Variables declared with `var` inside a function
- **Block Scope:** Variables declared with `let` or `const` inside `{}`

```javascript
let globalVar = "I'm global";

function example() {
  let functionVar = "I'm in function scope";
  
  if (true) {
    let blockVar = "I'm in block scope";
    console.log(globalVar);     // Accessible
    console.log(functionVar);   // Accessible
  }
  
  console.log(blockVar);  // ReferenceError: not defined
}
```

### 1.9 DOM (Document Object Model)

**Definition:**
- **DOM (Document Object Model):** The DOM is a programming interface (API) provided by the browser that represents an HTML or XML document as a hierarchical tree of objects (nodes). When a browser loads a webpage, it parses the HTML and constructs the DOM tree, where each element, attribute, text content, and comment becomes a node in this tree. JavaScript uses the DOM to dynamically access, modify, add, or delete elements and content on a webpage without requiring a page reload. The DOM acts as a bridge between JavaScript (the programming language) and the HTML (the document structure), enabling interactive and dynamic web applications.

**DOM Tree Structure:**
```
document
└── html
    ├── head
    │   ├── title
    │   └── meta
    └── body
        ├── h1
        ├── p
        └── div
            ├── span
            └── a
```

**Selecting Elements:**
```javascript
// Modern methods (recommended)
document.getElementById("myId");              // Single element by ID
document.querySelector(".myClass");           // First matching element (CSS selector)
document.querySelectorAll("div.item");        // All matching elements (NodeList)

// Legacy methods (still widely used)
document.getElementsByClassName("box");       // HTMLCollection of elements with class
document.getElementsByTagName("p");           // HTMLCollection of all <p> elements
document.getElementsByName("username");       // NodeList of elements with name attribute
```

**Manipulating Elements:**
```javascript
const element = document.querySelector("#example");

// Changing content
element.textContent = "New text";                    // Plain text (safe from XSS)
element.innerHTML = "<strong>Bold text</strong>";    // HTML content (use carefully)
element.outerHTML = "<div>Replaced entirely</div>";  // Replace element itself

// Changing attributes
element.setAttribute("href", "https://example.com");
element.getAttribute("href");        // "https://example.com"
element.removeAttribute("href");
element.hasAttribute("data-id");     // true/false
element.dataset.id = "123";          // Set data-id attribute
element.dataset.id;                  // Get data-id attribute

// Changing styles
element.style.color = "red";
element.style.backgroundColor = "#f0f0f0";
element.style.fontSize = "16px";
element.style.display = "none";

// Adding/removing CSS classes
element.classList.add("active", "highlight");
element.classList.remove("hidden");
element.classList.toggle("visible");
element.classList.contains("active");    // true/false
element.className = "box active large";  // Set all classes at once
```

**Creating and Removing Elements:**
```javascript
// Creating new elements
const newDiv = document.createElement("div");
const newP = document.createElement("p");
newP.textContent = "I'm a new paragraph";
newDiv.classList.add("container");

// Creating text nodes
const textNode = document.createTextNode("Hello World");

// Inserting into the DOM
document.body.appendChild(newDiv);                // Add as last child
document.body.insertBefore(newP, newDiv);         // Insert before a reference
newDiv.append(newP, "More text", textNode);       // Append multiple items
newDiv.prepend(newP);                             // Insert as first child
newDiv.before(newParagraph);                      // Insert before the element
newDiv.after(newParagraph);                       // Insert after the element
newDiv.replaceWith(newElement);                   // Replace element entirely

// Removing elements
element.remove();                                 // Remove element from DOM
element.parentNode.removeChild(element);          // Legacy removal method
newDiv.innerHTML = "";                            // Remove all children
```

**Traversing the DOM:**
```javascript
const item = document.querySelector(".item");

// Parent and child navigation
item.parentNode;            // Direct parent node
item.parentElement;         // Direct parent element (excludes non-element nodes)
item.childNodes;            // All child nodes (includes text, comments)
item.children;              // Only child elements (HTMLCollection)
item.firstChild;            // First child node
item.firstElementChild;     // First child element
item.lastChild;             // Last child node
item.lastElementChild;      // Last child element

// Sibling navigation
item.previousSibling;       // Previous sibling node
item.previousElementSibling;// Previous sibling element
item.nextSibling;           // Next sibling node
item.nextElementSibling;    // Next sibling element

// Iterating over children
item.children.forEach(child => console.log(child));
Array.from(item.children).map(child => child.id);
```

**Event Handling:**
```javascript
const button = document.querySelector("#submitBtn");

// Adding event listeners
button.addEventListener("click", function(event) {
  console.log("Button clicked!", event.target);
});

button.addEventListener("click", (event) => {
  console.log("Clicked at:", event.clientX, event.clientY);
});

// Event object properties
button.addEventListener("click", (e) => {
  e.target;           // Element that triggered the event
  e.currentTarget;    // Element the listener is attached to
  e.preventDefault(); // Prevent default behavior (e.g., form submission)
  e.stopPropagation();// Stop event bubbling to parent elements
  e.type;             // Event type ("click", "submit", etc.)
  e.key;              // Key pressed (for keyboard events)
  e.button;           // Mouse button (0=left, 1=middle, 2=right)
});

// Removing event listeners
function handleClick() {
  console.log("Clicked!");
}
button.addEventListener("click", handleClick);
button.removeEventListener("click", handleClick);

// Common events
// Mouse: click, dblclick, mousedown, mouseup, mousemove, mouseenter, mouseleave, mouseover, mouseout
// Keyboard: keydown, keyup, keypress
// Form: submit, change, input, focus, blur, reset
// Window: load, resize, scroll, unload, beforeunload
// Touch: touchstart, touchmove, touchend, touchcancel
// Drag: drag, dragstart, dragend, dragover, drop
```

**Event Delegation:**
```javascript
// Instead of attaching listeners to every child item
// Attach one listener to the parent and use event.target

const list = document.querySelector("#itemList");

list.addEventListener("click", (event) => {
  if (event.target.matches("li")) {
    console.log("Clicked item:", event.target.textContent);
  }
  
  if (event.target.matches(".delete-btn")) {
    event.target.closest("li").remove();
  }
});

// Benefits: memory efficient, works for dynamically added elements, cleaner code
```

**Working with Forms:**
```javascript
const form = document.querySelector("#myForm");

// Accessing form elements
const input = form.elements["username"];
const inputById = document.querySelector("#username");

// Getting values
const value = input.value;
const checked = document.querySelector("#agree").checked;
const selected = document.querySelector("#dropdown").value;

// Form submission
form.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent page reload
  
  const formData = new FormData(form);
  const name = formData.get("username");
  const email = formData.get("email");
  
  // Process form data
  console.log(name, email);
  
  // Reset form
  form.reset();
});

// Validation
input.setCustomValidity("Invalid input");
input.checkValidity();
input.reportValidity();
```

**DOM Measurements and Positioning:**
```javascript
const element = document.querySelector("#box");

// Dimensions (including padding, border, margin)
element.offsetWidth;           // Width including padding and border
element.offsetHeight;          // Height including padding and border
element.clientWidth;           // Width including padding (excluding border)
element.clientHeight;          // Height including padding (excluding border)
element.scrollWidth;           // Total width including overflow
element.scrollHeight;          // Total height including overflow

// Position relative to viewport
element.getBoundingClientRect();
// Returns: { top, right, bottom, left, width, height, x, y }

const rect = element.getBoundingClientRect();
console.log(rect.top);    // Distance from top of viewport
console.log(rect.left);   // Distance from left of viewport

// Scroll position
window.scrollX;            // Horizontal scroll offset
window.scrollY;            // Vertical scroll offset
window.scrollTo(0, 500);   // Scroll to position
window.scrollBy(0, 100);   // Scroll by amount
element.scrollTop;         // Element's vertical scroll position
element.scrollIntoView();  // Scroll element into view
```

**Performance Best Practices:**
```javascript
// 1. Cache DOM references (avoid repeated queries)
const header = document.querySelector("#header");
const menu = document.querySelector("#menu");
// Use header and menu instead of querying again

// 2. Use DocumentFragment for multiple insertions
const fragment = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
  const li = document.createElement("li");
  li.textContent = `Item ${i}`;
  fragment.appendChild(li);
}
document.querySelector("#list").appendChild(fragment); // Single reflow

// 3. Batch DOM reads and writes
// Bad (causes layout thrashing)
const width = element.offsetWidth;
element.style.width = (width + 10) + "px";
const height = element.offsetHeight;
element.style.height = (height + 10) + "px";

// Good (reads first, then writes)
const width = element.offsetWidth;
const height = element.offsetHeight;
element.style.width = (width + 10) + "px";
element.style.height = (height + 10) + "px";

// 4. Use classList instead of inline styles
element.classList.add("hidden");  // Better
element.style.display = "none";   // Worse (harder to maintain)

// 5. Use requestAnimationFrame for animations
function animate() {
  // Update animation frame
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```

---

## 2. Intermediate Concepts

### 2.1 Closures

**Definition:** A closure is a function that retains access to variables from its outer (enclosing) lexical scope even after the outer function has finished executing. Closures are created automatically when a function is defined inside another function, and they enable data privacy, function factories, and stateful behavior by "remembering" the environment in which they were created.

A closure is a function that remembers its outer variables and can access them even after the outer function has finished executing.

```javascript
function outer() {
  let count = 0;
  
  return function inner() {
    count++;
    return count;
  };
}

const counter = outer();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
```

**Practical Use Cases:**
- Data privacy and encapsulation
- Function factories
- Currying
- Maintaining state in async operations

### 2.2 Higher-Order Functions

**Definition:** A higher-order function is a function that either takes one or more functions as arguments (callbacks), returns a function as its result, or does both. This concept treats functions as first-class citizens, enabling powerful programming patterns like function composition, decorators, and functional programming paradigms.

Functions that take other functions as arguments or return functions.

```javascript
// Function as argument
function operate(a, b, operation) {
  return operation(a, b);
}

const add = (a, b) => a + b;
operate(5, 3, add); // 8

// Function returning function
function multiplier(factor) {
  return (number) => number * factor;
}

const double = multiplier(2);
const triple = multiplier(3);

double(5); // 10
triple(5); // 15
```

### 2.3 Callbacks

**Definition:** A callback is a function passed as an argument to another function, designed to be executed (called back) after some operation completes, either synchronously or asynchronously. Callbacks are the foundational mechanism for handling asynchronous operations in JavaScript before the introduction of Promises and async/await, enabling non-blocking code execution.

A callback is a function passed as an argument to another function, executed after some operation completes.

```javascript
// Synchronous callback
function processData(data, callback) {
  const result = data.map(item => item * 2);
  callback(result);
}

processData([1, 2, 3], (result) => {
  console.log(result); // [2, 4, 6]
});

// Asynchronous callback
function fetchData(callback) {
  setTimeout(() => {
    callback("Data received");
  }, 1000);
}

fetchData((data) => {
  console.log(data);
});
```

**Callback Hell Problem:**
```javascript
// Nested callbacks become hard to read
getData(function(a) {
  getMoreData(a, function(b) {
    getMoreData(b, function(c) {
      getMoreData(c, function(d) {
        console.log(d);
      });
    });
  });
});
```

### 2.4 Promises

**Definition:** A Promise is an object representing the eventual completion (or failure) of an asynchronous operation and its resulting value. A Promise has three states: `pending` (initial state, operation not completed), `fulfilled` (operation completed successfully), and `rejected` (operation failed). Promises provide a cleaner, more manageable alternative to callbacks for handling asynchronous code, avoiding "callback hell" through chainable `.then()` and `.catch()` methods.

Promises represent a value that may be available now, later, or never.

```javascript
// Creating a promise
const myPromise = new Promise((resolve, reject) => {
  const success = true;
  
  if (success) {
    resolve("Operation successful!");
  } else {
    reject("Operation failed!");
  }
});

// Consuming a promise
myPromise
  .then((result) => console.log(result))
  .catch((error) => console.error(error))
  .finally(() => console.log("Promise settled"));
```

**Promise Methods:**
```javascript
// Promise.all - resolves when all promises resolve
Promise.all([promise1, promise2, promise3])
  .then(results => console.log(results));

// Promise.race - resolves when first promise settles
Promise.race([promise1, promise2])
  .then(result => console.log(result));

// Promise.allSettled - resolves when all promises settle
Promise.allSettled([promise1, promise2])
  .then(results => console.log(results));

// Promise.any - resolves when first promise resolves
Promise.any([promise1, promise2])
  .then(result => console.log(result));
```

**Chaining Promises:**
```javascript
fetchUser(id)
  .then(user => fetchPosts(user.id))
  .then(posts => fetchComments(posts[0].id))
  .then(comments => console.log(comments))
  .catch(error => console.error(error));
```

### 2.5 Async/Await

**Definition:** Async/await is syntactic sugar built on top of Promises that allows you to write asynchronous code in a synchronous-looking style. The `async` keyword marks a function as asynchronous, guaranteeing it returns a Promise. The `await` keyword pauses execution inside an async function until a Promise settles (resolves or rejects), making asynchronous code easier to read, write, and debug without chaining `.then()` calls.

Syntactic sugar over promises for cleaner async code.

```javascript
// Basic usage
async function fetchData() {
  try {
    const response = await fetch("https://api.example.com/data");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// Parallel execution
async function fetchAll() {
  const [users, posts, comments] = await Promise.all([
    fetch("/api/users").then(r => r.json()),
    fetch("/api/posts").then(r => r.json()),
    fetch("/api/comments").then(r => r.json())
  ]);
  
  return { users, posts, comments };
}

// Sequential vs Parallel
// Sequential (slower)
async function sequential() {
  const user = await fetchUser(1);
  const posts = await fetchPosts(user.id);
  return posts;
}

// Parallel (faster)
async function parallel() {
  const [user, posts] = await Promise.all([
    fetchUser(1),
    fetchPosts(1)
  ]);
  return { user, posts };
}
```

### 2.6 Prototypes and Prototypal Inheritance

**Definition:** A prototype is an internal object that every JavaScript object inherits properties and methods from. Prototypal inheritance is JavaScript's mechanism for sharing behavior between objects, where an object can delegate property lookups to its prototype chain. Unlike classical inheritance (class-based), JavaScript uses a prototype-based model where objects inherit directly from other objects, forming a chain that ultimately leads to `Object.prototype`.

Every JavaScript object has a prototype object from which it inherits properties and methods.

```javascript
// Constructor function
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// Adding method to prototype
Person.prototype.greet = function() {
  return `Hello, I'm ${this.name}`;
};

const john = new Person("John", 30);
john.greet(); // "Hello, I'm John"

// Prototype chain
console.log(john.__proto__ === Person.prototype);        // true
console.log(Person.prototype.__proto__ === Object.prototype); // true
```

**Object.create():**
```javascript
const animal = {
  speak() {
    console.log(`${this.name} makes a sound`);
  }
};

const dog = Object.create(animal);
dog.name = "Buddy";
dog.speak(); // "Buddy makes a sound"
```

### 2.7 Classes and OOP

**Definition:** A class is a blueprint or template for creating objects that share the same properties and methods. Object-Oriented Programming (OOP) is a programming paradigm based on four pillars: encapsulation (bundling data and methods), inheritance (deriving new classes from existing ones), abstraction (hiding complex details), and polymorphism (same interface, different implementations). ES6 introduced class syntax as syntactic sugar over JavaScript's prototype-based inheritance, providing a more familiar OOP pattern.

ES6 introduced class syntax as syntactic sugar over prototypes.

```javascript
// Class definition
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    console.log(`${this.name} makes a sound`);
  }
  
  // Static method
  static describe() {
    return "This is an Animal class";
  }
  
  // Getter
  get description() {
    return `Animal: ${this.name}`;
  }
  
  // Setter
  set newName(name) {
    this.name = name;
  }
}

// Inheritance
class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
  
  // Method override
  speak() {
    console.log(`${this.name} barks`);
  }
}

const dog = new Dog("Buddy", "Labrador");
dog.speak();          // "Buddy barks"
dog.description;      // "Animal: Buddy"
Animal.describe();    // "This is an Animal class"
```

### 2.8 Error Handling

**Definition:** Error handling is the process of detecting, catching, and responding to runtime errors or exceptions that occur during program execution. It prevents your application from crashing unexpectedly by gracefully managing failure states. JavaScript provides the `try...catch...finally` block for synchronous error handling, and `.catch()` or `try...catch` for asynchronous error handling, allowing developers to define fallback behavior, log errors, and clean up resources.

```javascript
// try...catch...finally
try {
  // Code that may throw an error
  const result = JSON.parse("invalid json");
} catch (error) {
  console.error("Caught:", error.message);
} finally {
  console.log("This always runs");
}

// Throwing custom errors
function divide(a, b) {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
}

// Custom error class
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

// Async error handling
async function fetchData() {
  try {
    const response = await fetch("https://api.example.com/data");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
}
```

### 2.9 ES6+ Features

**Definition:** ES6 (ECMAScript 2015) and subsequent versions introduced major enhancements to JavaScript, adding modern syntax and capabilities that improve developer productivity and code readability. These features include template literals, destructuring, spread/rest operators, arrow functions, optional chaining, nullish coalescing, computed property names, and more. Collectively, they modernized JavaScript into a powerful, expressive language for both frontend and backend development.

**Template Literals:**
```javascript
const name = "John";
const greeting = `Hello, ${name}! Welcome to JavaScript.`;
```

**Destructuring:**
```javascript
// Array destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];

// Object destructuring
const { name, age, email = "no@email.com" } = person;

// Nested destructuring
const { address: { city, state } } = user;

// Function parameters
function greet({ name, age }) {
  console.log(`${name} is ${age}`);
}
```

**Spread and Rest Operators:**
```javascript
// Spread operator
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5];  // [1, 2, 3, 4, 5]

const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 };

// Rest parameters
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}
sum(1, 2, 3, 4); // 10
```

**Optional Chaining (ES2020):**
```javascript
const city = user?.address?.city;
const firstName = users?.[0]?.name;
```

**Nullish Coalescing (ES2020):**
```javascript
const value = input ?? "default";  // Only if input is null or undefined
const value = input || "default";  // If input is falsy (0, "", false, null, undefined)
```

**Object Property Shorthand:**
```javascript
const name = "John";
const age = 30;

const person = { name, age };  // { name: "John", age: 30 }
```

**Computed Property Names:**
```javascript
const key = "dynamicKey";
const obj = {
  [key]: "value"
};
```

### 2.10 Modules

**Definition:** A module is a self-contained unit of code that encapsulates related functionality and can export values (functions, objects, variables) to be imported and used in other files. Modules enable code organization, reusability, and separation of concerns by breaking large codebases into smaller, manageable pieces. JavaScript supports two module systems: ES Modules (ESM) using `import`/`export` syntax (modern standard) and CommonJS using `require()`/`module.exports` (Node.js legacy).

**ES Modules (ESM):**
```javascript
// math.js - Exporting
export const PI = 3.14159;
export function add(a, b) { return a + b; }
export default function multiply(a, b) { return a * b; }

// app.js - Importing
import multiply, { PI, add } from "./math.js";
import * as Math from "./math.js";
```

**CommonJS (Node.js):**
```javascript
// math.js - Exporting
const PI = 3.14159;
function add(a, b) { return a + b; }

module.exports = { PI, add };

// app.js - Importing
const { PI, add } = require("./math");
```

---

## 3. Advanced Concepts

### 3.1 Event Loop

**Definition:** The event loop is a continuous monitoring mechanism in JavaScript's runtime that manages the execution of code by coordinating the call stack, Web APIs, and task queues. Since JavaScript is single-threaded (can only do one thing at a time), the event loop enables non-blocking behavior by offloading asynchronous operations to browser APIs, queuing their callbacks, and pushing them onto the call stack only when the stack is empty. It processes microtasks (Promises) before macrotasks (setTimeout), ensuring predictable async execution order.

```
┌───────────────────────┐
│       Call Stack       │
└───────────────────────┘
         │
         ▼
┌───────────────────────┐
│      Web APIs          │  (setTimeout, DOM events, fetch, etc.)
└───────────────────────┘
         │
         ▼
┌───────────────────────┐
│    Callback Queue      │  (Macrotask Queue)
│    Microtask Queue     │  (Promises, MutationObserver)
└───────────────────────┘
         │
         ▼
┌───────────────────────┐
│      Event Loop        │  (Checks if call stack is empty)
└───────────────────────┘
```

**Execution Order:**
1. Synchronous code runs first (Call Stack)
2. Microtasks run (Promises, queueMicrotask)
3. Macrotasks run (setTimeout, setInterval, I/O)

```javascript
console.log("1. Synchronous");

setTimeout(() => console.log("2. setTimeout"), 0);

Promise.resolve().then(() => console.log("3. Promise"));

console.log("4. Synchronous");

// Output: 1, 4, 3, 2
```

### 3.2 Execution Context and Call Stack

**Definition:**
- **Execution Context:** An abstract environment that contains the information needed for executing a piece of JavaScript code, including the variable object (variables, functions, arguments), the scope chain (access to outer variables), and the `this` binding. Every time code runs, it runs inside an execution context.
- **Call Stack:** A LIFO (Last In, First Out) data structure that the JavaScript engine uses to track and manage function execution. When a function is called, it is pushed onto the stack; when it returns, it is popped off. The stack ensures functions execute in the correct order and prevents infinite recursion from causing a "Maximum call stack size exceeded" error.

```javascript
// Global Execution Context is created first
var globalVar = "I'm global";

function outer() {
  var outerVar = "I'm outer";
  
  function inner() {
    var innerVar = "I'm inner";
    console.log(globalVar, outerVar, innerVar);
  }
  
  inner();
}

outer();
```

**Call Stack:** LIFO structure that tracks function execution.

```
Execution Flow:
1. Global context pushed
2. outer() called -> pushed to stack
3. inner() called -> pushed to stack
4. inner() completes -> popped from stack
5. outer() completes -> popped from stack
6. Global context remains
```

### 3.3 Hoisting

**Definition:** Hoisting is JavaScript's default behavior of moving variable declarations (`var`), function declarations, and class declarations to the top of their containing scope during the compilation phase, before the code is executed. Only declarations are hoisted, not initializations. Function declarations are fully hoisted (name and body), while `var` variables are hoisted but initialized to `undefined`. `let` and `const` are also hoisted but remain in a "Temporal Dead Zone" (TDZ) until their actual declaration is reached, causing a ReferenceError if accessed early.

Variables and function declarations are moved to the top of their scope during compilation.

```javascript
// Function declarations are fully hoisted
greet(); // Works! "Hello"
function greet() {
  console.log("Hello");
}

// var declarations are hoisted but not initialized
console.log(x); // undefined
var x = 5;

// let and const are hoisted but in "Temporal Dead Zone"
console.log(y); // ReferenceError
let y = 10;

// Function expressions are not hoisted
sayHi(); // TypeError
const sayHi = function() {
  console.log("Hi");
};
```

### 3.4 The `this` Keyword

**Definition:** The `this` keyword is a special reference variable that points to the object that is currently executing the function. Its value is determined at runtime based on how a function is called, not where it is defined. In the global context, `this` refers to the global object (`window` in browsers, `global` in Node.js). In a method, `this` refers to the owning object. In a constructor, `this` refers to the newly created instance. Arrow functions do not have their own `this` and inherit it from the enclosing lexical scope.

```javascript
// Global context
console.log(this); // Window (browser) or global (Node.js)

// Object method
const obj = {
  name: "John",
  greet() {
    console.log(this.name); // "John"
  }
};

// Standalone function (strict mode)
function show() {
  console.log(this); // undefined (strict) or Window (non-strict)
}

// Constructor
function Person(name) {
  this.name = name;
}
const p = new Person("John");

// Arrow functions inherit `this` from enclosing scope
const outer = {
  name: "Outer",
  greet: function() {
    const inner = () => {
      console.log(this.name); // "Outer" (inherits from greet)
    };
    inner();
  }
};

// Event handler
button.addEventListener("click", function() {
  console.log(this); // The button element
});
```

### 3.5 Call, Apply, and Bind

**Definition:** `call`, `apply`, and `bind` are built-in JavaScript methods available on all functions that allow you to explicitly set the value of `this` when invoking a function, regardless of how the function is called.
- **`call()`:** Invokes the function immediately with a specified `this` value and individual arguments passed one by one.
- **`apply()`:** Invokes the function immediately with a specified `this` value and arguments passed as an array (or array-like object).
- **`bind()`:** Returns a new function with `this` permanently bound to a specified value, without invoking the original function. Useful for preserving context in callbacks and event handlers.

```javascript
const person = {
  name: "John",
  greet(greeting, punctuation) {
    return `${greeting}, I'm ${this.name}${punctuation}`;
  }
};

const otherPerson = { name: "Jane" };

// call - invokes function with `this` and individual arguments
person.greet.call(otherPerson, "Hello", "!"); // "Hello, I'm Jane!"

// apply - invokes function with `this` and array of arguments
person.greet.apply(otherPerson, ["Hi", "."]); // "Hi, I'm Jane."

// bind - returns new function with bound `this`
const greetJane = person.greet.bind(otherPerson);
greetJane("Hey", "!"); // "Hey, I'm Jane!"
```

### 3.6 Currying

**Definition:** Currying is a functional programming technique that transforms a function taking multiple arguments into a sequence of functions, each accepting a single argument. Instead of calling `fn(a, b, c)`, you call `fn(a)(b)(c)`. This enables partial application (pre-filling some arguments to create specialized functions), improves function composition, and promotes code reusability by creating factories of functions with preset parameters.

Transforming a function with multiple arguments into a sequence of functions.

```javascript
// Regular function
function multiply(a, b, c) {
  return a * b * c;
}

// Curried version
function curriedMultiply(a) {
  return function(b) {
    return function(c) {
      return a * b * c;
    };
  };
}

// Arrow function curried version
const curriedMultiply = a => b => c => a * b * c;

curriedMultiply(2)(3)(4); // 24

// Practical example
const add = a => b => a + b;
const addTen = add(10);
addTen(5);  // 15
addTen(20); // 30
```

### 3.7 Memoization

**Definition:** Memoization is a performance optimization technique that caches the results of expensive function calls based on their input arguments. When a memoized function is called with the same inputs again, it returns the cached result instead of recomputing, significantly improving performance for pure functions with repetitive calls. It is a form of caching specific to function results, commonly used in dynamic programming, recursive algorithms, and expensive computations.

Caching function results to avoid redundant calculations.

```javascript
function memoize(fn) {
  const cache = new Map();
  
  return function(...args) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

// Example: Expensive calculation
const fibonacci = memoize(function(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});

fibonacci(100); // Instant after first calculation
```

### 3.8 Debounce and Throttle

**Definition:**
- **Debounce:** A technique that ensures a function is not called until a specified amount of time has elapsed since the last invocation. If the function is called again before the delay expires, the timer resets. This is ideal for scenarios like search input filtering, where you only want to execute after the user stops typing.
- **Throttle:** A technique that ensures a function is called at most once within a specified time interval, regardless of how many times it is triggered. This is ideal for scenarios like scroll or resize events, where you want to limit execution frequency without waiting for the activity to stop.

```javascript
function debounce(fn, delay) {
  let timeoutId;
  
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Usage: Search input
const searchInput = document.getElementById("search");
searchInput.addEventListener("input", debounce((e) => {
  fetchResults(e.target.value);
}, 300));
```

**Throttle:** Ensures a function is called at most once in a specified time period.

```javascript
function throttle(fn, limit) {
  let inThrottle;
  
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Usage: Scroll event
window.addEventListener("scroll", throttle(() => {
  console.log("Scroll position:", window.scrollY);
}, 100));
```

### 3.9 Generators and Iterators

**Definition:**
- **Iterator:** An object that implements a `next()` method, returning an object with `value` and `done` properties. It defines a standard way to sequentially access elements from a collection, enabling `for...of` loops.
- **Generator:** A special function declared with `function*` that can pause execution (using `yield`) and resume later, producing a sequence of values on demand instead of computing them all at once. Generators automatically implement the iterator protocol, making them memory-efficient for handling large or infinite data streams.

```javascript
function* numberGenerator() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = numberGenerator();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }

// Infinite sequence
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

const fib = fibonacci();
console.log(fib.next().value); // 0
console.log(fib.next().value); // 1
console.log(fib.next().value); // 1
console.log(fib.next().value); // 2
```

**Custom Iterators:**
```javascript
const iterable = {
  [Symbol.iterator]() {
    let count = 0;
    return {
      next() {
        if (count < 3) {
          return { value: count++, done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
};

for (let item of iterable) {
  console.log(item); // 0, 1, 2
}
```

### 3.10 Proxies and Reflect

**Definition:**
- **Proxy:** A built-in object that wraps a target object and intercepts fundamental operations (like property access, assignment, enumeration, function invocation) through customizable "traps." Proxies enable meta-programming by allowing you to define custom behavior for basic operations, used for validation, logging, data binding, and reactive programming.
- **Reflect:** A built-in object that provides methods for interceptable JavaScript operations, mirroring the same traps available in Proxy handlers. Unlike Proxy, Reflect methods return values instead of throwing errors in some cases, and it provides a consistent, functional API for operations that were previously done with operators.

```javascript
const handler = {
  get(target, prop) {
    console.log(`Getting ${prop}`);
    return prop in target ? target[prop] : "Not found";
  },
  
  set(target, prop, value) {
    console.log(`Setting ${prop} to ${value}`);
    if (prop === "age" && typeof value !== "number") {
      throw new TypeError("Age must be a number");
    }
    target[prop] = value;
    return true;
  },
  
  has(target, prop) {
    console.log(`Checking if ${prop} exists`);
    return prop in target;
  },
  
  deleteProperty(target, prop) {
    console.log(`Deleting ${prop}`);
    delete target[prop];
    return true;
  }
};

const person = new Proxy({ name: "John", age: 30 }, handler);
console.log(person.name);    // "Getting name" -> "John"
console.log(person.email);   // "Getting email" -> "Not found"
person.age = "thirty";       // TypeError
```

**Reflect:** Built-in object for interceptable JavaScript operations.

```javascript
const obj = { x: 1, y: 2 };

Reflect.get(obj, "x");          // 1
Reflect.set(obj, "z", 3);       // true
Reflect.has(obj, "y");          // true
Reflect.deleteProperty(obj, "y"); // true
Reflect.ownKeys(obj);           // ["x", "z"]
```

### 3.11 Symbols

**Definition:** A Symbol is a unique and immutable primitive value introduced in ES6 that is guaranteed to be distinct from every other Symbol, even if created with the same description. Symbols are primarily used as unique property keys for objects, preventing naming collisions and enabling "hidden" properties that do not appear in `for...in` loops, `Object.keys()`, or `JSON.stringify()`. Well-known symbols (like `Symbol.iterator`, `Symbol.toStringTag`) allow customization of built-in language behaviors.

```javascript
// Creating symbols
const sym1 = Symbol("description");
const sym2 = Symbol("description");
console.log(sym1 === sym2); // false

// Symbol.for - global symbol registry
const sym3 = Symbol.for("shared");
const sym4 = Symbol.for("shared");
console.log(sym3 === sym4); // true

// Using symbols as property keys
const id = Symbol("id");
const user = {
  name: "John",
  [id]: 12345
};

console.log(user[id]); // 12345
console.log(Object.keys(user)); // ["name"] (symbols not enumerable)

// Well-known symbols
class CustomArray extends Array {
  [Symbol.hasInstance](instance) {
    return Array.isArray(instance);
  }
  
  [Symbol.toStringTag] = "CustomArray";
}

// Symbol.iterator for custom iterables
const myIterable = {
  [Symbol.iterator]() {
    let i = 0;
    return {
      next() {
        if (i < 3) return { value: i++, done: false };
        return { done: true };
      }
    };
  }
};
```

### 3.12 WeakMap and WeakSet

**Definition:**
- **WeakMap:** A collection of key-value pairs where keys must be objects and are held as weak references, meaning they do not prevent garbage collection. When a key object is no longer referenced elsewhere, the WeakMap entry is automatically removed. This makes WeakMap ideal for storing private metadata associated with objects without causing memory leaks.
- **WeakSet:** A collection that holds only objects as weak references. Like WeakMap, objects in a WeakSet can be garbage collected when no other references exist. Unlike Set, WeakSet is not iterable and does not expose its contents, making it useful for tracking objects (e.g., marking DOM elements that have been processed).

```javascript
// WeakMap - keys must be objects
const weakMap = new WeakMap();
let obj = { name: "John" };

weakMap.set(obj, "secret data");
console.log(weakMap.get(obj)); // "secret data"

obj = null; // obj can now be garbage collected

// WeakSet - stores weak object references
const weakSet = new WeakSet();
let item = { id: 1 };

weakSet.add(item);
console.log(weakSet.has(item)); // true

item = null; // item can now be garbage collected

// Practical use: Private data storage
const privateData = new WeakMap();

class Person {
  constructor(name) {
    privateData.set(this, { name, createdAt: new Date() });
  }
  
  getName() {
    return privateData.get(this).name;
  }
}
```

### 3.13 Map and Set

**Definition:**
- **Map:** An ordered collection of key-value pairs where keys can be of any type (objects, primitives, functions). Unlike plain objects, Maps preserve insertion order, allow any type as a key, provide a `size` property, and are optimized for frequent additions and removals. Maps are iterable and perform better than objects when used as dictionaries.
- **Set:** An ordered collection of unique values of any type. Sets automatically eliminate duplicates and provide efficient methods for checking existence (`has()`), adding (`add()`), and removing (`delete()`) values. Sets are iterable and ideal for membership testing and mathematical set operations (union, intersection, difference).

```javascript
const map = new Map();

map.set("key1", "value1");
map.set(1, "number key");
map.set(true, "boolean key");
map.set({ obj: true }, "object key");

map.get("key1");       // "value1"
map.has("key1");       // true
map.delete("key1");    // true
map.size;              // 3

// Iteration
for (let [key, value] of map) {
  console.log(`${key} => ${value}`);
}

// Convert to/from objects
const obj = Object.fromEntries(map);
const map2 = new Map(Object.entries(obj));
```

**Set:** Collection of unique values.

```javascript
const set = new Set([1, 2, 3, 3, 4, 4]);
console.log(set); // Set(4) { 1, 2, 3, 4 }

set.add(5);
set.has(5);       // true
set.delete(5);    // true
set.size;         // 4

// Remove duplicates from array
const unique = [...new Set([1, 2, 2, 3, 3, 4])]; // [1, 2, 3, 4]

// Set operations
const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);

// Union
const union = new Set([...a, ...b]); // {1, 2, 3, 4}

// Intersection
const intersection = new Set([...a].filter(x => b.has(x))); // {2, 3}

// Difference
const difference = new Set([...a].filter(x => !b.has(x))); // {1}
```

---

## 4. Professional Concepts

### 4.1 Design Patterns

**Definition:** Design patterns are proven, reusable solutions to common software design problems. They represent best practices evolved through experience that address specific architectural challenges in a structured, maintainable way. Design patterns are not code snippets but templates or blueprints that can be adapted to different situations. They are categorized into three types: Creational (object creation mechanisms), Structural (class and object composition), and Behavioral (communication between objects).
```javascript
const Counter = (() => {
  let count = 0; // Private
  
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count
  };
})();

Counter.increment();
Counter.getCount(); // 1
```

**Singleton Pattern:**
```javascript
class Singleton {
  constructor() {
    if (Singleton.instance) {
      return Singleton.instance;
    }
    this.data = [];
    Singleton.instance = this;
  }
  
  add(item) {
    this.data.push(item);
  }
}

const instance1 = new Singleton();
const instance2 = new Singleton();
console.log(instance1 === instance2); // true
```

**Factory Pattern:**
```javascript
class User {
  constructor(name, role) {
    this.name = name;
    this.role = role;
  }
}

class UserFactory {
  static createUser(name, role) {
    return new User(name, role);
  }
  
  static createAdmin(name) {
    return this.createUser(name, "admin");
  }
  
  static createGuest(name) {
    return this.createUser(name, "guest");
  }
}

const admin = UserFactory.createAdmin("John");
```

**Observer Pattern:**
```javascript
class EventEmitter {
  constructor() {
    this.events = new Map();
  }
  
  on(event, listener) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push(listener);
    
    return () => this.off(event, listener);
  }
  
  off(event, listener) {
    const listeners = this.events.get(event);
    if (listeners) {
      this.events.set(event, listeners.filter(l => l !== listener));
    }
  }
  
  emit(event, ...args) {
    const listeners = this.events.get(event);
    if (listeners) {
      listeners.forEach(listener => listener(...args));
    }
  }
}

const emitter = new EventEmitter();
emitter.on("data", (data) => console.log("Received:", data));
emitter.emit("data", { id: 1 });
```

**Strategy Pattern:**
```javascript
class PaymentStrategy {
  pay(amount) {
    throw new Error("Must implement pay()");
  }
}

class CreditCardPayment extends PaymentStrategy {
  pay(amount) {
    console.log(`Paid $${amount} via Credit Card`);
  }
}

class PayPalPayment extends PaymentStrategy {
  pay(amount) {
    console.log(`Paid $${amount} via PayPal`);
  }
}

class ShoppingCart {
  constructor(paymentStrategy) {
    this.paymentStrategy = paymentStrategy;
  }
  
  checkout(amount) {
    this.paymentStrategy.pay(amount);
  }
}
```

### 4.2 Functional Programming

**Definition:** Functional Programming (FP) is a programming paradigm that treats computation as the evaluation of pure mathematical functions and avoids changing state and mutable data. Key principles include:
- **Pure Functions:** Functions that always return the same output for the same input and have no side effects.
- **Immutability:** Data is never modified after creation; new data structures are returned instead.
- **Function Composition:** Building complex behavior by combining simple functions.
- **First-Class Functions:** Functions can be assigned to variables, passed as arguments, and returned from other functions.
- **Declarative Style:** Describing what to do rather than how to do it, improving readability and predictability.
```javascript
// Pure - same input always gives same output, no side effects
const add = (a, b) => a + b;

// Impure - depends on external state
let tax = 0.1;
const calculateTax = (price) => price * tax;
```

**Immutability:**
```javascript
// Instead of mutating, create new objects
const arr = [1, 2, 3];

// Bad (mutation)
arr.push(4);

// Good (immutability)
const newArr = [...arr, 4];

// Object
const obj = { a: 1, b: 2 };
const newObj = { ...obj, c: 3 };
```

**Function Composition:**
```javascript
const compose = (...fns) => (x) => fns.reduceRight((acc, fn) => fn(acc), x);
const pipe = (...fns) => (x) => fns.reduce((acc, fn) => fn(acc), x);

const double = x => x * 2;
const addTen = x => x + 10;
const square = x => x * x;

const transform = pipe(double, addTen, square);
transform(5); // ((5 * 2) + 10)^2 = 400
```

**Partial Application:**
```javascript
const partial = (fn, ...presetArgs) => (...laterArgs) => fn(...presetArgs, ...laterArgs);

const add = (a, b, c) => a + b + c;
const addFive = partial(add, 5);
addFive(10, 15); // 30
```

### 4.3 Memory Management and Garbage Collection

**Definition:** Memory management refers to the process of allocating memory for variables and objects during program execution and reclaiming memory when it is no longer needed. JavaScript uses automatic garbage collection via the **mark-and-sweep algorithm**, which identifies objects that are no longer reachable from the root (global object) and frees their memory. Memory leaks occur when references to unused objects are unintentionally retained, preventing garbage collection and degrading application performance over time.

**Memory Leaks to Avoid:**

```javascript
// 1. Accidental globals
function leak() {
  leakedVar = "I'm a global"; // Forgot var/let/const
}

// 2. Forgotten timers/callbacks
const intervalId = setInterval(() => {
  // Runs forever if not cleared
}, 1000);
clearInterval(intervalId); // Clean up

// 3. Out-of-DOM references
const elements = [];
function addElement() {
  const el = document.createElement("div");
  elements.push(el);
}
// elements keep DOM nodes in memory even after removal

// 4. Closures holding references
function createLeak() {
  const largeData = new Array(1000000).fill("data");
  return function() {
    return "I hold largeData in scope";
  };
}
```

**WeakRef for explicit weak references:**
```javascript
const weakRef = new WeakRef(largeObject);

// Access the object
const obj = weakRef.deref();
if (obj) {
  console.log("Object still exists");
} else {
  console.log("Object was garbage collected");
}
```

### 4.4 Performance Optimization

**Definition:** Performance optimization is the practice of improving the speed, efficiency, and resource usage of JavaScript applications. It involves identifying and eliminating bottlenecks in code execution, DOM manipulation, network requests, and rendering. Key areas include reducing reflows and repaints, minimizing bundle size, lazy loading resources, debouncing/throttling frequent operations, using efficient algorithms, and measuring performance using Web Vitals (LCP, FID, CLS) to ensure optimal user experience.

**Virtual DOM (concept):**
- Minimize direct DOM manipulation
- Batch DOM updates
- Use document fragments

```javascript
// Bad: Multiple DOM writes
const list = document.getElementById("list");
for (let i = 0; i < 1000; i++) {
  const item = document.createElement("li");
  item.textContent = i;
  list.appendChild(item); // Triggers reflow each time
}

// Good: DocumentFragment
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const item = document.createElement("li");
  item.textContent = i;
  fragment.appendChild(item);
}
list.appendChild(fragment); // Single reflow
```

**RequestAnimationFrame:**
```javascript
function animate() {
  // Update animation
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```

**Web Vitals Metrics:**
```javascript
// Largest Contentful Paint (LCP)
new PerformanceObserver((list) => {
  const entries = list.getEntries();
  console.log("LCP:", entries[entries.length - 1]);
}).observe({ type: "largest-contentful-paint", buffered: true });

// First Input Delay (FID)
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log("FID:", entry.processingStart - entry.startTime);
  }
}).observe({ type: "first-input", buffered: true });

// Cumulative Layout Shift (CLS)
let clsValue = 0;
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    clsValue += entry.value;
  }
  console.log("CLS:", clsValue);
}).observe({ type: "layout-shift", buffered: true });
```

### 4.5 Web APIs and Browser APIs

**Definition:** Web APIs (Application Programming Interfaces) are built-in browser-provided interfaces that extend JavaScript's capabilities beyond the core language, enabling interaction with browser features, hardware, and network services. These APIs include the Fetch API for HTTP requests, DOM API for manipulating HTML, LocalStorage/SessionStorage for data persistence, Geolocation API for location services, Intersection Observer for scroll-based interactions, Canvas API for graphics, Web Audio API for sound processing, and many others. They transform JavaScript from a scripting language into a full-featured application platform.
```javascript
// GET request
fetch("https://api.example.com/data")
  .then(response => {
    if (!response.ok) throw new Error("Network error");
    return response.json();
  })
  .then(data => console.log(data))
  .catch(error => console.error(error));

// POST request
fetch("https://api.example.com/data", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "John" })
});

// With async/await
async function getData() {
  const response = await fetch("https://api.example.com/data");
  return await response.json();
}
```

**LocalStorage and SessionStorage:**
```javascript
// LocalStorage (persists across sessions)
localStorage.setItem("key", "value");
localStorage.getItem("key");
localStorage.removeItem("key");
localStorage.clear();

// SessionStorage (cleared when tab closes)
sessionStorage.setItem("key", "value");

// Storing objects
const user = { name: "John", age: 30 };
localStorage.setItem("user", JSON.stringify(user));
const storedUser = JSON.parse(localStorage.getItem("user"));
```

**Geolocation:**
```javascript
navigator.geolocation.getCurrentPosition(
  (position) => {
    console.log("Lat:", position.coords.latitude);
    console.log("Lng:", position.coords.longitude);
  },
  (error) => console.error(error)
);
```

**Intersection Observer:**
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(".animate-on-scroll").forEach(el => {
  observer.observe(el);
});
```

**Mutation Observer:**
```javascript
const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    console.log("DOM changed:", mutation);
  });
});

observer.observe(document.body, {
  childList: true,
  attributes: true,
  subtree: true
});

observer.disconnect();
```

### 4.6 Service Workers

**Definition:** A Service Worker is a script that runs in the background, separate from a web page's main thread, acting as a programmable network proxy between your web application and the internet. It intercepts network requests, manages caching strategies, enables push notifications, and allows web applications to work offline. Service Workers have their own lifecycle (install, activate, fetch events) and cannot directly access the DOM, communicating with pages via the `postMessage` API. They are the foundation of Progressive Web Apps (PWAs).

```javascript
// register.js
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js")
    .then(registration => console.log("SW registered"))
    .catch(error => console.log("SW registration failed"));
}

// sw.js (service worker file)
const CACHE_NAME = "my-cache-v1";
const ASSETS = ["/", "/index.html", "/styles.css", "/app.js"];

// Install event - cache assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Activate event - clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys
        .filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
      )
    )
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
```

### 4.7 Web Workers

**Definition:** Web Workers provide a way to run JavaScript code in background threads, separate from the main UI thread, enabling true parallel execution in JavaScript. Since JavaScript is single-threaded, CPU-intensive tasks (image processing, data parsing, complex calculations) can block the UI and freeze the page. Web Workers solve this by running heavy computations in the background and communicating with the main thread via message passing (`postMessage`), ensuring the UI remains responsive.

```javascript
// main.js
const worker = new Worker("worker.js");

worker.postMessage({ type: "calculate", data: [1, 2, 3, 4, 5] });

worker.onmessage = (event) => {
  console.log("Result:", event.data);
};

worker.onerror = (error) => {
  console.error("Worker error:", error);
};

// worker.js
self.onmessage = (event) => {
  const { type, data } = event.data;
  
  if (type === "calculate") {
    const result = data.reduce((sum, num) => sum + num, 0);
    self.postMessage(result);
  }
};
```

### 4.8 Testing

**Definition:** Testing is the practice of verifying that code behaves correctly by writing automated checks that compare expected outcomes with actual results. There are several levels of testing:
- **Unit Testing:** Testing individual functions or components in isolation.
- **Integration Testing:** Testing how multiple units work together.
- **End-to-End (E2E) Testing:** Testing complete user flows through the application.
- **Mocking:** Replacing real dependencies with simulated versions to isolate test behavior.
Testing ensures code reliability, prevents regressions, documents expected behavior, and enables confident refactoring.
```javascript
// math.js
export function add(a, b) {
  return a + b;
}

export function divide(a, b) {
  if (b === 0) throw new Error("Division by zero");
  return a / b;
}

// math.test.js
import { add, divide } from "./math";

test("adds 1 + 2 to equal 3", () => {
  expect(add(1, 2)).toBe(3);
});

test("divides 10 / 2 to equal 5", () => {
  expect(divide(10, 2)).toBe(5);
});

test("throws on division by zero", () => {
  expect(() => divide(10, 0)).toThrow("Division by zero");
});

// Mocking
test("fetches user data", async () => {
  const mockData = { id: 1, name: "John" };
  global.fetch = jest.fn(() =>
    Promise.resolve({ json: () => Promise.resolve(mockData) })
  );
  
  const user = await fetchUser(1);
  expect(user).toEqual(mockData);
});
```

### 4.9 TypeScript Fundamentals

**Definition:** TypeScript is a statically-typed superset of JavaScript developed by Microsoft that adds optional type annotations to the language. It compiles down to plain JavaScript and catches errors at compile-time rather than runtime. Key benefits include: type safety (preventing invalid operations), improved IDE support (autocomplete, refactoring, navigation), self-documenting code through type interfaces, better team collaboration with explicit contracts, and gradual adoption (you can incrementally add types to existing JavaScript code).
```typescript
let name: string = "John";
let age: number = 30;
let isActive: boolean = true;
let list: number[] = [1, 2, 3];
let tuple: [string, number] = ["John", 30];

enum Role {
  Admin = "ADMIN",
  User = "USER",
  Guest = "GUEST"
}

// Any (avoid when possible)
let value: any = 4;
value = "string"; // OK

// Unknown (safer alternative to any)
let unknownValue: unknown;
if (typeof unknownValue === "string") {
  console.log(unknownValue.toUpperCase()); // OK after type check
}

// Void (function returns nothing)
function log(msg: string): void {
  console.log(msg);
}

// Never (function never returns)
function throwError(msg: string): never {
  throw new Error(msg);
}
```

**Interfaces and Types:**
```typescript
interface User {
  id: number;
  name: string;
  email?: string; // Optional
  readonly createdAt: Date; // Readonly
}

type Status = "pending" | "active" | "inactive";

interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// Type intersection
interface BaseUser {
  id: number;
  name: string;
}

interface UserWithRole extends BaseUser {
  role: Role;
}

// Utility types
type PartialUser = Partial<User>;      // All properties optional
type RequiredUser = Required<User>;    // All properties required
type ReadonlyUser = Readonly<User>;    // All properties readonly
type UserWithoutId = Omit<User, "id">; // Remove properties
```

**Generics:**
```typescript
function identity<T>(arg: T): T {
  return arg;
}

identity<string>("hello");
identity<number>(42);
identity("hello"); // Type inference

class Container<T> {
  private value: T;
  
  constructor(value: T) {
    this.value = value;
  }
  
  getValue(): T {
    return this.value;
  }
}
```

### 4.10 Build Tools and Bundlers

**Definition:**
- **Bundler:** A tool that takes multiple JavaScript files (and their dependencies) and combines them into a single optimized file (bundle) for the browser. Bundlers resolve module imports, transform modern syntax to browser-compatible code, and apply optimizations like tree-shaking (removing unused code), code splitting (lazy loading), and minification (reducing file size). Examples: Webpack, Vite, Rollup, esbuild.
- **Transpiler (Babel):** A tool that converts modern JavaScript syntax (ES6+) into older JavaScript (ES5) that older browsers can understand, ensuring cross-browser compatibility.
- **Task Runner:** Automates repetitive development tasks like linting, testing, and file watching. Examples: npm scripts, Gulp.
```javascript
// webpack.config.js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
  devServer: {
    port: 3000,
    hot: true
  },
  mode: "development"
};
```

**Babel Configuration:**
```json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": "> 0.25%, not dead",
      "useBuiltIns": "usage",
      "corejs": 3
    }]
  ],
  "plugins": [
    "@babel/plugin-transform-runtime"
  ]
}
```

---

## Quick Reference

### Truthy and Falsy Values

**Falsy:**
- `false`
- `0`, `-0`, `0n`
- `""`, `''`, `` `` ``
- `null`
- `undefined`
- `NaN`

**Truthy:** Everything else, including `[]`, `{}`, `"0"`, `"false"`

### Comparison Table

| Operator | Description | Example | Result |
|----------|-------------|---------|--------|
| `==` | Loose equality | `5 == "5"` | `true` |
| `===` | Strict equality | `5 === "5"` | `false` |
| `!=` | Loose inequality | `5 != "5"` | `false` |
| `!==` | Strict inequality | `5 !== "5"` | `true` |

### Array Methods Quick Reference

| Method | Purpose | Returns | Mutates |
|--------|---------|---------|---------|
| `push()` | Add to end | New length | Yes |
| `pop()` | Remove from end | Removed item | Yes |
| `map()` | Transform | New array | No |
| `filter()` | Filter items | New array | No |
| `reduce()` | Accumulate | Single value | No |
| `forEach()` | Iterate | undefined | No |
| `find()` | Find item | Item or undefined | No |
| `some()` | Check any | Boolean | No |
| `every()` | Check all | Boolean | No |
| `sort()` | Sort array | Same array | Yes |
| `slice()` | Extract | New array | No |
| `splice()` | Add/remove | Removed items | Yes |

---

## Resources

- [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [JavaScript.info](https://javascript.info/)
- [ECMAScript Specification](https://tc39.es/ecma262/)
- [You Don't Know JS (book series)](https://github.com/getify/You-Dont-Know-JS)
- [Eloquent JavaScript](https://eloquentjavascript.net/)
