# Senior Playwright Automation Interview Questions & Answers (5+ Years Experience)

A comprehensive collection of interview questions and answers tailored for a **senior-level Playwright automation engineer** with 5+ years of experience. Focuses on architecture, design decisions, scaling frameworks, team leadership, and strategic thinking.

---

## Table of Contents

1. [Architecture & Protocol Design](#1-architecture--protocol-design)
2. [Framework Architecture at Scale](#2-framework-architecture-at-scale)
3. [Advanced Browser Context & State Management](#3-advanced-browser-context--state-management)
4. [Network & API Architecture](#4-network--api-architecture)
5. [Performance Optimization & Benchmarking](#5-performance-optimization--benchmarking)
6. [Design Patterns & Abstraction](#6-design-patterns--abstraction)
7. [CI/CD Architecture & Pipeline Design](#7-cicd-architecture--pipeline-design)
8. [Test Strategy & Quality Gates](#8-test-strategy--quality-gates)
9. [Advanced Debugging & Observability](#9-advanced-debugging--observability)
10. [Security Testing with Playwright](#10-security-testing-with-playwright)
11. [Migration Strategy & Risk Management](#11-migration-strategy--risk-management)
12. [Team Leadership & Mentoring](#12-team-leadership--mentoring)
13. [System Design for Test Infrastructure](#13-system-design-for-test-infrastructure)
14. [Real-World Architecture Challenges](#14-real-world-architecture-challenges)

---

## 1. Architecture & Protocol Design

### Q1: Compare Playwright's WebSocket protocol against Selenium's WebDriver protocol at a protocol level. What are the architectural implications of each?

**Answer:**

At the protocol level, the difference is fundamental:

**Selenium WebDriver (HTTP-based):**
- Uses RESTful HTTP requests: each command (find element, click, get text) is a separate HTTP request/response cycle
- Protocol overhead: HTTP headers, TCP handshake, response parsing per command
- Stateless: server doesn't maintain command state between requests
- Latency: typical round-trip is 2-10ms per command even on localhost
- For a test with 200 commands, pure protocol overhead can exceed 1-2 seconds

**Playwright (WebSocket-based):**
- Single persistent WebSocket connection established at context creation
- Commands are sent as JSON messages over the existing socket
- Zero connection overhead per command (no TCP handshake, no HTTP headers)
- Supports CDP (Chrome DevTools Protocol) directly — access to browser internals that WebDriver cannot reach
- Bidirectional: browser can push events (console, network, dialog) without polling
- Supports asynchronous command pipelining — send multiple commands without waiting for responses

**Architectural Implications:**

| Factor | HTTP (Selenium) | WebSocket (Playwright) |
|--------|-----------------|----------------------|
| Per-command latency | 2-10ms | ~0.1ms |
| Connection overhead | New TCP handshake per driver session | One-time handshake |
| Browser events | Requires polling | Push-based, real-time |
| CDP access | Limited | Full access |
| Scalability | More CPU-bound (HTTP parsing) | More I/O-bound (socket events) |
| Resource usage | Higher per-session memory | Lower per-context memory |

**When it matters most:** In a CI pipeline running 1000+ tests, Playwright's protocol efficiency typically yields 20-40% faster execution purely from reduced protocol overhead, before considering any other optimization.

---

### Q2: How does Playwright manage browser process lifecycle? What happens at the OS level when you launch Playwright?

**Answer:**

Playwright manages browser processes at three distinct levels:

**1. Browser Launch (`browserType.launch()`)**
- Playwright spawns a child OS process for the browser
- For Chromium: `chrome.exe --remote-debugging-pipe=1234 --user-data-dir=...`
- Establishes a CDP (Chrome DevTools Protocol) connection over a pipe or WebSocket
- Browser runs as a separate OS process with its own PID, memory space, and thread pool
- Playwright monitors the process health via process exit codes and signals

**2. Browser Context Creation (`browser.newContext()`)**
- No new OS process — creates a logical incognito session within the existing browser process
- Creates a new storage partition (cookies, localStorage, IndexedDB isolated)
- New context group in the browser's process sandbox
- Memory cost: roughly 5-15MB per context (depends on cached resources)

**3. Page Creation (`context.newPage()`)**
- Creates a new rendering surface within the context
- Chromium spawns a new renderer process per site isolation (Site Isolation policy)
- Each page may have its own renderer process (for cross-origin pages)
- Memory cost: roughly 20-60MB per page depending on DOM complexity

**Process Architecture (Chromium):**

```
playwright script
  └── node process (1 thread per worker)
       └── browser process (CDP pipe)
            ├── GPU process
            ├── Network process
            ├── Storage process
            └── Renderer process(es)
                 ├── main thread (DOM, CSS, layout)
                 ├── compositor thread
                 └── worker threads (service workers, web workers)
```

**Resource Management:**
- Playwright's `browser.close()` sends SIGTERM to the browser process
- If the browser process crashes, Playwright detects via pipe closure and throws an error
- Orphaned processes are cleaned via Playwright's process registry (registers cleanup handlers)
- In CI, the `forbidOnly` option prevents hanging processes via global timeout

---

### Q3: Explain Playwright's implementation of the Chrome DevTools Protocol (CDP). Which CDP domains does Playwright leverage most heavily?

**Answer:**

Playwright communicates with Chromium through CDP over a WebSocket connection (or pipe). For Firefox and WebKit, Playwright uses their respective debugging protocols but abstracts them behind a unified API.

**Key CDP Domains Playwright Uses:**

| CDP Domain | Playwright Feature |
|------------|-------------------|
| `Page` | Navigation, DOM queries, screenshots, print-to-PDF |
| `DOM` | Element inspection, shadow DOM piercing, layout metrics |
| `Runtime` | `page.evaluate()`, JS execution, console message capture |
| `Network` | Request interception, response mocking, HAR recording |
| `Input` | Mouse/keyboard/touch events, drag-and-drop, scrolling |
| `Emulation` | Viewport, user agent, geolocation, timezone, locale, device metrics |
| `Storage` | Cookies, localStorage, sessionStorage, IndexedDB manipulation |
| `Security` | Certificate handling, mixed content warnings |
| `Performance` | Metrics, timeline, memory profiling |
| `Target` | Tab/window management, multi-page coordination |
| `Fetch` | Request interception (modern alternative to `Network` domain) |
| `WebAuthn` | Virtual authenticator for WebAuthn/Passkey testing |
| `Console` | Console message capture and inspection |
| `Log` | Log entry capture |
| `CSS` | Style computation, font loading, media queries |
| `Animation` | Animation control, pause/resume |
| `Accessibility` | Accessibility tree, ARIA attribute inspection |

**Low-Level Example (what Playwright does internally):**

```javascript
// When you call: page.getByRole("button").click()
// Playwright internally sends CDP messages like:

// 1. Evaluate the locator in the DOM context
ws.send(JSON.stringify({
  id: 1,
  method: "DOM.querySelector",
  params: { nodeId: document.documentElement, selector: "[role='button']" }
}));

// 2. Scroll element into view
ws.send(JSON.stringify({
  id: 2,
  method: "Input.dispatchMouseEvent",
  params: { type: "mousePressed", x: 100, y: 200, button: "left" }
}));

// 3. Perform the click
ws.send(JSON.stringify({
  id: 3,
  method: "Input.dispatchMouseEvent",
  params: { type: "mousePressed", x: 100, y: 200, button: "left" }
}));
```

**For Firefox:** Playwright uses the Firefox Remote Protocol (Juggler) — a custom protocol built by the Playwright team that mimics CDP capabilities.
**For WebKit:** Playwright uses the WebKit Remote Debugging Protocol.

The abstraction layer that unifies these three protocols is one of Playwright's most impressive engineering achievements.

---

## 2. Framework Architecture at Scale

### Q4: Design a Playwright test framework for an organization with 20 microservices and 200+ engineers. What's your folder structure, how do you handle shared state, and how do you ensure test isolation?

**Answer:**

**Monorepo Structure:**

```
e2e-platform/
├── packages/
│   ├── core/                         # Shared core library
│   │   ├── fixtures/                 # Base fixtures
│   │   ├── pages/                    # Base page classes
│   │   ├── utils/                    # Helpers, constants
│   │   ├── reporters/                # Custom reporters
│   │   └── types/                    # JSDoc / TypeScript types
│   │
│   ├── service-auth/                 # Auth service tests
│   │   ├── tests/
│   │   ├── pages/
│   │   ├── fixtures/
│   │   ├── playwright.config.js
│   │   └── package.json
│   │
│   ├── service-payments/             # Payments service tests
│   │   ├── tests/
│   │   ├── pages/
│   │   ├── fixtures/
│   │   ├── playwright.config.js
│   │   └── package.json
│   │
│   ├── service-search/               # Search service tests
│   │   └── ...
│   │
│   └── service-notifications/        # Notifications service tests
│       └── ...
│
├── suites/
│   ├── regression/                   # Cross-service regression
│   │   ├── tests/
│   │   ├── orchestrator.js           # Sequence cross-service flows
│   │   └── playwright.config.js
│   │
│   └── smoke/                        # Critical path smoke tests
│       └── ...
│
├── shared-config/
│   ├── environments/                 # Env vars per environment
│   ├── test-data/                    # Shared test data
│   └── secrets/                      # Encrypted secrets (vault)
│
├── infrastructure/
│   ├── docker/
│   ├── k8s/
│   ├── terraform/
│   └── ci/
│       ├── github-actions/
│       └── jenkins/
│
└── package.json                      # Workspaces root
```

**State Management Strategy:**

| Concern | Solution |
|---------|----------|
| Auth tokens | Custom fixture that refreshes token, stores in context storage state |
| Test data | Request-scoped fixtures with factory pattern — generate unique data per test |
| Shared DB state | Global setup seeds DB, fixture rollback via savepoint per test |
| Service coupling | API mock fixtures for dependent services; contract tests validate real integration |
| Configuration | Environment-agnostic configs with runtime overrides via env vars |

**Test Isolation Guarantees:**
- Every test gets a fresh browser context (new cookies, storage, cache)
- Test data is generated with unique identifiers (UUID + timestamp)
- Database mutations are rolled back via transaction savepoints or teardown
- Parallel execution within a service uses sharding with unique data partitions
- Cross-service tests run sequentially with explicit dependency declaration

---

### Q5: How do you handle test flakiness in a large-scale Playwright suite (5000+ tests)? Walk me through your complete strategy.

**Answer:**

Flakiness strategy operates at four levels: prevention, detection, remediation, and monitoring.

**Level 1: Prevention (Build-time)**

- **Locator audits**: Lint rules enforce `getByRole`, `getByText`, `getByTestId` over CSS/XPath
- **No `waitForTimeout`**: Custom ESLint rule forbids arbitrary waiting; all waits must be condition-based
- **Strict assertions**: `toHaveText()` over `toContainText()` where possible
- **Isolation checks**: Ensure no shared mutable state crosses test boundaries
- **Mock external dependencies**: Network intercept for third-party APIs, analytics, ads

**Level 2: Detection (CI-time)**

```javascript
// playwright.config.js
export default defineConfig({
  retries: process.env.CI ? 3 : 0,
  use: {
    trace: "retain-on-failure",     // Trace viewer for every failure
    screenshot: "only-on-failure",  // Screenshot at failure moment
    video: "retain-on-failure",     // Video recording for flaky tests
  },
  // Flaky test detection
  reporter: [
    ["list"],
    ["html"],
    ["json", { outputFile: "test-results/results.json" }],
    ["./custom-reporters/flaky-detector.js"],
  ],
});
```

**Flaky Detection Reporter:**

```javascript
// custom-reporters/flaky-detector.js
export default class FlakyDetector {
  constructor() {
    this.results = new Map(); // testId -> { attempts, failures, tracePaths }
  }

  onTestEnd(test, result) {
    const key = test.titlePath().join(" > ");
    if (!this.results.has(key)) {
      this.results.set(key, { attempts: 0, failures: 0, traces: [] });
    }
    const record = this.results.get(key);
    record.attempts++;
    if (result.status === "failed") {
      record.failures++;
      record.traces.push(result.attachments.find(a => a.name === "trace")?.path);
    }
  }

  onEnd() {
    for (const [testId, record] of this.results) {
      const flakinessRate = record.failures / record.attempts;
      if (record.attempts > 1 && flakinessRate > 0 && flakinessRate < 1) {
        console.warn(`FLAKY: ${testId} (${record.failures}/${record.attempts} failures)`);
        console.warn(`  Traces: ${record.traces.join(", ")}`);
      }
    }
  }
}
```

**Level 3: Remediation (Post-failure)**

| Failure Pattern | Root Cause | Fix |
|----------------|-----------|-----|
| Element not found intermittently | Lazy-loaded component | Add `expect().toBeVisible()` with longer timeout |
| Test passes locally, fails in CI | Environment timing difference | Use `networkidle` wait, mock slow API responses |
| Test A fails only when B runs before it | Shared state leak | Add isolation check in global teardown |
| Random timeout in headless mode | Animation race condition | Use `page.waitForFunction()` to check render completion |
| Flaky file upload tests | OS-level file dialog | Use `fileChooser` event pattern, not keyboard shortcuts |

**Level 4: Monitoring (Dashboard)**

```sql
-- Query in your analytics DB
SELECT
  test_name,
  COUNT(*) as total_runs,
  SUM(CASE WHEN status = 'passed' THEN 1 ELSE 0 END) as passes,
  SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failures,
  ROUND(SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as flakiness_pct
FROM test_results
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY test_name
HAVING flakiness_pct > 5
  AND COUNT(*) > 10
ORDER BY flakiness_pct DESC;
```

**Targets:**
- Overall flakiness rate: < 2%
- Flaky tests auto-quarantined after 3 failures in 10 runs
- Quarantined tests run separately with extra tracing until root-cause is fixed
- Any test flaky for 7+ consecutive days triggers an on-call alert

---

## 3. Advanced Browser Context & State Management

### Q6: Design a multi-user authentication system using Playwright for an app with OAuth2, SSO, MFA, and role-based access control.

**Answer:**

```javascript
// fixtures/auth-fixture.js
import { test as base } from "@playwright/test";
import fs from "fs";
import path from "path";

// Auth strategy configuration
const AUTH_STRATEGIES = {
  standard: { type: "credentials", url: "/login" },
  oauth: { type: "redirect", url: "/oauth/login", provider: "google" },
  sso: { type: "saml", url: "/saml/login", idp: "okta" },
  mfa: { type: "totp", url: "/login", requiresMfa: true },
};

export const test = base.extend({
  // Role-based storage state
  storageStateForRole: [
    async ({ browser }, use) => {
      const stateDir = "test-results/auth-states";
      fs.mkdirSync(stateDir, { recursive: true });

      // Lazy-load and cache auth states by role
      const getState = async (role) => {
        const statePath = path.join(stateDir, `${role}.json`);
        if (fs.existsSync(statePath)) {
          return statePath;
        }
        // Perform login
        const context = await browser.newContext();
        const page = await context.newPage();
        await performRoleLogin(page, role);
        await context.storageState({ path: statePath });
        await context.close();
        return statePath;
      };

      // Provide a function to get auth state for any role
      await use({ getState, strategies: AUTH_STRATEGIES, roles: ["admin", "user", "viewer"] });
    },
    { scope: "worker" },
  ],

  // Pre-authenticated page for specific roles
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: "test-results/auth-states/admin.json",
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

async function performRoleLogin(page, role) {
  const config = getRoleConfig(role);
  switch (config.strategy) {
    case "credentials":
      await page.goto("/login");
      await page.getByLabel("Email").fill(config.email);
      await page.getByLabel("Password").fill(config.password);
      if (config.mfa) {
        await page.getByRole("button", { name: "Sign In" }).click();
        await page.waitForSelector('[data-testid="mfa-input"]');
        await page.getByTestId("mfa-input").fill(generateTOTP(config.secret));
      }
      await page.getByRole("button", { name: "Sign In" }).click();
      await page.waitForURL("/dashboard");
      break;
    case "oauth":
      await page.goto("/oauth/login");
      await page.getByRole("button", { name: `Continue with ${config.provider}` }).click();
      // Handle OAuth redirect flow
      await page.waitForURL(`https://accounts.${config.provider}.com/**`);
      await page.getByLabel("Email").fill(config.email);
      await page.getByRole("button", { name: "Next" }).click();
      await page.getByLabel("Password").fill(config.password);
      await page.getByRole("button", { name: "Sign in" }).click();
      await page.waitForURL("/dashboard");
      break;
    case "saml":
      // SAML flow via IdP redirect
      await page.goto("/saml/login");
      await page.waitForURL(`https://${config.idp}.com/**`);
      await page.getByLabel(config.usernameField).fill(config.email);
      await page.getByRole("button", { name: "Sign In" }).click();
      await page.waitForURL("/dashboard");
      break;
  }
}

// Usage in tests:
test("admin can manage users", async ({ page, storageStateForRole }) => {
  const statePath = await storageStateForRole.getState("admin");
  const context = await browser.newContext({ storageState: statePath });
  const adminPage = await context.newPage();
  await adminPage.goto("/admin/users");
  await expect(adminPage.getByRole("table")).toBeVisible();
  await context.close();
});
```

**Key Design Decisions:**
1. **Storage state caching**: Auth state is computed once per worker and reused across tests (worker-scoped fixture)
2. **Graceful TOTP handling**: MFA uses a TOTP generator library; test secrets are stored in vault, not in code
3. **Session refresh**: Fixture monitors response headers for `Set-Cookie` and re-saves state if session is refreshed
4. **Parallel isolation**: Each worker gets its own set of test credentials to avoid concurrent login collisions

---

### Q7: How do you manage browser profile persistence across test runs? When would you use `storageState` vs. `browser.newContext()` with custom options?

**Answer:**

**When to use each approach:**

| Approach | Best For | Trade-offs |
|----------|----------|------------|
| `storageState` | Reusing authenticated sessions across tests | Stale state if session expires; requires explicit refresh |
| `browser.newContext()` with options | Fine-grained control over permissions, locale, etc. | More verbose; no state persistence |
| `storageState` + `browserType.launchPersistentContext()` | Long-running sessions, user-data-dir reuse | Slower launch; state may accumulate |
| CDP session restore | Full session reconstruction (cookies + localStorage + IndexedDB) | Complex implementation; not officially supported |

**Production Pattern – Hybrid Approach:**

```javascript
// fixtures/session-manager.js
import { test as base } from "@playwright/test";
import path from "path";
import fs from "fs";

export const test = base.extend({
  session: [
    async ({ browser, request }, use) => {
      const sessionDir = path.join(process.cwd(), "test-results/sessions");
      fs.mkdirSync(sessionDir, { recursive: true });

      const SESSION_KEY = `session-${process.env.TEST_ENV || "staging"}.json`;
      const sessionPath = path.join(sessionDir, SESSION_KEY);

      let storageState;
      let context;

      // Try to load cached session
      if (fs.existsSync(sessionPath)) {
        const stats = fs.statSync(sessionPath);
        const ageMinutes = (Date.now() - stats.mtimeMs) / 60000;

        if (ageMinutes < 30) {
          // Session is fresh enough to use
          context = await browser.newContext({
            storageState: sessionPath,
          });
        } else {
          // Session is stale — refresh with API first
          const refreshed = await refreshSessionViaAPI(request, sessionPath);
          context = await browser.newContext({ storageState: refreshed });
        }
      } else {
        // No session — create new one
        context = await browser.newContext();
        const page = await context.newPage();
        await performLogin(page);
        await context.storageState({ path: sessionPath });
      }

      // Session monitoring: watch for unauthorized responses
      context.on("response", async (response) => {
        if (response.status() === 401) {
          // Try silent refresh
          const refreshed = await refreshSessionViaAPI(request, sessionPath);
          if (refreshed) {
            await context.storageState({ path: sessionPath });
          } else {
            // Force re-login
            fs.unlinkSync(sessionPath);
            throw new Error("Session expired and refresh failed");
          }
        }
      });

      await use(context);
      await context.close();

      // Save any session updates before closing
      if (context.storageState) {
        await context.storageState({ path: sessionPath });
      }
    },
    { scope: "worker" },
  ],
});

async function refreshSessionViaAPI(request, currentStatePath) {
  const currentState = JSON.parse(fs.readFileSync(currentStatePath, "utf-8"));
  const cookies = currentState.cookies || [];

  const refreshToken = cookies.find(c => c.name === "refresh_token");
  if (!refreshToken) return null;

  const response = await request.post("/api/auth/refresh", {
    data: { refreshToken: refreshToken.value },
  });

  if (response.ok()) {
    return currentStatePath; // State is still valid
  }
  return null;
}
```

**When to avoid storageState entirely:**
- Tests that need to verify login flows themselves
- Tests that require different permission sets per test
- Tests where session expiry is part of the test scenario
- When running tests against production (security concern)

---

## 4. Network & API Architecture

### Q8: Design a network mocking strategy for a microservices frontend that makes 15+ API calls on page load. How do you balance test reliability with test fidelity?

**Answer:**

**Layered Mocking Strategy:**

```
┌─────────────────────────────────────────────────┐
│              Real Integration Tests              │  ← 5% of tests
│         (no mocks, real API + sandbox DB)        │
├─────────────────────────────────────────────────┤
│            Contract-Verified Mocks               │  ← 20% of tests
│         (mocks generated from OpenAPI spec)       │
├─────────────────────────────────────────────────┤
│            Selective API Mocking                 │  ← 50% of tests
│         (mock 3rd-party, real 1st-party API)      │
├─────────────────────────────────────────────────┤
│            Full Mock (All APIs)                  │  ← 25% of tests
│         (fastest, best for isolated scenarios)    │
└─────────────────────────────────────────────────┘
```

**Implementation – Selective Mock Fixture:**

```javascript
// fixtures/network-fixture.js
import { test as base, expect } from "@playwright/test";
import fs from "fs";
import path from "path";
import crypto from "crypto";

// Load contract mocks from OpenAPI examples
function loadContractMocks(specPath) {
  const spec = JSON.parse(fs.readFileSync(specPath, "utf-8"));
  const mocks = {};
  for (const [pathKey, methods] of Object.entries(spec.paths)) {
    for (const [method, details] of Object.entries(methods)) {
      if (details.responses?.["200"]?.content?.["application/json"]?.example) {
        const route = pathKey.replace(/{(\w+)}/g, ":$1");
        mocks[`${method.toUpperCase()} ${route}`] =
          details.responses["200"].content["application/json"].example;
      }
    }
  }
  return mocks;
}

export const test = base.extend({
  networkMock: [
    async ({ page }, use) => {
      const mockLevel = process.env.MOCK_LEVEL || "selective";
      const contractMocks = loadContractMocks("config/openapi/contract.json");

      // Routes to always mock (third-party, analytics, ads)
      const alwaysMock = [
        "**/analytics/**",
        "**/facebook.com/**",
        "**/google-analytics/**",
        "**/cdn.polyfill.io/**",
        "**/sentry.io/**",
      ];

      // Routes to always allow (critical path)
      const neverMock = [
        "**/api/v1/health",
        "**/api/v1/auth/me",
      ];

      if (mockLevel === "full") {
        // Mock ALL API calls
        for (const [route, data] of Object.entries(contractMocks)) {
          const [method, urlPattern] = route.split(" ");
          await page.route(`**/api/v1${urlPattern}**`, async (routeObj) => {
            await routeObj.fulfill({
              status: 200,
              contentType: "application/json",
              body: JSON.stringify(data),
            });
          });
        }
      } else if (mockLevel === "selective") {
        // Mock only third-party + unstable endpoints
        for (const pattern of alwaysMock) {
          await page.route(pattern, async (routeObj) => {
            const url = routeObj.request().url();
            const mockKey = Object.keys(contractMocks).find(k =>
              url.includes(k.split(" ")[1])
            );
            if (mockKey) {
              await routeObj.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(contractMocks[mockKey]),
              });
            } else {
              await routeObj.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({ mock: true, source: "default" }),
              });
            }
          });
        }
      }

      // API assertion helper
      const apiCalls = [];
      await page.route("**/api/**", async (routeObj, request) => {
        apiCalls.push({
          url: request.url(),
          method: request.method(),
          timestamp: Date.now(),
        });
        await routeObj.continue();
      });

      await use({ apiCalls, mockLevel });

      // Verify all mocked routes were actually hit
      if (mockLevel === "full" && process.env.VERIFY_MOCK_COVERAGE) {
        for (const route of Object.keys(contractMocks)) {
          const [method, urlPattern] = route.split(" ");
          const wasHit = apiCalls.some(call =>
            call.url.includes(urlPattern) && call.method === method
          );
          expect(wasHit, `Route ${method} ${urlPattern} was never called`).toBeTruthy();
        }
      }
    },
    { scope: "test" },
  ],
});
```

**Performance vs. Reliability Trade-off:**

| Approach | Speed | Reliability | Maintenance | Best For |
|----------|-------|------------|-------------|----------|
| Full mock | Fastest | Highest (isolated) | High (maintain mocks) | Component/visual tests |
| Selective mock | Fast | High | Medium | E2E with stable APIs |
| Contract-verified | Medium | Very high | Low (auto-generated) | Critical business flows |
| Real API | Slowest | Lowest | None | Smoke / release tests |

**Recommendation:** Start with selective mocking. Add contract verification by generating mocks from your OpenAPI/Swagger spec. Run a small subset of tests against real APIs as a canary. Rotate which tests run against real APIs to get broad coverage without sacrificing speed.

---

### Q9: How do you test API endpoints using Playwright's `request` fixture at scale? How do you handle pagination, rate limiting, and authentication across hundreds of API tests?

**Answer:**

**API Test Architecture:**

```javascript
// tests/api/users.spec.js
import { test, expect } from "../../fixtures/api-fixture.js";

test.describe("User API", () => {
  test("GET /users returns paginated results", async ({ apiClient }) => {
    // Collect all users across pages
    const allUsers = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await apiClient.get(`/api/v1/users?page=${page}&limit=50`);
      expect(response.status()).toBe(200);
      const body = await response.json();

      allUsers.push(...body.data);
      hasMore = body.pagination.hasNextPage;
      page++;

      // Rate limiting: back off if 429 received
      if (response.headers()["retry-after"]) {
        const wait = parseInt(response.headers()["retry-after"]) * 1000;
        await new Promise(r => setTimeout(r, wait));
      }
    }

    expect(allUsers.length).toBeGreaterThan(0);
    expect(new Set(allUsers.map(u => u.id)).size).toBe(allUsers.length); // No duplicates
  });

  test("CRUD operations maintain data integrity", async ({ apiClient, testData }) => {
    // Create
    const createRes = await apiClient.post("/api/v1/users", {
      data: testData.newUser(),
    });
    expect(createRes.status()).toBe(201);
    const userId = (await createRes.json()).id;

    // Read
    const readRes = await apiClient.get(`/api/v1/users/${userId}`);
    expect(readRes.status()).toBe(200);
    expect((await readRes.json()).email).toBe(testData.newUser().email);

    // Update
    const updateRes = await apiClient.put(`/api/v1/users/${userId}`, {
      data: { name: "Updated Name" },
    });
    expect(updateRes.status()).toBe(200);

    // Verify update persisted
    const verifyRes = await apiClient.get(`/api/v1/users/${userId}`);
    expect((await verifyRes.json()).name).toBe("Updated Name");

    // Delete
    const deleteRes = await apiClient.delete(`/api/v1/users/${userId}`);
    expect(deleteRes.status()).toBe(204);
  });
});
```

**API Fixture with Rate Limiting & Auth Handling:**

```javascript
// fixtures/api-fixture.js
import { test as base } from "@playwright/test";

export const test = base.extend({
  apiClient: [
    async ({ request }, use) => {
      const rateLimiter = createRateLimiter({
        maxRequests: 100,
        perWindowMs: 60_000,
      });

      const client = {
        async get(url, options = {}) {
          await rateLimiter.wait();
          const response = await request.get(url, {
            headers: await getAuthHeaders(),
            ...options,
          });
          return handleResponse(response, "GET", url);
        },

        async post(url, options = {}) {
          await rateLimiter.wait();
          const response = await request.post(url, {
            headers: await getAuthHeaders(),
            ...options,
          });
          return handleResponse(response, "POST", url);
        },

        async put(url, options = {}) {
          await rateLimiter.wait();
          const response = await request.put(url, {
            headers: await getAuthHeaders(),
            ...options,
          });
          return handleResponse(response, "PUT", url);
        },

        async delete(url, options = {}) {
          await rateLimiter.wait();
          const response = await request.delete(url, {
            headers: await getAuthHeaders(),
            ...options,
          });
          return handleResponse(response, "DELETE", url);
        },
      };

      await use(client);
    },
    { scope: "worker" },
  ],
});

function createRateLimiter({ maxRequests, perWindowMs }) {
  let requests = [];
  return {
    async wait() {
      const now = Date.now();
      requests = requests.filter(ts => now - ts < perWindowMs);
      if (requests.length >= maxRequests) {
        const oldest = requests[0];
        const waitMs = perWindowMs - (now - oldest) + 100;
        await new Promise(r => setTimeout(r, waitMs));
      }
      requests.push(Date.now());
    },
  };
}

async function getAuthHeaders() {
  const token = await getTokenFromVault();
  return { Authorization: `Bearer ${token}`, "X-Request-Id": crypto.randomUUID() };
}

async function handleResponse(response, method, url) {
  if (response.status() === 429) {
    const retryAfter = parseInt(response.headers()["retry-after"] || "5");
    console.warn(`Rate limited on ${method} ${url}. Waiting ${retryAfter}s`);
    await new Promise(r => setTimeout(r, retryAfter * 1000));
    // Retry not implemented here — the test fixture handles this at the test level
  }
  return response;
}

export { expect } from "@playwright/test";
```

**Scaling API Tests:**

| Concern | Solution |
|---------|----------|
| Auth token rotation | Worker-scoped fixture refreshes token on expiry |
| Rate limiting | Token bucket algorithm in the client wrapper |
| Test data cleanup | Async teardown queue registers cleanup callbacks |
| Parallel isolation | Each worker uses a unique test tenant/namespace |
| Flaky network | Retry wrapper with exponential backoff (3 attempts) |
| Schema validation | `ajv` (Another JSON Schema Validator) integration in assertions |

---

## 5. Performance Optimization & Benchmarking

### Q10: Your Playwright test suite takes 4 hours to run. Walk me through your complete optimization strategy to bring it under 30 minutes.

**Answer:**

**Phase 1: Measure (identify bottlenecks)**

```javascript
// custom-reporters/performance-benchmark.js
export default class PerformanceBenchmark {
  constructor() {
    this.startTime = Date.now();
    this.testTimes = [];
  }

  onTestBegin(test) {
    test._startTime = Date.now();
  }

  onTestEnd(test, result) {
    const duration = Date.now() - test._startTime;
    this.testTimes.push({ test: test.titlePath().join(" > "), duration, status: result.status });
  }

  onEnd() {
    const totalTime = Date.now() - this.startTime;
    this.testTimes.sort((a, b) => b.duration - a.duration);

    console.log(`\n=== Performance Report ===`);
    console.log(`Total suite time: ${(totalTime / 60000).toFixed(2)} min`);
    console.log(`Tests run: ${this.testTimes.length}`);

    // Top 10 slowest tests
    console.log(`\nTop 10 Slowest Tests:`);
    for (const t of this.testTimes.slice(0, 10)) {
      console.log(`  ${(t.duration / 1000).toFixed(1)}s - ${t.test}`);
    }

    // Bottleneck analysis
    const slowTests = this.testTimes.filter(t => t.duration > 30_000);
    if (slowTests.length > 0) {
      console.log(`\n⚠ Bottlenecks: ${slowTests.length} tests exceed 30s`);
    }
  }
}
```

**Phase 2: Optimize (layered approach)**

| Layer | Tactic | Expected Gain |
|-------|--------|---------------|
| **Test Design** | Remove redundant assertions, merge sequential navigations | 5-10% |
| **Parallelism** | Increase workers to match CPU cores | 4x (linear with cores) |
| **Sharding** | Split across 4-8 CI runners | 4-8x |
| **Selective Execution** | Run only changed tests on PR, full suite nightly | 80% reduction on PR |
| **Network Mocking** | Mock slow third-party APIs | 20-40% |
| **Browser Choice** | Use Chromium only (fastest), add others in nightly | 3x vs full cross-browser |
| **Context Reuse** | Worker-scoped auth, skip login in every test | 10-20% |
| **Config Tuning** | `actionTimeout: 10_000` instead of default 30s | Avoids long waits on failures |

**Phase 3: Smart execution strategy**

```yaml
# CI execution matrix
jobs:
  pr-check:
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
    steps:
      - run: npx playwright test --shard=${{ matrix.shard }}/4 --project=chromium

  nightly-full:
    strategy:
      matrix:
        shard: [1, 2, 3, 4, 5, 6, 7, 8]
        browser: [chromium, firefox, webkit]
    steps:
      - run: npx playwright test --shard=${{ matrix.shard }}/8 --project=${{ matrix.browser }}
```

**Phase 4: File-level parallelization**

```javascript
// playwright.config.js for CI
export default defineConfig({
  // Run test files in parallel (default)
  fullyParallel: true,

  // Optimize per-file parallel tests
  workers: process.env.CI ? os.cpus().length : undefined,

  projects: [
    {
      name: "smoke",
      testMatch: "**/smoke/**",
      retries: 0,
      workers: 1, // Smoke tests need careful ordering
    },
    {
      name: "e2e-chromium",
      testMatch: "**/e2e/**",
      use: { ...devices["Desktop Chrome"] },
      workers: os.cpus().length - 1,
    },
  ],
});
```

**Expected Results After Full Optimization:**

| State | Time | Gain |
|-------|------|------|
| Initial | 4 hours | — |
| + Sharding (8 runners) | 30 min | 8x |
| + Chromium only | 20 min | 1.5x |
| + Network mocking | 15 min | 1.3x |
| + Smart exclusions | 12 min | 1.25x |
| + Config tuning | 10 min | 1.2x |
| **Final** | **~10-12 min** | **~24x total** |

---

### Q11: Explain how Playwright's parallel execution model works internally. What happens when you set `workers: 4`?

**Answer:**

**Internal Architecture:**

When you set `workers: 4`, Playwright's test runner:

1. **Spawns 4 child processes** (Node.js worker processes)
2. Each worker process loads its own V8 isolate with separate memory heap
3. Each worker gets its own Playwright browser instance (browser process per worker)
4. Tests are distributed via a work-stealing queue: the runner maintains a queue of pending tests; when a worker completes a test, it picks the next available one

**Detailed Flow:**

```
Main Process (Test Runner)
├── Reads playwright.config.js
├── Discovers test files (glob)
├── Groups tests by file (tests in same file are serial)
├── Creates a work queue of test files
└── Spawns worker processes
     ├── Worker 1 🟢
     │   ├── browser process
     │   ├── context (isolated)
     │   └── test-file-A.spec.js
     ├── Worker 2 🟢
     │   ├── browser process
     │   ├── context
     │   └── test-file-B.spec.js
     ├── Worker 3 🟢 → test-file-C.spec.js
     └── Worker 4 🟢 → test-file-D.spec.js
```

**Resource Implications:**

| Resource | Per Worker | 4 Workers | 16 Workers |
|----------|-----------|-----------|------------|
| Node process | ~30-50 MB | ~120-200 MB | ~480-800 MB |
| Browser process | ~100-200 MB | ~400-800 MB | ~1.6-3.2 GB |
| Context | ~10-20 MB (per test) | ~40-80 MB | ~160-320 MB |
| Total (approx) | ~150-300 MB | ~600 MB - 1.1 GB | ~2.4-4.4 GB |

**Key Behaviors:**
- **`fullyParallel: true`**: Runs tests WITHIN a file in parallel across workers (each test in the file goes to a different worker)
- **`fullyParallel: false`** (default): Tests within a file run sequentially in one worker; different files go to different workers
- **Worker-scoped fixtures** (`{ scope: 'worker' }`): Instantiated once per worker, shared across all tests in that worker
- **Test-scoped fixtures** (`{ scope: 'test' }`): Instantiated fresh for every test

**Memory Limits:**
Playwright's default worker count is `os.cpus().length / 2`. In CI, setting `workers: 4` on a 4-CPU machine typically maxes out CPU. Going beyond `os.cpus().length` leads to CPU contention and diminishing returns.

**Anti-patterns that break parallelism:**
- Shared mutable variables in describe blocks
- Worker-scoped fixtures that mutate state between tests
- Test files that depend on execution order
- Absolute file paths hardcoded in tests (use `path.resolve`)

---

## 6. Design Patterns & Abstraction

### Q12: Design a page object framework for a large-scale application. How do you handle components, fragments, and shared behaviors without code duplication?

**Answer:**

**Three-Layer POM Architecture:**

```
┌────────────────────────────────────────────────┐
│            Layer 3: Service Objects              │
│   (Application flows: LoginFlow, CheckoutFlow)   │
├────────────────────────────────────────────────┤
│         Layer 2: Page Objects                    │
│   (LoginPage, DashboardPage, CheckoutPage)       │
├────────────────────────────────────────────────┤
│      Layer 1: UI Components / Fragments          │
│   (Header, Footer, DataTable, Modal, Toast)       │
├────────────────────────────────────────────────┤
│                Base Layer                        │
│   (BasePage, BaseComponent, BaseElement)          │
└────────────────────────────────────────────────┘
```

**Layer 1: Base & Components**

```javascript
// pages/base/BasePage.js
export class BasePage {
  constructor(page) {
    this.page = page;
    this.components = {};
  }

  // Navigation
  async goto(path) {
    await this.page.goto(path, { waitUntil: "networkidle" });
    return this;
  }

  // Wait for page to be fully loaded
  async waitForPageReady() {
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForSelector("[data-page-ready]", { state: "attached" });
    return this;
  }

  // Screenshot with auto-naming
  async screenshot(name) {
    const path = `reports/screenshots/${this.constructor.name}-${name}-${Date.now()}.png`;
    await this.page.screenshot({ path, fullPage: true });
    return path;
  }

  // Component registration
  registerComponent(name, component) {
    this.components[name] = component;
    return this;
  }

  getComponent(name) {
    return this.components[name];
  }
}

// pages/base/BaseComponent.js
export class BaseComponent {
  constructor(page, rootLocator) {
    this.page = page;
    this.root = rootLocator;
  }

  async isVisible() {
    return this.root.isVisible();
  }

  async waitForVisible(timeout = 5000) {
    await expect(this.root).toBeVisible({ timeout });
    return this;
  }

  async getText() {
    return this.root.textContent();
  }
}

// pages/components/DataTable.js (reusable fragment)
export class DataTable extends BaseComponent {
  constructor(page, rootLocator) {
    super(page, rootLocator);
    this.rows = rootLocator.locator("tbody tr");
    this.headers = rootLocator.locator("thead th");
  }

  async getRowCount() {
    return this.rows.count();
  }

  async getCellValue(rowIndex, columnName) {
    const colIndex = await this.getColumnIndex(columnName);
    return this.rows.nth(rowIndex).locator("td").nth(colIndex).textContent();
  }

  async clickRowAction(rowIndex, actionName) {
    const row = this.rows.nth(rowIndex);
    await row.locator(`[data-action="${actionName}"]`).click();
  }

  async getColumnIndex(columnName) {
    const count = await this.headers.count();
    for (let i = 0; i < count; i++) {
      const text = await this.headers.nth(i).textContent();
      if (text.trim() === columnName) return i;
    }
    throw new Error(`Column "${columnName}" not found`);
  }

  async search(searchTerm) {
    const searchInput = this.root.locator('[data-testid="table-search"]');
    await searchInput.fill(searchTerm);
    await searchInput.press("Enter");
    await this.page.waitForTimeout(500); // Wait for debounced search
    return this;
  }
}
```

**Layer 2: Page Objects**

```javascript
// pages/users/UserManagementPage.js
export class UserManagementPage extends BasePage {
  constructor(page) {
    super(page);

    // Components (composition over inheritance)
    this.userTable = new DataTable(page, page.locator('[data-testid="users-table"]'));
    this.filterPanel = new FilterPanel(page);
    this.toast = new Toast(page);

    // Page-specific locators
    this.addUserBtn = page.getByRole("button", { name: "Add User" });
    this.exportBtn = page.getByRole("button", { name: "Export" });
    this.searchInput = page.getByPlaceholder("Search users...");
  }

  // Intent-revealing methods
  async navigateTo() {
    await this.goto("/admin/users");
    await this.waitForPageReady();
    return this;
  }

  async addNewUser(userData) {
    await this.addUserBtn.click();
    // Returns a new page object for the form
    return new CreateUserForm(this.page).fill(userData).submit();
  }

  async findUserByEmail(email) {
    await this.searchInput.fill(email);
    const rowCount = await this.userTable.getRowCount();
    if (rowCount === 0) return null;
    return {
      name: await this.userTable.getCellValue(0, "Name"),
      email: await this.userTable.getCellValue(0, "Email"),
      role: await this.userTable.getCellValue(0, "Role"),
    };
  }

  async deleteUser(email) {
    const user = await this.findUserByEmail(email);
    if (!user) throw new Error(`User ${email} not found`);
    await this.userTable.clickRowAction(0, "delete");
    await this.page.getByRole("button", { name: "Confirm" }).click();
    await this.toast.waitForVisible();
    return this.toast.getText();
  }
}
```

**Layer 3: Service Objects (Application Flows)**

```javascript
// flows/UserRegistrationFlow.js
export class UserRegistrationFlow {
  constructor(page) {
    this.page = page;
    this.registrationForm = new CreateUserForm(page);
    this.verificationModal = new VerificationModal(page);
    this.dashboard = new DashboardPage(page);
  }

  async registerNewUser(userData, { verifyEmail = false, assignRole = null } = {}) {
    // Step 1: Fill registration form
    await this.registrationForm.navigateTo();
    await this.registrationForm.fill(userData);

    if (assignRole) {
      await this.registrationForm.selectRole(assignRole);
    }

    await this.registrationForm.submit();

    // Step 2: Handle email verification if required
    if (verifyEmail) {
      await this.verificationModal.waitForVisible();
      await this.verificationModal.verifyWithToken(userData.verificationToken);
    }

    // Step 3: Wait for dashboard
    await this.dashboard.waitForPageReady();

    return {
      userId: await this.dashboard.getUserId(),
      welcomeMessage: await this.dashboard.getWelcomeMessage(),
    };
  }

  async registerBulkUsers(usersData) {
    const results = [];
    for (const userData of usersData) {
      const result = await this.registerNewUser(userData);
      results.push(result);
      // Logout between registrations
      await this.dashboard.logout();
    }
    return results;
  }
}
```

**Key Design Decisions:**
- **Composition over inheritance**: Components are composed into pages, reducing deep inheritance chains
- **Service objects for flows**: Multi-step workflows are extracted into service objects, not buried in page methods
- **Fluent interface**: Methods return `this` for method chaining
- **Lazy component initialization**: Components are initialized once in constructor, not per action

---

### Q13: Compare custom fixtures vs. Page Object Model. When should you use one over the other?

**Answer:**

**Conceptual Difference:**

| Aspect | Page Object Model | Custom Fixtures |
|--------|-------------------|-----------------|
| What it models | UI pages & components | Test infrastructure & state |
| Scope | Structural (what the page looks like) | Behavioral (what the test needs) |
| Dependencies | Constructor receives `page` | Dependency injection via Playwright |
| Lifecycle | Per-test instantiation | Managed by scope (`test` or `worker`) |
| Test relationship | Tests call page methods | Tests receive fixtures as parameters |
| State sharing | Not designed for sharing | Built-in sharing via `scope: 'worker'` |

**When to use POM:**
- Modeling UI structure (pages, forms, tables, modals)
- Locator encapsulation (hide CSS/XPath from tests)
- Reusable action sequences (login, checkout, search)
- Visual layout verification
- When your team is familiar with the pattern

**When to use Fixtures:**
- Managing test infrastructure (browser, context, page)
- Authentication state (login once, reuse across tests)
- Test data injection (API-created data, DB seeds)
- Network mocking configuration per test
- Environment configuration (baseURL, tokens, timeouts)
- Cross-cutting concerns (tracing, reporting, metrics)

**Hybrid Approach (Recommended for 5+ YOE teams):**

```javascript
// fixtures/app-fixture.js — Infrastructure layer
export const test = base.extend({
  // Infrastructure fixtures
  authenticatedPage: async ({ browser }, use) => {
    // ... auth logic
  },

  testData: async ({}, use) => {
    // ... data generation
  },

  // Page object injection via fixture
  pages: async ({ page }, use) => {
    await use({
      login: new LoginPage(page),
      dashboard: new DashboardPage(page),
      admin: new UserManagementPage(page),
      checkout: new CheckoutFlow(page),
      components: {
        header: new Header(page),
        toast: new Toast(page),
        dataTable: new DataTable(page, page.locator("table")),
      },
    });
  },
});

// Usage in test:
test("admin can filter users", async ({ pages, testData }) => {
  await pages.login.navigateTo();
  await pages.login.loginAs("admin");

  await pages.admin.navigateTo();
  await pages.admin.searchInput.fill(testData.admin.email);

  expect(await pages.admin.userTable.getRowCount()).toBe(1);
});
```

**Decision Matrix:**

```
Is it related to page structure/layout?
├── YES → POM (Page class)
└── NO
    ├── Is it about test infrastructure (auth, data, browser)?
    │   └── YES → Fixture
    ├── Is it a shared cross-cutting concern?
    │   └── YES → Fixture
    └── Is it a multi-step business flow?
        └── YES → Service Object (combines POM + fixtures)
```

---

## 7. CI/CD Architecture & Pipeline Design

### Q14: Design a complete CI/CD pipeline for Playwright tests in a microservices environment with 50+ deployable services. How do you decide what to test, when, and how?

**Answer:**

**Pipeline Architecture:**

```
Developer Push
     │
     ▼
┌──────────────────┐
│   PR Pipeline     │  (~5 min)
│                   │
│  • Lint + Type    │
│  • Unit tests     │
│  • Affected tests │  ← Only tests for changed services
│  • Smoke tests    │  ← Deployed preview environment
└──────┬───────────┘
       │ success
       ▼
┌──────────────────┐
│  Merge to Main    │
└──────┬───────────┘
       │
       ▼
┌──────────────────────────────────┐
│        Staging Pipeline          │  (~20 min)
│                                  │
│  ┌──────────────────────────┐    │
│  │  Parallel Service Test   │    │
│  │  (runs per microservice) │    │
│  │                          │    │
│  │ ┌─────┐ ┌─────┐ ┌────┐ │    │
│  │ │Auth │ │Pay  │ │Sear│ │    │
│  │ │     │ │ment │ │ch  │ │    │
│  │ └─────┘ └─────┘ └────┘ │    │
│  └──────────────────────────┘    │
│                                  │
│  ┌──────────────────────────┐    │
│  │   Integration Tests      │    │
│  │   (cross-service flows)  │    │
│  └──────────────────────────┘    │
│                                  │
│  ┌──────────────────────────┐    │
│  │   Visual Regression      │    │
│  │   (chromium only)        │    │
│  └──────────────────────────┘    │
└──────┬───────────────────────────┘
       │ success
       ▼
┌──────────────────┐
│  Production       │
│  Canary Deploy    │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Canary Tests     │  (~10 min)
│                   │
│  • Health checks  │
│  • Critical paths │
│  • 15 min window  │
└──────┬───────────┘
       │ success
       ▼
┌──────────────────┐
│  Full Rollout     │
└──────────────────┘

Nightly (scheduled):
┌──────────────────────────────────┐
│  Full Regression + All Browsers  │  (~60 min)
│  • 8 shards, 3 browsers          │
│  • Performance benchmarks        │
│  • Full visual regression        │
│  • Accessibility scan            │
└──────────────────────────────────┘
```

**Test Selection Strategy (Affected Test Detection):**

```javascript
// ci/select-tests.js
import { execSync } from "child_process";
import fs from "fs";

function getAffectedServices(changedFiles) {
  // Map file paths to services
  const serviceMap = {
    "packages/service-auth/": "auth",
    "packages/service-payments/": "payments",
    "packages/service-search/": "search",
    "packages/shared/": ["auth", "payments", "search"], // Shared changes trigger all
  };

  const affected = new Set();
  for (const file of changedFiles) {
    for (const [prefix, services] of Object.entries(serviceMap)) {
      if (file.startsWith(prefix)) {
        if (Array.isArray(services)) {
          services.forEach(s => affected.add(s));
        } else {
          affected.add(services);
        }
      }
    }
  }
  return [...affected];
}

// Usage in CI:
// const changedFiles = execSync("git diff --name-only origin/main...HEAD")
//   .toString().trim().split("\n");
// const services = getAffectedServices(changedFiles);
// Run: npx playwright test tests/e2e/{services.join(",")}/
```

**Pipeline Performance Targets:**

| Stage | Target Duration | Tests |
|-------|----------------|-------|
| PR checks | < 5 min | ~50-100 smoke + affected |
| Staging | < 20 min | ~500-800 e2e + integration |
| Canary | < 10 min | ~20-30 critical path |
| Nightly | < 60 min | ~2000-3000 full suite |
| **Total (per deploy)** | **~35 min** | **All gates** |

---

### Q15: How do you integrate Playwright tests with feature flags/toggles? How do you test both enabled and disabled states?

**Answer:**

**Approach 1: API-Level Flag Override (Recommended)**

```javascript
// fixtures/feature-flag-fixture.js
import { test as base } from "@playwright/test";

export const test = base.extend({
  featureFlags: [
    async ({ request }, use) => {
      // Provide flag control via admin API
      const flagClient = {
        async enable(flagName) {
          return request.post("/api/admin/feature-flags", {
            data: { name: flagName, enabled: true },
          });
        },
        async disable(flagName) {
          return request.post("/api/admin/feature-flags", {
            data: { name: flagName, enabled: false },
          });
        },
        async set(flags) {
          return request.put("/api/admin/feature-flags/batch", {
            data: flags,
          });
        },
        async reset() {
          return request.delete("/api/admin/feature-flags/reset");
        },
      };
      await use(flagClient);
      // Cleanup: reset all flags after test
      await flagClient.reset();
    },
  ],
});

// Usage:
test("new checkout flow with feature flag enabled", async ({ page, featureFlags }) => {
  await featureFlags.enable("new-checkout");
  await page.goto("/checkout");
  await expect(page.getByTestId("new-checkout-form")).toBeVisible();
});

test("old checkout flow with feature flag disabled", async ({ page, featureFlags }) => {
  await featureFlags.disable("new-checkout");
  await page.goto("/checkout");
  await expect(page.getByTestId("legacy-checkout-form")).toBeVisible();
});
```

**Approach 2: Network-Level Flag Injection**

```javascript
// When feature flags are served via API
test("feature flag via network intercept", async ({ page }) => {
  await page.route("**/api/v1/feature-flags", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        "new-checkout": true,
        "dark-mode": false,
        "beta-payments": true,
      }),
    });
  });

  await page.goto("/");
  // Page renders with the mocked flags
});
```

**Approach 3: Matrix Testing (All Flag Combinations)**

```javascript
const FEATURE_FLAGS = ["new-checkout", "dark-mode", "beta-payments"];
const combinations = [];

// Generate all combinations (2^n)
for (let i = 0; i < Math.pow(2, FEATURE_FLAGS.length); i++) {
  const config = {};
  FEATURE_FLAGS.forEach((flag, index) => {
    config[flag] = Boolean(i & (1 << index));
  });
  combinations.push(config);
}

combinations.forEach((flags) => {
  const label = Object.entries(flags)
    .filter(([, v]) => v)
    .map(([k]) => k)
    .join("+") || "all-off";

  test(`checkout with flags: ${label}`, async ({ page, featureFlags }) => {
    await featureFlags.set(flags);
    await page.goto("/checkout");
    // Assert behavior depends on which flags are active
    // Use a decision table or strategy pattern
  });
});
```

**Best Practices:**
- Always reset flags after each test (fixture teardown)
- Test the default state (all flags off) explicitly
- Use a feature flag matrix for critical user journeys
- Mock flag evaluation at the network level when flag service is unstable
- Document flag dependencies in test metadata

---

## 8. Test Strategy & Quality Gates

### Q16: Design a test strategy for a payment processing system. How do you balance coverage, speed, and risk?

**Answer:**

**Test Pyramid for Payments:**

```
                    ╱╲
                   ╱  ╲             Prod Verification (~5)
                  ╱    ╲            Manual + canary checks
                 ╱      ╲
                ╱  E2E   ╲          Critical Paths (~20)
               ╱  (15%)  ╲         Full checkout flow
              ╱           ╲
             ╱─────────────╲
            ╱  Integration  ╲       API + Contract (~150)
           ╱   (35%)       ╲      Payment gateway mock
          ╱                 ╲     Refund, void, retry
         ╱───────────────────╲
        ╱   Unit / Component  ╲    Isolated logic (~500)
       ╱     (50%)           ╲   Validation rules
      ╱                       ╲  Amount formatting
     ╱─────────────────────────╲ Currency conversion
```

**Risk-Based Test Prioritization:**

| Risk Level | Area | Test Frequency | Threshold |
|-----------|------|---------------|-----------|
| **Critical** | Authorization, Capture, Refund, Void | Every deploy | 100% pass |
| **High** | Partial refund, Multi-currency, 3DS | Every staging deploy | 100% pass |
| **Medium** | Receipt generation, Email notifications | Nightly | 100% pass |
| **Low** | UI layout, Error message wording | Nightly visual | < 5% diff |

**Payment Test Scenarios (Implementation):**

```javascript
// tests/e2e/checkout/payment-flows.spec.js
test.describe("Payment Processing - Critical Paths", () => {
  test("successful card payment with valid details", async ({ checkoutFlow }) => {
    const result = await checkoutFlow
      .addProductToCart("PREMIUM-PLAN")
      .proceedToCheckout()
      .enterShippingDetails(validAddress())
      .selectPaymentMethod("credit-card")
      .enterCardDetails(validVisaCard())
      .submitPayment();

    expect(result.status).toBe("success");
    expect(result.orderId).toMatch(/^ORD-\d{8}$/);
    expect(result.receiptEmail).toBe(validAddress().email);
  });

  test("payment declined triggers correct error flow", async ({ checkoutFlow }) => {
    const result = await checkoutFlow
      .addProductToCart("BASIC-PLAN")
      .proceedToCheckout()
      .selectPaymentMethod("credit-card")
      .enterCardDetails(declinedCard())
      .submitPayment();

    expect(result.status).toBe("declined");
    expect(result.errorCode).toBe("card_declined");
    expect(result.suggestedAction).toContain("different payment method");

    // Verify user can retry with different card
    await checkoutFlow.enterCardDetails(validVisaCard());
    const retryResult = await checkoutFlow.submitPayment();
    expect(retryResult.status).toBe("success");
  });

  test("3D Secure authentication flow", async ({ checkoutFlow, page }) => {
    await checkoutFlow
      .addProductToCart("PREMIUM-PLAN")
      .proceedToCheckout()
      .enterCardDetails(threeDSCard())
      .submitPayment();

    // Handle 3DS redirect
    const challengeFrame = page.frameLocator("[name*='3ds']");
    await challengeFrame.getByRole("button", { name: "Complete" }).click();
    await page.waitForURL("/order-confirmation");

    expect(page.getByText("Payment successful")).toBeVisible();
    expect(page.getByTestId("3ds-verified")).toBeVisible();
  });
});
```

**Quality Gates (Gating Criteria):**

```
Pre-Production Gates:
┌─────────────────────────────────────┐
│ Gate 1: No Critical P0 failures     │  → Block deploy
│ Gate 2: < 2% flaky rate (last 7d)   │  → Block deploy
│ Gate 3: Payment auth 100% pass       │  → Block deploy
│ Gate 4: All smoke tests pass         │  → Block deploy
│ Gate 5: Visual diff < 1% of pages    │  → Warn, manual review
│ Gate 6: Performance no regression    │  → Warn, auto-rollback candidate
└─────────────────────────────────────┘
```

**Data Management for Payments:**
- Use a payment gateway sandbox (Stripe Test, Braintree Sandbox)
- Never test with real card numbers — use test tokens
- Scrub PII from test data after each run
- Rotate test API keys weekly
- Maintain a separate test merchant account

---

## 9. Advanced Debugging & Observability

### Q17: Design an observability system for a Playwright test suite that runs 1000+ times per day across multiple environments.

**Answer:**

**Three Pillars of Observability:**

```
┌────────────────────────────────────────────────┐
│                    Observability                │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  Logging  │  │  Metrics  │  │  Tracing  │     │
│  │          │  │          │  │          │        │
│  │ Test log │  │ Pass %   │  │ Trace     │       │
│  │ Console  │  │ Duration │  │ Screenshot│       │
│  │ Network  │  │ Flaky %  │  │ HAR files │       │
│  │ Errors   │  │ Bottle-  │  │ Video     │       │
│  │          │  │ necks    │  │          │        │
│  └──────────┘  └──────────┘  └──────────┘        │
└────────────────────────────────────────────────┘
```

**1. Structured Logging:**

```javascript
// utils/logger.js
export class TestLogger {
  constructor(testInfo) {
    this.testId = testInfo.testId;
    this.title = testInfo.title;
    this.startTime = Date.now();
    this.entries = [];
  }

  info(message, data = {}) {
    this.entries.push({
      level: "info",
      timestamp: new Date().toISOString(),
      message,
      data,
    });
  }

  warn(message, data = {}) {
    this.entries.push({
      level: "warn",
      timestamp: new Date().toISOString(),
      message,
      data,
    });
  }

  error(message, error) {
    this.entries.push({
      level: "error",
      timestamp: new Date().toISOString(),
      message,
      error: { message: error?.message, stack: error?.stack, code: error?.code },
    });
  }

  network(method, url, status, duration) {
    this.entries.push({
      level: "info",
      type: "network",
      timestamp: new Date().toISOString(),
      method,
      url,
      status,
      duration,
    });
  }

  attachToTest(testInfo) {
    testInfo.attachments.push({
      name: "test-log",
      contentType: "application/json",
      body: JSON.stringify({
        testId: this.testId,
        title: this.title,
        duration: Date.now() - this.startTime,
        entries: this.entries,
      }),
    });
  }
}
```

**2. Custom Reporter with Metrics Emission:**

```javascript
// custom-reporters/observability-reporter.js
export default class ObservabilityReporter {
  onBegin(config, suite) {
    this.startTime = Date.now();
    this.metrics = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      flaky: 0,
      totalDuration: 0,
    };
  }

  onTestEnd(test, result) {
    this.metrics.total++;
    this.metrics.totalDuration += result.duration;

    if (result.status === "passed" && result.retry > 0) {
      this.metrics.flaky++;
      this.metrics.passed++;
    } else if (result.status === "passed") {
      this.metrics.passed++;
    } else if (result.status === "failed") {
      this.metrics.failed++;
    } else {
      this.metrics.skipped++;
    }
  }

  async onEnd() {
    const elapsed = Date.now() - this.startTime;

    // Emit to metrics backend (Datadog, Prometheus, etc.)
    await this.emitMetrics({
      "test.pass_count": this.metrics.passed,
      "test.fail_count": this.metrics.failed,
      "test.flaky_count": this.metrics.flaky,
      "test.total_duration_ms": this.metrics.totalDuration,
      "test.suite_duration_ms": elapsed,
      "test.pass_rate_pct": (this.metrics.passed / this.metrics.total) * 100,
      "test.flaky_rate_pct": (this.metrics.flaky / this.metrics.total) * 100,
      "test.avg_duration_ms": this.metrics.totalDuration / this.metrics.total,
    });

    // Health check: alert if pass rate drops below threshold
    const passRate = (this.metrics.passed / this.metrics.total) * 100;
    if (passRate < 95) {
      console.error(`⚠ PASS RATE DROP: ${passRate.toFixed(1)}% (threshold: 95%)`);
      // Trigger alert
      await this.sendAlert({
        severity: "warning",
        message: `Test suite pass rate dropped to ${passRate.toFixed(1)}%`,
      });
    }
  }

  async emitMetrics(metrics) {
    // Send to your observability platform
    // await fetch("https://api.datadoghq.com/api/v2/series", {
    //   method: "POST",
    //   headers: { "DD-API-KEY": process.env.DD_API_KEY },
    //   body: JSON.stringify({ series: metrics }),
    // });
  }

  async sendAlert(alert) {
    // Send to PagerDuty / Slack / OpsGenie
  }
}
```

**3. Trace Enrichment:**

```javascript
// Attach additional context to Playwright traces
test("debug payment failure with enriched trace", async ({ page, logger }) => {
  // Add custom trace events
  await page.context().tracing.start({
    title: "payment-failure-debug",
    snapshots: true,
    screenshots: true,
  });

  try {
    // ... test logic
    // Log network requests
    page.on("request", request => {
      logger.network(request.method(), request.url(), null, null);
    });
    page.on("response", response => {
      logger.network(
        response.request().method(),
        response.url(),
        response.status(),
        response.timing?.responseEnd
      );
    });
  } finally {
    await page.context().tracing.stop({
      path: `reports/traces/${test.info().testId}.zip`,
    });
  }
});
```

**Dashboard View (Example Datadog):**

```
┌─────────────────────────────────────────────────────────┐
│  Test Suite Dashboard (Last 24h)                        │
│                                                         │
│  Pass Rate: 97.2% │ Flaky: 1.8% │ Avg Duration: 12.3s │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Pass Rate Over Time                            │   │
│  │  ████████████████████████████████████████░░ 97% │   │
│  │  ████████████████████████████░░░░░░░░░░ 82% ←  │   │
│  │  ██████████████████████████████████████████ 99% │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Top 5 Slowest Tests:                                   │
│  1. Payment > Full Checkout ....................... 45s │
│  2. Reports > Generate Monthly Report ............ 38s │
│  3. Search > Full Text Search with 10k results ... 32s │
│  4. Auth > SSO Login Flow ....................... 28s  │
│  5. Upload > Large File (50MB) .................. 25s  │
│                                                         │
│  Recent Failures:                                       │
│  ⚠ Auth > Token Refresh Test ................. 2 min ago│
│  ⚠ Payments > 3DS Challenge .................. 5 min ago│
└─────────────────────────────────────────────────────────┘
```

---

### Q18: How do you debug a flaky test that only fails in CI but never locally?

**Answer:**

**Systematic Debugging Approach:**

**Step 1: Collect Data (Enable Full Tracing in CI)**

```javascript
// playwright.config.js — CI-specific overrides
const config = {
  use: {
    // Always collect full data in CI
    trace: "on",                      // Trace for every test, not just failures
    screenshot: "on",                 // Screenshot at every step
    video: "on",                      // Video recording
  },
};
```

**Step 2: Reproduce with CI Conditions**

```javascript
// Create a test that simulates CI conditions
test("reproduce CI flakiness locally", async ({ page, browserName }) => {
  // 1. Match CI viewport and device
  test.use({
    viewport: { width: 1920, height: 1080 },
    locale: "en-US",
    timezoneId: "America/New_York",
    colorScheme: "light",
  });

  // 2. Simulate CI CPU/memory constraints
  // Run with: NODE_OPTIONS="--max-old-space-size=512"

  // 3. Set CI-specific environment variables
  // process.env.CI = "true"

  // 4. Race condition injection
  // Slow down network responses to match CI latency
  await page.route("**/*.{png,jpg,jpeg,gif,svg}", async (route) => {
    await new Promise(r => setTimeout(r, Math.random() * 2000));
    await route.continue();
  });
});
```

**Step 3: Common CI-vs-Local Differences Checklist**

| Factor | Local | CI | Debug Action |
|--------|-------|----|--------------|
| CPU | Fast (many cores) | Shared/throttled | `docker run --cpus=1` |
| Memory | 16-64GB | 4-8GB | `NODE_OPTIONS="--max-old-space-size=512"` |
| Network | Low latency | Variable, higher | `page.route()` with delay |
| Display | GUI available | Headless (xvfb) | Force headless locally |
| Timezone | User's | UTC | Set `timezoneId: "UTC"` |
| Locale | User's | "en-US" | Set locale explicitly |
| Screen size | Large | 1024x768 | Set viewport to CI size |
| Parallelism | Low | High (4-16 workers) | Match worker count |
| Browser launch | Warm cache | Cold start | Measure cold launch time |

**Step 4: Advanced Debugging Techniques**

```javascript
// Inject debug logging at every action
page.on("pageerror", error => {
  console.error(`PAGE ERROR: ${error.message}`);
});

page.on("console", msg => {
  if (msg.type() === "error") {
    console.error(`CONSOLE ERROR: ${msg.text()}`);
  }
});

// Network waterfall analysis
const networkLog = [];
page.on("request", req => {
  networkLog.push({
    url: req.url(),
    method: req.method(),
    startTime: Date.now(),
  });
});
page.on("response", res => {
  const entry = networkLog.find(e => e.url === res.url());
  if (entry) {
    entry.status = res.status();
    entry.duration = Date.now() - entry.startTime;
  }
});

// After test, analyze network waterfall
test.afterEach(() => {
  const slowRequests = networkLog.filter(e => e.duration > 2000);
  if (slowRequests.length > 0) {
    console.warn("Slow requests detected:", slowRequests);
  }
});
```

**Step 5: Automated Bisection (For Heisenbugs)**

```javascript
// Run the test N times to determine flakiness rate
export async function flakinessBisection(testFn, iterations = 50) {
  const results = [];
  for (let i = 0; i < iterations; i++) {
    try {
      await testFn();
      results.push("PASS");
    } catch (e) {
      results.push(`FAIL: ${e.message}`);
    }
  }

  const passCount = results.filter(r => r === "PASS").length;
  const flakinessRate = (iterations - passCount) / iterations;

  console.log(`Flakiness rate: ${(flakinessRate * 100).toFixed(1)}% (${passCount}/${iterations})`);

  // Group failure messages to identify pattern
  const failReasons = results.filter(r => r !== "PASS");
  const reasonCounts = {};
  for (const reason of failReasons) {
    reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
  }

  console.log("Failure patterns:");
  for (const [reason, count] of Object.entries(reasonCounts)) {
    console.log(`  ${count}x: ${reason}`);
  }

  return { flakinessRate, results, reasonCounts };
}
```

**Step 6: When All Else Fails — Record and Compare**

```
# Record a passing run locally
npx playwright test --reporter=json > passing-trace.json

# Record a failing run in CI (download artifacts)
# Compare the two traces:
# 1. Check timing differences between requests
# 2. Compare DOM state at failure point
# 3. Check CSS animation states
# 4. Compare network response payloads
```

---

## 10. Security Testing with Playwright

### Q19: How can Playwright be used for security testing? What types of security tests can you automate?

**Answer:**

**Security Test Categories Automatable with Playwright:**

| Category | What to Test | Playwright Feature |
|----------|-------------|-------------------|
| **XSS** | Input sanitization, stored/reflected XSS | `page.evaluate()`, content injection |
| **CSRF** | Token validation, missing SameSite cookies | Cookie inspection, request interception |
| **Auth** | Session fixation, token leakage, weak passwords | Storage state, network monitoring |
| **Headers** | Missing security headers, CSP bypass | Response header validation |
| **Rate Limiting** | Brute force protection, lockout policies | Rapid repeated requests |
| **IDOR** | Horizontal/vertical privilege escalation | Storage state switching, A/B testing |
| **CORS** | Misconfigured cross-origin policies | Network assertion, cross-origin requests |
| **SQLi** | Basic injection detection | Form input with malicious payloads |

**XSS Detection Test:**

```javascript
test("no stored XSS in user profile fields", async ({ page }) => {
  const xssPayloads = [
    "<script>alert('xss')</script>",
    "<img src=x onerror=alert(1)>",
    "javascript:alert(1)",
    "<svg onload=alert(1)>",
    `"><script>alert(1)</script>`,
    "{{constructor.constructor('alert(1)')()}}",
  ];

  for (const payload of xssPayloads) {
    // Attempt to inject XSS
    await page.goto("/profile/edit");
    await page.getByLabel("Display Name").fill(payload);
    await page.getByRole("button", { name: "Save" }).click();

    // Navigate to public profile and check for execution
    await page.goto("/profile/public");
    const pageContent = await page.content();

    // Check if payload was rendered without encoding
    expect(pageContent).not.toContain("<script>");
    expect(pageContent).not.toContain("onerror=");
    expect(pageContent).not.toContain("onload=");
    expect(pageContent).not.toContain("javascript:");
  }
});
```

**Security Headers Audit:**

```javascript
test("all security headers are present and valid", async ({ page, request }) => {
  const response = await request.get(process.env.BASE_URL);

  const requiredHeaders = {
    "Content-Security-Policy": {
      required: true,
      validator: (val) => val.includes("script-src") && val.includes("default-src"),
    },
    "X-Content-Type-Options": {
      required: true,
      expected: "nosniff",
    },
    "X-Frame-Options": {
      required: true,
      expected: "DENY",
    },
    "Strict-Transport-Security": {
      required: true,
      validator: (val) => val.includes("max-age="),
    },
    "X-XSS-Protection": {
      required: false, // Deprecated but useful
      expected: "0",   // Modern recommendation: disable
    },
    "Referrer-Policy": {
      required: true,
      expected: "strict-origin-when-cross-origin",
    },
    "Permissions-Policy": {
      required: true,
      validator: (val) => val.includes("geolocation=") || val.includes("camera="),
    },
  };

  for (const [header, config] of Object.entries(requiredHeaders)) {
    const headerValue = response.headers()[header.toLowerCase()];

    if (config.required) {
      expect(headerValue, `Missing required header: ${header}`).toBeTruthy();

      if (config.expected) {
        expect(headerValue, `${header} should be "${config.expected}"`).toBe(config.expected);
      }

      if (config.validator) {
        expect(config.validator(headerValue), `${header} validation failed`).toBe(true);
      }
    }
  }
});
```

**IDOR / Privilege Escalation Test:**

```javascript
test("regular user cannot access admin API endpoints", async ({ browser, storageStateForRole }) => {
  // Get auth states for both roles
  const adminState = await storageStateForRole.getState("admin");
  const userState = await storageStateForRole.getState("user");

  // Create contexts for both roles
  const adminCtx = await browser.newContext({ storageState: adminState });
  const userCtx = await browser.newContext({ storageState: userState });

  const adminPage = await adminCtx.newPage();
  const userPage = await userCtx.newPage();

  // Get an admin-only resource ID via admin context
  await adminPage.goto("/admin/users");
  const adminResourceId = await adminPage.locator("tr").first().getAttribute("data-user-id");

  // Attempt to access it with user context
  const response = await userPage.request.get(`/api/v1/admin/users/${adminResourceId}`);

  // User should get 403, not 200
  expect(response.status()).toBe(403);
  const body = await response.json();
  expect(body.error).toMatch(/forbidden|unauthorized|not.allowed/i);

  await adminCtx.close();
  await userCtx.close();
});
```

**Brute Force / Rate Limiting Test:**

```javascript
test("account locks after N failed login attempts", async ({ page }) => {
  const maxAttempts = 5;

  for (let i = 1; i <= maxAttempts + 1; i++) {
    await page.goto("/login");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password").fill("wrong-password");
    await page.getByRole("button", { name: "Sign In" }).click();

    if (i < maxAttempts) {
      // Should still be on login page with error
      await expect(page.getByTestId("login-error")).toBeVisible();
      expect(page.url()).toContain("/login");
    } else {
      // Should be locked out
      await expect(page.getByTestId("account-locked")).toBeVisible();
      expect(page.getByText(/too many|locked|try again/i)).toBeVisible();
    }
  }
});
```

---

## 11. Migration Strategy & Risk Management

### Q20: You're migrating a 3000-test Selenium suite to Playwright. Design the migration strategy including timeline, risk mitigation, and team onboarding.

**Answer:**

**Phased Migration Strategy (12-16 weeks):**

```
Week 1-2:  Foundation + Training
Week 3-6:  Core Migration (highest value tests)
Week 7-10: Scale Migration (most tests)
Week 11-12: Long Tail + Decommission
Week 13-16: Stabilization + Optimization
```

**Detailed Plan:**

**Phase 1: Foundation (Weeks 1-2)**

```
[Week 1]
├── Set up Playwright framework (POM, fixtures, config)
├── Establish coding standards and conventions
├── Set up CI/CD pipeline for Playwright (parallel to Selenium)
├── Create migration tooling (locator translator, helper scripts)
└── Team training: "Playwright in 5 Days" workshop

[Week 2]
├── Migrate 10 representative tests (varied complexity)
├── Establish baseline metrics (execution time, flakiness rate)
├── Set up parallel running (Selenium + Playwright)
├── Build custom assertion library (matching Selenium patterns)
└── Create migration checklist and PR review template
```

**Phase 2: Core Migration (Weeks 3-6)**

```
Priority Matrix:
         High Value        Low Value
        ┌──────────────┬──────────────┐
  Easy  │  QUICK WINS   │  DELEGATE    │
        │  Migrate Week3 │  Migrate Last│
        ├──────────────┼──────────────┤
  Hard  │  STRATEGIC    │  AVOID /     │
        │  Migrate Week4 │  AUTOMATE    │
        └──────────────┴──────────────┘
```

**Phase 3: Parallel Validation**

```javascript
// migration/hybrid-runner.js
// Run Selenium and Playwright side-by-side for critical tests
import { execSync } from "child_process";

const VALIDATION_TESTS = [
  "LoginFlow",
  "CheckoutFlow",
  "PaymentFlow",
  "UserRegistration",
  "SearchFlow",
];

let totalMismatches = 0;

for (const test of VALIDATION_TESTS) {
  console.log(`Validating: ${test}`);

  // Run Selenium test
  const seleniumStart = Date.now();
  try {
    execSync(`npx selenium-test tests/${test}.java`);
  } catch (e) {
    console.error(`Selenium failed: ${test}`);
  }
  const seleniumDuration = Date.now() - seleniumStart;

  // Run Playwright test
  const playwrightStart = Date.now();
  try {
    execSync(`npx playwright test tests/${test}.spec.js`);
  } catch (e) {
    console.error(`Playwright failed: ${test}`);
  }
  const playwrightDuration = Date.now() - playwrightStart;

  // Compare results (via test output JSON)
  const seleniumResult = JSON.parse(fs.readFileSync(`results/selenium/${test}.json`));
  const playwrightResult = JSON.parse(fs.readFileSync(`results/playwright/${test}.json`));

  const mismatch = compareResults(seleniumResult, playwrightResult);
  if (mismatch > 0) {
    console.warn(`⚠ Mismatch in ${test}: ${mismatch} differences`);
    totalMismatches += mismatch;
  }

  console.log(`  Selenium: ${seleniumDuration}ms | Playwright: ${playwrightDuration}ms`);
}

const improvement = ((seleniumDuration - playwrightDuration) / seleniumDuration) * 100;
console.log(`\nSpeed improvement: ${improvement.toFixed(1)}%`);
console.log(`Total mismatches: ${totalMismatches}`);
```

**Risk Mitigation:**

| Risk | Probability | Impact | Mitigation |
|------|-----------|--------|------------|
| Locator differences | High | Medium | Automated locator converter; manual review of complex selectors |
| Timing/race condition differences | Medium | High | Run validation suite for 1 week before cutting over |
| API contract changes during migration | Medium | High | Freeze API changes during core migration phase |
| Team productivity dip | High | Low | Dedicated migration sprints; no new feature work during migration |
| Selenium-specific features not in Playwright | Low | Medium | Check Playwright roadmap; implement workaround patterns |

**Decommission Checklist:**

```javascript
// migration/decommission-checklist.js
export async function verifyPlaywrightCoverage(seleniumTests, playwrightTests) {
  const coverage = {
    totalSelenium: seleniumTests.length,
    totalPlaywright: playwrightTests.length,
    migrated: [],
    notMigrated: [],
    failedMigration: [],
  };

  for (const selTest of seleniumTests) {
    const pwEquivalent = playwrightTests.find(pw =>
      pw.name === selTest.name || pw.tags?.includes(selTest.id)
    );

    if (pwEquivalent) {
      if (pwEquivalent.lastPassed) {
        coverage.migrated.push(selTest.name);
      } else {
        coverage.failedMigration.push(selTest.name);
      }
    } else {
      coverage.notMigrated.push(selTest.name);
    }
  }

  console.log(`Coverage: ${coverage.migrated.length}/${coverage.totalSelenium}`);
  console.log(`Not migrated: ${coverage.notMigrated.join(", ")}`);
  console.log(`Failed: ${coverage.failedMigration.join(", ")}`);

  // Block decommission if coverage < 95%
  const coveragePct = (coverage.migrated.length / coverage.totalSelenium) * 100;
  if (coveragePct < 95) {
    throw new Error(`Cannot decommission: only ${coveragePct.toFixed(1)}% coverage`);
  }

  return coverage;
}
```

---

## 12. Team Leadership & Mentoring

### Q21: How would you build an automation-first culture in a development team of 50 engineers? How do you drive adoption and ensure quality ownership?

**Answer:**

**Three-Pronged Approach:**

**1. Developer Experience (Make It Easy)**

```javascript
// dev-tools/add-test.js — CLI tool to scaffold tests
#!/usr/bin/env node
import { select, input, confirm } from "@inquirer/prompts";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

async function scaffoldTest() {
  console.log("🧪 Playwright Test Scaffold");

  const component = await input({ message: "What component/feature?" });
  const type = await select({
    message: "Test type?",
    choices: [
      { name: "E2E (full flow)", value: "e2e" },
      { name: "API (integration)", value: "api" },
      { name: "Visual (snapshot)", value: "visual" },
    ],
  });
  const addTrace = await confirm({ message: "Add trace recording?", default: true });

  const filePath = path.join("tests", type, `${component.toLowerCase().replace(/\s+/g, "-")}.spec.js`);
  const testTemplate = generateTestTemplate(component, type, addTrace);
  fs.writeFileSync(filePath, testTemplate);

  console.log(`✅ Created: ${filePath}`);
  execSync(`npx playwright test ${filePath}`, { stdio: "inherit" });
}

scaffoldTest();
```

**2. Quality Ownership (Shift Left)**

```
Developer Workflow:
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Code     │───▶│  Unit +  │───▶│  E2E     │───▶│  Review  │
│  Feature  │    │  API     │    │  Tests   │    │          │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                     │               │               │
                     ▼               ▼               ▼
              Runs in <1s       Runs in <2min     Auto-triggered
              (local)           (pre-push hook)   by PR label
```

**Pre-push Hook:**

```javascript
// .husky/pre-push
#!/bin/sh
npx playwright test tests/smoke --project=chromium --workers=2
npx playwright test tests/api --project="API Tests"
```

**3. Metrics & Visibility (Make It Visible)**

```
Dashboard - Team View
┌──────────────────────────────────────────────────────┐
│  Team: Alpha Squad              Week: 12 │ ▲ 8%     │
├──────────────────────────────────────────────────────┤
│  Test Coverage: 87% (+5% this sprint)   ████████░  │
│  Flakiness Rate: 1.2% (target < 3%)     ██████████  │
│  Avg Test Speed: 8s (-2s from last sprint) ████░░  │
│                                                    │
│  Test Ownership:                                    │
│  Developer          Test Count   Flakiness   Trend │
│  Alice Chen         42           0.8%        ▲     │
│  Bob Martinez       38           2.1%        ▼     │
│  Carlos Silva       55           0.3%        ▲     │
│  Diana Park         31           4.2%        ⚠     │
│                                                    │
│  Top Flaky Tests:                                   │
│  ⚠ Search > Filters > Date Range (3 fails/10 runs) │
│  ⚠ Auth > Token Refresh (2 fails/10 runs)         │
└──────────────────────────────────────────────────────┘
```

**Mentoring Framework:**

```
Level 1 (New to Automation):
├── Week 1-2: "Playwright Basics" paired programming
├── Week 3-4: Write 5 simple tests with guidance
└── Week 5-6: Own a small feature module

Level 2 (Competent):
├── Review others' test PRs
├── Add API tests to existing module
└── Participate in flaky test triage

Level 3 (Proficient):
├── Design test strategy for new features
├── Write custom fixtures and utilities
└── Mentor Level 1 engineers

Level 4 (Expert):
├── Architect cross-service test strategy
├── Design CI/CD pipeline integration
├── Performance optimization and benchmarking
└── Drive framework improvements
```

---

### Q22: You're interviewing for a Staff/Senior Engineer role. You need to present a complex technical problem you solved using Playwright. Walk me through your thought process.

**Answer:**

**Example Problem: Real-Time Collaborative Editor Testing**

**Context:** We were building a Google Docs competitor with real-time collaboration powered by WebSockets and OT (Operational Transformation). The editor supported 50+ concurrent users editing the same document.

**Challenge:** How do we test real-time collaboration (cursor positions, text sync, conflict resolution) with Playwright?

**Approach:**

**Step 1: Architecture Understanding**

```
User A (Browser)          Server          User B (Browser)
     │                       │                   │
     │──▶ Insert "Hello" ──▶ │                   │
     │                       │──▶ Insert "Hello" │
     │                       │                   │
     │                       │◀── Insert "World"─│
     │◀── Insert "World" ────│                   │
```

**Step 2: Multi-User Test Design**

```javascript
// tests/e2e/collaboration/realtime-editing.spec.js
test.describe("Real-Time Collaboration", () => {
  test("two users see each other's changes in real-time", async ({ browser }) => {
    // Create two browser contexts (two users)
    const contextA = await browser.newContext({ storageState: "user-a.json" });
    const contextB = await browser.newContext({ storageState: "user-b.json" });

    const pageA = await contextA.newPage();
    const pageB = await contextB.newPage();

    // Both users open the same document
    await pageA.goto("/documents/collab-test-123");
    await pageB.goto("/documents/collab-test-123");

    // Wait for collaboration connection
    await pageA.waitForSelector("[data-collab-connected='true']");
    await pageB.waitForSelector("[data-collab-connected='true']");

    // User A types
    await pageA.locator(".editor").click();
    await pageA.keyboard.type("Hello from User A");

    // Verify User B sees the text
    await expect(pageB.locator(".editor")).toContainText("Hello from User A");

    // User B types
    await pageB.locator(".editor").click();
    await pageB.keyboard.press("End");
    await pageB.keyboard.type(" And User B was here");

    // Verify User A sees the combined text
    await expect(pageA.locator(".editor")).toContainText("And User B was here");

    await contextA.close();
    await contextB.close();
  });

  test("cursor positions are synchronized", async ({ browser }) => {
    const ctxA = await browser.newContext({ storageState: "user-a.json" });
    const ctxB = await browser.newContext({ storageState: "user-b.json" });

    const pageA = await ctxA.newPage();
    const pageB = await ctxB.newPage();

    await pageA.goto("/documents/collab-test-456");
    await pageB.goto("/documents/collab-test-456");

    // User A places cursor at position 5
    await pageA.locator(".editor").click();
    for (let i = 0; i < 5; i++) await pageA.keyboard.press("ArrowRight");

    // Get User A's cursor position from the collaboration layer
    const cursorA = await pageA.evaluate(() => {
      return window.collabEngine.getCursor("user-a");
    });

    // Verify User B sees User A's cursor at position 5
    const remoteCursorB = await pageB.evaluate(() => {
      const cursors = window.collabEngine.getRemoteCursors();
      return cursors.find(c => c.userId === "user-a");
    });
    expect(remoteCursorB.position).toBe(5);
    expect(remoteCursorB.color).toBeTruthy();
    expect(remoteCursorB.label).toContain("User A");

    await ctxA.close();
    await ctxB.close();
  });

  test("conflict resolution: simultaneous edits", async ({ browser }) => {
    const ctxA = await browser.newContext({ storageState: "user-a.json" });
    const ctxB = await browser.newContext({ storageState: "user-b.json" });

    const pageA = await ctxA.newPage();
    const pageB = await ctxB.newPage();

    // Set initial text
    await pageA.goto("/documents/collab-test-789");
    await pageA.locator(".editor").fill("Hello World");
    await pageA.waitForTimeout(500); // Wait for sync

    // Both users modify the same word simultaneously
    await pageB.goto("/documents/collab-test-789");

    // Use page.evaluate to simulate near-simultaneous edits
    const [resultA, resultB] = await Promise.all([
      pageA.evaluate(() => {
        return window.collabEngine.applyEdit({ position: 6, deleteCount: 5, insert: "Playwright" });
      }),
      pageB.evaluate(() => {
        return window.collabEngine.applyEdit({ position: 6, deleteCount: 5, insert: "JavaScript" });
      }),
    ]);

    // Wait for OT to resolve
    await pageA.waitForTimeout(1000);

    // Both users should converge to the same resolved state
    const finalTextA = await pageA.locator(".editor").textContent();
    const finalTextB = await pageB.locator(".editor").textContent();
    expect(finalTextA).toBe(finalTextB);

    // The resolved text should be coherent (OT preserved intent)
    // Either "Hello Playwright" or "Hello JavaScript" depending on server's reconciliation
    expect(finalTextA).toMatch(/^Hello (Playwright|JavaScript)$/);

    await ctxA.close();
    await ctxB.close();
  });
});
```

**Step 3: Performance Testing (50 Concurrent Users)**

```javascript
test("editor performs well with 50 concurrent users", async ({ browser }) => {
  const contexts = [];
  const pages = [];
  const RENDER_TIMEOUT = 5000;

  // Create 50 user contexts
  for (let i = 0; i < 50; i++) {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto("/documents/perf-test-001");
    await page.waitForSelector("[data-collab-connected='true']");
    contexts.push(ctx);
    pages.push(page);
  }

  // Simulate 50 users typing simultaneously
  const startTime = Date.now();

  const editPromises = pages.map((page, index) =>
    page.evaluate((id) => {
      return window.collabEngine.applyEdit({
        position: Math.floor(Math.random() * 100),
        deleteCount: 0,
        insert: `User-${id} says hello! `,
      });
    }, index)
  );

  await Promise.all(editPromises);

  // Wait for all changes to propagate and render
  await pages[0].waitForFunction(
    () => window.collabEngine.getVersion() >= 50,
    { timeout: RENDER_TIMEOUT }
  );

  const totalTime = Date.now() - startTime;
  console.log(`50 concurrent edits resolved in ${totalTime}ms`);

  // Performance assertions
  expect(totalTime).toBeLessThan(3000); // All edits resolved within 3 seconds

  // Verify all 50 changes are applied
  const finalVersion = await pages[0].evaluate(() => window.collabEngine.getVersion());
  expect(finalVersion).toBe(50);

  // Cleanup
  await Promise.all(contexts.map(ctx => ctx.close()));
});
```

**Key Learnings Shared:**
- Playwright's multi-context architecture is crucial for collaboration testing
- Using `page.evaluate()` to directly call engine APIs avoids UI timing issues
- Performance testing with 50+ contexts revealed memory leaks in the editor
- The OT resolution tests uncovered 3 bugs in the server-side reconciliation logic
- This approach was adopted by the team for all real-time feature development

---

## 13. System Design for Test Infrastructure

### Q23: Design a distributed test execution system for Playwright that can run 10,000 tests in under 10 minutes.

**Answer:**

**System Architecture:**

```
                         ┌──────────────┐
                         │  Test Orchestrator  │
                         │  (Kubernetes Job)   │
                         └──────┬───────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│  Shard Master  │     │  Shard Master  │     │  Shard Master  │
│  (k8s pod)     │     │  (k8s pod)     │     │  (k8s pod)     │
│  shard-1/20    │     │  shard-2/20    │     │  shard-20/20   │
└───────┬───────┘     └───────┬───────┘     └───────┬───────┘
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│  Worker Pool   │     │  Worker Pool   │     │  Worker Pool   │
│  4 workers     │     │  4 workers     │     │  4 workers     │
│  8 browsers    │     │  8 browsers    │     │  8 browsers    │
└───────┬───────┘     └───────┬───────┘     └───────┬───────┘
        │                     │                     │
        ▼                     ▼                     ▼
  50 tests/pod         50 tests/pod          50 tests/pod

Total: 20 pods × 4 workers × 50 tests = 4000 tests per batch
Batches: 3 × 4000 = 12,000 tests in ~8 min
```

**Infrastructure as Code:**

```yaml
# k8s/test-runner-job.yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: playwright-distributed-runner
spec:
  completions: 20  # 20 shards
  parallelism: 8   # Run 8 pods at a time
  template:
    spec:
      containers:
      - name: playwright-runner
        image: registry.example.com/playwright-runner:v1.48
        env:
        - name: SHARD_INDEX
          valueFrom:
            fieldRef:
              fieldPath: metadata.annotations['batch.kubernetes.io/job-completion-index']
        - name: SHARD_TOTAL
          value: "20"
        - name: NODE_ENV
          value: "staging"
        - name: CI
          value: "true"
        - name: WORKERS
          value: "4"
        resources:
          requests:
            cpu: "4"
            memory: "4Gi"
          limits:
            cpu: "6"
            memory: "8Gi"
        volumeMounts:
        - name: test-results
          mountPath: /app/test-results
        - name: shared-state
          mountPath: /app/shared
      volumes:
      - name: test-results
        emptyDir: {}
      - name: shared-state
        configMap:
          name: playwright-shared-config
      restartPolicy: Never
```

**Orchestrator Script:**

```javascript
// orchestrator/distributed-runner.js
import { execSync } from "child_process";
import { S3Client } from "@aws-sdk/client-s3";
import { createWriteStream, readFileSync } from "fs";

const SHARDS = parseInt(process.env.SHARD_TOTAL || "20");
const SHARD_INDEX = parseInt(process.env.SHARD_INDEX || "0");
const WORKERS = parseInt(process.env.WORKERS || "4");

async function run() {
  console.log(`Starting shard ${SHARD_INDEX + 1}/${SHARDS} with ${WORKERS} workers`);

  const startTime = Date.now();

  try {
    // Run Playwright with sharding
    execSync(
      `npx playwright test --shard=${SHARD_INDEX + 1}/${SHARDS} ` +
      `--workers=${WORKERS} ` +
      `--reporter=html,json,${__dirname}/custom-reporters/metrics-reporter.js`,
      {
        stdio: "inherit",
        timeout: 600_000, // 10 min timeout per shard
      }
    );
  } catch (e) {
    // Even if tests fail, we need to collect results
    console.error("Test execution had failures:", e.message);
  }

  const duration = Date.now() - startTime;
  console.log(`Shard ${SHARD_INDEX + 1} completed in ${(duration / 1000).toFixed(1)}s`);

  // Upload results to S3
  await uploadResults(SHARD_INDEX);
}

async function uploadResults(shardIndex) {
  const s3 = new S3Client({ region: "us-east-1" });
  // Upload test-results/ to S3 organized by shard
}

run().catch(console.error);
```

**Docker Image Optimization:**

```dockerfile
# Dockerfile.distributed
FROM mcr.microsoft.com/playwright:v1.48.0-jammy

WORKDIR /app

# Copy only production dependencies first
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Install browsers
RUN npx playwright install --with-deps chromium firefox

# Prune to reduce image size
RUN rm -rf /root/.cache /tmp/* /var/lib/apt/lists/*

# Create non-root user
RUN useradd -m -u 1001 playwright && chown -R playwright:playwright /app
USER playwright

ENV CI=true
ENV NODE_ENV=staging

# Run with configurable sharding
ENTRYPOINT ["node", "orchestrator/distributed-runner.js"]
```

**Result Aggregation:**

```javascript
// orchestrator/merge-results.js
// Run after all shards complete
async function mergeAllShards() {
  const manifest = []; // List of all S3 result paths
  const allResults = [];

  for (let i = 0; i < SHARDS; i++) {
    const shardResults = JSON.parse(
      readFileSync(`./test-results/shards/${i}/results.json`, "utf-8")
    );
    allResults.push(...shardResults);
  }

  // Generate merged report
  const mergedReport = {
    totalTests: allResults.length,
    passed: allResults.filter(r => r.status === "passed").length,
    failed: allResults.filter(r => r.status === "failed").length,
    skipped: allResults.filter(r => r.status === "skipped").length,
    flaky: allResults.filter(r => r.status === "passed" && r.retryCount > 0).length,
    totalDuration: allResults.reduce((sum, r) => sum + r.duration, 0),
    startTime: Math.min(...allResults.map(r => r.startTime)),
    endTime: Math.max(...allResults.map(r => r.endTime)),
    failures: allResults.filter(r => r.status === "failed").map(r => ({
      test: r.title,
      file: r.file,
      error: r.error?.message,
      traceUrl: r.traceUrl,
    })),
  };

  console.log(`\n=== Merged Results ===`);
  console.log(`Total: ${mergedReport.totalTests}`);
  console.log(`Passed: ${mergedReport.passed}`);
  console.log(`Failed: ${mergedReport.failed}`);
  console.log(`Flaky: ${mergedReport.flaky}`);
  console.log(`Duration: ${(mergedReport.totalDuration / 60000).toFixed(1)} min`);

  if (mergedReport.failed > 0) {
    console.log(`\nFailures:`);
    mergedReport.failures.forEach(f => {
      console.log(`  ❌ ${f.test}`);
      console.log(`     ${f.error}`);
      console.log(`     Trace: ${f.traceUrl}`);
    });
  }
}
```

**Performance Projection:**

| Metric | CI Runner (4 workers) | Distributed (20 shards × 4 workers) |
|--------|---------------------|-------------------------------------|
| Test count | 10,000 | 10,000 |
| Tests per shard | — | 500 |
| Execution time | ~4 hours | ~8 min |
| Infrastructure cost | 1 machine × 4 hours | 20 pods × 8 min |
| Cost efficiency | 4 core-hours | ~3 core-hours (20 pods × 4 cores × 0.13h) |

---

## 14. Real-World Architecture Challenges

### Q24: You need to test a multi-region, globally distributed application with data sovereignty requirements (EU data stays in EU). How do you design the Playwright test strategy?

**Answer:**

**Architecture Considerations:**

```
Test Runner Locations:
┌──────────┐   ┌──────────┐   ┌──────────┐
│  US-East  │   │  EU-West  │   │  AP-East  │
│  (N. Vir) │   │ (Frankfurt)│   │  (Tokyo)  │
├──────────┤   ├──────────┤   ├──────────┤
│  playwright  │   │  playwright  │   │  playwright  │
│  tests       │   │  tests       │   │  tests       │
│  ────────    │   │  ────────    │   │  ────────    │
│  BASE_URL=us │   │  BASE_URL=eu │   │  BASE_URL=ap │
└──────────┘   └──────────┘   └──────────┘
```

**Multi-Region Fixture:**

```javascript
// fixtures/region-fixture.js
import { test as base } from "@playwright/test";

const REGION_CONFIGS = {
  us: {
    baseURL: "https://us.example.com",
    locale: "en-US",
    timezone: "America/New_York",
    dataCenter: "us-east-1",
    expectedCurrency: "USD",
    expectedDateFormat: "MM/DD/YYYY",
  },
  eu: {
    baseURL: "https://eu.example.com",
    locale: "de-DE",
    timezone: "Europe/Berlin",
    dataCenter: "eu-west-1",
    expectedCurrency: "EUR",
    expectedDateFormat: "DD.MM.YYYY",
    gdprConsentRequired: true,
    dataSovereigntyCheck: true,
  },
  ap: {
    baseURL: "https://ap.example.com",
    locale: "ja-JP",
    timezone: "Asia/Tokyo",
    dataCenter: "ap-northeast-1",
    expectedCurrency: "JPY",
    expectedDateFormat: "YYYY/MM/DD",
  },
};

export const test = base.extend({
  region: [
    async ({}, use) => {
      const regionName = process.env.TEST_REGION || "us";
      const config = REGION_CONFIGS[regionName];
      if (!config) throw new Error(`Unknown region: ${regionName}`);
      await use(config);
    },
    { scope: "worker" },
  ],

  regionPage: [
    async ({ browser, region }, use) => {
      const context = await browser.newContext({
        baseURL: region.baseURL,
        locale: region.locale,
        timezoneId: region.timezone,
      });
      const page = await context.newPage();
      await use(page);

      // Data sovereignty check for EU
      if (region.dataSovereigntyCheck) {
        const storedData = await context.storageState();
        // Verify no PII is stored in non-EU cookies
        const piiCookies = storedData.cookies.filter(c =>
          /(email|name|phone|ssn|address)/i.test(c.name)
        );
        if (piiCookies.length > 0) {
          console.warn("PII cookies detected in EU region test:", piiCookies);
        }
      }

      await context.close();
    },
    { scope: "test" },
  ],
});
```

**Data Sovereignty Validation:**

```javascript
test("EU user data does not leave EU region", async ({ regionPage, region }) => {
  await regionPage.goto("/register");

  // Fill EU user registration
  await regionPage.getByLabel("Email").fill("e user@example.com");
  await regionPage.getByLabel("Name").fill("Max Mustermann");
  await regionPage.getByLabel("Phone").fill("+49 123 456789");
  await regionPage.getByRole("button", { name: "Register" }).click();

  // Intercept all API calls to verify data residency
  const apiCalls = [];
  await regionPage.route("**/api/**", async (route) => {
    const request = route.request();
    apiCalls.push({
      url: request.url(),
      method: request.method(),
      postData: request.postData(),
    });
    await route.continue();
  });

  // Trigger data export
  await regionPage.goto("/settings/export-data");
  await regionPage.getByRole("button", { name: "Export My Data" }).click();
  await regionPage.waitForResponse("**/api/data-export**");

  // Verify all API calls went to EU endpoints
  for (const call of apiCalls) {
    expect(call.url).toContain("eu-west-1");
    expect(call.url).not.toContain("us-east-1");
    expect(call.url).not.toContain("ap-northeast-1");
  }

  // Verify no data was sent to non-EU analytics endpoints
  const nonEuAnalytics = apiCalls.filter(call =>
    /google-analytics|facebook|doubleclick/.test(call.url)
  );
  expect(nonEuAnalytics.length).toBe(0);
});
```

**Cross-Region Latency Test:**

```javascript
test("EU user gets acceptable latency from EU region", async ({ regionPage }) => {
  const measurements = [];

  for (let i = 0; i < 10; i++) {
    const start = Date.now();
    await regionPage.goto("/dashboard");
    const navigationTiming = await regionPage.evaluate(() => {
      const perf = performance.getEntriesByType("navigation")[0];
      return {
        dnsLookup: perf.domainLookupEnd - perf.domainLookupStart,
        tcpConnect: perf.connectEnd - perf.connectStart,
        tlsNegotiation: perf.secureConnectionStart ? perf.secureConnectionEnd - perf.secureConnectionStart : 0,
        ttfb: perf.responseStart - perf.requestStart,
        domContentLoaded: perf.domContentLoadedEventEnd - perf.domContentLoadedEventStart,
        fullLoad: perf.loadEventEnd - perf.loadEventStart,
        totalTime: perf.duration,
      };
    });
    measurements.push(navigationTiming);
  }

  // Calculate averages
  const avgTiming = {};
  for (const key of Object.keys(measurements[0])) {
    avgTiming[key] = measurements.reduce((sum, m) => sum + m[key], 0) / measurements.length;
  }

  console.log("Average navigation timing (EU region):", avgTiming);

  // Assert acceptable thresholds
  expect(avgTiming.totalTime).toBeLessThan(3000); // Full load under 3 seconds
  expect(avgTiming.ttfb).toBeLessThan(500);        // TTFB under 500ms
  expect(avgTiming.dnsLookup).toBeLessThan(50);    // DNS under 50ms
});
```

---

### Q25: A critical production bug was found in a checkout flow that only occurs under specific conditions: race condition between payment processing and inventory decrement. How do you reproduce and validate the fix using Playwright?

**Answer:**

**Bug Analysis:**

```
Conditions:
1. User adds item to cart (only 1 left in stock)
2. User proceeds to checkout
3. Payment processes successfully
4. Inventory decrement fails (race condition)
Result: User is charged but item shows out-of-stock
```

**Reproduction Test:**

```javascript
test("reproduce payment-inventory race condition", async ({ page, browser }) => {
  // Setup: Ensure one item in stock
  await page.goto("/admin/inventory");
  await page.getByLabel("Stock Count").fill("1");
  await page.getByRole("button", { name: "Save" }).click();

  // Create a second context (another user) to create competition
  const context2 = await browser.newContext();
  const page2 = await context2.newPage();

  // Both users navigate to product page simultaneously
  await page.goto("/products/limited-item");
  await page2.goto("/products/limited-item");

  // Both users add to cart and checkout at the same time
  const [result1, result2] = await Promise.allSettled([
    checkoutItem(page),
    checkoutItem(page2),
  ]);

  // Expected: One succeeds, one fails with out-of-stock
  const successCount = [result1, result2].filter(r => r.status === "fulfilled" && r.value.success).length;
  const failureCount = [result1, result2].filter(r => r.status === "fulfilled" && !r.value.success).length;

  expect(successCount).toBe(1);
  expect(failureCount).toBe(1);

  // Verify no user was charged without receiving the item
  const chargedUsers = [result1, result2].filter(r =>
    r.status === "fulfilled" && r.value.charged && !r.value.inventoryDecremented
  );
  expect(chargedUsers.length).toBe(0); // No one should be charged without inventory

  await context2.close();
});

