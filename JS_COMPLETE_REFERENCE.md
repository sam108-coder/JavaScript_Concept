# JavaScript: Complete Reference Guide

A comprehensive reference covering ES6+ features, design patterns, DOM APIs, data structures, algorithms, runtime internals, and daily-use coding patterns.

---

## Table of Contents

1. [ES6+ Features Deep Dive](#1-es6-features-deep-dive)
2. [JavaScript Design Patterns](#2-javascript-design-patterns)
3. [DOM & Browser APIs](#3-dom--browser-apis)
4. [Data Structures in JavaScript](#4-data-structures-in-javascript)
5. [Algorithms in JavaScript](#5-algorithms-in-javascript)
6. [JavaScript Under The Hood](#6-javascript-under-the-hood)
7. [Quick Reference / Cheatsheet](#7-quick-reference--cheatsheet)

---

## 1. ES6+ Features Deep Dive

### 1.1 Variables (let, const) & Block Scoping

```javascript
// var: function-scoped, hoisted with undefined
// let: block-scoped, hoisted but TDZ (Temporal Dead Zone)
// const: block-scoped, must be initialized, cannot reassign (mutation allowed)
{
  var a = 1; let b = 2; const c = 3;
}
console.log(a); // 1 (leaks)
console.log(b); // ReferenceError
```

### 1.2 Arrow Functions

```javascript
// No own 'this', arguments, super, or new.target
// Cannot be used as constructor
// Implicit return for single-expression bodies
const add = (a, b) => a + b;
const square = x => x * x;
const getObj = () => ({ key: 'value' }); // wrap object in parens
```

### 1.3 Destructuring

```javascript
// Array
const [first, second, ...rest] = [1, 2, 3, 4];
const [, , third] = arr; // skip elements
// Object
const { name: userName, age = 25 } = person;
const { nested: { prop } } = obj;
// Function params
function render({ x = 0, y = 0 }) {}
// Swapping
[a, b] = [b, a];
```

### 1.4 Spread & Rest Operators

```javascript
// Spread (expands iterable)
const arr2 = [...arr1, 4, 5];
const merged = { ...obj1, ...obj2 }; // shallow merge
const copy = { ...original }; // shallow clone
// Rest (collects remaining)
function sum(...nums) { return nums.reduce((a, b) => a + b); }
const { a, ...rest } = obj;
```

### 1.5 Template Literals

```javascript
const str = `Hello ${name}!`;
const multiline = `line1
line2
line3`;
const tagged = tag`Hello ${name}`; // tag function receives [strings, ...values]
```

### 1.6 Enhanced Object Literals

```javascript
const name = 'Alice';
const obj = {
  name,                              // shorthand property
  ['dynamic_' + Date.now()]: 42,     // computed property key
  method() { return this.name; },     // method shorthand
  *generator() { yield 1; }         // generator
};
```

### 1.7 Symbol

```javascript
const sym1 = Symbol('description');
const sym2 = Symbol('description');  // sym1 !== sym2
const reg = Symbol.for('global');    // registered globally
Symbol.keyFor(reg);                  // 'global'
// Built-in symbols: Symbol.iterator, Symbol.hasInstance, Symbol.toStringTag, etc.
```

### 1.8 Map, Set, WeakMap, WeakSet

```javascript
// Map: key-value (any type as key)
const map = new Map([['key', 'value']]);
map.set(obj, 1).get(obj).has(obj).delete(obj).clear();
// Set: unique values
const set = new Set([1, 1, 2, 3]); // {1, 2, 3}
set.add(4).has(4).delete(4);
// WeakMap/WeakSet: keys must be objects, not iterable, auto-GC
```

### 1.9 Promises & Async/Await

```javascript
// Promise lifecycle: pending -> fulfilled / rejected
const p = new Promise((resolve, reject) => {
  resolve(val); reject(err);
});
p.then(v => v, e => e).catch(e => e).finally(() => {});

// Combinators
Promise.all([p1, p2]);         // fail-fast
Promise.allSettled([p1, p2]);  // all results
Promise.race([p1, p2]);        // first settled
Promise.any([p1, p2]);         // first fulfilled

// Async/Await (syntactic sugar over Promises)
async function fetchData() {
  try {
    const res = await fetch(url);
    return res.json();
  } catch (e) { handleError(e); }
}
```

### 1.10 Iterators & Generators

```javascript
// Iterator protocol: { next() => { value, done } }
const iterable = {
  [Symbol.iterator]() {
    let i = 0;
    return { next: () => ({ value: i++, done: i > 5 }) };
  }
};

// Generator: function* + yield
function* range(start, end) {
  for (let i = start; i <= end; i++) yield i;
}
// Async generator
async function* paginate(url) {
  let page = 1;
  while (true) {
    const data = await fetch(`${url}?page=${page++}`);
    if (!data.items.length) return;
    yield data.items;
  }
}
for await (const items of paginate('/api')) {}
```

### 1.11 Proxies & Reflect

```javascript
const handler = {
  get(target, prop) { return prop in target ? target[prop] : 42; },
  set(target, prop, value) { target[prop] = value; return true; },
  has(target, prop) { return prop in target; },
  deleteProperty(target, prop) { delete target[prop]; return true; },
  apply(target, thisArg, args) { /* for functions */ },
  construct(target, args) { /* for new */ },
};
const proxy = new Proxy(target, handler);
Reflect.get(target, prop); // Reflect mimics Proxy traps
```

### 1.12 Decorators (Stage 3)

```javascript
function readonly(target, key, descriptor) {
  descriptor.writable = false;
  return descriptor;
}

class Example {
  @readonly
  pi = 3.14;
}
```

### 1.13 Optional Chaining & Nullish Coalescing

```javascript
const val = obj?.nested?.prop;     // short-circuits on null/undefined
const result = input ?? 'default'; // only for null/undefined (not falsy)
obj?.[key]?.();                    // optional chaining for brackets and calls
```

### 1.14 Top-Level Await (ES2022)

```javascript
// In modules only -- no async wrapper needed
const data = await fetch('/api/data').then(r => r.json());
export { data };
```

### 1.15 Array Methods

```javascript
// Immutable
arr.map(fn), arr.filter(fn), arr.reduce(fn, init), arr.reduceRight(fn)
arr.flat(depth), arr.flatMap(fn)  // ES2019
arr.slice(start, end)
arr.toReversed(), arr.toSorted(), arr.toSpliced(), arr.with() // ES2023 (immutable)

// Mutable
arr.forEach(fn), arr.push(v), arr.pop(), arr.shift(), arr.unshift(v)
arr.splice(start, deleteCount, ...items)
arr.sort(fn), arr.reverse()
arr.fill(v, start, end)
arr.copyWithin(target, start, end)

// Search
arr.find(fn), arr.findIndex(fn), arr.findLast(fn), arr.findLastIndex(fn) // ES2023
arr.indexOf(v), arr.lastIndexOf(v), arr.includes(v)
arr.some(fn), arr.every(fn)

// Array.from (array-like/iterable to array)
Array.from({ length: 5 }, (_, i) => i); // [0, 1, 2, 3, 4]
Array.from(new Set([1, 1, 2]));          // unique

// Array.of
Array.of(1, 2, 3); // [1, 2, 3] (unlike Array(3) which gives [,,])

// Typed Arrays
new Int8Array(), new Uint8Array(), new Uint8ClampedArray()
new Int16Array(), new Uint16Array()
new Int32Array(), new Uint32Array(), new Float32Array(), new Float64Array()
new BigInt64Array(), new BigUint64Array()
```

### 1.16 String Methods

```javascript
str.startsWith('x'), str.endsWith('x'), str.includes('x')
str.padStart(len, ch), str.padEnd(len, ch)  // ES2017
str.trimStart(), str.trimEnd()               // ES2019
str.replaceAll(search, replace)              // ES2021
str.at(-1)                                   // ES2022 (negative index)
str.matchAll(regex)                          // iterator of matches
```

### 1.17 Object Methods

```javascript
Object.keys(obj), Object.values(obj), Object.entries(obj)  // ES2017
Object.fromEntries(entries)                                 // ES2019
Object.assign(target, ...sources)                            // shallow merge
Object.freeze(obj), Object.seal(obj), Object.preventExtensions(obj)
Object.defineProperty(obj, key, descriptor)
Object.getOwnPropertyDescriptor(obj, key)
Object.getOwnPropertyDescriptors(obj)                        // ES2017
Object.getPrototypeOf(obj), Object.setPrototypeOf(obj, proto)
Object.hasOwn(obj, key)                                      // ES2022 (safer than obj.hasOwnProperty)
Object.groupBy(items, callback)                              // ES2024
```

### 1.18 Number & Math Extensions

```javascript
Number.isNaN(v), Number.isFinite(v), Number.isInteger(v)
Number.EPSILON, Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER
Math.trunc(x), Math.sign(x), Math.cbrt(x), Math.hypot(...args)
Math.log10(x), Math.log2(x), Math.fround(x)
BigInt: 123n, BigInt(123), typeof 1n === 'bigint'
```

### 1.19 Temporal API (Stage 3, replacing Date)

```javascript
Temporal.Now.instant()           // current time
Temporal.PlainDate.from('2024-01-01')
Temporal.PlainTime.from('14:30')
Temporal.PlainDateTime.from('2024-01-01T14:30')
Temporal.ZonedDateTime.from('2024-01-01T14:30+05:30[Asia/Kolkata]')
Temporal.Duration.from({ hours: 1, minutes: 30 })
date.toLocaleString(), date.add({ days: 5 }), date.until(other)
date.with({ year: 2025 }), date.round('day'), date.compare(a, b)
```

---

## 2. JavaScript Design Patterns

### 2.1 Module Pattern

```javascript
const Module = (function() {
  let privateVar = 0;
  function privateFn() {}
  return {
    publicMethod() { return privateVar; },
    publicProp: 'value',
  };
})();
```

### 2.2 Singleton

```javascript
const Singleton = {
  getInstance: (function() {
    let instance;
    return function() {
      if (!instance) instance = { id: Date.now() };
      return instance;
    };
  })(),
};
```

### 2.3 Factory

```javascript
function createUser(type) {
  const users = {
    admin: { role: 'admin', permissions: ['read', 'write', 'delete'] },
    guest: { role: 'guest', permissions: ['read'] },
  };
  return { ...users[type], createdAt: new Date() };
}
```

### 2.4 Observer (Pub/Sub)

```javascript
class EventBus {
  constructor() { this._events = new Map(); }
  on(event, fn) {
    if (!this._events.has(event)) this._events.set(event, new Set());
    this._events.get(event).add(fn);
    return () => this._events.get(event).delete(fn);
  }
  emit(event, ...args) {
    this._events.get(event)?.forEach(fn => fn(...args));
  }
  once(event, fn) {
    const wrapper = (...args) => { fn(...args); this.off(event, wrapper); };
    return this.on(event, wrapper);
  }
  off(event, fn) { this._events.get(event)?.delete(fn); }
}
```

### 2.5 Proxy-Based Reactivity (Vue 3-like)

```javascript
function reactive(obj, onChange) {
  return new Proxy(obj, {
    get(target, prop) {
      track(target, prop);
      const val = Reflect.get(target, prop);
      return val && typeof val === 'object' ? reactive(val, onChange) : val;
    },
    set(target, prop, value) {
      const old = target[prop];
      Reflect.set(target, prop, value);
      if (old !== value) onChange(prop, value, old);
      return true;
    },
  });
}
```

### 2.6 Command Pattern

```javascript
class Command {
  constructor(execute, undo) { this.execute = execute; this.undo = undo; }
}
class CommandHistory {
  constructor() { this.history = []; }
  execute(cmd) { cmd.execute(); this.history.push(cmd); }
  undo() { const cmd = this.history.pop(); cmd?.undo(); }
}
```

### 2.7 Strategy Pattern

```javascript
const strategies = {
  email: (val) => /^.+@.+$/.test(val),
  phone: (val) => /^\d{10}$/.test(val),
  required: (val) => val != null && val !== '',
};
function validate(type, value) { return strategies[type]?.(value) ?? false; }
```

### 2.8 Decorator Pattern

```javascript
function withLogging(fn) {
  return function(...args) {
    console.log(`Calling ${fn.name} with`, args);
    const result = fn(...args);
    console.log(`Result:`, result);
    return result;
  };
}
function withCache(fn) {
  const cache = new Map();
  return function(arg) {
    if (cache.has(arg)) return cache.get(arg);
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}
const enhanced = withLogging(withCache(expensiveFn));
```

### 2.9 State Pattern

```javascript
class StateMachine {
  constructor(states, initial) {
    this.states = states;
    this.current = initial;
  }
  transition(action) {
    const next = this.states[this.current]?.transitions?.[action];
    if (next) {
      this.states[this.current]?.onExit?.();
      this.current = next;
      this.states[this.current]?.onEnter?.();
    }
  }
}
```

### 2.10 Mediator Pattern

```javascript
class Mediator {
  constructor() { this.colleagues = new Map(); }
  register(name, colleague) { this.colleagues.set(name, colleague); colleague.mediator = this; }
  send(sender, msg) { this.colleagues.forEach((c, n) => n !== sender && c.receive(msg)); }
}
```

---

## 3. DOM & Browser APIs

### 3.1 DOM Selection

```javascript
// Modern
document.querySelector(selector);     // first match
document.querySelectorAll(selector);  // NodeList (static)
document.getElementById('id');
document.getElementsByClassName('class');  // HTMLCollection (live)
document.getElementsByTagName('div');      // live

// Closest (traverses up)
element.closest(selector);

// Relative
element.parentElement, element.children (HTMLCollection), element.nextElementSibling
element.previousElementSibling, element.firstElementChild, element.lastElementChild
```

### 3.2 DOM Manipulation

```javascript
// Create
const el = document.createElement('div');
const text = document.createTextNode('hello');
const frag = document.createDocumentFragment(); // batch append

// Insert
parent.appendChild(el);
parent.insertBefore(el, reference);
parent.prepend(el);    // first child
parent.append(el);     // last child
el.insertAdjacentHTML('beforebegin', html);
el.insertAdjacentElement('afterend', element);

// Replace
parent.replaceChild(newEl, oldEl);
el.replaceWith(newEl);

// Remove
parent.removeChild(el);
el.remove();

// Clone
const clone = el.cloneNode(true); // deep clone
```

### 3.3 Attributes & Properties

```javascript
el.getAttribute('name');
el.setAttribute('name', 'value');
el.removeAttribute('name');
el.hasAttribute('name');
el.toggleAttribute('name');   // ES2022
el.dataset.customName;         // data-* attributes (camelCase)

// ClassList
el.classList.add('active');
el.classList.remove('active');
el.classList.toggle('active');
el.classList.contains('active');
el.classList.replace('old', 'new');

// Style
el.style.color = 'red';
el.style.cssText = 'color: red; font-size: 14px;';
getComputedStyle(el).color; // read computed
```

### 3.4 DOM Traversal

```javascript
// Filter nodes
Array.from(el.childNodes).filter(n => n.nodeType === Node.ELEMENT_NODE);
// Node types: ELEMENT_NODE(1), TEXT_NODE(3), COMMENT_NODE(8)

// Walk the DOM
function walkTree(node, fn) {
  fn(node);
  node = node.firstChild;
  while (node) { walkTree(node, fn); node = node.nextSibling; }
}

// contains
parent.contains(child); // boolean
el.matches(selector);   // boolean
```

### 3.5 Events

```javascript
// Add/Remove
element.addEventListener(type, handler, options);
element.removeEventListener(type, handler);

// Options: { capture, once, passive, signal(AbortSignal) }

// Event object properties
event.target, event.currentTarget, event.type, event.preventDefault()
event.stopPropagation(), event.stopImmediatePropagation()
event.clientX/Y, event.pageX/Y, event.screenX/Y, event.ctrlKey, event.shiftKey

// Custom Events
const evt = new CustomEvent('my-event', { detail: { key: 'value' }, bubbles: true });
element.dispatchEvent(evt);

// Event Delegation
parent.addEventListener('click', e => {
  const btn = e.target.closest('.btn');
  if (btn) handleClick(btn);
});
```

### 3.6 Event Types

```javascript
// Mouse: click, dblclick, mousedown, mouseup, mousemove, mouseenter, mouseleave, mouseover, mouseout
// Keyboard: keydown, keyup, keypress (deprecated)
// Focus: focus, blur, focusin, focusout
// Form: submit, change, input, reset, select
// Drag: dragstart, drag, dragend, dragover, dragenter, dragleave, drop
// Touch: touchstart, touchmove, touchend, touchcancel
// Window: scroll, resize, load, DOMContentLoaded, beforeunload, unload
// Clipboard: copy, cut, paste
// Animation: animationstart, animationend, animationiteration
// Transition: transitionstart, transitionend, transitionrun, transitioncancel
// Media: play, pause, ended, timeupdate, volumechange, loadedmetadata, canplay
// Network: online, offline
// View: fullscreenchange, resize, scroll
```

### 3.7 Forms

```javascript
// Form element
form.elements, form.length, form.name
form.submit(), form.reset(), form.checkValidity()

// Input
input.value, input.checked, input.files (FileList)
input.select(), input.setRangeText(), input.setSelectionRange()

// Validation
input.validity (ValidityState: valueMissing, typeMismatch, tooShort, rangeOverflow, stepMismatch, customError)
input.validationMessage, input.willValidate
input.setCustomValidity(msg) // '' = valid

// FormData
const fd = new FormData(form);
fd.append('key', 'value'); fd.get('key'); fd.getAll('key');
fd.has('key'); fd.delete('key'); fd.set('key', 'value');
fd.entries(), fd.keys(), fd.values();
fetch('/api', { method: 'POST', body: fd }); // multipart/form-data
```

### 3.8 Fetch API

```javascript
async function api(url, options = {}) {
  const defaults = { headers: { 'Content-Type': 'application/json' } };
  const res = await fetch(url, { ...defaults, ...options });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}
// GET: fetch(url)
// POST: fetch(url, { method: 'POST', body: JSON.stringify(data) })
// Upload: fetch(url, { method: 'POST', body: formData })
// Progress: use XMLHttpRequest or fetch + ReadableStream

// Headers
res.headers.get('Content-Type');
res.headers.has('X-Custom');

// Response types
res.json(), res.text(), res.blob(), res.arrayBuffer(), res.formData()
res.clone()  // clone response (body can only be consumed once)

// AbortController
const ac = new AbortController();
fetch(url, { signal: ac.signal });
ac.abort(); // AbortError
```

### 3.9 Web Storage

```javascript
// localStorage (persists, 5-10MB per origin)
localStorage.setItem('key', 'value');
localStorage.getItem('key');
localStorage.removeItem('key');
localStorage.clear();
localStorage.length;
localStorage.key(0); // key at index

// sessionStorage (cleared when tab closes)
sessionStorage.setItem('key', 'value');

// StorageEvent (fires in OTHER tabs on same origin)
window.addEventListener('storage', e => {
  e.key, e.oldValue, e.newValue, e.url, e.storageArea;
});
```

### 3.10 History & Location

```javascript
// History API (SPA routing)
history.pushState(state, '', '/new-url');
history.replaceState(state, '', '/replace-url');
history.back(), history.forward(), history.go(-1);
window.addEventListener('popstate', e => { e.state; });

// Location
location.href, location.protocol, location.host, location.hostname, location.port
location.pathname, location.search, location.hash, location.origin
location.assign(url), location.replace(url), location.reload()
new URL('https://example.com/path?a=1#hash');
url.searchParams.get('a'); url.searchParams.set('a', '2');
```

### 3.11 Intersection Observer (Lazy Loading)

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.src = entry.target.dataset.src;
      observer.unobserve(entry.target);
    }
  });
}, { rootMargin: '200px', threshold: 0.1 });
document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
```

### 3.12 Resize Observer

```javascript
const ro = new ResizeObserver(entries => {
  for (const entry of entries) {
    entry.contentRect; // { width, height, top, left }
    entry.borderBoxSize; // new format
  }
});
ro.observe(element);
ro.disconnect();
```

### 3.13 Mutation Observer

```javascript
const mo = new MutationObserver(mutations => {
  mutations.forEach(m => {
    if (m.type === 'childList') { /* addedNodes, removedNodes */ }
    if (m.type === 'attributes') { /* attributeName, oldValue */ }
    if (m.type === 'characterData') { }
  });
});
mo.observe(element, {
  childList: true, subtree: true, attributes: true, characterData: true,
  attributeOldValue: true, characterDataOldValue: true,
});
mo.disconnect();
```

### 3.14 Canvas API

```javascript
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'red'; ctx.strokeStyle = 'blue'; ctx.lineWidth = 2;
ctx.fillRect(x, y, w, h); ctx.strokeRect(x, y, w, h);
ctx.clearRect(x, y, w, h);
ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(100,100); ctx.stroke();
ctx.arc(x, y, r, startAngle, endAngle);
ctx.fillText('hello', x, y); ctx.font = '16px Arial';
ctx.drawImage(image, dx, dy, dw, dh);
ctx.save(); ctx.translate(x,y); ctx.rotate(angle); ctx.scale(x,y); ctx.restore();
ctx.getImageData(x, y, w, h); ctx.putImageData(data, x, y);
ctx.createLinearGradient(x0,y0,x1,y1); ctx.createRadialGradient(x0,y0,r0,x1,y1,r1);
```

### 3.15 WebSockets

```javascript
const ws = new WebSocket('wss://example.com/socket');
ws.onopen = () => ws.send(JSON.stringify({ type: 'join', room: 'general' }));
ws.onmessage = e => { const data = JSON.parse(e.data); };
ws.onerror = e => { };
ws.onclose = e => { e.code; e.reason; };
ws.close();
// ReadyState: CONNECTING(0), OPEN(1), CLOSING(2), CLOSED(3)
```

### 3.16 Service Workers

```javascript
// Register
navigator.serviceWorker.register('/sw.js');

// sw.js -- Install
self.addEventListener('install', e => {
  e.waitUntil(caches.open('v1').then(c => c.addAll(['/', '/app.js'])));
});

// sw.js -- Fetch (Network First)
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});

