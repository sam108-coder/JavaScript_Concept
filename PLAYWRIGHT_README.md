# Playwright with JavaScript: From Beginner to Professional

A comprehensive guide to mastering Playwright for browser automation, testing, and web scraping using JavaScript.

---

## Table of Contents

1. [Beginner Concepts](#1-beginner-concepts)
   - [1.1 What is Playwright?](#11-what-is-playwright)
   - [1.2 Installation and Setup](#12-installation-and-setup)
   - [1.3 Basic Test Structure](#13-basic-test-structure)
   - [1.4 Locators](#14-locators)
   - [1.5 Clicking and Typing](#15-clicking-and-typing)
   - [1.6 Assertions](#16-assertions)
   - [1.7 Navigation](#17-navigation)
   - [1.8 Waiting and Auto-waiting](#18-waiting-and-auto-waiting)

2. [Intermediate Concepts](#2-intermediate-concepts)
   - [2.1 Handling Forms](#21-handling-forms)
   - [2.2 Frames and iframes](#22-frames-and-iframes)
   - [2.3 Dialogs and Popups](#23-dialogs-and-popups)
   - [2.4 File Upload and Download](#24-file-upload-and-download)
   - [2.5 Screenshots and Videos](#25-screenshots-and-videos)
   - [2.6 Handling Multiple Tabs and Windows](#26-handling-multiple-tabs-and-windows)
   - [2.7 Network Interception](#27-network-interception)
   - [2.8 Authentication](#28-authentication)
   - [2.9 Test Fixtures](#29-test-fixtures)
   - [2.10 Parameterized Tests](#210-parameterized-tests)

3. [Advanced Concepts](#3-advanced-concepts)
   - [3.1 Custom Fixtures](#31-custom-fixtures)
   - [3.2 Test Hooks and Lifecycle](#32-test-hooks-and-lifecycle)
   - [3.3 Parallel Execution](#33-parallel-execution)
   - [3.4 Sharding](#34-sharding)
   - [3.5 Retries and Flakiness](#35-retries-and-flakiness)
   - [3.6 API Testing](#36-api-testing)
   - [3.7 Component Testing](#37-component-testing)
   - [3.8 Visual Comparison](#38-visual-comparison)
   - [3.9 Trace Viewer](#39-trace-viewer)
   - [3.10 Codegen and UI Mode](#310-codegen-and-ui-mode)
   - [3.11 Browser Contexts](#311-browser-contexts)
   - [3.12 Evaluation and JavaScript Execution](#312-evaluation-and-javascript-execution)
   - [3.13 Shadow DOM](#313-shadow-dom)

4. [Professional Concepts](#4-professional-concepts)
   - [4.1 Page Object Model (POM)](#41-page-object-model-pom)
   - [4.2 Custom Reporter](#42-custom-reporter)
   - [4.3 Global Setup and Teardown](#43-global-setup-and-teardown)
   - [4.4 Docker and CI/CD](#44-docker-and-cicd)
   - [4.5 Accessibility Testing](#45-accessibility-testing)
   - [4.6 Performance Testing](#46-performance-testing)
   - [4.7 Web Scraping at Scale](#47-web-scraping-at-scale)
   - [4.8 Advanced Network Mocking](#48-advanced-network-mocking)
   - [4.9 Security Testing](#49-security-testing)
   - [4.10 Playwright Config Deep Dive](#410-playwright-config-deep-dive)

5. [Real-World Test Examples](#5-real-world-test-examples)
    - [5.1 Facebook: Login and Post Image Test](#51-facebook-login-and-post-image-test)
    - [5.2 Breaking Down the Test Flow](#52-breaking-down-the-test-flow)
    - [5.3 Best Practices for Social Media Testing](#53-best-practices-for-social-media-testing)

  6. [Industry-Level Project Structure](#6-industry-level-project-structure)
    - [6.1 Directory Tree](#61-directory-tree)
    - [6.2 Folder and File Descriptions](#62-folder-and-file-descriptions)
    - [6.3 Configuration Files](#63-configuration-files)
    - [6.4 Page Object Model at Scale](#64-page-object-model-at-scale)
    - [6.5 Custom Fixtures Architecture](#65-custom-fixtures-architecture)
    - [6.6 Test Data Management](#66-test-data-management)
    - [6.7 CI/CD Pipeline Integration](#67-cicd-pipeline-integration)
    - [6.8 Scaling Guidelines](#68-scaling-guidelines)

---

## 1. Beginner Concepts

### 1.1 What is Playwright?

Playwright is an open-source automation framework by Microsoft that enables reliable end-to-end testing for modern web apps.

**Key Features:**
- Cross-browser: Chromium, Firefox, WebKit
- Cross-platform: Windows, macOS, Linux
- Cross-language: JavaScript/TypeScript, Python, Java, .NET
- Auto-waiting: Automatically waits for elements to be ready
- Network interception: Mock, modify, or block network requests
- Multi-tab/multi-domain support
- Mobile emulation

### 1.2 Installation and Setup

**Definition:** Installation and setup refers to the process of adding Playwright as a dependency to your project, downloading the required browser binaries (Chromium, Firefox, WebKit), and configuring the initial project structure with test directories and configuration files. This foundational step ensures the testing environment is properly prepared before writing and executing tests.
```bash
# Initialize a new project
npm init playwright@latest

# Or install manually
npm init -y
npm install -D @playwright/test
npx playwright install
```

**Project Structure:**
```
my-project/
├── tests/
│   └── example.spec.js
├── playwright.config.js
├── package.json
└── node_modules/
```

**Basic Configuration (`playwright.config.js`):**
```javascript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
});
```

### 1.3 Basic Test Structure

**Definition:** The test structure is the foundational organizational pattern for writing Playwright tests, consisting of `test()` blocks that define individual test cases, `test.describe()` blocks that group related tests into suites, and assertion functions (`expect`) that verify expected outcomes. Each test receives fixtures (like `page`) that provide browser context, and tests run in isolation to ensure reliability and independence.

```javascript
import { test, expect } from "@playwright/test";

// Basic test
test("has title", async ({ page }) => {
  await page.goto("https://example.com");
  await expect(page).toHaveTitle(/Example/);
});

// Test with description
test.describe("Homepage Tests", () => {
  test("should display welcome message", async ({ page }) => {
    await page.goto("/");
    const welcome = page.getByText("Welcome");
    await expect(welcome).toBeVisible();
  });
  
  test("should have correct URL", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL("http://localhost:3000/");
  });
});

// Only run this test
test.only("critical test", async ({ page }) => {
  // ...
});

// Skip this test
test.skip("not ready yet", async ({ page }) => {
  // ...
});
```

**Running Tests:**
```bash
npx playwright test                    # Run all tests
npx playwright test --headed           # Run in headed mode
npx playwright test --ui               # Run in UI mode
npx playwright test example.spec.js    # Run specific file
npx playwright test -g "homepage"      # Run tests matching grep
npx playwright test --project chromium # Run specific browser
npx playwright show-report             # View HTML report
```

### 1.4 Locators

**Definition:** Locators are Playwright's method for finding and identifying elements on a web page. They act as queries that describe how to find a DOM element and are the foundation of all interactions (clicking, typing, asserting). Playwright's locators are auto-waiting, meaning they automatically wait for elements to be actionable before performing operations. They are designed to be resilient, user-facing, and resistant to DOM changes, with a priority system favoring accessibility-based selectors (getByRole) over brittle CSS/XPath selectors.

```javascript
// Recommended locators (user-facing)
page.getByRole("button", { name: "Submit" });
page.getByRole("link", { name: "Home" });
page.getByText("Welcome");
page.getByLabel("Username");
page.getByPlaceholder("Enter email");
page.getByTestId("submit-button");

// CSS selector
page.locator(".btn-primary");
page.locator("#submit-btn");
page.locator("div.card > h2");

// XPath (avoid when possible)
page.locator("//button[contains(text(), 'Submit')]");

// Chaining and filtering
page
  .getByRole("listitem")
  .filter({ hasText: "Item 1" })
  .getByRole("button");

page.locator("ul").filter({ has: page.getByText("Item 1") });

// Multiple locators
page.locator("button", { hasText: "Submit" });
```

**Locator Strategies Priority:**
1. `getByRole` - Best for accessibility
2. `getByText` - For visible text
3. `getByLabel` - For form inputs
4. `getByPlaceholder` - For input placeholders
5. `getByTestId` - For testing (requires `data-testid` attributes)
6. CSS/XPath - Last resort

### 1.5 Clicking and Typing

**Definition:** Clicking and typing refer to the fundamental user interaction methods in Playwright that simulate real user behavior on web elements. Clicking actions (click, dblclick, right-click, hover) trigger mouse events, while typing actions (fill, pressSequentially, keyboard press) simulate text input. Playwright's auto-waiting mechanism ensures elements are visible, enabled, and stable before performing these actions, eliminating the need for manual waits and reducing flaky tests.

```javascript
// Clicking
await page.getByRole("button").click();
await page.getByRole("link").click({ button: "right" }); // Right click
await page.getByRole("button").dblclick();
await page.getByRole("button").click({ force: true });   // Bypass actionability

// Hover
await page.getByRole("button").hover();

// Typing
await page.getByLabel("Username").fill("john@example.com");
await page.getByLabel("Password").fill("password123");

// Typing with delay (simulates real typing)
await page.getByLabel("Search").pressSequentially("Hello", { delay: 100 });

// Keyboard shortcuts
await page.keyboard.press("Enter");
await page.keyboard.press("Control+A");
await page.keyboard.press("Tab");
await page.keyboard.down("Shift");
await page.keyboard.up("Shift");

// Mouse actions
await page.mouse.click(100, 200);
await page.mouse.move(100, 200);
await page.mouse.dblclick(100, 200);
await page.mouse.dragAndDrop({ x: 100, y: 100 }, { x: 200, y: 200 });
```

### 1.6 Assertions

**Definition:** Assertions are verification statements that check whether the application's state matches expected conditions. Playwright's assertions are built-in, async, and auto-retrying, meaning they automatically wait and re-check until the expected condition is met or a timeout occurs. This eliminates flaky assertions caused by timing issues. Assertions cover element visibility, text content, attributes, CSS properties, form states, accessibility properties, and page-level conditions like URL and title.

```javascript
import { test, expect } from "@playwright/test";

test("assertions example", async ({ page }) => {
  await page.goto("https://example.com");
  
  // Page assertions
  await expect(page).toHaveTitle(/Example/);
  await expect(page).toHaveURL("https://example.com");
  
  // Visibility assertions
  const element = page.getByRole("heading", { name: "Welcome" });
  await expect(element).toBeVisible();
  await expect(element).toBeHidden();
  
  // Text assertions
  await expect(element).toHaveText("Welcome to Example");
  await expect(element).toContainText("Welcome");
  
  // Attribute assertions
  await expect(element).toHaveAttribute("href", "/home");
  await expect(element).toHaveClass(/active/);
  await expect(element).toHaveCSS("display", "block");
  
  // State assertions
  await expect(page.getByRole("checkbox")).toBeChecked();
  await expect(page.getByRole("button")).toBeEnabled();
  await expect(page.getByRole("textbox")).toBeEditable();
  await expect(page.getByRole("textbox")).toBeFocused();
  
  // Count assertions
  const items = page.getByRole("listitem");
  await expect(items).toHaveCount(5);
  
  // Value assertions
  await expect(page.getByLabel("Age")).toHaveValue("25");
  
  // Accessibility assertions
  await expect(page.locator("img").first()).toHaveAccessibleName("Logo");
  await expect(page.locator("img").first()).toHaveAccessibleDescription("Company logo");
});
```

**Custom Assertions:**
```javascript 
await expect(async () => {
  const response = await page.request.get("/api/data");
  expect(response.ok()).toBeTruthy();
  expect(await response.json()).toHaveProperty("success");
}).toPass({
  timeout: 5000,
  intervals: [1000, 2000, 5000],
});
```

### 1.7 Navigation

**Definition:** Navigation in Playwright refers to the methods for moving between pages and URLs within a browser session. This includes loading new pages (`goto`), going back/forward in browser history (`goBack`, `goForward`), reloading the current page (`reload`), and controlling how the browser waits for navigation to complete (via `waitUntil` options: `load`, `domcontentloaded`, `networkidle`, `commit`). Proper navigation handling ensures tests interact with fully loaded and stable pages.

```javascript
// Basic navigation
await page.goto("https://example.com");
await page.goto("/dashboard", { waitUntil: "domcontentloaded" });

// Wait until options
await page.goto("/", { waitUntil: "load" });           // load event fires
await page.goto("/", { waitUntil: "domcontentloaded" }); // DOMContentLoaded fires
await page.goto("/", { waitUntil: "networkidle" });    // No network connections for 500ms
await page.goto("/", { waitUntil: "commit" });         // Navigation is committed

// Go back and forward
await page.goBack();
await page.goForward();

// Reload
await page.reload();

// Get current URL
const url = page.url();
```

### 1.8 Waiting and Auto-waiting

**Definition:**
- **Auto-waiting:** Playwright's built-in mechanism that automatically waits for elements to be visible, enabled, stable (not animating), and ready to receive events before performing actions. This eliminates the need for manual `sleep()` calls and dramatically reduces test flakiness.
- **Explicit Waiting:** Manual wait methods for specific conditions like page load states (`waitForLoadState`), URL changes (`waitForURL`), DOM elements (`waitForSelector`), browser events (`waitForEvent`), network responses (`waitForResponse`), or custom JavaScript conditions (`waitForFunction`). These are used when you need to wait for something before the next action.

```javascript
// Explicit waits
await page.waitForLoadState("domcontentloaded");
await page.waitForLoadState("load");
await page.waitForLoadState("networkidle");

await page.waitForURL("**/dashboard");
await page.waitForSelector(".loaded");
await page.waitForTimeout(1000); // Use sparingly

// Wait for specific events
await page.waitForEvent("popup");
await page.waitForEvent("download");
await page.waitForEvent("dialog");
await page.waitForEvent("request");
await page.waitForEvent("response");

// Wait for function to return truthy
await page.waitForFunction(() => window.innerWidth > 1000);

// Wait for network response
const [response] = await Promise.all([
  page.waitForResponse("**/api/data"),
  page.getByRole("button").click(),
]);
```

---

## 2. Intermediate Concepts

### 2.1 Handling Forms

**Definition:** Form handling in Playwright refers to the methods for interacting with web form elements including text inputs, dropdowns (select), checkboxes, radio buttons, multi-select lists, and file upload fields. Playwright provides dedicated methods for each form element type that simulate real user interactions, including filling text, selecting options, checking/unchecking, and uploading files. Proper form handling ensures data is correctly entered and submitted as a real user would.

```javascript
import { test, expect } from "@playwright/test";

test("form handling", async ({ page }) => {
  await page.goto("/form");
  
  // Text inputs
  await page.getByLabel("Name").fill("John Doe");
  
  // Select dropdown
  await page.getByLabel("Country").selectOption("US");
  await page.getByLabel("Country").selectOption({ label: "United States" });
  await page.getByLabel("Country").selectOption({ value: "us" });
  await page.getByLabel("Country").selectOption(["US", "CA"]); // Multiple
  
  // Checkbox
  await page.getByLabel("Accept Terms").check();
  await page.getByLabel("Accept Terms").uncheck();
  await expect(page.getByLabel("Accept Terms")).toBeChecked();
  
  // Radio buttons
  await page.getByLabel("Male").check();
  await expect(page.getByLabel("Male")).toBeChecked();
  
  // Multi-select
  await page.getByLabel("Skills").selectOption(["js", "py"]);
  
  // File input
  await page.getByLabel("Upload").setInputFiles(["file1.txt", "file2.txt"]);
  
  // Submit form
  await page.getByRole("button", { name: "Submit" }).click();
  
  // Or press Enter
  await page.getByLabel("Name").press("Enter");
  
  // Verify form submission
  await expect(page.getByText("Form submitted")).toBeVisible();
});
```

### 2.2 Frames and iframes

**Definition:** Frames and iframes are HTML elements (`<iframe>`, `<frame>`, `<object>`) that embed another HTML document within the current page, creating an isolated browsing context with its own DOM, JavaScript environment, and security sandbox. In Playwright, interacting with content inside frames requires explicitly targeting the frame object before using normal locator methods, as locators on the main page cannot directly access elements within embedded frames.

```javascript
test("iframe handling", async ({ page }) => {
  await page.goto("/page-with-iframe");
  
  // Get frame by name
  const frame = page.frame("my-iframe");
  
  // Get frame by URL
  const frameByUrl = page.frame({ url: /example\.com/ });
  
  // Get all frames
  const frames = page.frames();
  
  // Interact with frame
  await frame.getByRole("button").click();
  await frame.getByLabel("Input").fill("text");
  
  // Nested frames
  const nestedFrame = frame.childFrames()[0];
  await nestedFrame.getByText("Nested content").click();
});
```

### 2.3 Dialogs and Popups

**Definition:**
- **Dialogs:** Browser-native modal windows triggered by JavaScript methods (`alert()`, `confirm()`, `prompt()`) that pause page execution until dismissed. In Playwright, dialogs must be handled by registering an event listener (`page.on("dialog")`) before the action that triggers them, otherwise the test will hang.
- **Popups:** New browser windows or tabs opened via `window.open()` or links with `target="_blank"`. Playwright captures these via `context.waitForEvent("page")`, allowing you to interact with the new page's content independently.

```javascript
test("dialog handling", async ({ page }) => {
  // Handle alert
  page.on("dialog", async (dialog) => {
    console.log(dialog.message());
    await dialog.dismiss(); // or dialog.accept()
  });
  
  await page.getByRole("button").click();
  
  // Handle confirm
  page.on("dialog", async (dialog) => {
    expect(dialog.type()).toBe("confirm");
    await dialog.accept("Yes");
  });
  
  // Handle prompt
  page.on("dialog", async (dialog) => {
    expect(dialog.type()).toBe("prompt");
    await dialog.accept("My response");
  });
  
  // Handle popup windows
  const [popup] = await Promise.all([
    page.waitForEvent("popup"),
    page.getByRole("link", { name: "Open popup" }).click(),
  ]);
  
  await expect(popup).toHaveURL("https://example.com/popup");
  await popup.close();
});
```

### 2.4 File Upload and Download

**Definition:**
- **File Upload:** The process of selecting and submitting files from the local filesystem to a web server through `<input type="file">` elements. Playwright bypasses the native file picker dialog by using `setInputFiles()`, directly providing file paths, buffers, or file objects to the input element.
- **File Download:** The process of receiving files from the server triggered by user actions (clicking a download button/link). Playwright captures downloads as events (`page.waitForEvent("download")`), allowing you to access the file's metadata, stream, or save it to disk.

```javascript
test("file upload", async ({ page }) => {
  await page.goto("/upload");
  
  // Single file
  await page.getByLabel("Upload file").setInputFiles("path/to/file.txt");
  
  // Multiple files
  await page.getByLabel("Upload files").setInputFiles([
    "file1.txt",
    "file2.txt",
  ]);
  
  // Buffer
  await page.getByLabel("Upload").setInputFiles({
    name: "file.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("file content"),
  });
  
  // Clear file input
  await page.getByLabel("Upload").setInputFiles([]);
});

test("file download", async ({ page }) => {
  await page.goto("/download");
  
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Download" }).click(),
  ]);
  
  // Get file info
  console.log(download.suggestedFilename());
  console.log(download.url());
  
  // Save file
  await download.saveAs("downloads/" + download.suggestedFilename());
  
  // Or get stream
  const stream = await download.createReadStream();
});
```

### 2.5 Screenshots and Videos

**Definition:**
- **Screenshots:** Static image captures of the entire page, a specific element, or a custom region of the viewport. Screenshots are used for visual debugging, visual regression testing, and documenting test failures. Playwright supports full-page screenshots, element-specific captures, and masked areas to ignore dynamic content.
- **Videos:** Continuous screen recordings of the entire browser viewport during test execution. Videos are invaluable for debugging failed tests by providing a step-by-step visual replay of what happened. They are configured at the browser context level and saved automatically based on your configuration.

```javascript
test("screenshots", async ({ page }) => {
  await page.goto("/");
  
  // Full page screenshot
  await page.screenshot({ path: "fullpage.png", fullPage: true });
  
  // Element screenshot
  await page.getByRole("img").screenshot({ path: "element.png" });
  
  // Screenshot with custom clip
  await page.screenshot({
    path: "clip.png",
    clip: { x: 0, y: 0, width: 800, height: 600 },
  });
});

// Video recording is configured in playwright.config.js
// use: {
//   video: "on",           // Always record
//   video: "off",          // Never record
//   video: "on-first-retry", // Only on retry
//   video: "retain-on-failure", // Keep only on failure
//   videoSize: { width: 1280, height: 720 },
// }

test("get video path", async ({ page }, testInfo) => {
  await page.goto("/");
  // Video is saved automatically, path available after test
  console.log(testInfo.outputPath("video.webm"));
});
```

### 2.6 Handling Multiple Tabs and Windows

**Definition:** Multiple tabs and windows handling refers to managing scenarios where a web application opens new browser tabs or windows (via `window.open()`, `target="_blank"` links, or programmatic window creation). In Playwright, each tab is represented as a separate `Page` object within the same `BrowserContext`. You capture new pages by listening to the `context.on("page")` event, enabling you to switch between tabs, interact with content in each tab independently, and manage their lifecycle (close, navigate, assert).

```javascript
test("multiple tabs", async ({ page, context }) => {
  await page.goto("/");
  
  // Wait for new page
  const [newPage] = await Promise.all([
    context.waitForEvent("page"),
    page.getByRole("link", { name: "Open in new tab" }).click(),
  ]);
  
  await newPage.waitForLoadState();
  await expect(newPage).toHaveURL(/example\.com/);
  
  // Switch between pages
  const pages = context.pages();
  for (const p of pages) {
    console.log(p.url());
  }
  
  // Close page
  await newPage.close();
});
```

### 2.7 Network Interception

**Definition:** Network interception is Playwright's ability to intercept, monitor, modify, mock, or block HTTP/HTTPS requests and responses made by the browser. Using `page.route()`, you can intercept any network request matching a URL pattern and either fulfill it with custom mock data, modify the request before sending it, abort it entirely, or let it pass through. This enables testing without real backends, simulating error scenarios, modifying API responses, and blocking unwanted requests (analytics, ads).

```javascript
test("network interception", async ({ page }) => {
  // Mock API response
  await page.route("**/api/users", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([{ id: 1, name: "John" }]),
    });
  });
  
  // Modify request
  await page.route("**/api/data", async (route) => {
    const headers = route.request().headers();
    headers["X-Custom-Header"] = "value";
    await route.continue({ headers });
  });
  
  // Abort request
  await page.route("**/analytics", (route) => route.abort());
  
  // Modify response
  await page.route("**/api/config", async (route) => {
    const response = await route.fetch();
    const json = await response.json();
    json.featureFlag = true;
    await route.fulfill({ response, json });
  });
  
  await page.goto("/");
});

// Global network setup
test("listen to requests", async ({ page }) => {
  const requests = [];
  page.on("request", (request) => {
    if (request.url().includes("/api")) {
      requests.push(request.url());
    }
  });
  
  await page.goto("/");
  console.log(requests);
});
```

### 2.8 Authentication

**Definition:** Authentication in Playwright refers to the process of simulating user login and maintaining session state across tests. Instead of logging in through the UI for every test (which is slow), Playwright allows you to authenticate once, save the browser's storage state (cookies, localStorage, sessionStorage) to a JSON file, and reuse it across multiple tests or browser contexts. This dramatically speeds up test execution while maintaining realistic authentication scenarios. It also supports HTTP Basic Auth credentials directly through browser context configuration.

```javascript
// Basic authentication
test("basic auth", async ({ browser }) => {
  const context = await browser.newContext({
    httpCredentials: {
      username: "user",
      password: "pass",
    },
  });
  
  const page = await context.newPage();
  await page.goto("/protected");
});

// Cookie-based authentication
test("login once and reuse", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Login
  await page.goto("/login");
  await page.getByLabel("Username").fill("admin");
  await page.getByLabel("Password").fill("password");
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForURL("/dashboard");
  
  // Save storage state
  await context.storageState({ path: "auth.json" });
  
  // Reuse in another context
  const newContext = await browser.newContext({
    storageState: "auth.json",
  });
  
  const newPage = await newContext.newPage();
  await newPage.goto("/dashboard");
  // Already authenticated!
});
```

**Global Authentication Setup:**
```javascript
// playwright.config.js
export default defineConfig({
  globalSetup: require.resolve("./global-setup"),
  use: {
    storageState: "auth.json",
  },
});

// global-setup.js
async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto("/login");
  await page.getByLabel("Username").fill("admin");
  await page.getByLabel("Password").fill("password");
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForURL("/dashboard");
  
  await page.context().storageState({ path: "auth.json" });
  await browser.close();
}
```

### 2.9 Test Fixtures

**Definition:** Fixtures are reusable setup and teardown functions that provide test dependencies (like `page`, `browser`, `context`) and custom resources to test functions. Playwright's fixture system automatically manages the lifecycle of each fixture: creating it before the test, injecting it into the test function, and cleaning it up afterward. Fixtures can be overridden, extended, and chained, enabling shared setup code (like login, database seeding, API clients) without duplication, making tests cleaner and more maintainable.

```javascript
import { test as base, expect } from "@playwright/test";

// Extend built-in fixtures
const test = base.extend({
  // Override page fixture
  page: async ({ page }, use) => {
    await page.goto("/");
    await use(page);
    // Cleanup after test
    await page.close();
  },
  
  // Custom fixture
  loggedInPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.goto("/login");
    await page.getByLabel("Username").fill("admin");
    await page.getByRole("button", { name: "Login" }).click();
    await page.waitForURL("/dashboard");
    
    await use(page);
    await context.close();
  },
});

test("use custom fixture", async ({ loggedInPage }) => {
  await loggedInPage.goto("/settings");
  await expect(loggedInPage).toHaveURL("/settings");
});
```

### 2.10 Parameterized Tests

**Definition:** Parameterized tests are a testing pattern where the same test logic is executed multiple times with different input values, configurations, or conditions. Instead of writing duplicate test code, you define a single test and run it across various datasets (e.g., different browsers, user roles, form inputs). Playwright supports parameterization through loops, `test.describe.configure()` for parallel/serial execution, conditional `test.skip()` for environment-specific tests, `test.fail()` for known bugs, and `test.slow()` for long-running scenarios.

```javascript
import { test, expect } from "@playwright/test";

// Simple parameterized test
for (const browserType of ["chromium", "firefox", "webkit"]) {
  test.describe(browserType, () => {
    test("works in all browsers", async ({ page }) => {
      await page.goto("/");
      await expect(page).toHaveTitle(/Example/);
    });
  });
}

// Test with test.describe.configure for parallel
test.describe.configure({ mode: "parallel" });

// Using test.fail for expected failures
test("known bug", async ({ page }) => {
  test.fail(); // Test is expected to fail
  await page.goto("/buggy-page");
  await expect(page.getByText("Broken")).toBeVisible();
});

// Conditional skip
test("mobile only", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "Only runs in Chromium");
  // ...
});

// Slow test marker
test("slow operation", async ({ page }) => {
  test.slow(); // Triples the timeout
  // ...
});
```

---

## 3. Advanced Concepts

### 3.1 Custom Fixtures

**Definition:** Custom fixtures are user-defined setup and teardown functions that extend Playwright's built-in fixture system to provide project-specific dependencies to tests. They allow you to create reusable resources (database connections, API clients, authenticated sessions, mock servers) that are automatically managed throughout the test lifecycle. Custom fixtures support different scopes (`test` scope recreates per test, `worker` scope shares across tests in the same worker), can depend on other fixtures, and can be configured as auto-fixtures (always run) or option fixtures (configurable per project).

```javascript
import { test as base } from "@playwright/test";

// Database fixture
const test = base.extend({
  db: async ({}, use) => {
    const connection = await connectToDatabase();
    await use(connection);
    await connection.close();
  },
  
  // Fixture with options
  apiClient: [
    async ({ baseURL }, use) => {
      const client = new APIClient(baseURL);
      await use(client);
    },
    { scope: "worker" }, // Worker-scoped fixture
  ],
  
  // Fixture that depends on other fixtures
  authenticatedApi: async ({ apiClient, db }, use) => {
    const token = await db.getAuthToken();
    apiClient.setToken(token);
    await use(apiClient);
  },
});

export { test, expect };
```

**Fixture Scopes:**
```javascript
// Test scope (default) - recreated for each test
{ scope: "test" }

// Worker scope - shared across tests in same worker
{ scope: "worker" }

// Auto fixture - always runs even if not requested
{ auto: true }

// Option fixture - can be configured per project
{ option: true }
```

### 3.2 Test Hooks and Lifecycle

**Definition:** Test hooks are lifecycle callbacks that execute code at specific points during the test run. Playwright provides four hook types:
- **`test.beforeAll()`:** Runs once before all tests in a suite. Used for expensive one-time setup like database connections or server startup.
- **`test.afterAll()`:** Runs once after all tests in a suite complete. Used for cleanup like closing connections or deleting test data.
- **`test.beforeEach()`:** Runs before every individual test. Used for common per-test setup like navigating to a page or resetting state.
- **`test.afterEach()`:** Runs after every individual test, even if it failed. Used for per-test cleanup, logging, or conditional actions based on test outcome.

```javascript
import { test, expect } from "@playwright/test";

test.describe("Suite with hooks", () => {
  // Runs once before all tests in this describe block
  test.beforeAll(async () => {
    console.log("Before all tests");
  });
  
  // Runs once after all tests in this describe block
  test.afterAll(async () => {
    console.log("After all tests");
  });
  
  // Runs before each test
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });
  
  // Runs after each test
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      console.log(`Test ${testInfo.title} failed`);
    }
  });
  
  test("test 1", async ({ page }) => {
    // ...
  });
  
  test("test 2", async ({ page }) => {
    // ...
  });
});
```

### 3.3 Parallel Execution

**Definition:** Parallel execution is a test running strategy where multiple tests are executed simultaneously across separate worker processes, significantly reducing total test execution time. Playwright runs tests in parallel by default, with each test file running in its own worker process. You can control parallelism at the config level (`workers`, `fullyParallel`), suite level (`test.describe.configure({ mode: "parallel" })`), or project level. Tests within a file run serially by default (to prevent shared state conflicts) but can be configured to run in parallel if they are independent.

```javascript
// playwright.config.js
export default defineConfig({
  fullyParallel: true,       // Run all tests in parallel
  workers: 4,                // Max 4 workers
  
  // Or per describe block
});

// In test file
test.describe.configure({ mode: "parallel" });
test.describe.configure({ mode: "serial" });    // Run tests in order
test.describe.configure({ workers: 2 });        // Limit workers for this suite

// Parallel projects in config
projects: [
  { name: "desktop", use: { ...devices["Desktop Chrome"] } },
  { name: "mobile", use: { ...devices["iPhone 13"] } },
]
```

### 3.4 Sharding

**Definition:** Sharding is a test distribution technique that splits the entire test suite into smaller subsets (shards) that can be executed across multiple machines, containers, or CI runners simultaneously. Each shard runs a portion of the total tests (e.g., `--shard=1/3` runs the first third), and results from all shards can be combined for a complete report. Sharding dramatically reduces total CI/CD pipeline time by parallelizing tests across infrastructure, making it essential for large test suites with hundreds or thousands of tests.

```bash
# Split tests into 3 shards, run shard 1
npx playwright test --shard=1/3
npx playwright test --shard=2/3
npx playwright test --shard=3/3

# In CI (GitHub Actions example)
# strategy:
#   matrix:
#     shardIndex: [1, 2, 3, 4, 5]
#     shardTotal: [5]
# steps:
#   - run: npx playwright test --shard=$SHARD_INDEX/$SHARD_TOTAL
```

### 3.5 Retries and Flakiness

**Definition:**
- **Retries:** A mechanism that automatically re-runs failed tests a specified number of times before marking them as truly failed. Retries help mitigate intermittent failures caused by network instability, timing issues, or transient server errors. Configured globally in `playwright.config.js` or per-test via `test.retry()`.
- **Flakiness:** The tendency of a test to produce inconsistent results (passing sometimes, failing other times) without any code changes. Flaky tests are a major problem in CI/CD pipelines. Playwright helps identify flaky tests through retry tracking, and provides tools like `test.describe.configure({ retries: N })` to investigate stability. The best approach is to fix the root cause (timing, state isolation, external dependencies) rather than relying on retries.

```javascript
// playwright.config.js
export default defineConfig({
  retries: 3,                    // Retry up to 3 times
  expect: {
    timeout: 10000,              // Assertion timeout
  },
  timeout: 60000,                // Test timeout
  globalTimeout: 600000,         // Max total time for all tests
});

// Per-test retry
test("flaky test", async ({ page }) => {
  test.retry(2);  // Retry this test up to 2 times
  // ...
});

// Detect flaky tests
test.describe("Flaky detection", () => {
  test.describe.configure({ retries: 5 });
  
  test("investigate this", async ({ page }) => {
    // Run multiple times to check stability
  });
});
```

### 3.6 API Testing

**Definition:** API testing in Playwright involves making HTTP requests directly (GET, POST, PUT, DELETE, PATCH) to backend endpoints and verifying responses without going through the browser UI. Playwright provides a built-in `request` fixture (`page.request` or `request`) that shares browser context (cookies, headers) with the page, allowing you to test authenticated API endpoints. API testing is faster than UI testing, ideal for testing backend logic, data validation, error handling, and integrating UI and API test scenarios in the same suite.

```javascript
import { test, expect } from "@playwright/test";

test("API testing", async ({ request }) => {
  // GET request
  const getResponse = await request.get("/api/users");
  expect(getResponse.ok()).toBeTruthy();
  const users = await getResponse.json();
  expect(users).toHaveLength(5);
  
  // POST request
  const postResponse = await request.post("/api/users", {
    data: {
      name: "John",
      email: "john@example.com",
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
  expect(postResponse.status()).toBe(201);
  
  // PUT request
  await request.put("/api/users/1", {
    data: { name: "Jane" },
  });
  
  // DELETE request
  const deleteResponse = await request.delete("/api/users/1");
  expect(deleteResponse.status()).toBe(204);
  
  // PATCH request
  await request.patch("/api/users/1", {
    data: { email: "new@email.com" },
  });
  
  // With query parameters
  await request.get("/api/users", {
    params: { page: 1, limit: 10 },
  });
  
  // With form data
  await request.post("/api/upload", {
    multipart: {
      file: {
        name: "file.txt",
        mimeType: "text/plain",
        buffer: Buffer.from("content"),
      },
    },
  });
});

// API context sharing browser state
test("API with browser cookies", async ({ page, request }) => {
  // Login via UI
  await page.goto("/login");
  await page.getByLabel("Username").fill("admin");
  await page.getByRole("button", { name: "Login" }).click();
  
  // API requests will use browser cookies
  const response = await request.get("/api/protected");
  expect(response.ok()).toBeTruthy();
});
```

### 3.7 Component Testing

**Definition:** Component testing is a testing approach where individual UI components (React, Vue, Angular, Svelte) are tested in isolation, rendered directly in a real browser without the full application wrapper. Playwright's experimental component testing (`@playwright/experimental-ct-*`) mounts components using a bundler (Vite), allowing you to interact with them, assert their rendered output, test user interactions, and verify props/state behavior. Component tests are faster than E2E tests and provide better isolation for debugging UI-specific issues.

```javascript
// playwright-ct.config.js
import { defineConfig, devices } from "@playwright/experimental-ct-react";

export default defineConfig({
  testDir: "./tests/component",
  use: {
    ctPort: 3100,
    ctViteConfig: {
      // Vite config
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});

// Component test
import { test, expect } from "@playwright/experimental-ct-react";
import { Button } from "../src/Button";

test("button renders", async ({ mount }) => {
  const component = await mount(<Button>Click me</Button>);
  await expect(component).toContainText("Click me");
  await component.click();
});

test("button with props", async ({ mount }) => {
  const component = await mount(
    <Button variant="primary" disabled={false}>
      Submit
    </Button>
  );
  await expect(component).toHaveClass(/btn-primary/);
  await expect(component).toBeEnabled();
});
```

### 3.8 Visual Comparison

**Definition:** Visual comparison (visual regression testing) is a testing technique that captures screenshots of pages or elements and compares them pixel-by-pixel against reference baseline images to detect unintended visual changes. Playwright's `toHaveScreenshot()` assertion automatically generates baseline images on first run and flags differences on subsequent runs. It supports tolerances (`maxDiffPixels`, `maxDiffPixelRatio`), masking dynamic content (timestamps, animations), disabling animations, and hiding the caret, making it ideal for catching CSS regressions, layout shifts, and design inconsistencies.

```javascript
test("visual regression", async ({ page }) => {
  await page.goto("/");
  
  // Full page screenshot comparison
  await expect(page).toHaveScreenshot("homepage.png", {
    fullPage: true,
    maxDiffPixels: 100,
  });
  
  // Element screenshot comparison
  const header = page.getByRole("banner");
  await expect(header).toHaveScreenshot("header.png", {
    maxDiffPixelRatio: 0.1,
  });
  
  // With mask to ignore dynamic content
  await expect(page).toHaveScreenshot("page.png", {
    mask: [page.getByTestId("timestamp")],
    maskColor: "#FF0000",
  });
  
  // With animations disabled
  await expect(page).toHaveScreenshot("page.png", {
    animations: "disabled",
  });
  
  // With caret disabled
  await expect(page).toHaveScreenshot("page.png", {
    caret: "hide",
  });
});
```

**Update snapshots:**
```bash
npx playwright test --update-snapshots
```

### 3.9 Trace Viewer

**Definition:** Trace Viewer is Playwright's powerful debugging tool that records a comprehensive trace of test execution, including screenshots, DOM snapshots, network requests, console logs, and a timeline of every action performed. Unlike a simple screenshot or video, traces allow you to step through each action, inspect the page state at any point, view the exact network request/response, and see which locator was used. Traces are configured via `trace: "on"`, `trace: "on-first-retry"`, or `trace: "retain-on-failure"` and viewed with `npx playwright show-trace trace.zip`.

```javascript
// Configure in playwright.config.js
use: {
  trace: "on",                    // Always record
  trace: "off",                   // Never record
  trace: "on-first-retry",        // Record only on first retry
  trace: "on-all-retries",        // Record on all retries
  trace: "retain-on-failure",     // Record and keep on failure
}

// Programmatically start/stop tracing
test("manual tracing", async ({ page }, testInfo) => {
  await page.context().tracing.start({
    screenshots: true,
    snapshots: true,
    sources: true,
  });
  
  await page.goto("/");
  await page.getByRole("button").click();
  
  await page.context().tracing.stop({
    path: `traces/${testInfo.title}.zip`,
  });
});
```

**View traces:**
```bash
npx playwright show-trace trace.zip
```

### 3.10 Codegen and UI Mode

**Definition:**
- **Codegen:** An interactive tool that records your manual browser actions and automatically generates Playwright test code in real-time. By running `npx playwright codegen URL`, a browser opens alongside a code editor where every click, type, and navigation is translated into test commands. It's invaluable for quickly scaffolding tests, learning locator strategies, and exploring page structure.
- **UI Mode:** A graphical test runner (`npx playwright test --ui`) that provides an interactive interface for running tests, exploring locators, time-travel debugging, and visualizing test execution step-by-step. It combines test execution, debugging, and exploration in a single visual environment.
```bash
# Generate test by recording actions
npx playwright codegen https://example.com

# With specific browser
npx playwright codegen --browser=webkit https://example.com

# With device emulation
npx playwright codegen --device="iPhone 13" https://example.com

# Save to file
npx playwright codegen --target=javascript -o tests/generated.spec.js https://example.com
```

**UI Mode:**
```bash
npx playwright test --ui
```

Features:
- Interactive test runner
- Time-travel debugging
- Explorer for locators
- Action trace visualization

### 3.11 Browser Contexts

**Definition:** A Browser Context is a lightweight, isolated incognito-like session within a single browser instance. Each context has its own cookies, localStorage, sessionStorage, and cache, completely separate from other contexts. Creating multiple contexts is much faster than launching multiple browsers, making it ideal for testing multi-user scenarios (e.g., admin and regular user simultaneously), parallel test execution, and maintaining test isolation. Contexts can be configured with custom viewport sizes, locales, timezones, geolocation, user agents, color schemes, permissions, and HTTP headers.

```javascript
test("multiple contexts", async ({ browser }) => {
  // Create isolated contexts
  const context1 = await browser.newContext();
  const context2 = await browser.newContext();
  
  // Each context has its own cookies, storage
  const page1 = await context1.newPage();
  const page2 = await context2.newPage();
  
  await page1.goto("/");
  await page2.goto("/");
  
  // Different storage states
  await context1.addCookies([{
    name: "session",
    value: "abc123",
    domain: "example.com",
    path: "/",
  }]);
  
  // Clear context
  await context1.clearCookies();
  await context1.clearPermissions();
  
  // Close contexts
  await context1.close();
  await context2.close();
});

// Context options
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  userAgent: "Custom Agent",
  locale: "en-US",
  timezoneId: "America/New_York",
  geolocation: { longitude: -74.006, latitude: 40.7128 },
  permissions: ["geolocation"],
  colorScheme: "dark",
  reducedMotion: "reduce",
  extraHTTPHeaders: {
    "X-Custom-Header": "value",
  },
  ignoreHTTPSErrors: true,
  javaScriptEnabled: true,
  bypassCSP: true,
});
```

### 3.12 Evaluation and JavaScript Execution

**Definition:** Evaluation refers to the ability to execute JavaScript code inside the browser's context (the page's DOM environment) from your Node.js test script. Playwright provides methods like `page.evaluate()` to run arbitrary JavaScript in the page, access DOM properties, call page-level functions, and retrieve computed values that are not accessible through locators. It also provides `evaluateAll()` for operating on all matching elements, `exposeFunction()` to make Node.js functions available in the page, and `addInitScript()`/`addScriptTag()`/`addStyleTag()` to inject code before or during page load.

```javascript
test("evaluate JavaScript", async ({ page }) => {
  // Evaluate in browser context
  const result = await page.evaluate(() => {
    return document.title;
  });
  console.log(result);
  
  // Pass arguments
  const dimension = await page.evaluate(({ selector }) => {
    const el = document.querySelector(selector);
    return { width: el.offsetWidth, height: el.offsetHeight };
  }, { selector: ".container" });
  
  // Evaluate on specific element
  const text = await page.getByRole("heading").evaluate((el) => el.textContent);
  
  // Evaluate all matching elements
  const allTexts = await page.locator("li").evaluateAll((elements) =>
    elements.map((el) => el.textContent)
  );
  
  // Expose function from Node to browser
  await page.exposeFunction("getNodeEnv", () => process.env.NODE_ENV);
  const env = await page.evaluate(() => window.getNodeEnv());
  
  // Add init script (runs before any page script)
  await page.addInitScript(() => {
    window.__playwright = true;
  });
  
  // Add style tag
  await page.addStyleTag({
    content: "body { background: red !important; }",
  });
  
  // Add script tag
  await page.addScriptTag({
    url: "https://cdn.example.com/library.js",
  });
});
```

### 3.13 Shadow DOM

**Definition:** Shadow DOM is a browser feature that encapsulates a DOM subtree, hiding it from the main document's CSS and JavaScript. It is used by web components to create isolated, reusable UI elements with their own styling and behavior. In most testing frameworks, interacting with Shadow DOM elements requires special handling. Playwright automatically pierces (penetrates) Shadow DOM boundaries by default, meaning locators like `getByRole()`, `getByText()`, and `locator()` work seamlessly with elements inside shadow roots without any additional configuration, making Shadow DOM testing transparent and straightforward.

```javascript
test("shadow DOM", async ({ page }) => {
  await page.goto("/shadow-dom");
  
  // Works automatically with shadow DOM
  await page.getByRole("button", { name: "Shadow Button" }).click();
  
  // CSS selectors pierce shadow DOM
  await page.locator("custom-element >> .inner-button").click();
  
  // If you need to disable shadow DOM piercing
  await page.locator("custom-element", { hasNotText: "shadow" }).click();
});

// Disable shadow DOM piercing per locator
await page.locator("element", { has: page.locator("deep(.shadow-content)") });
```

---

## 4. Professional Concepts

### 4.1 Page Object Model (POM)

**Definition:** Page Object Model (POM) is a design pattern that creates an object repository for UI elements, where each web page (or significant section) is represented as a class. The class encapsulates the page's locators, actions (methods), and assertions, abstracting away the underlying HTML structure from test code. This promotes code reusability, reduces duplication, and makes tests more maintainable: when a page's UI changes, you only update the page object class, not every test that uses it. POM separates test logic from page-specific implementation details.
```javascript
// pages/LoginPage.js
export class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.getByLabel("Username");
    this.passwordInput = page.getByLabel("Password");
    this.loginButton = page.getByRole("button", { name: "Login" });
    this.errorMessage = page.getByTestId("error-message");
    this.forgotPasswordLink = page.getByRole("link", { name: "Forgot password" });
  }
  
  async goto() {
    await this.page.goto("/login");
  }
  
  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
  
  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }
  
  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
  }
}

// pages/DashboardPage.js
export class DashboardPage {
  constructor(page) {
    this.page = page;
    this.welcomeMessage = page.getByRole("heading", { name: "Welcome" });
    this.logoutButton = page.getByRole("button", { name: "Logout" });
    this.userMenu = page.getByTestId("user-menu");
  }
  
  async waitForLoad() {
    await expect(this.welcomeMessage).toBeVisible();
  }
  
  async logout() {
    await this.logoutButton.click();
  }
}
```

**Using POM in Tests:**
```javascript
// tests/auth.spec.js
import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";

test.describe("Authentication", () => {
  let loginPage;
  let dashboardPage;
  
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.goto();
  });
  
  test("successful login", async () => {
    await loginPage.login("admin", "password");
    await dashboardPage.waitForLoad();
    await expect(dashboardPage.welcomeMessage).toBeVisible();
  });
  
  test("failed login shows error", async () => {
    await loginPage.login("invalid", "wrong");
    await expect(loginPage.errorMessage).toBeVisible();
  });
});
```

**POM with Fixtures:**
```javascript
// fixtures/pages.js
import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";

export const test = base.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
});

export { expect } from "@playwright/test";

// tests/auth.spec.js
import { test, expect } from "../fixtures/pages";

test("login flow", async ({ loginPage, dashboardPage }) => {
  await loginPage.goto();
  await loginPage.login("admin", "password");
  await dashboardPage.waitForLoad();
});
```

### 4.2 Custom Reporter

**Definition:** A custom reporter is a user-defined class that implements Playwright's reporter interface to customize how test results are displayed, logged, or exported. Reporters receive lifecycle events (`onBegin`, `onTestBegin`, `onTestEnd`, `onEnd`, `onError`) and can format output in any way: console messages, files, dashboards, or external services (Slack, Jira, TestRail). Custom reporters are useful for integrating with proprietary CI/CD systems, generating compliance reports, sending notifications, or creating domain-specific test summaries beyond Playwright's built-in reporters (list, html, json, junit, github, blob).

```javascript
// reporters/custom-reporter.js
export default class CustomReporter {
  onBegin(config, suite) {
    this.totalTests = suite.allTests().length;
    console.log(`Starting ${this.totalTests} tests`);
  }
  
  onTestBegin(test, result) {
    console.log(`Running: ${test.title}`);
  }
  
  onTestEnd(test, result) {
    const icon = result.status === "passed" ? "✓" : "✗";
    console.log(`${icon} ${test.title} (${result.duration}ms)`);
    
    if (result.status === "failed") {
      console.error(`Error: ${result.error.message}`);
    }
  }
  
  onError(error) {
    console.error(`Global error: ${error.message}`);
  }
  
  async onEnd(result) {
    console.log("\n--- Summary ---");
    console.log(`Total: ${result.total}`);
    console.log(`Passed: ${result.passed}`);
    console.log(`Failed: ${result.failed}`);
    console.log(`Skipped: ${result.skipped}`);
  }
}

// playwright.config.js
export default defineConfig({
  reporter: [
    ["list"],
    ["html"],
    ["./reporters/custom-reporter.js"],
  ],
});
```

### 4.3 Global Setup and Teardown

**Definition:**
- **Global Setup:** A function that runs once before any tests execute in the entire test suite. It is used for expensive, one-time initialization tasks like authenticating users (saving auth state), seeding databases, starting test servers, generating test data, or configuring environment variables. The setup runs outside the test runner context and has direct access to the Playwright browser API.
- **Global Teardown:** A function that runs once after all tests complete. It is used for cleanup tasks like deleting test data, stopping servers, removing temporary files, resetting database state, or revoking authentication tokens. Together, they ensure the test environment is properly prepared before and cleaned up after the entire test run.

```javascript
// global-setup.js
import { chromium } from "@playwright/test";

async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Login and save state
  await page.goto("https://app.example.com/login");
  await page.getByLabel("Username").fill("admin");
  await page.getByLabel("Password").fill("password");
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForURL("https://app.example.com/dashboard");
  
  await page.context().storageState({ path: "auth-state.json" });
  
  // Seed database
  await seedDatabase();
  
  await browser.close();
}

async function seedDatabase() {
  // Database seeding logic
}

export default globalSetup;

// global-teardown.js
async function globalTeardown() {
  // Cleanup database
  await cleanupDatabase();
  
  // Remove auth state
  const fs = require("fs");
  fs.unlinkSync("auth-state.json");
}

export default globalTeardown;

// playwright.config.js
export default defineConfig({
  globalSetup: require.resolve("./global-setup"),
  globalTeardown: require.resolve("./global-teardown"),
});
```

### 4.4 Docker and CI/CD

**Definition:**
- **Docker:** A containerization platform that packages Playwright, its dependencies, and browser binaries into a portable, reproducible environment. Using official Playwright Docker images (`mcr.microsoft.com/playwright`), you ensure consistent test execution across different machines and CI/CD environments without needing to install browsers manually.
- **CI/CD (Continuous Integration/Continuous Deployment):** Automated pipelines that run tests on every code commit, pull request, or deployment. Integrating Playwright into CI/CD (GitHub Actions, GitLab CI, Jenkins, Azure DevOps) ensures code changes are validated automatically, preventing regressions from reaching production. Configuration includes browser installation, headless mode, parallel execution, artifact uploads (reports, traces, screenshots), and test sharding for large suites.

**Dockerfile:**
```dockerfile
FROM mcr.microsoft.com/playwright:v1.45.0-jammy

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx playwright install --with-deps

CMD ["npx", "playwright", "test"]
```

**docker-compose.yml:**
```yaml
version: "3"
services:
  playwright:
    build: .
    volumes:
      - ./test-results:/app/test-results
      - ./blob-report:/app/blob-report
    environment:
      - CI=true
```

**GitHub Actions:**
```yaml
name: Playwright Tests
on:
  push:
    branches: [main]
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
          node-version: lts/*
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Run Playwright tests
        run: npx playwright test
        env:
          BASE_URL: ${{ secrets.BASE_URL }}
      
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

**GitLab CI:**
```yaml
stages:
  - test

playwright:
  stage: test
  image: mcr.microsoft.com/playwright:v1.45.0-jammy
  script:
    - npm ci
    - npx playwright test
  artifacts:
    when: always
    paths:
      - playwright-report/
      - test-results/
    expire_in: 7 days
```

### 4.5 Accessibility Testing

**Definition:** Accessibility (a11y) testing is the practice of verifying that web applications are usable by people with disabilities, including visual, auditory, motor, and cognitive impairments. Playwright integrates with `axe-core` (`@axe-core/playwright`) to automatically scan pages for WCAG (Web Content Accessibility Guidelines) violations, including missing alt text, insufficient color contrast, improper ARIA attributes, keyboard navigation issues, and screen reader compatibility problems. Accessibility testing ensures legal compliance (ADA, Section 508) and inclusive user experiences.

```javascript
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("accessibility scan", async ({ page }) => {
  await page.goto("/");
  
  const accessibilityScanResults = await new AxeBuilder({ page })
    .analyze();
  
  expect(accessibilityScanResults.violations).toEqual([]);
});

test("partial accessibility scan", async ({ page }) => {
  await page.goto("/form");
  
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .exclude("#third-party-widget")
    .analyze();
  
  // Log violations for review
  accessibilityScanResults.violations.forEach((violation) => {
    console.log(`Rule: ${violation.id}`);
    console.log(`Impact: ${violation.impact}`);
    console.log(`Description: ${violation.description}`);
    violation.nodes.forEach((node) => {
      console.log(`  - ${node.html}`);
    });
  });
  
  // Allow known violations
  expect(accessibilityScanResults.violations).toHaveLength(0);
});
```

**Install axe-core:**
```bash
npm install -D @axe-core/playwright
```

### 4.6 Performance Testing

**Definition:** Performance testing in Playwright involves measuring and verifying the speed, responsiveness, and resource efficiency of web applications under real browser conditions. Using `page.evaluate()` to access the browser's Performance API, you can capture metrics like DOMContentLoaded time, load time, Web Vitals (Largest Contentful Paint, Cumulative Layout Shift, First Input Delay), resource timing (individual asset load times), and custom performance marks. Performance testing ensures pages meet user experience benchmarks and catches regressions that degrade loading speed or rendering efficiency.

```javascript
import { test, expect } from "@playwright/test";

test("performance metrics", async ({ page }) => {
  await page.goto("/");
  
  // Get performance metrics
  const metrics = await page.evaluate(() => {
    const entries = performance.getEntriesByType("navigation")[0];
    return {
      domContentLoaded: entries.domContentLoadedEventEnd - entries.startTime,
      load: entries.loadEventEnd - entries.startTime,
      domInteractive: entries.domInteractive - entries.startTime,
    };
  });
  
  console.log("Performance metrics:", metrics);
  expect(metrics.domContentLoaded).toBeLessThan(2000);
  expect(metrics.load).toBeLessThan(3000);
  
  // Web Vitals
  const webVitals = await page.evaluate(async () => {
    return new Promise((resolve) => {
      const vitals = {};
      
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        vitals.lcp = entries[entries.length - 1];
      }).observe({ type: "largest-contentful-paint", buffered: true });
      
      new PerformanceObserver((list) => {
        vitals.cls = list.getEntries().reduce((sum, e) => sum + e.value, 0);
      }).observe({ type: "layout-shift", buffered: true });
      
      setTimeout(() => resolve(vitals), 3000);
    });
  });
  
  expect(webVitals.lcp?.startTime).toBeLessThan(2500);
  expect(webVitals.cls).toBeLessThan(0.1);
});

test("resource timing", async ({ page }) => {
  await page.goto("/");
  
  const resources = await page.evaluate(() => {
    return performance.getEntriesByType("resource").map((r) => ({
      name: r.name,
      duration: r.duration,
      size: r.transferSize,
    }));
  });
  
  console.table(resources);
});
```

### 4.7 Web Scraping at Scale

**Definition:** Web scraping at scale with Playwright involves extracting data from websites programmatically across multiple pages, handling dynamic content (JavaScript-rendered pages), pagination, rate limiting, and error recovery. Playwright excels at scraping because it renders JavaScript, handles SPAs (Single Page Applications), and interacts with pages like a real browser. Key techniques include concurrent scraping (processing multiple URLs in parallel using browser contexts), pagination handling (navigating through page sequences), retry logic (recovering from network failures), and data extraction via `page.evaluate()` to access the DOM directly.

```javascript
import { chromium } from "@playwright/browser";

async function scrapeWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const browser = await chromium.launch();
      const page = await browser.newPage();
      
      await page.goto(url, { waitUntil: "networkidle" });
      
      // Extract data
      const data = await page.evaluate(() => {
        const items = document.querySelectorAll(".item");
        return Array.from(items).map((item) => ({
          title: item.querySelector("h2")?.textContent,
          price: item.querySelector(".price")?.textContent,
          url: item.querySelector("a")?.href,
        }));
      });
      
      await browser.close();
      return data;
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === maxRetries - 1) throw error;
    }
  }
}

// Concurrent scraping
async function scrapeMultiple(urls, concurrency = 5) {
  const browser = await chromium.launch();
  const results = [];
  
  // Process in batches
  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = urls.slice(i, i + concurrency);
    const batchPromises = batch.map(async (url) => {
      const context = await browser.newContext();
      const page = await context.newPage();
      
      try {
        await page.goto(url, { waitUntil: "domcontentloaded" });
        const data = await page.evaluate(() => ({
          url: window.location.href,
          title: document.title,
        }));
        return { url, success: true, data };
      } catch (error) {
        return { url, success: false, error: error.message };
      } finally {
        await context.close();
      }
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }
  
  await browser.close();
  return results;
}

// Handle pagination
async function scrapeAllPages(baseUrl) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const allData = [];
  let currentPage = 1;
  
  while (true) {
    await page.goto(`${baseUrl}?page=${currentPage}`);
    
    const items = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".item")).map((el) => ({
        name: el.querySelector("h3")?.textContent,
      }));
    });
    
    if (items.length === 0) break;
    
    allData.push(...items);
    
    const hasNext = await page.evaluate(() => {
      return !!document.querySelector(".pagination .next:not(.disabled)");
    });
    
    if (!hasNext) break;
    currentPage++;
  }
  
  await browser.close();
  return allData;
}
```

### 4.8 Advanced Network Mocking

**Definition:** Advanced network mocking extends basic request interception by providing sophisticated strategies for simulating complex network behaviors. This includes HAR (HTTP Archive) recording and replay (capturing real network traffic and replaying it deterministically), dynamic mock handlers (programmatically generating responses based on request data), WebSocket mocking (intercepting real-time communication), and selective routing (mocking specific endpoints while passing through others). Advanced mocking enables testing in complete isolation from external services, simulating edge cases (rate limits, timeouts, partial failures), and creating deterministic test environments.

```javascript
import { test, expect } from "@playwright/test";

test("HAR recording and replay", async ({ page }) => {
  // Record HAR file
  const context = await page.context();
  await context.routeFromHAR("har/recording.har", { update: true });
  
  await page.goto("/");
  // Interactions are recorded
  
  // Replay from HAR
  const newContext = await browser.newContext();
  await newContext.routeFromHAR("har/recording.har", { notFound: "abort" });
  
  const newPage = await newContext.newPage();
  await newPage.goto("/");
  // All requests served from HAR
});

test("dynamic mocking with HAR", async ({ page }) => {
  await page.routeFromHAR("har/api.har", {
    url: "**/api/**",
    update: false,
  });
  
  await page.goto("/");
});

test("custom route handler", async ({ page }) => {
  class ApiMocker {
    constructor() {
      this.handlers = new Map();
    }
    
    mock(endpoint, response) {
      this.handlers.set(endpoint, response);
    }
    
    async handle(route) {
      const url = route.request().url();
      for (const [pattern, response] of this.handlers) {
        if (url.includes(pattern)) {
          await route.fulfill({
            status: response.status || 200,
            contentType: "application/json",
            body: JSON.stringify(response.body),
          });
          return;
        }
      }
      await route.continue();
    }
  }
  
  const mocker = new ApiMocker();
  mocker.mock("/api/users", { body: [{ id: 1, name: "Mocked User" }] });
  mocker.mock("/api/posts", { body: [], status: 404 });
  
  await page.route("**/api/**", (route) => mocker.handle(route));
  
  await page.goto("/");
});

test("WebSocket mocking", async ({ page }) => {
  await page.route("**/ws/**", async (route) => {
    // Intercept WebSocket connection
    const ws = await route.fetch();
    // Handle WebSocket messages
  });
});
```

### 4.9 Security Testing

**Definition:** Security testing with Playwright involves using the browser automation framework to identify and verify security vulnerabilities in web applications. This includes detecting CSP (Content Security Policy) violations, identifying mixed content (HTTP resources on HTTPS pages), finding sensitive data leakage in console logs, verifying security headers (HSTS, X-Frame-Options, X-Content-Type-Options), testing XSS (Cross-Site Scripting) injection resistance, and validating authentication/authorization flows. While Playwright is not a dedicated security scanning tool, it provides a practical approach for integrating security checks into automated test suites and CI/CD pipelines.

```javascript
import { test, expect } from "@playwright/test";

test("CSP violation detection", async ({ page }) => {
  const violations = [];
  
  page.on("console", (msg) => {
    if (msg.text().includes("Content Security Policy")) {
      violations.push(msg.text());
    }
  });
  
  await page.goto("/");
  expect(violations).toEqual([]);
});

test("mixed content detection", async ({ page }) => {
  const mixedContent = [];
  
  page.on("response", (response) => {
    if (response.url().startsWith("http://") && !response.url().includes("localhost")) {
      mixedContent.push(response.url());
    }
  });
  
  await page.goto("/");
  expect(mixedContent).toEqual([]);
});

test("sensitive data in console", async ({ page }) => {
  const logs = [];
  
  page.on("console", (msg) => {
    const text = msg.text();
    // Check for potential secrets
    if (/api[_-]?key|secret|token|password/i.test(text)) {
      logs.push(text);
    }
  });
  
  await page.goto("/");
  expect(logs).toEqual([]);
});

test("security headers", async ({ page }) => {
  const response = await page.goto("/");
  const headers = response.headers();
  
  expect(headers).toHaveProperty("strict-transport-security");
  expect(headers).toHaveProperty("x-content-type-options", "nosniff");
  expect(headers).toHaveProperty("x-frame-options");
  expect(headers).toHaveProperty("content-security-policy");
});

test("XSS vulnerability check", async ({ page }) => {
  // Test input fields for XSS
  const payload = "<script>alert('xss')</script>";
  
  await page.goto("/form");
  await page.getByLabel("Name").fill(payload);
  await page.getByRole("button", { name: "Submit" }).click();
  
  // Check if script executed
  const alertFired = await page.evaluate(() => window.__alertFired);
  expect(alertFired).toBeFalsy();
});
```

### 4.10 Playwright Config Deep Dive

**Definition:** The Playwright configuration file (`playwright.config.js`) is the central control point for defining how tests are discovered, executed, reported, and managed. It encompasses a comprehensive set of options including: test directory and file patterns, parallelization settings (workers, fullyParallel), timeout configurations (test timeout, global timeout, action timeout, navigation timeout, assertion timeout), retry strategies, reporter setups (multiple reporters simultaneously), browser projects (multi-browser/multi-device testing with device emulation), base URLs, tracing/screenshot/video policies, web server management (auto-starting dev servers), grep patterns (tag-based test filtering), and snapshot path templates. A well-configured file enables fine-grained control over every aspect of the test execution pipeline.

```javascript
// playwright.config.js
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  // Test directory
  testDir: "./tests",
  
  // Test file patterns
  testMatch: /.*\.spec\.js/,
  testIgnore: /.*manual\.spec\.js/,
  
  // Parallelization
  fullyParallel: true,
  workers: process.env.CI ? 4 : undefined,
  
  // Timeout settings
  timeout: 60000,
  globalTimeout: process.env.CI ? 600000 : undefined,
  
  // Retries
  retries: process.env.CI ? 2 : 0,
  
  // Expect defaults
  expect: {
    timeout: 10000,
    toHaveScreenshot: {
      maxDiffPixels: 100,
    },
    toMatchSnapshot: {
      maxDiffPixelRatio: 0.1,
    },
  },
  
  // Reporter configuration
  reporter: process.env.CI
    ? [["github"], ["html"], ["blob"]]
    : [["html"], ["list"]],
  
  // Global test options
  use: {
    // Base URL
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    
    // Browser options
    headless: true,
    viewport: { width: 1280, height: 720 },
    
    // Tracing
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    
    // Context options
    locale: "en-US",
    timezoneId: "America/New_York",
    colorScheme: "light",
    
    // Action options
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
  
  // Projects for different configurations
  projects: [
    // Desktop browsers
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        channel: "chrome", // Use installed Chrome
      },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    
    // Mobile devices
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 13"] },
    },
    
    // Authenticated tests
    {
      name: "authenticated",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "auth-state.json",
      },
      testMatch: /.*auth\.spec\.js/,
    },
    
    // API-only tests
    {
      name: "api",
      testMatch: /.*api\.spec\.js/,
      use: {
        baseURL: process.env.API_URL,
      },
    },
  ],
  
  // Web server to start before tests
  webServer: {
    command: "npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    stderr: "pipe",
    stdout: "pipe",
  },
  
  // Custom test directory per project
  // grep for test tags
  grep: /@smoke|@regression/,
  grepInvert: /@skip/,
  
  // Snapshot directory
  snapshotPathTemplate: "{testDir}/__screenshots__/{testFilePath}/{arg}{ext}",
  
  // Output directories
  outputDir: "./test-results",
  preserveOutput: "failures-only", // or "always", "never"
});
```

---

 ## 5. Real-World Test Examples

### 5.1 Facebook: Login and Post Image Test

**Scenario:** You want to write an end-to-end test that first logs into Facebook, then posts an image to the user's timeline/feed. This test combines multiple Playwright concepts: authentication, file upload, navigation, assertions, and waiting for dynamic content.

**Complete Test File (`tests/facebook-post-image.spec.js`):**

```javascript
import { test, expect } from "@playwright/test";
import path from "path";

test.describe("Facebook - Login and Post Image", () => {
  
  // Step 1: Login to Facebook
  test("should successfully login to Facebook", async ({ page }) => {
    await page.goto("https://www.facebook.com/");
    
    // Verify we are on the login page
    await expect(page).toHaveTitle(/Facebook/);
    
    // Enter credentials
    await page.getByLabel("Email address or phone number").fill("your-email@example.com");
    await page.getByLabel("Password").fill("your-password");
    
    // Click login button
    await page.getByRole("button", { name: "Log in" }).click();
    
    // Wait for navigation to feed/homepage after login
    await page.waitForURL("**/facebook.com**");
    await page.waitForLoadState("networkidle");
    
    // Verify successful login by checking feed elements
    const createPostBox = page.getByText("What's on your mind?");
    await expect(createPostBox).toBeVisible({ timeout: 15000 });
    
    // Handle "Save Login Info" dialog if it appears
    const notNowBtn = page.getByRole("button", { name: "Not now" });
    if (await notNowBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await notNowBtn.click();
    }
    
    // Verify we see the news feed
    await expect(page.getByRole("navigation")).toBeVisible();
    console.log("Login successful!");
  });

  // Step 2: Post an image to Facebook
  test("should post an image to Facebook feed", async ({ page }) => {
    // Navigate to Facebook (assumes already logged in via saved state)
    await page.goto("https://www.facebook.com/");
    await page.waitForLoadState("networkidle");
    
    // Wait for the create post box to be visible
    const createPostBox = page.getByText("What's on your mind?");
    await expect(createPostBox).toBeVisible({ timeout: 15000 });
    
    // Click to open the post creation modal
    await createPostBox.click();
    
    // Wait for the post modal to appear
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 10000 });
    
    // Type post text
    await page.getByRole("textbox", { name: "What's on your mind?" }).fill("Testing Playwright automation! This post was created by an automated test. #Testing #Playwright");
    
    // Click on photo/video button to add image
    // This button typically has a photo/camera icon
    const photoVideoBtn = page.getByRole("button", { name: "Photo/video" });
    await photoVideoBtn.click();
    
    // Wait for file chooser dialog to appear
    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      photoVideoBtn.click(),
    ]);
    
    // Set the file to upload (provide path to your test image)
    const imagePath = path.resolve(__dirname, "../test-assets/sample-image.jpg");
    await fileChooser.setFiles([imagePath]);
    
    // Wait for the image to be uploaded/previewed
    // Facebook shows a preview after upload - wait for it
    await page.waitForSelector('img[alt*="Photo"]', { timeout: 30000 });
    await expect(page.locator('img[alt*="Photo"]').first()).toBeVisible();
    
    // Add a caption to the photo (optional)
    const captionInput = page.getByRole("textbox", { name: "Say something about this..." });
    if (await captionInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await captionInput.fill("Automated test image uploaded via Playwright!");
    }
    
    // Handle potential "Post privacy" or audience selector
    const audienceBtn = page.getByRole("button", { name: /Public|Friends/ });
    if (await audienceBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      // Select "Public" or "Friends" as needed
      await audienceBtn.click();
      await page.getByText("Public").click();
    }
    
    // Handle potential "Continue" or "Done" button on the image preview screen
    const continueBtn = page.getByRole("button", { name: "Continue" });
    if (await continueBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await continueBtn.click();
    }
    
    // Click the Post button
    const postButton = page.getByRole("button", { name: "Post" });
    await expect(postButton).toBeEnabled();
    await postButton.click();
    
    // Wait for the post to be published
    // Facebook shows a "Post published" notification or the post appears in feed
    await page.waitForSelector('[data-testid="feedbackIndicator"]', { timeout: 30000 })
      .catch(async () => {
        // Alternative: wait for the post text to appear in the feed
        await expect(page.getByText("Testing Playwright automation!")).toBeVisible({ timeout: 15000 });
      });
    
    // Verify the post was successfully published
    await expect(page.getByText("Testing Playwright automation!")).toBeVisible({ timeout: 15000 });
    
    // Verify the image appears in the published post
    const publishedPost = page.getByText("Testing Playwright automation!").locator("..").locator("..");
    await expect(publishedPost.locator("img")).toBeVisible();
    
    // Verify engagement buttons are present (Like, Comment, Share)
    await expect(page.getByRole("button", { name: "Like" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Comment" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Share" })).toBeVisible();
    
    // Take a screenshot of the published post for documentation
    await page.screenshot({ path: "test-results/facebook-post-success.png", fullPage: true });
    
    console.log("Image post published successfully!");
  });

  // Step 3: Verify and clean up - delete the test post
  test("should verify and delete the test post", async ({ page }) => {
    await page.goto("https://www.facebook.com/");
    await page.waitForLoadState("networkidle");
    
    // Find the test post we created
    const testPost = page.getByText("Testing Playwright automation!").first();
    await expect(testPost).toBeVisible({ timeout: 20000 });
    
    // Scroll to ensure the post is in view
    await testPost.scrollIntoViewIfNeeded();
    
    // Click the three dots menu (post options)
    const postMenuBtn = testPost.locator('[aria-label="Action options"]');
    await postMenuBtn.click();
    
    // Click "Move to trash" or "Delete"
    await page.getByRole("menuitem", { name: /Move to trash|Delete|Delete post/ }).click();
    
    // Confirm deletion if dialog appears
    const confirmDelete = page.getByRole("button", { name: "Move to trash" });
    if (await confirmDelete.isVisible({ timeout: 5000 }).catch(() => false)) {
      await confirmDelete.click();
    }
    
    // Verify the post is no longer visible
    await expect(page.getByText("Testing Playwright automation!")).toBeHidden({ timeout: 10000 });
    
    console.log("Test post deleted successfully!");
  });
});
```

---

### 5.2 Breaking Down the Test Flow

This test demonstrates a complete end-to-end workflow combining multiple Playwright features:

**Phase 1 - Login:**
| Step | Playwright Concept | Method Used |
|------|-------------------|-------------|
| Navigate to Facebook | Navigation | `page.goto()` |
| Verify login page | Assertion | `expect(page).toHaveTitle()` |
| Enter email | Form filling | `page.getByLabel().fill()` |
| Enter password | Form filling | `page.getByLabel().fill()` |
| Click login button | Clicking | `page.getByRole("button").click()` |
| Wait for redirect | Waiting | `page.waitForURL()`, `waitForLoadState()` |
| Handle popup dialog | Dialog handling | `isVisible()` check + conditional click |
| Verify login success | Assertion | `expect().toBeVisible()` |

**Phase 2 - Post Image:**
| Step | Playwright Concept | Method Used |
|------|-------------------|-------------|
| Click create post box | Clicking | `page.getByText().click()` |
| Wait for modal | Waiting | `expect(page.getByRole("dialog")).toBeVisible()` |
| Type post text | Typing | `page.getByRole("textbox").fill()` |
| Click photo button | Clicking | `page.getByRole("button").click()` |
| Upload image file | File upload | `page.waitForEvent("filechooser")` + `setFiles()` |
| Wait for image preview | Waiting | `page.waitForSelector()`, `expect().toBeVisible()` |
| Click Post button | Clicking + Assertion | `expect().toBeEnabled()` + `click()` |
| Verify post published | Assertion | `expect(page.getByText()).toBeVisible()` |
| Verify engagement buttons | Assertion | `expect().toBeVisible()` |
| Screenshot proof | Screenshot | `page.screenshot()` |

**Phase 3 - Cleanup:**
| Step | Playwright Concept | Method Used |
|------|-------------------|-------------|
| Find test post | Locator | `page.getByText().first()` |
| Scroll into view | Scrolling | `scrollIntoViewIfNeeded()` |
| Open post menu | Clicking | `locator('[aria-label="Action options"]').click()` |
| Delete post | Clicking | `page.getByRole("menuitem").click()` |
| Confirm deletion | Conditional click | `isVisible()` check + `click()` |
| Verify deletion | Assertion | `expect().toBeHidden()` |

---

### 5.3 Best Practices for Social Media Testing

**1. Use Authentication State (Avoid Login Every Time):**
```javascript
// Save login state once (global-setup.js)
async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto("https://www.facebook.com/");
  await page.getByLabel("Email address or phone number").fill(process.env.FB_EMAIL);
  await page.getByLabel("Password").fill(process.env.FB_PASSWORD);
  await page.getByRole("button", { name: "Log in" }).click();
  await page.waitForURL("**/facebook.com**");
  
  await page.context().storageState({ path: "fb-auth.json" });
  await browser.close();
}

// Reuse in tests (playwright.config.js)
export default defineConfig({
  globalSetup: require.resolve("./global-setup"),
  use: {
    storageState: "fb-auth.json",
  },
});
```

**2. Handle Dynamic Content and Timing:**
```javascript
// Use explicit waits instead of waitForTimeout()
// Bad:
await page.waitForTimeout(5000);

// Good:
await expect(page.getByText("Post published")).toBeVisible({ timeout: 30000 });

// For elements that may or may not appear:
async function handleOptionalElement(page, locator) {
  try {
    const isVisible = await locator.isVisible({ timeout: 5000 });
    if (isVisible) {
      await locator.click();
      return true;
    }
  } catch (e) {
    // Element not found - continue
  }
  return false;
}
```

**3. Use Test Data Files:**
```javascript
// tests/data/test-image.js
import path from "path";

export const testImageData = {
  imagePath: path.resolve(__dirname, "../fixtures/test-photo.jpg"),
  postText: `Automated test post - ${new Date().toISOString()}`,
  caption: "Test image uploaded by Playwright",
};
```

**4. Add Retry Logic for Flaky Operations:**
```javascript
// playwright.config.js
export default defineConfig({
  retries: process.env.CI ? 3 : 1,
  use: {
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
});

// Per-test retry for particularly flaky steps
test("post image", async ({ page }) => {
  test.retry(2);
  // ... test code
});
```

**5. Use Environment Variables for Sensitive Data:**
```javascript
// .env (never commit this file!)
FB_EMAIL=your-email@example.com
FB_PASSWORD=your-secure-password

// In your test
const email = process.env.FB_EMAIL;
const password = process.env.FB_PASSWORD;

if (!email || !password) {
  test.skip("Missing Facebook credentials");
}
```

**6. Page Object Model for Social Media:**
```javascript
// pages/FacebookHomePage.js
export class FacebookHomePage {
  constructor(page) {
    this.page = page;
    this.createPostBox = page.getByText("What's on your mind?");
    this.postModal = page.getByRole("dialog");
    this.postTextbox = page.getByRole("textbox", { name: "What's on your mind?" });
    this.photoVideoBtn = page.getByRole("button", { name: "Photo/video" });
    this.postButton = page.getByRole("button", { name: "Post" });
  }
  
  async clickCreatePost() {
    await this.createPostBox.click();
    await expect(this.postModal).toBeVisible();
  }
  
  async typePostText(text) {
    await this.postTextbox.fill(text);
  }
  
  async uploadImage(filePath) {
    await this.photoVideoBtn.click();
    const [fileChooser] = await Promise.all([
      this.page.waitForEvent("filechooser"),
      this.photoVideoBtn.click(),
    ]);
    await fileChooser.setFiles([filePath]);
    await this.page.waitForSelector('img[alt*="Photo"]', { timeout: 30000 });
  }
  
  async submitPost() {
    await expect(this.postButton).toBeEnabled();
    await this.postButton.click();
  }
}

// In test:
const fbHome = new FacebookHomePage(page);
await fbHome.clickCreatePost();
await fbHome.typePostText("Hello from Playwright!");
await fbHome.uploadImage("test-photo.jpg");
await fbHome.submitPost();
```

---

## 6. Industry-Level Project Structure

### 6.1 Directory Tree

A production-grade Playwright automation framework follows a modular, scalable architecture. Below is the recommended directory structure used by mid-to-large organizations:

```
automation-framework/
├── .github/
│   └── workflows/
│       ├── playwright-ci.yml          # GitHub Actions pipeline
│       └── playwright-nightly.yml     # Scheduled nightly runs
│
├── tests/
│   ├── e2e/                           # End-to-end tests
│   │   ├── auth/
│   │   │   ├── login.spec.js
│   │   │   ├── logout.spec.js
│   │   │   └── registration.spec.js
│   │   ├── dashboard/
│   │   │   ├── widgets.spec.js
│   │   │   └── navigation.spec.js
│   │   ├── checkout/
│   │   │   ├── cart.spec.js
│   │   │   ├── payment.spec.js
│   │   │   └── order-confirmation.spec.js
│   │   └── admin/
│   │       ├── user-management.spec.js
│   │       └── settings.spec.js
│   │
│   ├── api/                           # API/integration tests
│   │   ├── users.spec.js
│   │   ├── orders.spec.js
│   │   └── health-check.spec.js
│   │
│   ├── visual/                        # Visual regression tests
│   │   ├── homepage.spec.js
│   │   └── product-page.spec.js
│   │
│   └── smoke/                         # Smoke/sanity suite
│       └── critical-path.spec.js
│
├── pages/                             # Page Object Model classes
│   ├── base/
│   │   ├── BasePage.js                # Shared page methods
│   │   └── BaseComponent.js           # Reusable component class
│   ├── auth/
│   │   ├── LoginPage.js
│   │   └── RegistrationPage.js
│   ├── dashboard/
│   │   ├── DashboardPage.js
│   │   └── WidgetsPage.js
│   ├── checkout/
│   │   ├── CartPage.js
│   │   ├── PaymentPage.js
│   │   └── ConfirmationPage.js
│   └── shared/
│       ├── Header.js
│       ├── Footer.js
│       └── Navigation.js
│
├── fixtures/                          # Custom test fixtures
│   ├── authenticated-user.js          # Pre-authenticated browser context
│   ├── test-data-fixture.js           # Test data injection
│   ├── db-fixture.js                  # Database connection fixture
│   ├── api-fixture.js                 # API client fixture
│   └── mock-fixture.js                # Network mock fixtures
│
├── utils/                             # Shared utilities
│   ├── api-client.js                  # HTTP client wrapper
│   ├── db-helper.js                   # Database query helpers
│   ├── date-helper.js                 # Date formatting utilities
│   ├── file-helper.js                 # File read/write operations
│   ├── string-helper.js               # String manipulation utilities
│   ├── test-data-generator.js         # Faker-based data generation
│   ├── retry-helper.js                # Custom retry logic
│   └── logger.js                      # Logging utility (pino/winston)
│
├── config/
│   ├── playwright.config.js           # Main Playwright configuration
│   ├── environments/
│   │   ├── dev.env                    # Dev environment variables
│   │   ├── staging.env                # Staging environment variables
│   │   └── production.env             # Production environment variables
│   └── test-data/
│       ├── users.json                 # Test user accounts
│       ├── products.json              # Product catalog data
│       └── orders.json                # Order test data
│
├── test-data/                         # Static and dynamic test data
│   ├── fixtures/
│   │   ├── valid-user.json
│   │   ├── invalid-user.json
│   │   └── sample-products.json
│   ├── uploads/
│   │   ├── test-image.png
│   │   └── test-document.pdf
│   └── seeds/
│       └── seed-database.js           # Database seeding script
│
├── reports/                           # Generated test reports (gitignored)
│   ├── html-report/                   # Playwright HTML reporter output
│   ├── junit-results/                 # JUnit XML for CI integration
│   ├── allure-results/                # Allure reporter output
│   └── traces/                        # Playwright trace files (gitignored)
│
├── .env.example                       # Environment variable template
├── .gitignore                         # Git ignore rules
├── .eslintrc.js                       # ESLint configuration
├── package.json                       # Dependencies and scripts
├── package-lock.json                  # Locked dependency versions
├── README.md                          # Project documentation
└── Dockerfile                         # Container configuration
```

### 6.2 Folder and File Descriptions

#### `tests/` — Test Suites
Organized by feature/domain rather than by technical layer. Each `.spec.js` file groups related test cases.

| Directory | Purpose |
|-----------|---------|
| `e2e/` | Full end-to-end user flow tests |
| `api/` | API endpoint validation, contract testing |
| `visual/` | Screenshot comparison / visual regression |
| `smoke/` | Critical path tests run on every deploy |

#### `pages/` — Page Object Model
Every page or shared UI component gets its own class. Extends `BasePage` for common actions like navigation, screenshot capture, and waiting.

| File | Responsibility |
|------|----------------|
| `BasePage.js` | Constructor receives `page`, defines shared methods (`goto()`, `screenshot()`, `waitForPageLoad()`) |
| `LoginPage.js` | Locators + actions for the login page |
| `Header.js` | Shared navigation/header component used across pages |

#### `fixtures/` — Custom Test Fixtures
Playwright's fixture system is the backbone of test setup and teardown. Fixtures provide isolated, reusable contexts.

| Fixture | What It Provides |
|---------|------------------|
| `authenticated-user.js` | Pre-loaded auth state via `storageState`, returns a logged-in `page` |
| `test-data-fixture.js` | Injects test data from JSON/config into each test |
| `db-fixture.js` | Opens a database connection, seeds data, cleans up after test |
| `api-fixture.js` | Provides a pre-configured API client (axios/node-fetch wrapper) |

#### `utils/` — Shared Utilities
Pure helper functions with no Playwright dependencies. Easily unit-testable.

#### `config/` — Configuration
Centralized configuration for environments, Playwright settings, and structured test data.

#### `test-data/` — Test Data
Static JSON fixtures, uploadable files, and database seeding scripts kept separate from test code for maintainability.

#### `reports/` — Test Output
All generated artifacts (HTML reports, traces, screenshots, videos). Always added to `.gitignore`.

### 6.3 Configuration Files

#### `playwright.config.js`

```javascript
// playwright.config.js
import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

// Load environment based on NODE_ENV
const envFile = process.env.NODE_ENV === "production"
  ? "config/environments/production.env"
  : process.env.NODE_ENV === "staging"
    ? "config/environments/staging.env"
    : "config/environments/dev.env";

dotenv.config({ path: envFile });

export default defineConfig({
  // Test directory and file pattern
  testDir: "./tests",
  testMatch: ["**/*.spec.js"],

  // Run tests in parallel across files
  fullyParallel: true,

  // Fail the build on first error in CI
  forbidOnly: !!process.env.CI,

  // Retry failed tests in CI (not locally)
  retries: process.env.CI ? 2 : 0,

  // Optimize worker count for CI
  workers: process.env.CI ? 4 : undefined,

  // Reporter configuration
  reporter: [
    ["list"],
    ["html", { outputFolder: "reports/html-report", open: "never" }],
    ["junit", { outputFolder: "reports/junit-results", outputFile: "results.xml" }],
    ["allure-playwright"],
  ],

  // Global timeout per test
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },

  // Shared context options
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    viewport: { width: 1280, height: 720 },
    locale: "en-US",
    timezoneId: "America/New_York",
  },

  // Projects for cross-browser testing
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "API Tests",
      testMatch: "**/api/**/*.spec.js",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // Global setup (auth, DB seeding)
  globalSetup: require.resolve("./config/global-setup.js"),
  globalTeardown: require.resolve("./config/global-teardown.js"),

  // Snapshot directory for visual regression
  snapshotDir: "./test-results/snapshots",
  snapshotPathTemplate: "{snapshotDir}/{testFilePath}/{arg}{ext}",
});
```

#### `.env.example`

```env
# Base URL for the application under test
BASE_URL=https://staging.example.com

# API configuration
API_BASE_URL=https://api.staging.example.com
API_TIMEOUT=30000

# Database (for test data seeding)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=test_db
DB_USER=test_user
DB_PASSWORD=

# Test accounts
TEST_ADMIN_EMAIL=admin@test.com
TEST_ADMIN_PASSWORD=
TEST_USER_EMAIL=user@test.com
TEST_USER_PASSWORD=

# CI-specific
CI=true
SHARD_TOTAL=4
SHARD_INDEX=0

# Third-party services
BROWSERSTACK_USERNAME=
BROWSERSTACK_ACCESS_KEY=
SLACK_WEBHOOK_URL=
```

#### `package.json` Scripts

```json
{
  "scripts": {
    "test": "playwright test",
    "test:ui": "playwright test --ui",
    "test:headed": "playwright test --headed",
    "test:debug": "playwright test --debug",
    "test:smoke": "playwright test tests/smoke --retries=0",
    "test:api": "playwright test tests/api --project='API Tests'",
    "test:visual": "playwright test tests/visual --project=chromium",
    "test:chrome": "playwright test --project=chromium",
    "test:firefox": "playwright test --project=firefox",
    "test:all-browsers": "playwright test --project=chromium --project=firefox --project=webkit",
    "test:ci": "playwright test --retries=2 --workers=4 --reporter=html,junit,list",
    "test:shard": "playwright test --shard=$SHARD_INDEX/$SHARD_TOTAL",
    "test:changed": "playwright test --last-failed",
    "test:codegen": "playwright codegen",
    "report:show": "npx playwright show-report reports/html-report",
    "report:allure": "allure generate reports/allure-results --clean && allure open",
    "lint": "eslint . --ext .js",
    "lint:fix": "eslint . --ext .js --fix",
    "docker:build": "docker build -t playwright-tests .",
    "docker:run": "docker run --rm playwright-tests"
  }
}
```

### 6.4 Page Object Model at Scale

In a large framework, POM classes follow a strict inheritance pattern:

```javascript
// pages/base/BasePage.js
export class BasePage {
  constructor(page) {
    this.page = page;
  }

  async goto(path) {
    await this.page.goto(path, { waitUntil: "networkidle" });
  }

  async screenshot(name) {
    await this.page.screenshot({
      path: `reports/screenshots/${name}-${Date.now()}.png`,
      fullPage: true,
    });
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState("networkidle");
  }
}

// pages/auth/LoginPage.js
export class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.emailInput = page.getByLabel("Email");
    this.passwordInput = page.getByLabel("Password");
    this.loginBtn = page.getByRole("button", { name: "Sign In" });
    this.errorMsg = page.getByTestId("login-error");
  }

  async login(email, password) {
    await this.goto("/login");
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginBtn.click();
  }

  async loginAndVerify(email, password, expectError) {
    await this.login(email, password);
    if (expectError) {
      await expect(this.errorMsg).toBeVisible();
    } else {
      await expect(this.page).toHaveURL("/dashboard");
    }
  }
}

// pages/shared/Header.js (reusable component)
export class Header extends BasePage {
  constructor(page) {
    super(page);
    this.logo = page.getByRole("link", { name: "Home" });
    this.navLinks = page.locator("nav a");
    this.userMenu = page.getByRole("button", { name: "User menu" });
    this.logoutBtn = page.getByRole("menuitem", { name: "Logout" });
  }

  async navigateTo(pageName) {
    await this.navLinks.filter({ hasText: pageName }).click();
  }

  async logout() {
    await this.userMenu.click();
    await this.logoutBtn.click();
    await this.page.waitForURL("/login");
  }
}
```

### 6.5 Custom Fixtures Architecture

Custom fixtures are the most powerful way to share setup logic. Here's the recommended pattern:

```javascript
// fixtures/authenticated-user.js
import { test as base } from "@playwright/test";
import path from "path";
import fs from "fs";

export const test = base.extend({
  authenticatedPage: async ({ browser }, use) => {
    // Check if auth state exists, create if not
    const authFile = "test-results/auth-state.json";

    if (!fs.existsSync(authFile)) {
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto("/login");
      await page.getByLabel("Email").fill(process.env.TEST_USER_EMAIL);
      await page.getByLabel("Password").fill(process.env.TEST_USER_PASSWORD);
      await page.getByRole("button", { name: "Sign In" }).click();
      await page.waitForURL("/dashboard");
      await context.storageState({ path: authFile });
      await context.close();
    }

    // Create a fresh context with saved auth
    const context = await browser.newContext({ storageState: authFile });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

export { expect } from "@playwright/test";

// Usage in a test:
// import { test, expect } from "../fixtures/authenticated-user.js";
// test("dashboard loads for authenticated user", async ({ authenticatedPage }) => {
//   await authenticatedPage.goto("/dashboard");
//   await expect(authenticatedPage.getByRole("heading", { name: "Welcome" })).toBeVisible();
// });
```

```javascript
// fixtures/test-data-fixture.js
import { test as base } from "@playwright/test";
import fs from "fs";
import path from "path";

export const test = base.extend({
  testData: async ({}, use) => {
    const usersPath = path.join(process.cwd(), "config/test-data/users.json");
    const users = JSON.parse(fs.readFileSync(usersPath, "utf-8"));
    await use(users);
  },
});

export { expect } from "@playwright/test";
```

### 6.6 Test Data Management

#### Static Test Data (JSON)

```json
// config/test-data/users.json
{
  "admin": {
    "email": "admin@test.com",
    "password": "Admin123!",
    "role": "administrator"
  },
  "standard": {
    "email": "user@test.com",
    "password": "User123!",
    "role": "user"
  },
  "locked": {
    "email": "locked@test.com",
    "password": "WrongPass1!",
    "role": "locked",
    "expectedError": "Account locked. Contact support."
  }
}
```

#### Dynamic Test Data Generation

```javascript
// utils/test-data-generator.js
import { faker } from "@faker-js/faker";

export function generateUser(overrides = {}) {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 12 }),
    phone: faker.phone.number(),
    ...overrides,
  };
}

export function generateOrder(overrides = {}) {
  return {
    product: faker.commerce.productName(),
    quantity: faker.number.int({ min: 1, max: 5 }),
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      zip: faker.location.zipCode(),
    },
    ...overrides,
  };
}
```

### 6.7 CI/CD Pipeline Integration

#### GitHub Actions Workflow

```yaml
# .github/workflows/playwright-ci.yml
name: Playwright E2E Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    - cron: "0 6 * * *"  # Nightly at 6 AM UTC

env:
  NODE_ENV: staging
  BASE_URL: ${{ secrets.STAGING_URL }}
  TEST_USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
  TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}

jobs:
  test:
    timeout-minutes: 30
    runs-on: ubuntu-latest

    strategy:
      fail-fast: false
      matrix:
        shard: [1, 2, 3, 4]

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Run Playwright tests (shard ${{ matrix.shard }})
        run: npx playwright test --shard=${{ matrix.shard }}/4 --retries=2
        env:
          CI: true

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report-shard-${{ matrix.shard }}
          path: |
            playwright-report/
            test-results/
          retention-days: 14

      - name: Merge HTML reports
        if: always()
        run: npx playwright merge-reports --reporter html ./blob-report

      - name: Upload merged report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report-merged
          path: playwright-report/
          retention-days: 30
```

#### Docker Configuration

```dockerfile
# Dockerfile
FROM mcr.microsoft.com/playwright:v1.48.0-jammy

WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Install Playwright browsers
RUN npx playwright install --with-deps chromium

# Set environment
ENV CI=true
ENV NODE_ENV=staging

# Run tests
CMD ["npx", "playwright", "test", "--project=chromium", "--retries=2"]
```

### 6.8 Scaling Guidelines

#### When Your Suite Grows Beyond 500 Tests

| Challenge | Solution |
|-----------|----------|
| Slow execution | Enable sharding (`--shard=x/y`), parallel workers, and API-only tests where possible |
| Flaky tests | Use `retries` in CI, add trace on failure, audit locators, eliminate `waitForTimeout` |
| Test data conflicts | Use unique identifiers (timestamps/UUIDs), seed DB per test, isolate test environments |
| Maintenance overhead | Strict POM discipline, shared component classes, centralized locator strategy |
| CI pipeline bottlenecks | Split suites (smoke → e2e → visual), run smoke on PR, full suite nightly |
| Cross-browser failures | Start with Chromium, add Firefox/WebKit in nightly runs only |

#### Recommended Test Execution Strategy

| Pipeline | Scope | Frequency | Retries | Browsers |
|----------|-------|-----------|---------|----------|
| PR / Commit | Smoke + changed files | Every push | 0 | Chromium only |
| Pre-merge | Full e2e + API | Before merge | 2 | Chromium |
| Nightly | Full suite + all browsers + visual | Daily 6 AM | 3 | Chromium, Firefox, WebKit |
| Release | Full suite + staging | Before release | 3 | All browsers + mobile |

#### Key Performance Targets

| Metric | Target |
|--------|--------|
| Single test duration | < 30 seconds |
| Full smoke suite | < 5 minutes |
| Full e2e suite (sharded) | < 20 minutes |
| API test suite | < 3 minutes |
| Flaky test rate | < 2% |
| Code coverage of critical paths | 100% |

---

## Quick Reference

### Common Locators

| Locator | Usage | Best For |
|---------|-------|----------|
| `getByRole()` | `page.getByRole("button", { name: "Submit" })` | Accessibility, most reliable |
| `getByText()` | `page.getByText("Welcome")` | Visible text content |
| `getByLabel()` | `page.getByLabel("Email")` | Form inputs |
| `getByPlaceholder()` | `page.getByPlaceholder("Enter name")` | Input placeholders |
| `getByAltText()` | `page.getByAltText("Logo")` | Images |
| `getByTitle()` | `page.getByTitle("Tooltip")` | Elements with title attribute |
| `getByTestId()` | `page.getByTestId("submit-btn")` | Testing-specific selectors |
| `locator()` | `page.locator(".class")` | CSS selectors |

### Assertion Methods

| Assertion | Description |
|-----------|-------------|
| `toBeVisible()` | Element is visible |
| `toBeHidden()` | Element is hidden |
| `toHaveText()` | Element has exact text |
| `toContainText()` | Element contains text |
| `toHaveValue()` | Input has value |
| `toHaveAttribute()` | Element has attribute |
| `toHaveClass()` | Element has class |
| `toHaveCSS()` | Element has CSS property |
| `toBeChecked()` | Checkbox is checked |
| `toBeEnabled()` | Element is enabled |
| `toBeDisabled()` | Element is disabled |
| `toBeEditable()` | Element is editable |
| `toBeFocused()` | Element is focused |
| `toBeEmpty()` | Element is empty |
| `toHaveCount()` | Locator has count |
| `toHaveURL()` | Page has URL |
| `toHaveTitle()` | Page has title |

### Wait Strategies

| Method | Use Case |
|--------|----------|
| Auto-waiting | Default for all actions |
| `waitForSelector()` | Wait for element |
| `waitForURL()` | Wait for navigation |
| `waitForLoadState()` | Wait for page load |
| `waitForResponse()` | Wait for API response |
| `waitForEvent()` | Wait for browser event |
| `waitForFunction()` | Wait for JS condition |

---

## Best Practices

1. **Use user-facing locators** - Prefer `getByRole`, `getByText`, `getByLabel` over CSS/XPath
2. **Avoid hardcoded waits** - Use auto-waiting or explicit waits for conditions
3. **Use Page Object Model** - For maintainable and reusable test code
4. **Isolate tests** - Each test should be independent and not rely on other tests
5. **Use fixtures wisely** - Share setup code through custom fixtures
6. **Configure retries in CI** - Handle flaky tests gracefully
7. **Record traces** - Always record traces for debugging failures
8. **Mock external services** - Use network interception for reliable tests
9. **Test across browsers** - Ensure compatibility with all target browsers
10. **Keep tests fast** - Avoid unnecessary navigation and waits

---

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright GitHub](https://github.com/microsoft/playwright)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Trace Viewer](https://trace.playwright.dev/)
- [Playwright Community](https://github.com/microsoft/playwright/discussions)