async function checkoutItem(page) {
  await page.getByRole("button", { name: "Add to Cart" }).click();
  await page.getByRole("button", { name: "Checkout" }).click();
  await page.getByLabel("Card Number").fill("4242424242424242");
  await page.getByRole("button", { name: "Pay Now" }).click();

  // Wait for either success or failure
  const success = await page.waitForSelector(
    '[data-testid="order-confirmation"], [data-testid="out-of-stock-error"]',
    { timeout: 10000 }
  );

  const orderType = await success.getAttribute("data-testid");

  return {
    success: orderType === "order-confirmation",
    charged: !!(await page.locator('[data-testid="charge-id"]').count()),
    inventoryDecremented: !!(await page.locator('[data-testid="inventory-updated"]').count()),
  };
}
```

**Validating the Fix:**

```javascript
test("fix: inventory decrement is atomic with payment", async ({ page, request }) => {
  // Test with increased load to ensure fix holds
  const ITERATIONS = 50;
  const results = [];

  for (let i = 0; i < ITERATIONS; i++) {
    // Reset inventory via API
    await request.post("/api/admin/inventory/reset", {
      data: { productId: "limited-item", stock: 5 },
    });

    // Simulate concurrent checkouts
    const contexts = [];
    const promises = [];

    for (let j = 0; j < 5; j++) {
      const ctx = await browser.newContext({
        storageState: `test-data/users/user-${j}.json`,
      });
      contexts.push(ctx);
      const p = ctx.newPage();
      promises.push(
        (async () => {
          const p = await ctx.newPage();
          await p.goto("/products/limited-item");
          return checkoutItem(p);
        })()
      );
    }

    const batchResults = await Promise.allSettled(promises);
    const successes = batchResults.filter(r => r.status === "fulfilled" && r.value.success).length;
    const failures = batchResults.filter(r => r.status === "fulfilled" && !r.value.success).length;

    // Verify no one was charged without inventory
    const overcharged = batchResults.filter(r =>
      r.status === "fulfilled" && r.value.charged && !r.value.inventoryDecremented
    );
    expect(overcharged.length).toBe(0);

    results.push({ successes, failures, overcharged: overcharged.length });

    await Promise.all(contexts.map(ctx => ctx.close()));
  }

  // Verify overcharge never occurred
  const totalOvercharged = results.reduce((sum, r) => sum + r.overcharged, 0);
  expect(totalOvercharged).toBe(0);

  console.log(`Race condition stress test: ${ITERATIONS} iterations, 0 overcharges`);
});
```

---

## Quick Reference

### Architecture Decision Framework

| Decision | Senior Take |
|----------|-------------|
| POM vs Fixtures | Both. Fixtures for infrastructure, POM for UI structure |
| Custom reporter vs Built-in | Custom for metrics/observability, built-in for development |
| storageState vs Re-login | storageState for speed, re-login for auth flow testing |
| Chrome only vs Cross-browser | Chrome on PR/CI, full cross-browser nightly |
| Network mock vs Real API | Selective mock for speed, real API subset for validation |
| Test data static vs Dynamic | Static for shared fixtures, dynamic for isolation |

### Performance Decision Guide

| Goal | Tactic | Effort | Gain |
|------|--------|--------|------|
| Cut execution 50% | Sharding (4 runners) | Low | ~4x |
| Cut execution 75% | Sharding (8 runners) + chromium-only | Medium | ~8x |
| Cut execution 90% | Full distributed (20 shards) | High | ~20x |
| Reduce flakiness 50% | Auto-retry + trace on failure | Low | Significant |
| Reduce flakiness 80% | Contract mocks + isolated test data | Medium | Significant |

### Common Anti-Patterns

| Anti-Pattern | Senior Fix |
|-------------|------------|
| `waitForTimeout(5000)` | Replace with condition-based wait (`toBeVisible`, `waitForSelector`) |
| `page.locator(".class div span")` | Use `getByRole`, `getByText`, `getByTestId` |
| Re-login in every test | Use `storageState` with worker-scoped fixture |
| Shared mutable test data | Use factory/generator pattern per test |
| Test depends on another test | Redesign as independent; use API to set up state |
| Hardcoded URLs | Use `baseURL` from config + env vars |
| No trace on failure | Add `trace: "retain-on-failure"` globally |

---

## Best Practices for Senior Engineers

1. **Design for observability** — Every test should emit structured logs, traces, and metrics
2. **Prefer composition over inheritance** — Use fixtures + service objects, avoid deep POM hierarchies
3. **Isolate test infrastructure** — Fixtures manage infrastructure; POMs manage UI structure
4. **Mock with contracts** — Generate mocks from OpenAPI specs, not by hand
5. **Test the flaky test** — If a test is flaky, write a test that reproduces the flakiness
6. **Own the pipeline** — Don't just write tests; design the CI/CD integration, sharding, and reporting
7. **Measure everything** — Test duration, flakiness rate, pass rate, resource usage — put them on a dashboard
8. **Document decisions** — Trade-off decisions in ARCHITECTURE.md with rationales
9. **Mentor by PR review** — Use test PR reviews as teaching opportunities
10. **Think in systems, not tests** — The test suite is a distributed system; design it as one

---

*Last updated: May 2026 | Target: Senior Automation Engineer (5+ Years)*