// sw.js -- Push
self.addEventListener('push', e => {
  const data = e.data.json();
  self.registration.showNotification(data.title, { body: data.body });
});

// Communication
navigator.serviceWorker.controller.postMessage({ type: 'hello' });
self.addEventListener('message', e => { e.data; e.source; });
```

### 3.17 Web Workers

```javascript
// Main thread
const worker = new Worker('worker.js');
worker.postMessage({ cmd: 'process', data: largeArray });
worker.onmessage = e => { console.log(e.data); };
worker.onerror = e => {};
worker.terminate();

// SharedWorker
const sw = new SharedWorker('shared.js');
sw.port.start(); sw.port.postMessage(data); sw.port.onmessage = e => {};

// worker.js
self.onmessage = e => {
  const result = processData(e.data);
  self.postMessage(result);
};

// Transferable objects (zero-copy)
worker.postMessage(buffer, [buffer]); // ownership transferred
```

### 3.18 WebRTC

```javascript
// Peer Connection
const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });

// Local stream
const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
stream.getTracks().forEach(t => pc.addTrack(t, stream));

// Signaling (via WebSocket)
pc.createOffer().then(offer => pc.setLocalDescription(offer));
// Send offer via signaling server
pc.onicecandidate = e => { if (e.candidate) sendCandidate(e.candidate); };
pc.ontrack = e => { remoteVideo.srcObject = e.streams[0]; };
```

### 3.19 Web Animations API

```javascript
element.animate([
  { transform: 'translateX(0)', opacity: 1 },
  { transform: 'translateX(100px)', opacity: 0 },
], { duration: 1000, easing: 'ease-in', fill: 'forwards' });
// Returns Animation object: .play(), .pause(), .reverse(), .cancel(), .finished (Promise)
```

### 3.20 File APIs

```javascript
// FileReader
const reader = new FileReader();
reader.onload = e => { e.target.result; }; // data URL
reader.readAsDataURL(file);    // base64
reader.readAsText(file);       // string
reader.readAsArrayBuffer(file); // ArrayBuffer

