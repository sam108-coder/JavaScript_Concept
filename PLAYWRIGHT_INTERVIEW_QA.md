# Playwright Automation Interview Questions & Answers (4+ Years Experience)

A comprehensive collection of interview questions and answers tailored for a mid-to-senior level Playwright automation engineer with approximately 4 years of hands-on experience.

---

## Table of Contents

1. [Core Concepts & Architecture](#1-core-concepts--architecture)
2. [Locators & Element Handling](#2-locators--element-handling)
3. [Authentication & State Management](#3-authentication--state-management)
4. [Network & API Testing](#4-network--api-testing)
5. [Advanced Features](#5-advanced-features)
6. [Framework Design & Best Practices](#6-framework-design--best-practices)
7. [CI/CD & DevOps Integration](#7-cicd--devops-integration)
8. [Performance & Optimization](#8-performance--optimization)
9. [Debugging & Troubleshooting](#9-debugging--troubleshooting)
10. [Real-World Scenarios](#10-real-world-scenarios) 
11. [Migration & Comparison](#11-migration--comparison)
12. [Behavioral & Leadership](#12-behavioral--leadership)

---

## 1. Core Concepts & Architecture

### Q1: Explain how Playwright works under the hood. How is it different from Selenium?

**Answer:**

Playwright works by establishing a direct connection to browser instances using the Chrome DevTools Protocol (CDP) for Chromium, and equivalent protocols for Firefox and WebKit. Unlike Selenium, which uses the WebDriver protocol (an external HTTP-based API that communicates with a browser driver), Playwright communicates with browsers via WebSocket connections, enabling faster execution and deeper control.

**Key Architectural Differences:**

| Aspect | Playwright | Selenium |
|--------|-----------|----------|
| Protocol | WebSocket (CDP/protocol-specific) | HTTP (WebDriver) |
| Speed | Faster (no HTTP overhead) | Slower (HTTP request/response cycle) |
| Auto-waiting | Built-in for all actions | Requires manual waits or explicit waits |
| Network interception | Native, built-in | Requires third-party tools (BrowserMob, etc.) |
| Browser context | Incognito-like isolation per test | Requires full browser restart or profile management |
| Shadow DOM | Automatically pierced | Requires special handling |
| Multi-tab/multi-domain | Supported natively | Limited, requires window switching |
| Mobile emulation | Built-in device descriptors | Requires device mode configuration |
| Execution model | Single binary, no external drivers | Requires separate driver binaries (chromedriver, geckodriver) |

**How Playwright Works:**
1. **Browser Launch:** Playwright launches a browser instance using its bundled browser binaries
2. **WebSocket Connection:** Establishes a WebSocket connection to the browser's debugging port
3. **CDP Communication:** Sends commands and receives events over the WebSocket using browser-specific protocols
4. **Browser Contexts:** Creates isolated contexts (like incognito tabs) within a single browser instance
5. **Page Objects:** Creates page objects within contexts for interaction

---

### Q2: What is a Browser Context in Playwright and why is it important?

**Answer:**

A Browser Context is a lightweight, isolated session within a single browser instance. It is analogous to an incognito/private window but can be created and destroyed programmatically in milliseconds. Each context has its own cookies, localStorage, sessionStorage, cache, and permissions, completely isolated from other contexts.

**Why It's Important:**
- **Test Isolation:** Each test runs in a fresh context, preventing state leakage between tests
- **Parallel Execution:** Multiple contexts can run simultaneously within a single browser, enabling true parallelism
- **Performance:** Creating a context is much faster (~10ms) than launching a new browser instance (~2-5 seconds)
- **Multi-user Testing:** Simulate multiple users simultaneously (e.g., admin + regular user) without multiple browsers
- **Resource Efficiency:** Share a single browser process across multiple tests

**Example:**
```javascript
test("parallel user actions", async ({ browser }) => {
  const context1 = await browser.newContext();
  const context2 = await browser.newContext();
  
  const page1 = await context1.newPage();
  const page2 = await context2.newPage();
  
  await page1.goto("https://example.com/user1");
  await page2.goto("https://example.com/user2");
  
  // Both pages operate independently with separate sessions
});
```

---

### Q3: How does Playwright's auto-waiting mechanism work?

**Answer:**

Auto-waiting is Playwright's built-in mechanism that ensures elements are ready for interaction before performing actions. Before any action (click, fill, select, etc.), Playwright automatically verifies that the target element:

1. **Is attached to the DOM** - Element exists in the document tree
2. **Is visible** - Element has non-zero dimensions and is not hidden by CSS (`display: none`, `visibility: hidden`, `opacity: 0`)
3. **Is stable** - Element is not undergoing CSS animations or transitions
4. **Is enabled** - Element is not disabled (for form elements)
5. **Is actionable** - Element can receive events (not covered by another element, not in a disabled state)

**How It Works Internally:**
```javascript
// When you call: await page.getByRole("button").click();
// Playwright does the following:
// 1. Queries the DOM for the element using the locator
// 2. Checks if element is attached to DOM
// 3. Waits for element to become visible (if hidden)
// 4. Waits for element to become stable (no animations)
// 5. Waits for element to become enabled
// 6. Scrolls element into view if needed
// 7. Checks if element is not covered by another element
// 8. Performs the click action
// 9. If any check fails within timeout, retries the entire process
```

**Timeouts Involved:**
- **Action Timeout:** Default 30 seconds (configurable via `actionTimeout` in config)
- **Navigation Timeout:** Default 30 seconds (configurable via `navigationTimeout`)
- **Assertion Timeout:** Default 5 seconds (configurable via `expect.timeout`)

---

### Q4: Explain the difference between `page.goto()` waitUntil options.

**Answer:**

The `waitUntil` option determines when `page.goto()` considers navigation "complete":

| Option | Description | Use Case |
|--------|-------------|----------|
| `load` (default) | Waits for the `load` event to fire (all resources loaded) | Standard page navigation, when you need all images/stylesheets |
| `domcontentloaded` | Waits for `DOMContentLoaded` event (HTML parsed, DOM built) | Faster navigation, when you don't need images/stylesheets to load |
| `networkidle` | Waits until there are no network connections for at least 500ms | SPAs, pages that load content dynamically via API calls |
| `commit` | Waits until the navigation is committed (server responded) | Fastest option, useful when you just need the server response |

**Example:**
```javascript
// Fastest - just need server response
await page.goto("https://example.com", { waitUntil: "commit" });

// For SPAs with dynamic content
await page.goto("https://example.com", { waitUntil: "networkidle" });

// Standard - wait for everything
await page.goto("https://example.com", { waitUntil: "load" });
```

---

### Q5: What is the difference between `page.evaluate()` and `page.locator().evaluate()`?

**Answer:**

| Method | Scope | Return | Use Case |
|--------|-------|--------|----------|
| `page.evaluate(fn)` | Entire page/window context | Any serializable value | Accessing global variables, `window` object, `document` methods, running arbitrary JS |
| `locator.evaluate(fn)` | Specific element(s) matched by locator | Any serializable value | Operating on DOM elements, reading element properties, checking computed styles |
| `locator.evaluateAll(fn)` | All elements matched by locator | Any serializable value | Operating on multiple elements at once (e.g., getting all text from a list) |

**Examples:**
```javascript
// page.evaluate - runs in global window context
const title = await page.evaluate(() => document.title);
const cookies = await page.evaluate(() => document.cookie);
const viewportWidth = await page.evaluate(() => window.innerWidth);

// locator.evaluate - runs on a specific element
const buttonText = await page.getByRole("button").evaluate(el => el.textContent);
const inputClasses = await page.getByLabel("Email").evaluate(el => el.className);

// locator.evaluateAll - runs on all matching elements
const allLinks = await page.locator("a").evaluateAll(links => links.map(a => a.href));
const itemCounts = await page.locator(".item").evaluateAll(items => items.length);
```

**Key Limitation:** `evaluate()` can only return serializable values (primitives, plain objects, arrays). It cannot return DOM elements, functions, or complex objects.

---

## 2. Locators & Element Handling

### Q6: What are the different locator strategies in Playwright and which one should you prefer?

**Answer:**

Playwright offers multiple locator strategies, listed in order of preference:

1. **`getByRole()` (Most Preferred)** - Locates elements by their ARIA role and accessible name
   ```javascript
   page.getByRole("button", { name: "Submit" });
   page.getByRole("link", { name: "Home" });
   page.getByRole("heading", { level: 1 });
   ```
   - Resilient to DOM changes, enforces accessibility best practices

2. **`getByText()`** - Locates elements by visible text content
   ```javascript
   page.getByText("Welcome");
   page.getByText(/Sign\s+up/); // Regex for flexible matching
   ```
   - Good for static text, but can be fragile if text changes

3. **`getByLabel()`** - Locates form elements by their associated label
   ```javascript
   page.getByLabel("Email address");
   ```
   - Ideal for form inputs, enforces proper label association

4. **`getByPlaceholder()`** - Locates inputs by placeholder attribute
   ```javascript
   page.getByPlaceholder("Enter your email");
   ```
   - Useful when labels are missing

5. **`getByAltText()`** - Locates images by alt attribute
   ```javascript
   page.getByAltText("Company logo");
   ```
   - Good for image verification

6. **`getByTitle()`** - Locates elements by title attribute
   ```javascript
   page.getByTitle("Settings");
   ```
   - Less common but useful for specific cases

7. **`getByTestId()`** - Locates elements by `data-testid` attribute
   ```javascript
   page.getByTestId("submit-button");
   ```
   - Most stable for testing but requires adding test attributes to HTML

8. **`locator()` (CSS/XPath)** - Generic locator using CSS or XPath selectors
   ```javascript
   page.locator(".btn-primary");
   page.locator("#submit-btn");
   page.locator("//div[@class='card']"); // XPath
   ```
   - Last resort, most fragile to DOM changes

---

### Q7: How do you handle dynamic elements whose IDs or classes change on every page load?

**Answer:**

Dynamic elements are common in modern frameworks (React, Angular, Vue) where class names and IDs are auto-generated. Strategies to handle them:

**1. Use Role-Based Locators (Best):**
```javascript
// Instead of: page.locator("#submit-btn-x7k2m")
page.getByRole("button", { name: "Submit" });
```

**2. Use Text-Based Locators:**
```javascript
// Instead of: page.locator(".css-1a2b3c4")
page.getByText("Confirm Order");
```

**3. Use CSS Attribute Selectors (Partial Matching):**
```javascript
// Match elements where class contains a specific substring
page.locator('[class*="submit-"]');

// Match elements where attribute starts with a pattern
page.locator('[id^="dynamic-prefix-"]');

// Match elements where attribute ends with a pattern
page.locator('[id$="-generated"]');
```

**4. Use XPath with Text Content:**
```javascript
page.locator("//button[contains(text(), 'Submit')]");
```

**5. Ask Developers to Add Test IDs:**
```javascript
// Developers add: <button data-testid="submit-btn">Submit</button>
page.getByTestId("submit-btn");
```

**6. Use Relative/Chained Locators:**
```javascript
// Find a stable parent, then navigate to the dynamic child
page.getByRole("form").locator("button[type='submit']");

// Filter by nearby stable text
page.getByRole("listitem").filter({ hasText: "Product Name" }).getByRole("button");
```

---

### Q8: How do you handle Shadow DOM elements in Playwright?

**Answer:**

Playwright automatically pierces Shadow DOM boundaries by default. Unlike Selenium, you don't need special handling:

```javascript
// Shadow DOM is handled transparently
await page.getByRole("button", { name: "Shadow Button" }).click();

// CSS selectors work through shadow boundaries
await page.locator("custom-element >> .inner-button").click();

// Even complex nested shadow DOM works
await page.locator("parent-component").locator("child-component").locator("button").click();
```

**When You Need Special Handling:**
```javascript
// If you need to target shadow DOM specifically
await page.locator("custom-element >> #shadow-host").evaluate(el => el.shadowRoot.querySelector("button"));

// For elements outside shadow DOM when using deep selectors
page.locator("element", { hasNotText: "shadow" });
```

---

## 3. Authentication & State Management

### Q9: How do you handle authentication in Playwright tests efficiently?

**Answer:**

There are multiple approaches, each with different trade-offs:

**Approach 1: UI Login (Slow, but realistic):**
```javascript
test("login and do something", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("user@test.com");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForURL("/dashboard");
  // ... rest of test
});
// Disadvantage: Login runs for EVERY test, slow
```

**Approach 2: Storage State Reuse (Recommended):**
```javascript
// global-setup.js
async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto("/login");
  await page.getByLabel("Email").fill(process.env.TEST_USER_EMAIL);
  await page.getByLabel("Password").fill(process.env.TEST_USER_PASSWORD);
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForURL("/dashboard");
  
  // Save cookies, localStorage, sessionStorage
  await page.context().storageState({ path: "auth.json" });
  await browser.close();
}

// playwright.config.js
export default defineConfig({
  globalSetup: require.resolve("./global-setup"),
  use: {
    storageState: "auth.json", // All tests start authenticated
  },
});
```

**Approach 3: API Login (Fastest):**
```javascript
test("authenticated test", async ({ page, request }) => {
  // Login via API
  const loginResponse = await request.post("/api/auth/login", {
    data: { email: "user@test.com", password: "password123" },
  });
  const { token } = await loginResponse.json();
  
  // Set authentication cookie
  await page.context().addCookies([{
    name: "auth_token",
    value: token,
    domain: "example.com",
    path: "/",
  }]);
  
  await page.goto("/dashboard");
  // ... test authenticated features
});
```

**Approach 4: Multiple Auth States (Multi-role testing):**
```javascript
// playwright.config.js
projects: [
  {
    name: "admin",
    use: { storageState: "admin-auth.json" },
    testMatch: /.*admin\.spec\.js/,
  },
  {
    name: "user",
    use: { storageState: "user-auth.json" },
    testMatch: /.*user\.spec\.js/,
  },
]
```

---

### Q10: How do you handle multi-factor authentication (MFA/2FA) in automated tests?

**Answer:**

MFA is a common challenge in test automation. Strategies:

**1. Disable MFA for Test Accounts:**
- Create dedicated test accounts with MFA disabled
- Most practical approach for test environments

**2. Use MFA Bypass/Backdoor:**
```javascript
// Many systems provide a bypass endpoint for testing
test("login with MFA bypass", async ({ request }) => {
  const bypassResponse = await request.post("/api/auth/mfa-bypass", {
    data: { userId: "test-user-123" },
  });
  // Use bypass token
});
```

**3. Use Static/Pre-generated OTP Codes:**
```javascript
// If the system supports static backup codes
test("login with backup code", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("user@test.com");
  await page.getByLabel("Password").fill("password");
  await page.getByLabel("MFA Code").fill(process.env.MFA_BACKUP_CODE);
  await page.getByRole("button", { name: "Verify" }).click();
});
```

**4. Use TOTP Library (Time-based One-Time Password):**
```javascript
import { authenticator } from "otplib";

test("login with generated OTP", async ({ page }) => {
  const secret = process.env.MFA_SECRET_KEY;
  const token = authenticator.generate(secret);
  
  await page.goto("/login");
  await page.getByLabel("Email").fill("user@test.com");
  await page.getByLabel("Password").fill("password");
  await page.getByLabel("OTP Code").fill(token);
  await page.getByRole("button", { name: "Verify" }).click();
});
```

**5. Intercept MFA API Response:**
```javascript
test("bypass MFA via network interception", async ({ page }) => {
  await page.route("**/api/auth/mfa/verify", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, token: "mock-jwt-token" }),
    });
  });
  
  await page.goto("/login");
  // Submit login, MFA verification is mocked
});
```

---

## 4. Network & API Testing

### Q11: How do you mock API responses in Playwright?

**Answer:**

Playwright provides several ways to mock API responses:

**1. Route with Static Response:**
```javascript
test("mock API response", async ({ page }) => {
  await page.route("**/api/users", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
      ]),
    });
  });
  
  await page.goto("/users");
  await expect(page.getByText("John")).toBeVisible();
});
```

**2. Route with Dynamic Response:**
```javascript
test("dynamic mock", async ({ page }) => {
  await page.route("**/api/users/**", async (route, request) => {
    const userId = request.url().split("/").pop();
    const mockUsers = { "1": "John", "2": "Jane" };
    
    await route.fulfill({
      status: 200,
      body: JSON.stringify({ id: userId, name: mockUsers[userId] || "Unknown" }),
    });
  });
});
```

**3. Modify Requests Before Sending:**
```javascript
test("modify request", async ({ page }) => {
  await page.route("**/api/data", async (route) => {
    const headers = route.request().headers();
    headers["X-Test-Header"] = "test-value";
    headers["Authorization"] = "Bearer mock-token";
    
    await route.continue({ headers });
  });
});
```

**4. Abort/Block Requests:**
```javascript
test("block analytics", async ({ page }) => {
  // Block third-party requests
  await page.route("**/analytics**", (route) => route.abort());
  await page.route("**/ads**", (route) => route.abort());
  await page.route("**/tracking**", (route) => route.abort());
});
```

**5. Modify Real Responses:**
```javascript
test("modify real response", async ({ page }) => {
  await page.route("**/api/config", async (route) => {
    const response = await route.fetch();
    const json = await response.json();
    json.featureFlag = true; // Enable feature for test
    await route.fulfill({ response, json });
  });
});
```

**6. HAR Recording and Replay:**
```javascript
// Record HAR file
test("record HAR", async ({ page }) => {
  await page.context().routeFromHAR("test-fixtures/api.har", { update: true });
  await page.goto("/");
});

// Replay from HAR
test("replay HAR", async ({ page }) => {
  await page.context().routeFromHAR("test-fixtures/api.har", {
    url: "**/api/**",
    notFound: "abort",
  });
  await page.goto("/");
});
```

---

### Q12: How do you test API endpoints using Playwright's `request` fixture?

**Answer:**

Playwright provides a built-in `request` fixture for API testing that shares browser context (cookies, headers) with the page:

```javascript
import { test, expect } from "@playwright/test";

test("CRUD API testing", async ({ request }) => {
  // GET
  const getResponse = await request.get("/api/users");
  expect(getResponse.ok()).toBeTruthy();
  expect(getResponse.status()).toBe(200);
  const users = await getResponse.json();
  expect(users).toHaveLength(5);
  
  // POST
  const postResponse = await request.post("/api/users", {
    data: {
      name: "John Doe",
      email: "john@example.com",
      role: "admin",
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
  expect(postResponse.status()).toBe(201);
  const newUser = await postResponse.json();
  expect(newUser.id).toBeDefined();
  
  // PUT
  const putResponse = await request.put(`/api/users/${newUser.id}`, {
    data: { name: "John Updated" },
  });
  expect(putResponse.status()).toBe(200);
  
  // DELETE
  const deleteResponse = await request.delete(`/api/users/${newUser.id}`);
  expect(deleteResponse.status()).toBe(204);
  
  // Verify deletion
  const verifyResponse = await request.get(`/api/users/${newUser.id}`);
  expect(verifyResponse.status()).toBe(404);
});

// Testing with query parameters
test("API with params", async ({ request }) => {
  const response = await request.get("/api/search", {
    params: {
      q: "test",
      page: 1,
      limit: 10,
      sort: "desc",
    },
  });
});

// Testing with form data
test("API with multipart", async ({ request }) => {
  const response = await request.post("/api/upload", {
    multipart: {
      file: {
        name: "document.pdf",
        mimeType: "application/pdf",
        buffer: Buffer.from("PDF content"),
      },
      description: "Test document",
    },
  });
});

// Testing API with authentication (shares browser cookies)
test("authenticated API", async ({ page, request }) => {
  // Login via UI
  await page.goto("/login");
  await page.getByLabel("Email").fill("admin@test.com");
  await page.getByLabel("Password").fill("password");
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForURL("/dashboard");
  
  // API request uses browser cookies automatically
  const apiResponse = await request.get("/api/admin/users");
  expect(apiResponse.ok()).toBeTruthy();
});
```

---

### Q13: How do you wait for API responses before making assertions?

**Answer:**

```javascript
// Wait for specific API response
test("wait for API", async ({ page }) => {
  const [apiResponse] = await Promise.all([
    page.waitForResponse("**/api/users/**"),
    page.getByRole("button", { name: "Load Users" }).click(),
  ]);
  
  expect(apiResponse.ok()).toBeTruthy();
  expect(apiResponse.status()).toBe(200);
  
  const data = await apiResponse.json();
  expect(data.length).toBeGreaterThan(0);
});

// Wait for multiple responses
test("wait for multiple APIs", async ({ page }) => {
  const [usersResponse, postsResponse] = await Promise.all([
    page.waitForResponse("**/api/users"),
    page.waitForResponse("**/api/posts"),
    page.goto("/dashboard"),
  ]);
  
  expect(usersResponse.status()).toBe(200);
  expect(postsResponse.status()).toBe(200);
});

// Wait for response and verify request details
test("verify API request and response", async ({ page }) => {
  const [response] = await Promise.all([
    page.waitForResponse("**/api/login"),
    page.getByRole("button", { name: "Login" }).click(),
  ]);
  
  // Verify request
  const request = response.request();
  expect(request.method()).toBe("POST");
  expect(request.headers()["content-type"]).toContain("application/json");
  
  // Verify response
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.token).toBeDefined();
});
```

---

## 5. Advanced Features

### Q14: What are fixtures in Playwright and how do you create custom fixtures?

**Answer:**

Fixtures are the foundation of Playwright's test architecture. They provide setup and teardown logic that runs automatically before and after each test. Playwright provides built-in fixtures (`page`, `browser`, `context`, `request`), and you can extend them with custom fixtures.

**Why Fixtures Are Powerful:**
- Automatic lifecycle management (setup before test, cleanup after)
- Dependency injection (fixtures can depend on other fixtures)
- Reusability across tests
- Scoping (test-level or worker-level)
- Clean separation of concerns

**Creating Custom Fixtures:**
```javascript
// fixtures/custom-fixtures.js
import { test as base, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { DatabaseClient } from "../utils/DatabaseClient";

// Extend Playwright's test
export const test = base.extend({
  // Simple fixture
  loggedInPage: async ({ page }, use) => {
    // Setup: Login before test
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("admin@test.com", "password");
    await page.waitForURL("/dashboard");
    
    // Provide fixture to test
    await use(page);
    
    // Teardown: Cleanup after test
    await page.goto("/logout");
  },
  
  // Fixture with options
  apiClient: [
    async ({ baseURL }, use) => {
      const client = new DatabaseClient(baseURL);
      await client.connect();
      await use(client);
      await client.disconnect();
    },
    { scope: "worker" }, // Shared across tests in same worker
  ],
  
  // Fixture that depends on other fixtures
  seededUser: async ({ apiClient, loggedInPage }, use) => {
    const user = await apiClient.createUser({
      name: "Test User",
      email: `test-${Date.now()}@test.com`,
    });
    await use(user);
    await apiClient.deleteUser(user.id);
  },
  
  // Auto fixture (always runs, even if not requested)
  cleanupDatabase: [
    async ({ apiClient }, use) => {
      await use();
      await apiClient.cleanupTestData();
    },
    { auto: true },
  ],
});

export { expect };

// Using custom fixtures in tests
// tests/user.spec.js
import { test, expect } from "../fixtures/custom-fixtures";

test("create and verify user", async ({ loggedInPage, seededUser }) => {
  await loggedInPage.goto(`/users/${seededUser.id}`);
  await expect(page.getByText(seededUser.name)).toBeVisible();
});
```

---

### Q15: Explain the difference between test scope and worker scope fixtures.

**Answer:**

| Aspect | Test Scope | Worker Scope |
|--------|-----------|--------------|
| Lifecycle | Created fresh for each test | Created once per worker process |
| Cleanup | Cleaned up after each test | Cleaned up when worker exits |
| Performance | Slower (recreated frequently) | Faster (shared across tests) |
| Isolation | High (no state sharing) | Lower (shared state) |
| Use Case | Tests that need clean state | Expensive setup (DB connection, auth token) |
| Default | Yes | No (must specify) |

**Example:**
```javascript
const test = base.extend({
  // Test scope: New instance for each test
  page: async ({ browser }, use) => {
    const page = await browser.newPage();
    await use(page);
    await page.close();
  },
  
  // Worker scope: Single instance shared by all tests in this worker
  dbConnection: [
    async ({}, use) => {
      const connection = await Database.connect();
      await use(connection);
      await connection.close();
    },
    { scope: "worker" },
  ],
});
```

**When to Use Worker Scope:**
- Database connections (expensive to create)
- API tokens (don't change between tests)
- Test server instances
- Shared mock servers
- Large test data that doesn't need resetting

**When to Use Test Scope:**
- Browser pages (need isolation)
- User sessions (need fresh state)
- Test-specific data
- Anything that could cause test interdependence

---

### Q16: How do you handle file uploads and downloads in Playwright?

**Answer:**

**File Uploads:**
```javascript
test("file upload", async ({ page }) => {
  // Single file
  await page.getByLabel("Upload").setInputFiles("path/to/file.txt");
  
  // Multiple files
  await page.getByLabel("Upload").setInputFiles([
    "file1.txt",
    "file2.pdf",
    "image.png",
  ]);
  
  // File with custom buffer (no physical file needed)
  await page.getByLabel("Upload").setInputFiles({
    name: "test.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("Test file content"),
  });
  
  // Using file chooser event (when click triggers native dialog)
  const [fileChooser] = await Promise.all([
    page.waitForEvent("filechooser"),
    page.getByText("Choose File").click(),
  ]);
  await fileChooser.setFiles(["file.txt"]);
  
  // Clear file input
  await page.getByLabel("Upload").setInputFiles([]);
});
```

**File Downloads:**
```javascript
test("file download", async ({ page }) => {
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Download Report" }).click(),
  ]);
  
  // Get file metadata
  console.log("Filename:", download.suggestedFilename());
  console.log("URL:", download.url());
  
  // Save to disk
  await download.saveAs(`downloads/${download.suggestedFilename()}`);
  
  // Or get as stream for processing
  const stream = await download.createReadStream();
  // ... process stream
  
  // Delete downloaded file
  await download.delete();
});

// Configure download behavior
const context = await browser.newContext({
  acceptDownloads: true, // Required for downloads to work
});
```

---

### Q17: How do you handle iframes in Playwright?

**Answer:**

```javascript
test("iframe interaction", async ({ page }) => {
  await page.goto("/page-with-iframe");
  
  // Access iframe by name
  const frameByName = page.frame("my-iframe");
  
  // Access iframe by URL pattern
  const frameByUrl = page.frame({ url: /iframe-content\.com/ });
  
  // Access all frames
  const allFrames = page.frames();
  console.log(`Page has ${allFrames.length} frames`);
  
  // Interact with iframe content
  const frame = page.frame("my-iframe");
  await frame.getByRole("button", { name: "Click Me" }).click();
  await frame.getByLabel("Input").fill("text inside iframe");
  
  // Nested iframes
  const childFrame = frame.childFrames()[0];
  await childFrame.getByText("Nested content").click();
  
  // Wait for iframe to load
  const [frameLoaded] = await Promise.all([
    page.waitForEvent("frameattached"),
    page.getByText("Load iframe").click(),
  ]);
  
  // Verify iframe content
  await expect(frame.getByText("Loaded successfully")).toBeVisible();
});
```

---

## 6. Framework Design & Best Practices

### Q18: How do you design a scalable Playwright test framework?

**Answer:**

A scalable Playwright framework should follow these architectural principles:

**1. Project Structure:**
```
playwright-framework/
├── tests/
│   ├── e2e/
│   │   ├── auth/
│   │   │   ├── login.spec.js
│   │   │   └── logout.spec.js
│   │   ├── checkout/
│   │   │   └── checkout-flow.spec.js
│   │   └── dashboard/
│   │       └── dashboard.spec.js
│   ├── api/
│   │   └── users.spec.js
│   └── visual/
│       └── homepage.spec.js
├── pages/                    # Page Object Model
│   ├── LoginPage.js
│   ├── HomePage.js
│   └── DashboardPage.js
├── fixtures/                 # Custom fixtures
│   └── custom-fixtures.js
├── utils/                    # Helper utilities
│   ├── testData.js
│   ├── dateUtils.js
│   └── apiHelpers.js
├── test-data/                # Test fixtures
│   └── sample-data.json
├── playwright.config.js
├── global-setup.js
├── global-teardown.js
└── package.json
```

**2. Page Object Model (POM):**
```javascript
// pages/LoginPage.js
export class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.getByLabel("Email");
    this.passwordInput = page.getByLabel("Password");
    this.loginBtn = page.getByRole("button", { name: "Log in" });
    this.errorMsg = page.getByTestId("login-error");
  }
  
  async goto() {
    await this.page.goto("/login");
  }
  
  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginBtn.click();
  }
  
  async getError() {
    return await this.errorMsg.textContent();
  }
}
```

**3. Custom Fixtures for Dependency Injection:**
```javascript
// fixtures/app-fixtures.js
import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

export const test = base.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});
```

**4. Configuration Management:**
```javascript
// playwright.config.js
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: process.env.CI ? [["html"], ["junit"], ["github"]] : [["html"], ["list"]],
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: {
    command: "npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

**5. Data-Driven Testing:**
```javascript
// test-data/users.json
{
  "valid": [
    { "email": "admin@test.com", "password": "password123", "role": "admin" },
    { "email": "user@test.com", "password": "password456", "role": "user" }
  ],
  "invalid": [
    { "email": "", "password": "password", "expectedError": "Email is required" },
    { "email": "invalid", "password": "password", "expectedError": "Invalid email" }
  ]
}

// tests/login.spec.js
import { test, expect } from "@playwright/test";
import users from "../test-data/users.json";

for (const user of users.valid) {
  test(`login as ${user.role}`, async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(user.email);
    await page.getByLabel("Password").fill(user.password);
    await page.getByRole("button", { name: "Log in" }).click();
    await expect(page).toHaveURL(`/${user.role}/dashboard`);
  });
}
```

---

### Q19: How do you handle flaky tests in Playwright?

**Answer:**

Flaky tests are tests that pass and fail inconsistently without code changes. Strategies to handle them:

**1. Identify Root Causes:**
- Timing issues (race conditions, async operations not complete)
- Shared state between tests
- Network instability
- Dynamic content loading
- Browser-specific behavior

**2. Use Proper Waiting (Not `waitForTimeout`):**
```javascript
// Bad:
await page.waitForTimeout(5000);

// Good:
await expect(page.getByText("Success")).toBeVisible({ timeout: 10000 });
```

**3. Isolate Test State:**
```javascript
// Each test should start fresh
test.beforeEach(async ({ page }) => {
  await page.context().clearCookies();
  await page.context().clearPermissions();
  await page.goto("/");
});
```

**4. Use Retries Strategically:**
```javascript
// playwright.config.js
export default defineConfig({
  retries: process.env.CI ? 2 : 0, // Only retry in CI
});

// Per-test retry for known flaky tests
test("flaky third-party integration", async ({ page }) => {
  test.retry(3);
  // ...
});
```

**5. Track Flaky Tests:**
```javascript
// Tag flaky tests
test("integration with third-party API @flaky", async ({ page }) => {
  // ...
});

// Run only stable tests
// npx playwright test --grep-invert "@flaky"
```

**6. Use Custom Assertions with Retry:**
```javascript
await expect(async () => {
  const response = await page.request.get("/api/data");
  expect(response.status()).toBe(200);
}).toPass({
  timeout: 10000,
  intervals: [1000, 2000, 5000],
});
```

---

### Q20: How do you organize and categorize tests in Playwright?

**Answer:**

**1. By Test Type:**
```
tests/
├── e2e/          # End-to-end tests
├── api/          # API tests
├── visual/       # Visual regression tests
├── accessibility/# Accessibility tests
└── smoke/        # Smoke/sanity tests
```

**2. By Feature/Module:**
```
tests/
├── auth/         # Authentication tests
├── checkout/     # Checkout flow tests
├── dashboard/    # Dashboard tests
└── settings/     # Settings tests
```

**3. By Priority/Tag:**
```javascript
test("critical login flow @smoke @critical", async ({ page }) => {});
test("user profile update @regression", async ({ page }) => {});
test("admin analytics dashboard @admin @regression", async ({ page }) => {});

// Run specific categories
// npx playwright test --grep "@smoke"
// npx playwright test --grep "@regression"
// npx playwright test --grep-invert "@flaky"
```

**4. By Environment:**
```javascript
test.describe("Production tests", () => {
  test.skip(() => process.env.ENV !== "production", "Only run in production");
  // ...
});
```

---

## 7. CI/CD & DevOps Integration

### Q21: How do you integrate Playwright tests into a CI/CD pipeline?

**Answer:**

**GitHub Actions Example:**
```yaml
name: Playwright E2E Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Run Playwright tests
        run: npx playwright test
        env:
          BASE_URL: ${{ secrets.BASE_URL }}
          TEST_USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
          TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}
      
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
      
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: test-results
          path: test-results/
          retention-days: 7
```

**Docker Integration:**
```dockerfile
FROM mcr.microsoft.com/playwright:v1.45.0-jammy

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx playwright install --with-deps

CMD ["npx", "playwright", "test"]
```

**Test Sharding for Large Suites:**
```yaml
# Run tests in parallel across 5 shards
strategy:
  matrix:
    shardIndex: [1, 2, 3, 4, 5]
    shardTotal: [5]
steps:
  - run: npx playwright test --shard=$SHARD_INDEX/$SHARD_TOTAL
```

---

### Q22: How do you run Playwright tests in Docker?

**Answer:**

```bash
# Option 1: Use official Playwright Docker image
docker run -v $(pwd):/work/ -w /work/ -it mcr.microsoft.com/playwright:v1.45.0-jammy \
  /bin/bash -c "npm ci && npx playwright test"

# Option 2: Build custom Docker image
docker build -t playwright-tests .
docker run --rm playwright-tests

# Option 3: Docker Compose
# docker-compose.yml
version: "3"
services:
  playwright:
    build: .
    volumes:
      - ./test-results:/app/test-results
      - ./playwright-report:/app/playwright-report
    environment:
      - BASE_URL=https://staging.example.com
      - CI=true

# Run with:
docker-compose up --exit-code-from playwright
```

---

## 8. Performance & Optimization

### Q23: How do you optimize Playwright test execution speed?

**Answer:**

**1. Use Storage State (Skip Login):**
```javascript
// Instead of logging in for every test
test.use({ storageState: "auth.json" });
```

**2. Parallel Execution:**
```javascript
// playwright.config.js
export default defineConfig({
  fullyParallel: true,
  workers: 4, // Limit to 4 workers
});

// Per-suite parallel
test.describe.configure({ mode: "parallel" });
```

**3. API Testing Instead of UI:**
```javascript
// Instead of UI flow (slow)
// await page.goto("/register"); ... multiple steps

// Use API (fast)
await request.post("/api/users", { data: userData });
```

**4. Reduce Unnecessary Waits:**
```javascript
// Use appropriate waitUntil
await page.goto("/", { waitUntil: "domcontentloaded" });

// Instead of networkidle when not needed
```

**5. Browser Context Reuse:**
```javascript
// Instead of launching new browser per test
// Playwright automatically shares browser across tests
// Each test gets a fresh context
```

**6. Skip Unnecessary Tests:**
```javascript
test.describe.configure({ mode: "parallel" });

// Skip tests based on conditions
test.skip(() => process.env.SKIP_SLOW_TESTS === "true", "Skipping slow tests");
```

**7. Use Web Server Configuration:**
```javascript
// playwright.config.js
webServer: {
  command: "npm run start",
  url: "http://localhost:3000",
  reuseExistingServer: !process.env.CI, // Reuse in local, start fresh in CI
},
```

---

### Q24: How do you measure and report test performance?

**Answer:**

```javascript
// Custom reporter that tracks test duration
class PerformanceReporter {
  onBegin(config, suite) {
    this.tests = [];
    this.startTime = Date.now();
  }
  
  onTestEnd(test, result) {
    this.tests.push({
      title: test.title,
      duration: result.duration,
      status: result.status,
    });
  }
  
  async onEnd(result) {
    const totalTime = Date.now() - this.startTime;
    const avgDuration = this.tests.reduce((sum, t) => sum + t.duration, 0) / this.tests.length;
    const slowestTests = [...this.tests].sort((a, b) => b.duration - a.duration).slice(0, 10);
    
    console.log(`\n=== Performance Report ===`);
    console.log(`Total execution time: ${totalTime}ms`);
    console.log(`Average test duration: ${avgDuration.toFixed(0)}ms`);
    console.log(`\nTop 10 Slowest Tests:`);
    slowestTests.forEach((t, i) => {
      console.log(`${i + 1}. ${t.title} - ${t.duration}ms (${t.status})`);
    });
  }
}
```

---

## 9. Debugging & Troubleshooting

### Q25: How do you debug failing Playwright tests?

**Answer:**

**1. Use Trace Viewer (Most Powerful):**
```javascript
// playwright.config.js
use: {
  trace: "on-first-retry",
}

// View trace
npx playwright show-trace trace.zip
```
Trace Viewer provides:
- Screenshots of every action
- DOM snapshots
- Network request/response details
- Console logs
- Timeline visualization

**2. Run in UI Mode:**
```bash
npx playwright test --ui
```
Features:
- Interactive test runner
- Time-travel debugging
- Locator explorer
- Action-by-action execution

**3. Run in Headed Mode:**
```bash
npx playwright test --headed
```

**4. Debug with Node Inspector:**
```bash
npx playwright test --debug
```

**5. Add Console Logs:**
```javascript
test("debug test", async ({ page }) => {
  page.on("console", msg => console.log("Browser console:", msg.text()));
  page.on("pageerror", err => console.error("Page error:", err.message));
  page.on("request", req => console.log("Request:", req.url()));
  page.on("response", res => console.log("Response:", res.url(), res.status()));
});
```

**6. Use `page.pause()`:**
```javascript
test("interactive debug", async ({ page }) => {
  await page.goto("/");
  await page.pause(); // Opens Playwright Inspector for interactive debugging
});
```

---

### Q26: How do you handle tests that fail only in CI but pass locally?

**Answer:**

**Common Causes and Solutions:**

**1. Timing Issues (Most Common):**
```javascript
// CI machines are slower - increase timeouts
// playwright.config.js
export default defineConfig({
  timeout: 60000, // Increase from default 30s
  expect: {
    timeout: 15000, // Increase assertion timeout
  },
});
```

**2. Different Screen Sizes:**
```javascript
// CI may run with different viewport
use: {
  viewport: { width: 1280, height: 720 },
},
```

**3. Missing Test Data:**
```javascript
// Use globalSetup to seed data in CI
globalSetup: require.resolve("./global-setup"),
```

**4. Network Differences:**
```javascript
// Mock external services in CI
await page.route("**/third-party-api**", (route) => route.fulfill({
  status: 200,
  body: JSON.stringify({ mock: true }),
}));
```

**5. Environment Variable Issues:**
```bash
# Ensure all required env vars are set in CI
env:
  BASE_URL: ${{ secrets.BASE_URL }}
  API_TOKEN: ${{ secrets.API_TOKEN }}
```

**6. Browser Version Differences:**
```javascript
// Pin browser versions
projects: [
  {
    name: "chromium",
    use: { ...devices["Desktop Chrome"], channel: "chrome" },
  },
],
```

**7. Resource Constraints:**
```bash
# Limit workers in CI
workers: process.env.CI ? 2 : undefined,
```

---

## 10. Real-World Scenarios

### Q27: How would you test a multi-step checkout flow?

**Answer:**

```javascript
import { test, expect } from "@playwright/test";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { ConfirmationPage } from "../pages/ConfirmationPage";

test.describe("Checkout Flow", () => {
  test("complete checkout with credit card", async ({ page }) => {
    // Setup
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const confirmationPage = new ConfirmationPage(page);
    
    // Step 1: Add items to cart
    await cartPage.goto();
    await cartPage.addItem("Product A", 2);
    await cartPage.addItem("Product B", 1);
    await expect(cartPage.getCartTotal()).toContainText("$150.00");
    
    // Step 2: Proceed to checkout
    await cartPage.clickCheckout();
    await expect(checkoutPage.shippingForm).toBeVisible();
    
    // Step 3: Fill shipping details
    await checkoutPage.fillShipping({
      firstName: "John",
      lastName: "Doe",
      address: "123 Test Street",
      city: "Test City",
      zipCode: "12345",
      country: "US",
    });
    
    // Step 4: Select shipping method
    await checkoutPage.selectShipping("express");
    await expect(checkoutPage.getShippingCost()).toContainText("$15.00");
    
    // Step 5: Fill payment details
    await checkoutPage.fillPayment({
      cardNumber: "4111111111111111",
      expiry: "12/25",
      cvv: "123",
      nameOnCard: "John Doe",
    });
    
    // Step 6: Review order
    await checkoutPage.clickReview();
    await expect(checkoutPage.getOrderSummary()).toContainText("$165.00"); // Items + shipping
    
    // Step 7: Place order
    await checkoutPage.clickPlaceOrder();
    
    // Step 8: Verify confirmation
    await expect(confirmationPage.getConfirmationMessage()).toBeVisible();
    await expect(confirmationPage.getOrderNumber()).toMatch(/ORD-\d+/);
    await expect(page).toHaveURL(/\/confirmation/);
    
    // Step 9: Verify email was sent (API check)
    const emailResponse = await page.request.get("/api/test/last-email");
    expect(emailResponse.ok()).toBeTruthy();
    const email = await emailResponse.json();
    expect(email.subject).toContain("Order Confirmation");
  });
});
```

---

### Q28: How do you test a SPA (Single Page Application) with Playwright?

**Answer:**

```javascript
import { test, expect } from "@playwright/test";

test.describe("SPA Testing", () => {
  test("navigation without page reload", async ({ page }) => {
    await page.goto("/");
    
    // SPA navigation doesn't trigger full page load
    const [navigation] = await Promise.all([
      page.waitForURL("**/dashboard"),
      page.getByRole("link", { name: "Dashboard" }).click(),
    ]);
    
    // Verify content changed without reload
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
    await expect(page).toHaveURL("https://example.com/dashboard");
  });
  
  test("handle dynamic content loading", async ({ page }) => {
    await page.goto("/");
    
    // Wait for data to load via API
    await page.waitForResponse("**/api/products");
    
    // Verify dynamic content
    await expect(page.locator(".product-card")).toHaveCount(10);
  });
  
  test("handle client-side routing", async ({ page }) => {
    await page.goto("/");
    
    // Navigate via client-side router
    await page.evaluate(() => {
      window.history.pushState({}, "", "/new-page");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    
    await expect(page).toHaveURL("https://example.com/new-page");
  });
  
  test("intercept API calls in SPA", async ({ page }) => {
    await page.route("**/api/data", async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ data: "mocked", loaded: true }),
      });
    });
    
    await page.goto("/");
    
    // Verify UI reflects mocked data
    await expect(page.getByText("mocked")).toBeVisible();
  });
});
```

---

## 11. Migration & Comparison

### Q29: How would you migrate from Selenium/Cypress to Playwright?

**Answer:**

**Migration Strategy:**

**1. Audit Existing Tests:**
- Count total tests
- Categorize by type (smoke, regression, E2E)
- Identify fragile tests (high flakiness rate)
- Map Selenium/Cypress commands to Playwright equivalents

**2. Command Mapping:**

| Selenium/Cypress | Playwright Equivalent |
|-----------------|----------------------|
| `driver.findElement(By.id("x"))` | `page.locator("#x")` or `page.getByTestId("x")` |
| `element.click()` | `await page.locator("#x").click()` |
| `element.sendKeys("text")` | `await page.getByLabel("x").fill("text")` |
| `driver.wait(until.elementLocated())` | `await page.locator("#x").waitFor()` |
| `driver.switchTo().frame()` | `page.frame("name")` |
| `driver.switchTo().alert().accept()` | `page.on("dialog", d => d.accept())` |
| `driver.manage().window().maximize()` | `viewport: { width: 1280, height: 720 }` |
| `cypress.get()` | `page.locator()` |
| `cypress.contains()` | `page.getByText()` |
| `cypress.request()` | `page.request` |

**3. Migration Steps:**
```bash
# 1. Set up Playwright project
npm init playwright@latest

# 2. Create parallel test structure
tests/
├── selenium/  # Existing tests
└── playwright/  # New tests

# 3. Migrate tests incrementally (start with least flaky)
# 4. Run both suites in parallel during transition
# 5. Gradually deprecate Selenium tests
```

**4. Key Differences to Address:**
- Playwright auto-waits (remove explicit waits)
- Playwright uses browser contexts (not window management)
- Playwright has built-in test runner (no need for Jest/Mocha if using `@playwright/test`)
- Playwright handles Shadow DOM automatically
- Playwright supports multi-tab natively

---

### Q30: When should you choose Playwright over Cypress or Selenium?

**Answer:**

**Choose Playwright When:**
- Cross-browser testing is required (Chromium, Firefox, WebKit)
- Multi-tab/multi-domain testing is needed
- Network interception and mocking are important
- Mobile emulation is needed
- You need fast execution (no WebDriver overhead)
- You want built-in auto-waiting
- You need to test across multiple pages simultaneously
- API testing needs to be integrated with E2E tests
- You want first-class TypeScript support

**Choose Cypress When:**
- Developer experience and debugging are top priority
- Time-travel debugging is essential
- You're testing a React/Vue app and want component testing
- You want automatic waiting without configuration
- Your team is already invested in the Cypress ecosystem

**Choose Selenium When:**
- You need to test legacy browsers (IE11)
- You need language support beyond JS/TS/Python/Java/.NET
- You have an existing Selenium grid infrastructure
- You need to test on real mobile devices via Appium
- Your organization has strict tool standardization on Selenium

---

## 12. Behavioral & Leadership

### Q31: How do you convince stakeholders to adopt Playwright over existing tools?

**Answer:**

**Business Case Points:**

1. **Speed:** "Playwright tests run 2-3x faster than Selenium due to WebSocket communication vs HTTP WebDriver protocol."

2. **Reliability:** "Auto-waiting eliminates 70% of flaky tests caused by timing issues, reducing CI failures and developer frustration."

3. **Cost Savings:** "Browser contexts are lightweight (~10ms creation) vs full browser launches (~2-5s), reducing infrastructure costs by 40-60%."

4. **Developer Productivity:** "Built-in test runner, Trace Viewer, and UI mode reduce debugging time by 50%."

5. **Maintenance:** "Resilient locators (getByRole, getByText) reduce test breakage when UI changes, cutting maintenance effort by 30-40%."

6. **Unified Testing:** "One tool for E2E, API, visual, and accessibility testing reduces tool sprawl and training overhead."

7. **Future-Proof:** "Actively maintained by Microsoft, growing adoption, and strong community support."

**Pilot Approach:**
```
1. Identify 10-20 critical, stable tests
2. Rewrite them in Playwright (1-2 weeks)
3. Run both suites in parallel for 2-3 weeks
4. Compare: execution time, flakiness rate, maintenance effort
5. Present data-driven results to stakeholders
6. Propose incremental migration plan
```

---

### Q32: How do you mentor junior team members in Playwright?

**Answer:**

**1. Structured Learning Path:**
```
Week 1: Basics
- Playwright architecture, installation, first test
- Locators, actions, assertions
- Running tests, reading reports

Week 2: Intermediate
- Fixtures, hooks, test organization
- Network interception, API testing
- Authentication, state management

Week 3: Advanced
- Page Object Model, framework design
- Custom fixtures, parallel execution
- Trace Viewer, debugging techniques

Week 4: Real-World
- CI/CD integration
- Handling flaky tests
- Writing maintainable tests
```

**2. Hands-On Exercises:**
- Start with simple login test
- Progress to multi-step workflows
- Add API testing integration
- Implement Page Object Model
- Set up CI pipeline

**3. Code Review Checklist:**
```
- [ ] Uses user-facing locators (getByRole, getByText)
- [ ] No hardcoded waitForTimeout()
- [ ] Proper assertions with auto-retry
- [ ] Tests are independent and isolated
- [ ] Page Object Model followed
- [ ] Meaningful test names
- [ ] Proper error handling
- [ ] Trace/screenshot configured
```

---

### Q33: Describe a challenging automation problem you solved with Playwright.

**Answer (Template - Customize with your experience):**

"In my previous project, we faced a challenge testing a real-time collaboration feature where multiple users could edit a document simultaneously. The challenge was:

1. **Problem:** We needed to verify that changes made by User A appeared in real-time for User B, and conflict resolution worked correctly.

2. **Solution:** I used Playwright's browser contexts to create multiple isolated sessions within a single browser instance:
```javascript
test("real-time collaboration", async ({ browser }) => {
  const contextA = await browser.newContext();
  const contextB = await browser.newContext();
  
  const pageA = await contextA.newPage();
  const pageB = await contextB.newPage();
  
  // Both users open the same document
  await pageA.goto("/doc/123");
  await pageB.goto("/doc/123");
  
  // User A makes changes
  await pageA.getByRole("textbox").fill("User A's text");
  
  // Verify User B sees changes in real-time
  await expect(pageB.getByRole("textbox")).toHaveText("User A's text", { timeout: 5000 });
});
```

3. **Result:** This approach allowed us to test real-time behavior without spinning up multiple browsers, reducing test execution time by 60% and enabling us to catch 3 race condition bugs before production."

---

## Quick Reference Cards

### Essential Commands
```bash
npx playwright test                    # Run all tests
npx playwright test --headed           # Run with visible browser
npx playwright test --ui               # Open UI mode
npx playwright test --debug            # Debug mode
npx playwright test -g "test name"     # Run specific test
npx playwright test --project chromium # Run specific browser
npx playwright test --shard=1/3        # Run shard 1 of 3
npx playwright show-report             # Open HTML report
npx playwright show-trace trace.zip    # Open trace viewer
npx playwright codegen URL             # Generate test code
```

### Key Configurations
```javascript
// playwright.config.js essentials
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  timeout: 60000,
  expect: { timeout: 10000 },
  reporter: [["html"], ["list"]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
});
```

### Common Interview Tips
1. Always mention **auto-waiting** as a key Playwright advantage
2. Explain **browser contexts** for test isolation
3. Demonstrate knowledge of **Trace Viewer** for debugging
4. Discuss **Page Object Model** for maintainability
5. Show understanding of **CI/CD integration**
6. Talk about **flaky test handling** strategies
7. Emphasize **network interception** capabilities
8. Mention **cross-browser** testing benefits
   