# TypeScript Concepts README

This README is a structured TypeScript learning guide from beginner to advanced level. It is useful for web development, backend development, and automation testing with tools like Playwright.

## Table of Contents

1. [What Is TypeScript?](#what-is-typescript)
2. [TypeScript vs JavaScript](#typescript-vs-javascript)
3. [Setup](#setup)
4. [Basic Types](#basic-types)
5. [Type Inference](#type-inference)
6. [Functions](#functions)
7. [Arrays and Tuples](#arrays-and-tuples)
8. [Objects](#objects)
9. [Type Aliases](#type-aliases)
10. [Interfaces](#interfaces)
11. [Union and Intersection Types](#union-and-intersection-types)
12. [Literal Types](#literal-types)
13. [Optional and Readonly Properties](#optional-and-readonly-properties)
14. [Enums](#enums)
15. [Classes and OOP](#classes-and-oop)
16. [Access Modifiers](#access-modifiers)
17. [Generics](#generics)
18. [Narrowing](#narrowing)
19. [Utility Types](#utility-types)
20. [Modules](#modules)
21. [Async TypeScript](#async-typescript)
22. [Error Handling](#error-handling)
23. [Advanced Types](#advanced-types)
24. [TypeScript Config](#typescript-config)
25. [TypeScript for Playwright Automation](#typescript-for-playwright-automation)
26. [Practice Roadmap](#practice-roadmap)

## What Is TypeScript?

TypeScript is a strongly typed programming language built on top of JavaScript.

TypeScript code is compiled into JavaScript before it runs.

```ts
let username: string = "John";
let age: number = 25;
let isActive: boolean = true;
```

JavaScript:

```js
let username = "John";
let age = 25;
let isActive = true;
```

TypeScript helps catch mistakes before running the code.

```ts
let count: number = 10;

// Error: Type 'string' is not assignable to type 'number'
// count = "ten";
```

JavaScript:

```js
let count = 10;

// JavaScript allows this at runtime because it is dynamically typed.
count = "ten";
```

## TypeScript vs JavaScript

| Feature | JavaScript | TypeScript |
|---|---|---|
| Typing | Dynamic | Static |
| Runs directly | Yes | No, compiles to JavaScript |
| Error checking | Runtime | Compile time |
| Interfaces | Not available | Available |
| Generics | Not available as types | Available |
| Best for | Small scripts and simple apps | Large apps, automation frameworks, scalable projects |
| Tooling | Good | Excellent |

## Setup

Install TypeScript:

```bash
npm install -D typescript
```

Check TypeScript version:

```bash
npx tsc --version
```

Create a TypeScript config file:

```bash
npx tsc --init
```

Compile a TypeScript file:

```bash
npx tsc app.ts
```

## Basic Types

### string

```ts
let firstName: string = "John";
```

JavaScript:

```js
let firstName = "John";
```

### number

```ts
let price: number = 999;
let rating: number = 4.5;
```

JavaScript:

```js
let price = 999;
let rating = 4.5;
```

### boolean

```ts
let isLoggedIn: boolean = true;
```

JavaScript:

```js
let isLoggedIn = true;
```

### null and undefined

```ts
let emptyValue: null = null;
let notAssigned: undefined = undefined;
```

JavaScript:

```js
let emptyValue = null;
let notAssigned = undefined;
```

### any

`any` disables type checking. Use it only when really needed.

```ts
let data: any = "Hello";
data = 100;
data = true;
```

JavaScript:

```js
let data = "Hello";
data = 100;
data = true;
```

### unknown

`unknown` is safer than `any` because you must check the type before using it.

```ts
let value: unknown = "Hello";

if (typeof value === "string") {
  console.log(value.toUpperCase());
}
```

JavaScript:

```js
let value = "Hello";

if (typeof value === "string") {
  console.log(value.toUpperCase());
}
```

### void

Used when a function does not return anything.

```ts
function logMessage(message: string): void {
  console.log(message);
}
```

JavaScript:

```js
function logMessage(message) {
  console.log(message);
}
```

### never

Used when a function never successfully finishes.

```ts
function throwError(message: string): never {
  throw new Error(message);
}
```

JavaScript:

```js
function throwError(message) {
  throw new Error(message);
}
```

## Type Inference

TypeScript can automatically understand the type from the assigned value.

```ts
let city = "Delhi"; // string
let score = 95;     // number
let isPass = true;  // boolean
```

JavaScript:

```js
let city = "Delhi";
let score = 95;
let isPass = true;
```

This means you do not always need to write explicit types.

```ts
let username = "Sam";
// username = 123; // Error
```

JavaScript:

```js
let username = "Sam";
username = 123; // Allowed in JavaScript
```

## Functions

### Function Parameter Types

```ts
function add(a: number, b: number): number {
  return a + b;
}

console.log(add(10, 20));
```

JavaScript:

```js
function add(a, b) {
  return a + b;
}

console.log(add(10, 20));
```

### Optional Parameters

```ts
function greet(name: string, role?: string): string {
  return role ? `${name} is a ${role}` : `Hello ${name}`;
}
```

JavaScript:

```js
function greet(name, role) {
  return role ? `${name} is a ${role}` : `Hello ${name}`;
}
```

### Default Parameters

```ts
function createUser(name: string, role: string = "user"): string {
  return `${name} - ${role}`;
}
```

JavaScript:

```js
function createUser(name, role = "user") {
  return `${name} - ${role}`;
}
```

### Arrow Functions

```ts
const multiply = (a: number, b: number): number => {
  return a * b;
};
```

JavaScript:

```js
const multiply = (a, b) => {
  return a * b;
};
```

### Function Type

```ts
let calculate: (a: number, b: number) => number;

calculate = (x, y) => x + y;
console.log(calculate(5, 3));
```

JavaScript:

```js
let calculate;

calculate = (x, y) => x + y;
console.log(calculate(5, 3));
```

## Arrays and Tuples

### Arrays

```ts
let numbers: number[] = [1, 2, 3, 4];
let names: string[] = ["John", "Sam"];
```

JavaScript:

```js
let numbers = [1, 2, 3, 4];
let names = ["John", "Sam"];
```

Alternative syntax:

```ts
let scores: Array<number> = [90, 80, 70];
```

JavaScript:

```js
let scores = [90, 80, 70];
```

### Array of Objects

```ts
let users: { name: string; age: number }[] = [
  { name: "John", age: 25 },
  { name: "Sam", age: 30 }
];
```

JavaScript:

```js
let users = [
  { name: "John", age: 25 },
  { name: "Sam", age: 30 }
];
```

### Tuples

Tuples define fixed length and fixed type positions.

```ts
let user: [number, string, boolean] = [1, "John", true];
```

JavaScript:

```js
let user = [1, "John", true];
```

## Objects

```ts
let user: { name: string; age: number; isActive: boolean } = {
  name: "John",
  age: 25,
  isActive: true
};
```

JavaScript:

```js
let user = {
  name: "John",
  age: 25,
  isActive: true
};
```

### Object Method Type

```ts
let employee: {
  name: string;
  getSalary: () => number;
} = {
  name: "Sam",
  getSalary: () => 50000
};
```

JavaScript:

```js
let employee = {
  name: "Sam",
  getSalary: () => 50000
};
```

## Type Aliases

Type aliases create custom type names.

```ts
type User = {
  id: number;
  name: string;
  email: string;
};

const user: User = {
  id: 1,
  name: "John",
  email: "john@example.com"
};
```

JavaScript:

```js
const user = {
  id: 1,
  name: "John",
  email: "john@example.com"
};
```

Type aliases can also be used for union types.

```ts
type Status = "pending" | "passed" | "failed";

let testStatus: Status = "passed";
```

JavaScript:

```js
let testStatus = "passed";
```

## Interfaces

Interfaces define the shape of an object.

```ts
interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: "John",
  email: "john@example.com"
};
```

JavaScript:

```js
const user = {
  id: 1,
  name: "John",
  email: "john@example.com"
};
```

### Interface with Method

```ts
interface Person {
  name: string;
  greet(): void;
}

const person: Person = {
  name: "Sam",
  greet() {
    console.log(`Hello ${this.name}`);
  }
};
```

JavaScript:

```js
const person = {
  name: "Sam",
  greet() {
    console.log(`Hello ${this.name}`);
  }
};
```

### Extending Interfaces

```ts
interface BaseUser {
  id: number;
  name: string;
}

interface AdminUser extends BaseUser {
  permissions: string[];
}

const admin: AdminUser = {
  id: 1,
  name: "Admin",
  permissions: ["read", "write"]
};
```

JavaScript:

```js
const admin = {
  id: 1,
  name: "Admin",
  permissions: ["read", "write"]
};
```

## Union and Intersection Types

### Union Types

Union means a value can be one of multiple types.

```ts
let id: string | number;

id = 101;
id = "EMP101";
```

JavaScript:

```js
let id;

id = 101;
id = "EMP101";
```

### Intersection Types

Intersection combines multiple types.

```ts
type Employee = {
  employeeId: number;
};

type Manager = {
  teamSize: number;
};

type TeamLead = Employee & Manager;

const lead: TeamLead = {
  employeeId: 101,
  teamSize: 8
};
```

JavaScript:

```js
const lead = {
  employeeId: 101,
  teamSize: 8
};
```

## Literal Types

Literal types allow only specific values.

```ts
type BrowserName = "chromium" | "firefox" | "webkit";

let browser: BrowserName = "chromium";
```

JavaScript:

```js
let browser = "chromium";
```

Useful in automation:

```ts
type TestResult = "passed" | "failed" | "skipped";

let result: TestResult = "passed";
```

JavaScript:

```js
let result = "passed";
```

## Optional and Readonly Properties

### Optional Properties

```ts
interface User {
  name: string;
  age?: number;
}

const user: User = {
  name: "John"
};
```

JavaScript:

```js
const user = {
  name: "John"
};
```

### Readonly Properties

```ts
interface Product {
  readonly id: number;
  name: string;
}

const product: Product = {
  id: 1,
  name: "Laptop"
};

// product.id = 2; // Error
```

JavaScript:

```js
const product = {
  id: 1,
  name: "Laptop"
};

product.id = 2; // Allowed unless you freeze or protect the object
```

## Enums

Enums define named constants.

```ts
enum Role {
  Admin,
  User,
  Guest
}

let role: Role = Role.Admin;
```

JavaScript:

```js
const Role = {
  Admin: 0,
  User: 1,
  Guest: 2
};

let role = Role.Admin;
```

String enums are often easier to read.

```ts
enum TestStatus {
  Passed = "PASSED",
  Failed = "FAILED",
  Skipped = "SKIPPED"
}

let status: TestStatus = TestStatus.Passed;
```

JavaScript:

```js
const TestStatus = {
  Passed: "PASSED",
  Failed: "FAILED",
  Skipped: "SKIPPED"
};

let status = TestStatus.Passed;
```

## Classes and OOP

```ts
class User {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  greet(): void {
    console.log(`Hello ${this.name}`);
  }
}

const user = new User("John", 25);
user.greet();
```

JavaScript:

```js
class User {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    console.log(`Hello ${this.name}`);
  }
}

const user = new User("John", 25);
user.greet();
```

### Inheritance

```ts
class Animal {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  speak(): void {
    console.log(`${this.name} makes a sound`);
  }
}

class Dog extends Animal {
  speak(): void {
    console.log(`${this.name} barks`);
  }
}

const dog = new Dog("Tommy");
dog.speak();
```

JavaScript:

```js
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a sound`);
  }
}

class Dog extends Animal {
  speak() {
    console.log(`${this.name} barks`);
  }
}

const dog = new Dog("Tommy");
dog.speak();
```

## Access Modifiers

Access modifiers control where class members can be used.

### public

Accessible everywhere. This is the default.

```ts
class User {
  public name: string;

  constructor(name: string) {
    this.name = name;
  }
}
```

JavaScript:

```js
class User {
  constructor(name) {
    this.name = name;
  }
}
```

### private

Accessible only inside the same class.

```ts
class BankAccount {
  private balance: number = 0;

  deposit(amount: number): void {
    this.balance += amount;
  }
}
```

JavaScript:

```js
class BankAccount {
  #balance = 0;

  deposit(amount) {
    this.#balance += amount;
  }
}
```

### protected

Accessible inside the same class and child classes.

```ts
class Employee {
  protected salary: number;

  constructor salaryAmount(salary: number) {
    this.salary = salary;
  }
}
```

Correct constructor syntax:

```ts
class Employee {
  protected salary: number;

  constructor(salary: number) {
    this.salary = salary;
  }
}
```

JavaScript:

```js
class Employee {
  constructor(salary) {
    this.salary = salary;
  }
}
```

### Parameter Properties

Short way to define and assign class properties.

```ts
class Product {
  constructor(public name: string, private price: number) {}

  getPrice(): number {
    return this.price;
  }
}
```

JavaScript:

```js
class Product {
  #price;

  constructor(name, price) {
    this.name = name;
    this.#price = price;
  }

  getPrice() {
    return this.#price;
  }
}
```

## Generics

Generics allow types to be reusable and flexible.

```ts
function identity<T>(value: T): T {
  return value;
}

console.log(identity<string>("Hello"));
console.log(identity<number>(100));
```

JavaScript:

```js
function identity(value) {
  return value;
}

console.log(identity("Hello"));
console.log(identity(100));
```

### Generic Array Function

```ts
function getFirstItem<T>(items: T[]): T {
  return items[0];
}

console.log(getFirstItem<number>([10, 20, 30]));
console.log(getFirstItem<string>(["a", "b", "c"]));
```

JavaScript:

```js
function getFirstItem(items) {
  return items[0];
}

console.log(getFirstItem([10, 20, 30]));
console.log(getFirstItem(["a", "b", "c"]));
```

### Generic Interface

```ts
interface ApiResponse<T> {
  status: number;
  data: T;
}

type User = {
  id: number;
  name: string;
};

const response: ApiResponse<User> = {
  status: 200,
  data: {
    id: 1,
    name: "John"
  }
};
```

JavaScript:

```js
const response = {
  status: 200,
  data: {
    id: 1,
    name: "John"
  }
};
```

## Narrowing

Narrowing means checking a value so TypeScript can understand its exact type.

### typeof Narrowing

```ts
function printId(id: string | number): void {
  if (typeof id === "string") {
    console.log(id.toUpperCase());
  } else {
    console.log(id.toFixed(2));
  }
}
```

JavaScript:

```js
function printId(id) {
  if (typeof id === "string") {
    console.log(id.toUpperCase());
  } else {
    console.log(id.toFixed(2));
  }
}
```

### in Operator Narrowing

```ts
type User = {
  name: string;
};

type Admin = {
  name: string;
  permissions: string[];
};

function printUser(user: User | Admin): void {
  if ("permissions" in user) {
    console.log(user.permissions);
  } else {
    console.log(user.name);
  }
}
```

JavaScript:

```js
function printUser(user) {
  if ("permissions" in user) {
    console.log(user.permissions);
  } else {
    console.log(user.name);
  }
}
```

### instanceof Narrowing

```ts
function printDate(value: Date | string): void {
  if (value instanceof Date) {
    console.log(value.toISOString());
  } else {
    console.log(value.toUpperCase());
  }
}
```

JavaScript:

```js
function printDate(value) {
  if (value instanceof Date) {
    console.log(value.toISOString());
  } else {
    console.log(value.toUpperCase());
  }
}
```

## Utility Types

TypeScript provides built-in utility types.

### Partial

Makes all properties optional.

```ts
interface User {
  name: string;
  email: string;
}

const updateUser: Partial<User> = {
  email: "new@example.com"
};
```

JavaScript:

```js
const updateUser = {
  email: "new@example.com"
};
```

### Required

Makes all properties required.

```ts
interface User {
  name?: string;
  email?: string;
}

const user: Required<User> = {
  name: "John",
  email: "john@example.com"
};
```

JavaScript:

```js
const user = {
  name: "John",
  email: "john@example.com"
};
```

### Pick

Selects specific properties.

```ts
interface User {
  id: number;
  name: string;
  email: string;
}

type UserPreview = Pick<User, "id" | "name">;
```

JavaScript:

```js
const userPreview = {
  id: 1,
  name: "John"
};
```

### Omit

Removes specific properties.

```ts
interface User {
  id: number;
  name: string;
  password: string;
}

type PublicUser = Omit<User, "password">;
```

JavaScript:

```js
const publicUser = {
  id: 1,
  name: "John"
};
```

### Record

Creates an object type with specific key and value types.

```ts
type BrowserConfig = Record<string, boolean>;

const config: BrowserConfig = {
  headless: true,
  slowMo: false
};
```

JavaScript:

```js
const config = {
  headless: true,
  slowMo: false
};
```

## Modules

Modules help organize code into multiple files.

### Export

```ts
export function add(a: number, b: number): number {
  return a + b;
}

export type User = {
  id: number;
  name: string;
};
```

JavaScript:

```js
export function add(a, b) {
  return a + b;
}
```

### Import

```ts
import { add, type User } from "./helpers";

const result = add(10, 20);

const user: User = {
  id: 1,
  name: "John"
};
```

JavaScript:

```js
import { add } from "./helpers";

const result = add(10, 20);

const user = {
  id: 1,
  name: "John"
};
```

### Default Export

```ts
export default class LoginPage {
  open(): void {
    console.log("Open login page");
  }
}
```

JavaScript:

```js
export default class LoginPage {
  open() {
    console.log("Open login page");
  }
}
```

```ts
import LoginPage from "./LoginPage";
```

JavaScript:

```js
import LoginPage from "./LoginPage";
```

## Async TypeScript

### Promise Type

```ts
function fetchMessage(): Promise<string> {
  return Promise.resolve("Data loaded");
}
```

### async and await

```ts
async function getUser(): Promise<{ id: number; name: string }> {
  const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
  const data = await response.json();
  return data;
}
```

### Typing API Response

```ts
interface User {
  id: number;
  name: string;
  email: string;
}

async function getUser(): Promise<User> {
  const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
  const data: User = await response.json();
  return data;
}
```

## Error Handling

```ts
try {
  throw new Error("Something went wrong");
} catch (error) {
  if (error instanceof Error) {
    console.log(error.message);
  }
}
```

In TypeScript, caught errors are often treated as `unknown`, so check the error type before using it.

## Advanced Types

### keyof

```ts
interface User {
  id: number;
  name: string;
  email: string;
}

type UserKeys = keyof User;

let key: UserKeys = "name";
```

### typeof

```ts
const settings = {
  browser: "chromium",
  headless: true
};

type Settings = typeof settings;
```

### Indexed Access Types

```ts
interface User {
  id: number;
  name: string;
}

type UserName = User["name"];
```

### Conditional Types

```ts
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;
type B = IsString<number>;
```

### Mapped Types

```ts
type ReadonlyUser<T> = {
  readonly [Key in keyof T]: T[Key];
};

interface User {
  name: string;
  age: number;
}

type LockedUser = ReadonlyUser<User>;
```

### Type Assertions

```ts
let value: unknown = "Hello TypeScript";
let length = (value as string).length;
```

Use assertions carefully because they tell TypeScript to trust you.

## TypeScript Config

The `tsconfig.json` file controls TypeScript compiler behavior.

Common useful options:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### Important Options

- `target`: JavaScript version output
- `module`: module system
- `strict`: enables strict type checking
- `noImplicitAny`: prevents hidden `any` types
- `strictNullChecks`: checks `null` and `undefined` safely
- `esModuleInterop`: improves compatibility with CommonJS modules
- `skipLibCheck`: skips checking type files from libraries

## TypeScript for Playwright Automation

TypeScript is a very good choice for Playwright because it gives better autocomplete, safer test code, and easier maintenance.

### Basic Playwright Test

```ts
import { test, expect } from "@playwright/test";

test("homepage has title", async ({ page }) => {
  await page.goto("https://example.com");
  await expect(page).toHaveTitle(/Example/);
});
```

### Typed Test Data

```ts
type LoginUser = {
  username: string;
  password: string;
};

const validUser: LoginUser = {
  username: "standard_user",
  password: "secret_sauce"
};
```

### Page Object Model Example

```ts
import { type Page, type Locator } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator("#user-name");
    this.passwordInput = page.locator("#password");
    this.loginButton = page.locator("#login-button");
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

### Playwright Config Example

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  use: {
    baseURL: "https://example.com",
    trace: "on-first-retry"
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
});
```

### Important TypeScript Topics for Playwright

- `async` and `await`
- Function parameter and return types
- Object types
- Type aliases
- Interfaces
- Classes
- Access modifiers
- Modules
- Union types
- Literal types
- Generics basics
- `Promise<T>`
- `Page` and `Locator` types
- JSON test data typing

## Practice Roadmap

### Beginner Level

- Install TypeScript
- Create `.ts` files
- Learn basic types
- Practice type inference
- Write typed functions
- Use arrays and objects
- Understand `any` vs `unknown`

### Intermediate Level

- Create type aliases
- Create interfaces
- Use optional and readonly properties
- Practice union and literal types
- Learn classes and inheritance
- Use modules with import and export
- Practice async functions with `Promise<T>`

### Advanced Level

- Learn generics
- Practice utility types
- Understand narrowing
- Use `keyof` and `typeof`
- Learn mapped types
- Learn conditional types
- Configure `tsconfig.json`
- Reduce usage of `any`

### Automation Testing Level

- Write Playwright tests in TypeScript
- Use `Page` and `Locator` types
- Create typed test data
- Build Page Object Model classes
- Create reusable helper functions
- Use fixtures
- Type API responses
- Organize tests using modules

## Recommended Learning Order

1. Basic JavaScript knowledge
2. TypeScript basic types
3. Type inference
4. Functions
5. Arrays and objects
6. Type aliases
7. Interfaces
8. Union and literal types
9. Classes
10. Modules
11. Async TypeScript
12. Generics
13. Utility types
14. Advanced types
15. TypeScript with Playwright

## Quick Interview Points

- TypeScript is a superset of JavaScript.
- TypeScript provides static typing.
- TypeScript catches many errors at compile time.
- TypeScript code compiles to JavaScript.
- `interface` and `type` both define shapes, but `interface` is commonly used for object contracts.
- `any` disables type safety.
- `unknown` is safer than `any`.
- Generics make reusable typed code.
- TypeScript improves Playwright automation by giving better type safety and editor support.

## Final Notes

For Playwright automation, TypeScript is usually the better choice because it helps you write cleaner, safer, and more maintainable tests.

Focus first on functions, objects, interfaces, classes, modules, and `async/await`. After that, move into generics, utility types, and advanced type concepts.