// File (extends Blob)
input.files[0]; // { name, size, type, lastModified }

// Blob
const blob = new Blob([data], { type: 'text/plain' });
const url = URL.createObjectURL(blob);
URL.revokeObjectURL(url);

// Stream
const stream = blob.stream();
const reader = stream.getReader();
while (true) { const { done, value } = await reader.read(); if (done) break; }

// File System Access API
const handle = await window.showOpenFilePicker();
const file = await handle.getFile();
const writable = await handle.createWritable();
await writable.write('content');
await writable.close();
```

### 3.21 Clipboard API

```javascript
// Write
await navigator.clipboard.writeText('text');
await navigator.clipboard.write([new ClipboardItem({ 'text/plain': blob })]);

// Read
const text = await navigator.clipboard.readText();
const items = await navigator.clipboard.read();
// Requires user gesture + secure context (HTTPS)
```

### 3.22 Geolocation

```javascript
navigator.geolocation.getCurrentPosition(pos => {
  pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy;
}, err => { err.code; err.message; }, { enableHighAccuracy: true, timeout: 5000 });
const watch = navigator.geolocation.watchPosition(cb);
navigator.geolocation.clearWatch(watch);
```

### 3.23 Notifications

```javascript
Notification.requestPermission().then(perm => {
  if (perm === 'granted') {
    new Notification('Title', { body: 'Message', icon: '/icon.png' });
  }
});
```

### 3.24 Performance API

```javascript
performance.mark('start');
performance.mark('end');
performance.measure('my-op', 'start', 'end');
const entries = performance.getEntriesByType('measure');
performance.getEntriesByType('navigation')[0]; // { domComplete, domInteractive, loadEventEnd, ... }
performance.getEntriesByType('paint'); // first-paint, first-contentful-paint
performance.getEntriesByType('resource'); // all resource timings

