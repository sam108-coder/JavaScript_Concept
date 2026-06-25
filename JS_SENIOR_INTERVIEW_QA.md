# Senior JavaScript Interview Questions & Answers (5+ Years Experience)

A comprehensive collection of interview questions and answers tailored for a **senior-level JavaScript engineer** with 5+ years of experience. Covers deep internals, system design, performance, concurrency, and architectural decision-making.

---

## Table of Contents

1. [Event Loop & Concurrency Model](#1-event-loop--concurrency-model)
2. [V8 Engine & Runtime Internals](#2-v8-engine--runtime-internals)
3. [Memory Management & Garbage Collection](#3-memory-management--garbage-collection)
4. [Async Patterns & Control Flow](#4-async-patterns--control-flow)
5. [Concurrency & Parallelism](#5-concurrency--parallelism)
6. [Module Systems & Bundling](#6-module-systems--bundling)
7. [Prototypes, Inheritance & Object Model](#7-prototypes-inheritance--object-model)
8. [Functional Programming & Composition](#8-functional-programming--composition)
9. [Design Patterns in JavaScript](#9-design-patterns-in-javascript)
10. [Performance Optimization & Profiling](#10-performance-optimization--profiling)
11. [Security in JavaScript](#11-security-in-javascript)
12. [Error Handling & Reliability](#12-error-handling--reliability)
13. [TypeScript Integration](#13-typescript-integration)
14. [Build Systems & Tooling](#14-build-systems--tooling)
15. [System Design with Node.js](#15-system-design-with-nodejs)
16. [Real-World Architecture Challenges](#16-real-world-architecture-challenges)

---

## 1. Event Loop & Concurrency Model

### Q1: Explain the event loop at the C++ level. How does libuv implement it, and what are the phases?

**Answer:**

The event loop is implemented by **libuv**, the C library that provides the asynchronous I/O layer for Node.js (and browsers via similar constructs). It has six phases:

- **timers**: setTimeout, setInterval callbacks
- **pending callbacks**: I/O callbacks deferred to next iteration
- **idle, prepare**: Internal use (not exposed to JS)
- **poll**: Retrieve new I/O events, execute I/O callbacks
- **check**: setImmediate callbacks
- **close callbacks**: close events (socket.on('close'))

Each phase has a FIFO queue of callbacks. The loop iterates until all queues are empty.

**Microtasks & Macrotasks:**

One iteration of the event loop:
1. Execute the current phase (e.g., timers)
2. AFTER each phase, drain the microtask queue entirely (Promise.then, queueMicrotask, process.nextTick)
3. Move to next phase

Critical distinction:
- process.nextTick() runs BEFORE Promise.then (it is in a special nextTickQueue checked first)
- Promise.then callbacks are in the microtask queue (checked after each phase)
- All other callbacks (timers, I/O, setImmediate) are macrotasks

After each C++ phase returns control to V8, V8 executes a microtasks checkpoint before the next C++ phase runs. This is why Promise.then runs between timer callbacks, not after all timers.

---

### Q2: Explain the difference between process.nextTick() and queueMicrotask(). When would you use each in production code?

**Answer:**

| Aspect | process.nextTick() | queueMicrotask() | Promise.then() |
|--------|---------------------|--------------------|------------------|
| Queue | nextTickQueue (highest priority) | microtaskQueue | microtaskQueue |
| Priority | Highest -- fires before any microtask | After nextTick | Same as queueMicrotask |
| Availability | Node.js only | Node.js + Browser | Node.js + Browser |
| Max queue size | 1000 (hard limit) | Unbounded | Unbounded |

**When to use process.nextTick():**
1. Run code BEFORE any I/O, timers, or microtasks (e.g., emit events before I/O starts)
2. Fix event emitter ordering -- ensure listeners are attached before events are emitted

**When to use queueMicrotask():**
1. Flush pending state updates before yielding to event loop
2. Batch coalescing -- schedule a single microtask from many synchronous calls

**When NOT to use either:**
- process.nextTick() can starve I/O if called recursively (Node.js warns at 1000)
- queueMicrotask() can also starve (no built-in protection)

---

### Q3: Explain how the browser implements requestAnimationFrame and requestIdleCallback in relation to the event loop.

**Answer:**

Browser Event Loop Structure (one frame = ~16.6ms at 60fps):
1. Process macrotasks (events, timers)
2. Process microtask queue (Promises)
3. requestAnimationFrame callbacks
4. Style calculation (Recalc)
5. Layout (Reflow)
6. Paint (Rasterization)
7. requestIdleCallback (if time remaining)

**requestAnimationFrame (rAF):**
- Fires BEFORE paint/repaint
- Best for visual updates (animations, DOM changes affecting layout)
- Drops frames if execution exceeds 16.6ms
- Order: sync code -> microtasks -> rAF -> paint -> timeout

**requestIdleCallback (rIC):**
- Fires during idle periods (after a frame, if time permits)
- Receives IdleDeadline with timeRemaining()
- Best for non-critical work (analytics, preloading)
- May never fire if the page is constantly busy

---

## 2. V8 Engine & Runtime Internals

### Q4: Explain V8's JIT compilation pipeline -- from source to optimized machine code.

**Answer:**

**V8 Pipeline Stages:**

1. **Parser** -> AST (Abstract Syntax Tree)
   - Eager parsing: Full AST + scopes + error detection (slower)
   - Lazy parsing: Skip function bodies until invoked (faster)
   - IIFEs trigger eager parse

2. **Ignition (Interpreter)** -> Bytecode
   - Platform-independent bytecode (~2-5x faster than pure interpretation)
   - Virtual registers (not stack-based)
   - Bytecode size is about 25% of AST size

3. **Hot Code Detection** (after ~62 executions)
   - V8 collects type feedback (e.g., argument types are always 'number')
   - Ignition annotates bytecode with type feedback vectors

4. **Sparkplug (Baseline Compiler)**
   - Unoptimized machine code directly from bytecode
   - No type assumptions, no inlining
   - ~2-5x faster than Ignition

5. **Maglev (Mid-Tier, Chromium 120+)**
   - Intermediate optimization level
   - Static type information without speculative optimization

6. **TurboFan (Optimizing Compiler)**
   - Speculative Optimization: assumes stable types
   - Inline Caching (IC): caches property lookups
   - Hidden Classes (Shapes): tracks object shape transitions
   - Inlining: inlines small hot functions
   - Escape Analysis: eliminates non-escaping allocations

**Deoptimization:** Optimized code -> Type assumption fails -> Bailout to Ignition. Each deopt costs ~50ms.

**Performance Implications:**
- Hot functions with stable types: 50-100x faster than interpreted
- Polymorphic call sites: up to 10x slower than monomorphic
- Megamorphic call sites (5+ shapes): dictionary lookup (slow)

---

### Q5: Explain hidden classes (Shapes), Inline Caching (IC), and how they affect performance.

**Answer:**

**Hidden Classes (Shapes):** V8 uses hidden classes (called "Maps" or "Shapes") to track object structure. Each property addition creates a new hidden class transition. Same-shape objects use O(1) property access (direct offset). Different shapes trigger dictionary lookup O(n).

**Inline Caching (IC):** V8 records the shape of obj at each `obj.property` call site. IC states:
- Monomorphic (1 shape) -> Fast direct load
- Polymorphic (2-4 shapes) -> Branch on shape
- Megamorphic (5+ shapes) -> Hash table lookup (10-100x slower)

**Practical Guidelines:**
- Same shape for all instances: Fast
- delete obj.prop: Very Slow (forces dictionary mode)
- Initialize all properties in constructor (same shape chain)

---

### Q6: How does V8's memory and garbage collection work?

**Answer:**

**V8 Heap:** Young Generation (New Space, two semi-spaces ~1-8MB each) + Old Generation (Old Pointer Space, Old Data Space, Large Object Space, Code Space, Map Space)

**Generational Hypothesis:** Most objects die young; survivors live longer.

**Young Generation GC (Scavenger):** Copying algorithm. Live objects copied to other semi-space (compacted). Survivors promoted to Old Generation after 2+ GC cycles.

**Old Generation GC (Mark-Sweep-Compact):**
1. Mark: Tri-color marking (white/gray/black), parallel marking
2. Sweep: Free memory for dead objects
3. Compact (optional): Move survivors, update references

**Orinoco (Concurrent GC):** Reduces pause time from ~100ms to ~1-3ms using incremental marking + concurrent sweeping.

**Key Flags:** --max-semi-space-size, --max-old-space-size, --trace-gc

---

## 3. Memory Management & Garbage Collection

### Q7: Identify and fix the 6 most common JavaScript memory leaks.

**Answer:**

1. **Accidental Globals**: Assignment to undeclared variable creates global. Fix: 'use strict'

2. **Forgotten Timers/Intervals**: setInterval keeps component reference via closure. Fix: clearInterval in cleanup

3. **Closure References**: Callback closes over unused large data. Fix: nullify unused variables

4. **Detached DOM Nodes**: JS reference to removed element prevents GC. Fix: clean up references

5. **Outgoing Event Listeners (SPAs)**: Listeners accumulate on navigation. Fix: event delegation or remove old listeners

6. **Unclosed Resources**: DB connections, file handles left open. Fix: always close in finally blocks

**Detection:** Heap snapshots (Chrome DevTools), --trace-gc, process.memoryUsage(), allocation profiling

---

### Q8: Explain WeakRef, FinalizationRegistry, and WeakMap/WeakSet.

**Answer:**

| Feature | Reference Strength | Use Case |
|---------|-------------------|----------|
| WeakMap | Weak keys (objects) | Private data, caching without preventing GC |
| WeakSet | Weak values (objects) | Marking/tagging without preventing GC |
| WeakRef | Weak ref to single object | Non-essential caches |
| FinalizationRegistry | Cleanup callback | Resource monitoring, leak detection |

**When NOT to use:** WeakMap not iterable (privacy guarantee). WeakRef unpredictable (GC may collect anytime). FinalizationRegistry may never run (process exit).

---

## 4. Async Patterns & Control Flow

### Q9: Explain Promise combinators (all, allSettled, race, any) with use cases.

**Answer:**

| Method | Resolution | Use Case |
|--------|-----------|----------|
| Promise.all() | All resolve or any rejects (fail-fast) | All tasks must succeed |
| Promise.allSettled() | All settle (resolve or reject) | Need all results regardless |
| Promise.race() | First to settle | Timeout mechanism |
| Promise.any() | First to fulfill | Best available result |

**Custom:** firstSuccess(promises) -- resolves with first fulfilled, rejects AggregateError if all fail. mapConcurrent(items, fn, concurrency) -- limited concurrency via semaphore.

---

### Q10: How would you implement a cancellable Promise?

**Answer:**

**Three Approaches:**

1. **AbortController** (Recommended): Native API, works with fetch/streams, signal propagates through call chain

2. **Promise Wrapper**: Simple wrapping, but doesn't stop underlying execution (just ignores result)

3. **Token-based Cancellation**: Fine-grained with isCancelled checks at specific points. More boilerplate but composable for complex async graphs

For async generators, the token pattern provides natural cancellation check points between yields.

---

## 5. Concurrency & Parallelism

### Q11: Compare Web Workers, Service Workers, and Worklets.

**Answer:**

| Feature | Web Worker | Service Worker | Worklet |
|---------|-----------|---------------|---------|
| Purpose | Parallel computation | Network proxy, offline | Rendering pipeline hooks |
| Lifetime | Tied to page | Registered independently | Per-render scope |
| DOM access | No | No | No |
| Communication | postMessage | postMessage + events | Callbacks |

**Decision Guide:**
- Heavy computation -> Web Worker
- Offline/caching -> Service Worker
- Custom rendering/audio -> Worklet
- Shared state across tabs -> SharedWorker

---

### Q12: Explain SharedArrayBuffer and Atomics.

**Answer:**

SharedArrayBuffer allows multiple workers to read/write the same memory without copying. Atomics provide uninterruptible read-modify-write operations: add, store, load, compareExchange, wait, notify.

**Security:** Disabled after Spectre/Meltdown (2018). Re-enabled with COOP (same-origin) + COEP (require-corp) headers. Without these headers, SharedArrayBuffer is unavailable.

---

## 6. Module Systems & Bundling

### Q13: Explain CommonJS vs ESM. How does Node.js resolve them?

**Answer:**

| Feature | CommonJS (require) | ESM (import) |
|---------|---------------------|----------------|
| Loading | Synchronous | Asynchronous |
| Syntax | require/module.exports | import/export |
| Tree-shakable | No (dynamic) | Yes (static) |
| Circular deps | Partial (uninitialized) | Full (live bindings) |
| Top-level await | No | Yes |

**Node.js Resolution:**
- "type": "module" in package.json -> .js = ESM
- "type": "commonjs" or absent -> .js = CJS
- .mjs -> ESM, .cjs -> CJS

---

## 7. Prototypes, Inheritance & Object Model

### Q14: Explain the JavaScript object model and property lookup.

**Answer:**

Property lookup: check own properties -> check prototype (__proto__) -> walk prototype chain -> Object.prototype -> undefined

Prototype chain for arrays: arr -> Array.prototype -> Object.prototype -> null

**Property Descriptors:** writable, enumerable, configurable control property behavior

**instanceof:** Checks if Constructor.prototype is in obj's prototype chain. Can be customized via Symbol.hasInstance

**Object.create vs class:** Both produce the same prototype chain. class is syntactic sugar over prototype-based inheritance.

---

## 8. Functional Programming & Composition

### Q15: Explain pipe, compose, transducers, and lenses.

**Answer:**

- **pipe(f, g)(x)** = f(g(x)) -- left to right
- **compose(f, g)(x)** = f(g(x)) -- right to left

**Transducers:** Single-pass transformation chains (filter -> map -> reduce) without intermediate arrays. O(1) memory for large collections.

**Lenses:** Focus on nested data for immutable reads/updates. Lens = { get: obj -> value, set: (val, obj) -> newObj }

**When to use:** pipe for sequential transforms, transducers for large data, lenses for immutable nested state (Redux, React).

---

## 9. Design Patterns in JavaScript

### Q16: Implement Observer with Proxy vs EventEmitter vs MutationObserver.

**Answer:**

**Proxy:** Intercepts get/set/deleteProperty. Deeply nested via lazy proxy wrapping. Reactive state (Vue 3, MobX).

**EventEmitter:** Manual pub/sub. on(event), off(event), emit(event). Application-level messaging, domain events.

**MutationObserver:** DOM-native. Observes childList, subtree, attributes. DOM monitoring, third-party widget detection.

---

## 10. Performance Optimization & Profiling

### Q17: Walk through a real-world performance optimization case.

**Answer:**

**Case:** E-Commerce listing page with 200+ products (10fps during scroll).

**Optimizations:** Virtual scrolling (20 DOM nodes vs 200), memoized Intl.NumberFormat, lazy image loading + async decoding, object pooling for GC reduction, batched layout reads/writes.

**Results:** 10fps -> 60fps, 185ms -> 35ms initial render, 45MB -> 12MB memory.

---

### Q18: Explain the critical rendering path and optimize FCP, LCP, CLS.

**Answer:**

**Path:** HTML -> DOM -> Render Tree -> Layout -> Paint -> Composite

| Metric | Target | Affected By |
|--------|--------|-------------|
| FCP | < 1.8s | Render-blocking CSS, JS parsing |
| LCP | < 2.5s | Image/font loading, slow server |
| CLS | < 0.1 | Images without dimensions, web fonts |

**Optimizations:** Preload critical resources, defer non-critical CSS/JS, images with dimensions, font-display: swap, code splitting, avoid layout thrash, CSS containment.

---

## 11. Security in JavaScript

### Q19: Explain XSS types, prevention, and testing.

**Answer:**

**Types:** Reflected (URL payload), Stored (DB-stored payload), DOM-based (client-side only, never reaches server)

**Prevention:** textContent over innerHTML, DOMPurify for allowed HTML, CSP headers, HttpOnly+Secure+SameSite cookies, Trusted Types API

**Testing:** Inject XSS payloads, verify no script execution, check for unencoded output

---

### Q20: Explain prototype pollution.

**Answer:**

Attack: Recursive merge of user input with __proto__ key pollutes Object.prototype, affecting all objects.

**Prevention:** Object.create(null) for safe objects, reject __proto__/constructor/prototype keys in merge, freeze built-in prototypes, use Map for user data, structuredClone is safe by default

---

## 12. Error Handling & Reliability

### Q21: Design error handling for a large JS application.

**Answer:**

**Layered Architecture:**
- Utility Layer: Custom AppError classes with code, status, metadata
- Service Layer: Resilient fetch with retries, exponential backoff, circuit breaker
- Feature Layer: Recovery strategies per domain
- Boundary Layer: window.onerror, unhandledrejection, process.on

**Circuit Breaker:** Track failures, open at threshold, half-open after reset, close on success.

---

## 13. TypeScript Integration

### Q22: Approach TypeScript adoption in a legacy JS project.

**Answer:**

**Phased (8-12 weeks):**
1. tsconfig with allowJs, strict off, rename .js to .ts
2. Type utilities and API responses, add JSDoc to critical files
3. Type stores and components, enable strict file-by-file
4. Enable strict globally, remove allowJs, add lint rules

**Patterns:** JSDoc as bridge, declare module for untyped deps, skipLibCheck

---

## 14. Build Systems & Tooling

### Q23: How does a bundler work? Compare Webpack, Rollup, Vite.

**Answer:**

**Pipeline:** Parse -> Dependency graph -> Transform (loaders) -> Tree shake -> Code split -> Bundle -> Minify -> Output

**Comparison:**
- Webpack: Full-featured, complex config, good code splitting
- Rollup: Library-focused, excellent tree shaking
- Vite: Native ESM dev (instant HMR via esbuild), Rollup for production

---

## 15. System Design with Node.js

### Q24: Design a rate limiter (Token Bucket vs Sliding Window).

**Answer:**

**Token Bucket:** Per-user bucket with N capacity, tokens refill at R/sec. Distributed via Redis with sorted sets and TTL.

**Sliding Window:** Sorted timestamps per user, remove old entries on each request. Redis ZREMRANGEBYSCORE + ZCARD.

---

### Q25: Design a pub/sub system for real-time notifications.

**Answer:** Redis Pub/Sub + WebSocket gateway. Channel-based subscriptions, client heartbeat, offline message persistence via Redis streams.

---

## 16. Real-World Architecture Challenges

### Q26: Optimize a React list with 10,000+ items.

**Answer:** Virtual scrolling (react-window), React.memo + stable props, useMemo/useCallback for expensive computations, useDeferredValue, event delegation on container (windowing).

---

### Q27: Diagnose Node.js memory limits in production.

**Answer:** --trace-gc, heap snapshots via --inspect, process.memoryUsage() monitoring, check unclosed connections, streaming for large data, object pooling.

---

### Q28: Implement offline-first support.

**Answer:** Service Worker (Cache First / Network First / Stale While Revalidate), IndexedDB for structured data, Background Sync for deferred mutations, optimistic UI updates, versioned cache invalidation.

---

### Q29: Design a real-time collaborative editing system.

**Answer:** Operational Transformation (OT) over WebSockets. Version vectors, cursor broadcasting, undo/redo stacks. Test with Playwright multi-context for simultaneous edits.

---

### Q30: Migrate monolithic frontend to micro-frontends.

**Answer:** Module Federation (Webpack 5), shared component library (npm), cross-app communication via custom events, consistent auth via session cookie, CSS isolation (Shadow DOM/CSS-in-JS), independent deploy units, contract tests for shared APIs.

---

## Quick Reference

### Event Loop Order
sync code -> process.nextTick -> Promise.then -> queueMicrotask -> timers -> I/O -> setImmediate -> close

### Memory Leak Detection
```bash
node --trace-gc --max-old-space-size=256 app.js
node --inspect app.js
```

### V8 Diagnostics
```bash
node --trace-ic app.js
node --trace-deopt app.js
node --trace-opt app.js
```

### Security Headers
| Header | Value |
|--------|-------|
| Content-Security-Policy | default-src 'self' |
| X-Content-Type-Options | nosniff |
| X-Frame-Options | DENY |
| Strict-Transport-Security | max-age=31536000 |

---

## Best Practices for Senior JavaScript Engineers

1. **Understand the runtime** -- V8 internals, event loop phases, GC behavior
2. **Profile before optimizing** -- Measure with performance API, not intuition
3. **Design for observability** -- Structured logging, metrics, tracing from day one
4. **Prefer composition over inheritance** -- Functional patterns, avoid deep class hierarchies
5. **Own the full stack** -- Source code to machine code understanding
6. **Think in systems** -- Memory, concurrency, security, failure modes
7. **Document decisions** -- Trade-off rationales in architecture docs
8. **Mentor by code review** -- PR reviews as teaching opportunities
9. **Test at the right level** -- Unit for logic, integration for flows, E2E for critical paths
10. **Stay current** -- TC39 proposals, V8 blog, Node.js release notes

---

*Last updated: May 2026 | Target: Senior JavaScript Engineer (5+ Years)*