// Performance Observer
const po = new PerformanceObserver(list => {
  for (const entry of list.getEntries()) console.log(entry);
});
po.observe({ type: 'largest-contentful-paint', buffered: true });
po.observe({ type: 'layout-shift', buffered: true });
po.observe({ type: 'first-input', buffered: true });
```

### 3.25 Internationalization (Intl)

```javascript
new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'short' }).format(date);
new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(1234.56);
new Intl.ListFormat('en', { style: 'long', type: 'conjunction' }).format(['A', 'B', 'C']);
new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(-5, 'days');
new Intl.Collator('de').compare('a', 'b'); // locale-aware sorting
```

---

## 4. Data Structures in JavaScript

### 4.1 Array (Dynamic)

```javascript
// O(1) get/set by index, O(n) insert/delete (shift/unshift/splice)
// O(n) search (indexOf, includes) unless sorted (O(log n) with binary)
```

### 4.2 Stack (LIFO)

```javascript
class Stack {
  constructor() { this.items = []; }
  push(v) { this.items.push(v); }
  pop() { return this.items.pop(); }
  peek() { return this.items[this.items.length - 1]; }
  isEmpty() { return this.items.length === 0; }
  size() { return this.items.length; }
}
// O(1) push/pop/peek
```

### 4.3 Queue (FIFO)

```javascript
class Queue {
  constructor() { this.items = []; this.head = 0; }
  enqueue(v) { this.items.push(v); }
  dequeue() { return this.isEmpty() ? undefined : this.items[this.head++]; }
  peek() { return this.items[this.head]; }
  isEmpty() { return this.head >= this.items.length; }
  size() { return this.items.length - this.head; }
}
// O(1) enqueue/dequeue (amortized)
```

### 4.4 Linked List

```javascript
class Node { constructor(val) { this.val = val; this.next = null; } }
class LinkedList {
  constructor() { this.head = null; this.tail = null; this.length = 0; }
  push(val) { const n = new Node(val); if (!this.head) { this.head = this.tail = n; } else { this.tail.next = n; this.tail = n; } this.length++; }
  pop() { if (!this.head) return; let cur = this.head; while (cur.next?.next) cur = cur.next; const val = this.tail.val; this.tail = cur; this.tail.next = null; this.length--; return val; }
  get(idx) { if (idx < 0 || idx >= this.length) return; let cur = this.head; for (let i = 0; i < idx; i++) cur = cur.next; return cur; }
  delete(idx) { if (idx === 0) { this.head = this.head.next; this.length--; return; } const prev = this.get(idx - 1); prev.next = prev.next?.next; if (idx === this.length - 1) this.tail = prev; this.length--; }
  reverse() { let prev = null, cur = this.head; while (cur) { const next = cur.next; cur.next = prev; prev = cur; cur = next; } [this.head, this.tail] = [this.tail, this.head]; }
  toArray() { const result = []; let cur = this.head; while (cur) { result.push(cur.val); cur = cur.next; } return result; }
}
// O(n) get/delete, O(1) push/shift (with tail)
```

### 4.5 Doubly Linked List

```javascript
class DNode { constructor(val) { this.val = val; this.prev = null; this.next = null; } }
// Same as LinkedList but each node has .prev for backward traversal
// O(1) operations at both ends, O(n) random access
```

### 4.6 Hash Map

```javascript
// Built-in: Map, Object, WeakMap
// O(1) average get/set/delete (O(n) worst-case on collision)
// Map: preserves insertion order, any key type
// Object: string/symbol keys, inherits from prototype
```

### 4.7 Set

```javascript
// Built-in: Set, WeakSet
// O(1) add/has/delete average
// Unique values, preserves insertion order
```

### 4.8 Binary Search Tree

```javascript
class BSTNode { constructor(val) { this.val = val; this.left = null; this.right = null; } }
class BST {
  constructor() { this.root = null; }
  insert(val) { const n = new BSTNode(val); if (!this.root) { this.root = n; return; } let cur = this.root; while (true) { if (val < cur.val) { if (!cur.left) { cur.left = n; return; } cur = cur.left; } else { if (!cur.right) { cur.right = n; return; } cur = cur.right; } } }
  find(val) { let cur = this.root; while (cur) { if (val === cur.val) return cur; cur = val < cur.val ? cur.left : cur.right; } return null; }
  bfs() { const q = [this.root], result = []; while (q.length) { const n = q.shift(); result.push(n.val); if (n.left) q.push(n.left); if (n.right) q.push(n.right); } return result; }
  dfsInorder() { const r = []; this._inorder(this.root, r); return r; }
  _inorder(n, r) { if (!n) return; this._inorder(n.left, r); r.push(n.val); this._inorder(n.right, r); }
  dfsPreorder() { const r = []; this._preorder(this.root, r); return r; }
  _preorder(n, r) { if (!n) return; r.push(n.val); this._preorder(n.left, r); this._preorder(n.right, r); }
  dfsPostorder() { const r = []; this._postorder(this.root, r); return r; }
  _postorder(n, r) { if (!n) return; this._postorder(n.left, r); this._postorder(n.right, r); r.push(n.val); }
}
// O(log n) average insert/find, O(n) worst (unbalanced)
```

### 4.9 Heap (Priority Queue)

```javascript
class MinHeap {
  constructor() { this.heap = []; }
  parent(i) { return Math.floor((i - 1) / 2); }
  left(i) { return 2 * i + 1; }
  right(i) { return 2 * i + 2; }
  push(v) { this.heap.push(v); this._siftUp(this.heap.length - 1); }
  pop() { if (this.heap.length === 1) return this.heap.pop(); const top = this.heap[0]; this.heap[0] = this.heap.pop(); this._siftDown(0); return top; }
  peek() { return this.heap[0]; }
  size() { return this.heap.length; }
  _siftUp(i) { while (i > 0 && this.heap[i] < this.heap[this.parent(i)]) { [this.heap[i], this.heap[this.parent(i)]] = [this.heap[this.parent(i)], this.heap[i]]; i = this.parent(i); } }
  _siftDown(i) { const l = this.left(i), r = this.right(i); let smallest = i; if (l < this.heap.length && this.heap[l] < this.heap[smallest]) smallest = l; if (r < this.heap.length && this.heap[r] < this.heap[smallest]) smallest = r; if (smallest !== i) { [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]]; this._siftDown(smallest); } }
}
// O(log n) push/pop, O(1) peek
```

### 4.10 Graph

```javascript
class Graph {
  constructor() { this.adjList = new Map(); }
  addVertex(v) { if (!this.adjList.has(v)) this.adjList.set(v, []); }
  addEdge(v1, v2, directed = false) { this.adjList.get(v1).push(v2); if (!directed) this.adjList.get(v2).push(v1); }
  bfs(start) { const visited = new Set([start]), queue = [start], result = []; while (queue.length) { const v = queue.shift(); result.push(v); for (const n of this.adjList.get(v) || []) { if (!visited.has(n)) { visited.add(n); queue.push(n); } } } return result; }
  dfs(start) { const visited = new Set(), result = []; this._dfs(start, visited, result); return result; }
  _dfs(v, visited, result) { if (visited.has(v)) return; visited.add(v); result.push(v); for (const n of this.adjList.get(v) || []) this._dfs(n, visited, result); }
  hasCycle() { const visiting = new Set(), visited = new Set(); for (const v of this.adjList.keys()) { if (this._detectCycle(v, visiting, visited)) return true; } return false; }
  _detectCycle(v, visiting, visited) { if (visited.has(v)) return false; if (visiting.has(v)) return true; visiting.add(v); for (const n of this.adjList.get(v) || []) if (this._detectCycle(n, visiting, visited)) return true; visiting.delete(v); visited.add(v); return false; }
  topologicalSort() { const visited = new Set(), stack = []; const dfs = (v) => { if (visited.has(v)) return; visited.add(v); for (const n of this.adjList.get(v) || []) dfs(n); stack.push(v); }; for (const v of this.adjList.keys()) dfs(v); return stack.reverse(); }
}
```

### 4.11 Trie (Prefix Tree)

```javascript
class TrieNode { constructor() { this.children = new Map(); this.isEnd = false; } }
class Trie {
  constructor() { this.root = new TrieNode(); }
  insert(word) { let node = this.root; for (const ch of word) { if (!node.children.has(ch)) node.children.set(ch, new TrieNode()); node = node.children.get(ch); } node.isEnd = true; }
  search(word) { const node = this._getNode(word); return node !== null && node.isEnd; }
  startsWith(prefix) { return this._getNode(prefix) !== null; }
  _getNode(str) { let node = this.root; for (const ch of str) { if (!node.children.has(ch)) return null; node = node.children.get(ch); } return node; }
}
// O(L) insert/search/startsWith where L = word length
```

### 4.12 LRU Cache

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map(); // Map preserves insertion order
  }
  get(key) {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val); // move to end (most recent)
    return val;
  }
  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    this.cache.set(key, value);
    if (this.cache.size > this.capacity) {
      const oldest = this.cache.keys().next().value; // first inserted
      this.cache.delete(oldest);
    }
  }
}
// O(1) get/put using Map
```

### 4.13 Bloom Filter (Probabilistic)

```javascript
class BloomFilter {
  constructor(size, numHashes) {
    this.size = size;
    this.numHashes = numHashes;
    this.bits = new Uint8Array(Math.ceil(size / 8));
  }
  _hash(item, seed) {
    let h = 0;
    for (let i = 0; i < item.length; i++) {
      h = (h * seed + item.charCodeAt(i)) & 0x7fffffff;
    }
    return h % this.size;
  }
  add(item) {
    for (let i = 0; i < this.numHashes; i++) {
      const pos = this._hash(item, i + 1);
      this.bits[Math.floor(pos / 8)] |= (1 << (pos % 8));
    }
  }
  has(item) {
    for (let i = 0; i < this.numHashes; i++) {
      const pos = this._hash(item, i + 1);
      if (!(this.bits[Math.floor(pos / 8)] & (1 << (pos % 8)))) return false;
    }
    return true; // may be false positive
  }
}
// O(k) add/has (k = numHashes), no false negatives, can have false positives
```

---

## 5. Algorithms in JavaScript

### 5.1 Sorting

```javascript
// Bubble Sort: O(n^2)
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++)
    for (let j = 0; j < arr.length - 1 - i; j++)
      if (arr[j] > arr[j + 1]) [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
  return arr;
}

// Selection Sort: O(n^2)
function selectionSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    let min = i;
    for (let j = i + 1; j < arr.length; j++) if (arr[j] < arr[min]) min = j;
    if (min !== i) [arr[i], arr[min]] = [arr[min], arr[i]];
  }
  return arr;
}

// Insertion Sort: O(n^2), O(n) nearly sorted
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const val = arr[i]; let j = i - 1;
    while (j >= 0 && arr[j] > val) { arr[j + 1] = arr[j]; j--; }
    arr[j + 1] = val;
  }
  return arr;
}

// Merge Sort: O(n log n), O(n) space
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  const result = []; let i = 0, j = 0;
  while (i < left.length && j < right.length) result.push(left[i] < right[j] ? left[i++] : right[j++]);
  return [...result, ...left.slice(i), ...right.slice(j)];
}

// Quick Sort: O(n log n) avg, O(n^2) worst, O(log n) space (in-place)
function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pivot = partition(arr, low, high);
    quickSort(arr, low, pivot - 1);
    quickSort(arr, pivot + 1, high);
  }
  return arr;
}
function partition(arr, low, high) {
  const pivot = arr[high]; let i = low - 1;
  for (let j = low; j < high; j++)
    if (arr[j] < pivot) { i++; [arr[i], arr[j]] = [arr[j], arr[i]]; }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}

// Counting Sort: O(n + k), for integers
function countingSort(arr) {
  const max = Math.max(...arr), count = new Array(max + 1).fill(0), result = [];
  arr.forEach(v => count[v]++);
  count.forEach((c, v) => { for (let i = 0; i < c; i++) result.push(v); });
  return result;
}

// Radix Sort: O(nk), k = digit count
function radixSort(arr) {
  const max = Math.max(...arr);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const buckets = Array.from({ length: 10 }, () => []);
    arr.forEach(v => buckets[Math.floor(v / exp) % 10].push(v));
    arr = buckets.flat();
  }
  return arr;
}
```

### 5.2 Searching

```javascript
// Linear: O(n)
function linearSearch(arr, target) { for (let i = 0; i < arr.length; i++) if (arr[i] === target) return i; return -1; }

// Binary: O(log n), sorted array
function binarySearch(arr, target) {
  let low = 0, high = arr.length - 1;
  while (low <= high) { const mid = Math.floor((low + high) / 2); if (arr[mid] === target) return mid; if (arr[mid] < target) low = mid + 1; else high = mid - 1; }
  return -1;
}

// Binary Search Recursive
function binarySearchRec(arr, target, low = 0, high = arr.length - 1) {
  if (low > high) return -1;
  const mid = Math.floor((low + high) / 2);
  if (arr[mid] === target) return mid;
  return arr[mid] < target ? binarySearchRec(arr, target, mid + 1, high) : binarySearchRec(arr, target, low, mid - 1);
}

// Lower Bound (first >= target)
function lowerBound(arr, target) { let l = 0, r = arr.length; while (l < r) { const m = Math.floor((l + r) / 2); if (arr[m] < target) l = m + 1; else r = m; } return l; }

// Upper Bound (first > target)
function upperBound(arr, target) { let l = 0, r = arr.length; while (l < r) { const m = Math.floor((l + r) / 2); if (arr[m] <= target) l = m + 1; else r = m; } return l; }
```

### 5.3 Two Pointers

```javascript
// Two Sum (sorted)
function twoSum(arr, target) { let l = 0, r = arr.length - 1; while (l < r) { const sum = arr[l] + arr[r]; if (sum === target) return [l, r]; sum < target ? l++ : r--; } return [-1, -1]; }

// Remove Duplicates (sorted)
function removeDups(arr) { if (!arr.length) return 0; let i = 0; for (let j = 1; j < arr.length; j++) if (arr[j] !== arr[i]) { i++; arr[i] = arr[j]; } return i + 1; }

// Palindrome Check
function isPalindrome(s) { let l = 0, r = s.length - 1; while (l < r) { if (s[l] !== s[r]) return false; l++; r--; } return true; }
```

### 5.4 Sliding Window

```javascript
// Max sum subarray of size k
function maxSumSubarray(arr, k) {
  let max = 0, sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
    if (i >= k - 1) { max = Math.max(max, sum); sum -= arr[i - k + 1]; }
  }
  return max;
}

// Longest substring without repeating
function longestUniqueSubstr(s) {
  const seen = new Map(); let max = 0, start = 0;
  for (let end = 0; end < s.length; end++) {
    if (seen.has(s[end])) start = Math.max(start, seen.get(s[end]) + 1);
    seen.set(s[end], end);
    max = Math.max(max, end - start + 1);
  }
  return max;
}
```

### 5.5 Recursion & Backtracking

```javascript
// Fibonacci (memoized)
const fib = (n, memo = {}) => { if (n <= 1) return n; if (memo[n]) return memo[n]; return memo[n] = fib(n - 1, memo) + fib(n - 2, memo); };

// Permutations
function permute(arr) {
  const result = [];
  function backtrack(start) { if (start === arr.length) { result.push([...arr]); return; } for (let i = start; i < arr.length; i++) { [arr[start], arr[i]] = [arr[i], arr[start]]; backtrack(start + 1); [arr[start], arr[i]] = [arr[i], arr[start]]; } }
  backtrack(0); return result;
}

// Subsets
function subsets(arr) {
  const result = [];
  function backtrack(start, cur) { result.push([...cur]); for (let i = start; i < arr.length; i++) { cur.push(arr[i]); backtrack(i + 1, cur); cur.pop(); } }
  backtrack(0, []); return result;
}

// N-Queens
function solveNQueens(n) {
  const result = []; const cols = new Set(), diag1 = new Set(), diag2 = new Set();
  function backtrack(row, board) {
    if (row === n) { result.push(board.map(r => r.join(''))); return; }
    for (let col = 0; col < n; col++) {
      if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) continue;
      board[row][col] = 'Q'; cols.add(col); diag1.add(row - col); diag2.add(row + col);
      backtrack(row + 1, board);
      board[row][col] = '.'; cols.delete(col); diag1.delete(row - col); diag2.delete(row + col);
    }
  }
  backtrack(0, Array.from({ length: n }, () => Array(n).fill('.')));
  return result;
}
```

### 5.6 Dynamic Programming

```javascript
// Coin Change (minimum coins)
function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity); dp[0] = 0;
  for (const coin of coins) for (let i = coin; i <= amount; i++) dp[i] = Math.min(dp[i], dp[i - coin] + 1);
  return dp[amount] === Infinity ? -1 : dp[amount];
}

// Longest Common Subsequence
function lcs(text1, text2) {
  const m = text1.length, n = text2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) dp[i][j] = text1[i - 1] === text2[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  return dp[m][n];
}

// 0/1 Knapsack
function knapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));
  for (let i = 1; i <= n; i++) for (let w = 1; w <= capacity; w++) dp[i][w] = weights[i - 1] <= w ? Math.max(dp[i - 1][w], dp[i - 1][w - weights[i - 1]] + values[i - 1]) : dp[i - 1][w];
  return dp[n][capacity];
}

// Edit Distance (Levenshtein)
function editDistance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
  return dp[a.length][b.length];
}
```

### 5.7 Greedy Algorithms

```javascript
// Activity Selection
function activitySelection(activities) {
  activities.sort((a, b) => a.end - b.end);
  const result = [activities[0]];
  for (let i = 1; i < activities.length; i++) if (activities[i].start >= result[result.length - 1].end) result.push(activities[i]);
  return result;
}

// Huffman Coding
class HuffmanNode { constructor(char, freq) { this.char = char; this.freq = freq; this.left = null; this.right = null; } }
function huffmanEncode(text) {
  const freq = {}; for (const ch of text) freq[ch] = (freq[ch] || 0) + 1;
  const heap = new MinHeap(); for (const [char, f] of Object.entries(freq)) heap.push(new HuffmanNode(char, f));
  while (heap.size() > 1) { const a = heap.pop(), b = heap.pop(); const n = new HuffmanNode(null, a.freq + b.freq); n.left = a; n.right = b; heap.push(n); }
  const codes = {}; function encode(node, code) { if (!node) return; if (node.char) codes[node.char] = code; encode(node.left, code + '0'); encode(node.right, code + '1'); }
  encode(heap.peek(), '');
  return text.split('').map(ch => codes[ch]).join('');
}
```

### 5.8 Graph Algorithms

```javascript
// Dijkstra (shortest path)
function dijkstra(graph, start) {
  const dist = {}; const pq = new MinHeap();
  for (const v of Object.keys(graph)) dist[v] = Infinity;
  dist[start] = 0; pq.push([0, start]);
  while (pq.size()) { const [d, v] = pq.pop(); if (d > dist[v]) continue; for (const [neighbor, weight] of Object.entries(graph[v])) { const nd = d + weight; if (nd < dist[neighbor]) { dist[neighbor] = nd; pq.push([nd, neighbor]); } } }
  return dist;
}

// Floyd-Warshall (all pairs shortest path)
function floydWarshall(graph) {
  const n = graph.length; const dist = graph.map(r => [...r]);
  for (let k = 0; k < n; k++) for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (dist[i][k] + dist[k][j] < dist[i][j]) dist[i][j] = dist[i][k] + dist[k][j];
  return dist;
}

// Kruskal (MST)
function kruskal(vertices, edges) {
  const parent = Object.fromEntries(vertices.map(v => [v, v]));
  function find(x) { return parent[x] === x ? x : (parent[x] = find(parent[x])); }
  function union(a, b) { parent[find(a)] = find(b); }
  edges.sort((a, b) => a.weight - b.weight);
  const mst = [];
  for (const { u, v, weight } of edges) { if (find(u) !== find(v)) { union(u, v); mst.push({ u, v, weight }); } }
  return mst;
}

// Topological Sort (Kahn's algorithm)
function topologicalSortKahn(graph) {
  const inDegree = {}; for (const v of Object.keys(graph)) inDegree[v] = 0;
  for (const v of Object.keys(graph)) for (const n of graph[v]) inDegree[n] = (inDegree[n] || 0) + 1;
  const queue = Object.keys(inDegree).filter(v => inDegree[v] === 0);
  const result = [];
  while (queue.length) { const v = queue.shift(); result.push(v); for (const n of graph[v] || []) { inDegree[n]--; if (inDegree[n] === 0) queue.push(n); } }
  return result;
}
```

---

## 6. JavaScript Under The Hood

### 6.1 Execution Context & Call Stack

```javascript
// Global Execution Context: created when script loads
// Function Execution Context: created on each function invocation
// Eval Execution Context: inside eval()

// Each context has: Variable Environment, Lexical Environment, 'this' binding, Outer Environment reference

// Call Stack: LIFO structure tracking execution position
function a() { b(); }
function b() { c(); }
function c() { throw new Error('stack trace'); }
a();
// Stack: c -> b -> a -> global (unwound on return/error)

// Execution Context Lifecycle:
// 1. Creation Phase: Create Variable Object, Scope Chain, Set 'this'
// 2. Execution Phase: Execute code line by line, assign values
```

### 6.2 Hoisting

```javascript
// var declarations: hoisted and initialized with undefined
console.log(a); // undefined
var a = 5;

// let/const: hoisted but NOT initialized (TDZ - Temporal Dead Zone)
console.log(b); // ReferenceError
let b = 5;

// Function declarations: hoisted completely (can call before definition)
foo(); // works
function foo() {}

// Function expressions: NOT hoisted (depends on declaration keyword)
bar(); // TypeError (if var) or ReferenceError (if let/const)
var bar = function() {};
```

### 6.3 Scope & Closure

```javascript
// Scope types: Global, Module, Function (var), Block (let/const)

// Closure: function + its lexical environment
function outer(x) {
  return function inner(y) {
    return x + y; // 'x' is captured from outer scope
  };
}
const add5 = outer(5);
console.log(add5(3)); // 8 -- 'x' is still accessible even though outer() finished

// Closure use cases:
// 1. Data privacy (module pattern)
// 2. Partial application / currying
// 3. Callbacks with preserved state
// 4. Event handlers with captured data
// 5. Memoization

// Closure memory: every closure retains its entire scope chain
// Can cause memory leaks if large objects are captured but unused
```

### 6.4 The `this` Keyword

```javascript
// 1. Default: global object (window/global), undefined in strict mode
function foo() { console.log(this); } // global (non-strict)

// 2. Implicit: the object before the dot
obj.method(); // 'this' = obj

// 3. Explicit: call, apply, bind
fn.call(obj, a, b); fn.apply(obj, [a, b]); fn.bind(obj)(a, b);

// 4. 'new' binding: 'this' = the new instance
function Foo() { this.val = 42; }
new Foo(); // this = empty object created by new

// 5. Arrow functions: 'this' from enclosing lexical scope (NOT rebound)
const obj = { method: () => { console.log(this); } }; // 'this' is outer scope, not obj!

// 6. Event handlers: 'this' = element, unless arrow function used
element.addEventListener('click', function() { this }); // element
element.addEventListener('click', () => {}); // outer scope

// Priority: new > bind > call/apply > implicit > default
```

### 6.5 Prototype Chain

```javascript
// Every object has [[Prototype]] (__proto__) pointing to its prototype
// Property lookup: own -> prototype -> prototype's prototype -> ... -> Object.prototype -> null

function Animal(name) { this.name = name; }
Animal.prototype.speak = function() { return this.name + ' makes a sound'; };

const dog = new Animal('Rex');
console.log(dog.speak()); // found on Animal.prototype
console.log(dog.toString()); // found on Object.prototype

// Class syntax is syntactic sugar over prototype chain
class Animal {
  constructor(name) { this.name = name; } // own property
  speak() { return this.name + ' makes a sound'; } // -> Animal.prototype
  static create(name) { return new Animal(name); } // -> Animal (static)
}
```

### 6.6 Event Loop Deep Dive

```javascript
// JavaScript is single-threaded (one call stack, one heap)
// Event loop manages asynchronous operations

// Phases (Node.js / libuv):
// 1. timers: setTimeout, setInterval callbacks
// 2. pending callbacks: I/O callbacks deferred to next iteration
// 3. idle, prepare: internal
// 4. poll: retrieve I/O events, execute I/O callbacks
// 5. check: setImmediate callbacks
// 6. close callbacks: socket.on('close'), etc.

// Microtasks (checked after EACH phase):
// - process.nextTick (highest priority, before other microtasks)
// - Promise.then / catch / finally
// - queueMicrotask
// - MutationObserver (browser)

// Execution order:
// sync code -> process.nextTick -> Promise.then -> queueMicrotask -> (repeat for each event loop phase)

// Starvation warning:
// Recursive process.nextTick or queueMicrotask can starve I/O
// Node.js warns at 1000 nextTicks without I/O
```

### 6.7 Memory Model

```javascript
// Stack: Primitive values, function call frames, local variables
// Heap: Objects, arrays, closures (allocated dynamically)

// Primitive types (stored on stack, passed by value):
// string, number, boolean, null, undefined, symbol, bigint

// Reference types (stored on heap, accessed by reference):
// object, array, function, Map, Set, Date, RegExp

// Shallow copy: copies references for nested objects
const copy = { ...original };

// Deep copy: recursively copies all values
const deep = structuredClone(original); // handles Date, Map, Set, circular refs

// Garbage Collection:
// - Young Generation (Scavenge): fast copy, frequent
// - Old Generation (Mark-Sweep-Compact): slower, less frequent
// - Orinoco: concurrent/incremental GC (reduces pauses to ~1-3ms)
```

### 6.8 Error Handling

```javascript
// try/catch/finally
try {
  riskyOperation();
} catch (error) {
  if (error instanceof TypeError) handleTypeError(error);
  else if (error instanceof RangeError) handleRangeError(error);
  else throw error; // rethrow if not handled
} finally {
  cleanup(); // always runs
}

// Custom errors
class AppError extends Error {
  constructor(message, code, status = 500) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
  }
}

// Async error handling
async function safeFetch(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new AppError(`HTTP ${res.status}`, 'HTTP_ERROR', res.status);
    return res.json();
  } catch (e) {
    if (e instanceof TypeError) throw new AppError('Network error', 'NETWORK_ERROR');
    throw e;
  }
}

// Global handlers
window.onerror = (msg, url, line, col, error) => {};
window.onunhandledrejection = (event) => {};
process.on('uncaughtException', (err) => {}); // Node.js
```

### 6.9 Strict Mode

```javascript
'use strict';
// Prevents: accidental globals, assigning to non-writable properties, duplicate params, octal, with, this coercion
// Enables: silent errors throw, this is undefined in functions, better optimizations

function sloppy() { return this; } // global
function strict() { 'use strict'; return this; } // undefined
```

### 6.10 JSON

```javascript
JSON.parse(str, (key, value) => { /* reviver */ });
JSON.stringify(obj, (key, value) => { /* replacer */ }, 2); // 2 = spaces
JSON.stringify(obj, ['key1', 'key2']); // only specified keys

// Unsupported: undefined, functions, symbols, BigInt, circular references, Map, Set, Date (becomes string)
// For BigInt: JSON.stringify({ big: 1n }) throws TypeError
// Fix: BigInt.prototype.toJSON = function() { return this.toString(); }
```

---

## 7. Quick Reference / Cheatsheet

### 7.1 Type Conversion

```javascript
String(val), Number(val), Boolean(val), BigInt(val), Symbol(val)
parseInt(str, 10), parseFloat(str)
+str // to number
!!val // to boolean
val.toString(radix) // number to string with base
```

### 7.2 Truthy & Falsy

```javascript
// Falsy: false, 0, -0, 0n, '', null, undefined, NaN
// Truthy: everything else (including '0', 'false', [], {}, Infinity)
```

### 7.3 Equality

```javascript
==  // loose (coerces types)
=== // strict (no coercion)
Object.is(a, b) // same as === but: Object.is(NaN, NaN) === true, Object.is(-0, +0) === false
```

### 7.4 Common Regex

```javascript
/^[\w.-]+@[\w.-]+\.\w{2,}$/   // email
/^\+?\d{10,15}$/              // phone
/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/ // password (1 upper, 1 lower, 1 digit, 8+ chars)
/^https?:\/\/.+$/              // URL
/^\d{4}-\d{2}-\d{2}$/         // date
/^#([0-9a-f]{3}|[0-9a-f]{6})$/i // hex color
```

### 7.5 Utility Functions

```javascript
// Debounce (rate-limit execution)
function debounce(fn, ms) { let timer; return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); }; }

// Throttle (execute at most once per interval)
function throttle(fn, ms) { let last = 0; return (...args) => { const now = Date.now(); if (now - last >= ms) { last = now; fn(...args); } }; }

// Memoize (cache function results)
function memoize(fn) { const cache = new Map(); return (arg) => { if (cache.has(arg)) return cache.get(arg); const result = fn(arg); cache.set(arg, result); return result; }; }

// Sleep
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Once (execute only once)
function once(fn) { let called = false; return (...args) => { if (called) return; called = true; return fn(...args); }; }

// Pipe (left-to-right composition)
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

// Compose (right-to-left)
const compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x);

// Curry
const curry = (fn) => function curried(...args) { return args.length >= fn.length ? fn(...args) : (...next) => curried(...args, ...next); };

// Range
const range = (start, end, step = 1) => Array.from({ length: Math.floor((end - start) / step) + 1 }, (_, i) => start + i * step);

// Shuffle
const shuffle = (arr) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// Group By
const groupBy = (arr, fn) => arr.reduce((acc, item) => { const key = fn(item); (acc[key] ||= []).push(item); return acc; }, {});

// Deep Clone
const deepClone = (obj, map = new WeakMap()) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (map.has(obj)) return map.get(obj);
  const clone = Array.isArray(obj) ? [] : Object.create(Object.getPrototypeOf(obj));
  map.set(obj, clone);
  for (const key of [...Object.getOwnPropertyNames(obj), ...Object.getOwnPropertySymbols(obj)]) clone[key] = deepClone(obj[key], map);
  return clone;
};
```

### 7.6 Performance Tips

```javascript
// 1. Use requestAnimationFrame for visual updates
// 2. Batch DOM reads before writes (avoid layout thrash)
// 3. Use DocumentFragment for batch inserts
// 4. Virtual scrolling for large lists
// 5. Debounce search/scroll handlers
// 6. Memoize expensive function calls
// 7. Use Web Workers for CPU-heavy tasks
// 8. Lazy load images, components, and routes
// 9. Avoid: try/catch in hot paths, delete on objects, for...in for arrays
// 10. Use CSS containment (contain: layout style paint) for isolated components
```

### 7.7 Console API

```javascript
console.log, console.info, console.warn, console.error
console.debug, console.trace(), console.dir(obj), console.dirxml(el)
console.group('label'), console.groupEnd(), console.groupCollapsed
console.time('label'), console.timeEnd('label'), console.timeLog('label')
console.count('label'), console.countReset('label')
console.table(array, ['columns']) // pretty table view
console.assert(condition, 'msg')  // conditional error
console.clear()
```

### 7.8 Module Systems

```javascript
// ESM (static, tree-shakable)
export const fn = () => {};
export default class {}
import fn, { named } from './module.js';
import * as Module from './module.js';
import('./dynamic.js').then(m => m.default());

// CommonJS (dynamic, runtime)
module.exports = { fn };
exports.named = fn;
const mod = require('./module');

// Mixing: ESM can import CJS (default export), CJS must use dynamic import() for ESM
```

### 7.9 Node.js Core APIs Quick Reference

```javascript
// File System
const fs = require('fs/promises');
await fs.readFile('path', 'utf-8');
await fs.writeFile('path', 'content');
await fs.readdir('dir');
await fs.mkdir('dir', { recursive: true });

// Path
path.join('a', 'b', 'c');  // platform-independent
path.resolve('a', '..', 'b');
path.basename('/a/b/c.js'); // 'c.js'
path.extname('file.js');    // '.js'

// Process
process.env.NODE_ENV, process.argv, process.cwd(), process.pid
process.exit(code), process.nextTick(fn)
process.memoryUsage(), process.uptime(), process.hrtime()

// Crypto
crypto.randomUUID(), crypto.randomBytes(32)
crypto.createHash('sha256').update(data).digest('hex')

// Events
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const emitter = new MyEmitter();
emitter.on('event', handler);
emitter.emit('event', data);
```

### 7.10 NPM Scripts Cheatsheet

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "lint": "eslint . --ext .js,.ts",
    "format": "prettier --write .",
    "typecheck": "tsc --noEmit",
    "clean": "rm -rf dist node_modules",
    "prepare": "husky"
  }
}
// npm run dev, npm run build (not npm dev, npm build)
// Pre/Post hooks: prebuild runs before build, postbuild runs after
```

---

*Last updated: May 2026 | Quick reference covering ES6+, design patterns, DOM APIs, data structures, algorithms, runtime internals, and daily patterns.*
