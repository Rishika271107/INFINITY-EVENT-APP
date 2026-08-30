/**
 * frontend/src/utils/jsConceptsDemo.js
 *
 * This file demonstrates four core JavaScript concepts that underpin the
 * patterns used throughout this codebase. Each concept is explained with
 * a real example drawn from something this app actually does.
 *
 * Concepts covered:
 *   1. Closures
 *   2. Promises vs Callbacks
 *   3. The Event Loop (microtasks vs macrotasks)
 *   4. Hoisting (var vs let/const)
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. CLOSURES
// ─────────────────────────────────────────────────────────────────────────────
//
// A closure is a function that "remembers" variables from its outer scope even
// after the outer function has finished executing.
//
// Real-world use in this app: useDebounce and useRazorpay rely on closures.
// The inner function returned by loadRazorpayScript "closes over" the resolve
// callback even though the outer Promise constructor has already returned.
//
// Simple example:
//
//   function createToastManager(type) {       ← outer function
//     let count = 0;                           ← variable in outer scope
//     return function show(message) {          ← inner function = closure
//       count++;
//       console.log(`[${type}] #${count}: ${message}`);
//       // 'count' and 'type' are remembered via closure
//     };
//   }
//
//   const showError = createToastManager('error');
//   showError('Payment failed');   // [error] #1: Payment failed
//   showError('Network timeout');  // [error] #2: Network timeout
//
// In useDebounce, the closure is the setTimeout callback that captures 'value'
// and 'setDebouncedValue' from the useEffect scope, which has already "returned"
// by the time the timeout fires.

/**
 * Creates a debounce function using a closure.
 * The inner function closes over `timerRef` so each call can cancel the previous timer.
 *
 * @param {Function} fn  - function to debounce
 * @param {number}   ms  - delay in milliseconds
 * @returns {Function} debounced version of fn
 */
export function createDebounce(fn, ms) {
  // `timerId` lives in the closure — it persists between calls
  let timerId = null;

  // This returned function is a closure: it "remembers" timerId and fn
  return function (...args) {
    clearTimeout(timerId);            // cancel previous pending call
    timerId = setTimeout(() => {      // schedule new call
      fn.apply(this, args);
    }, ms);
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. PROMISES VS CALLBACKS
// ─────────────────────────────────────────────────────────────────────────────
//
// Callbacks are the old way to handle async operations. They lead to deeply
// nested code ("callback hell") and make error handling difficult.
//
// Promises and async/await are the modern standard. This entire app uses them.
//
// ── Callback style (old — avoid this) ────────────────────────────────────────
//
//   function loadScript_Callback(url, onSuccess, onError) {
//     const script = document.createElement('script');
//     script.src = url;
//     script.onload  = () => onSuccess(true);   // called when done
//     script.onerror = () => onError(false);    // called on failure
//     document.body.appendChild(script);
//   }
//
//   // Usage — nested, hard to read:
//   loadScript_Callback(RAZORPAY_URL,
//     (ok) => {
//       createOrder(bookingId,
//         (order) => {
//           openCheckout(order, (result) => { /* ... */ });
//         },
//         (err) => console.error(err)   // separate error path
//       );
//     },
//     (err) => console.error('Script failed')
//   );
//
// ── Promise style (used in useRazorpay.jsx) ───────────────────────────────────
//
//   function loadRazorpayScript() {
//     return new Promise((resolve) => {       ← wraps callback in a Promise
//       const script = document.createElement('script');
//       script.onload  = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   }
//
// ── Async/await style (used everywhere in this app) ───────────────────────────
//
//   async function initiatePayment(bookingId, user, onSuccess) {
//     const loaded = await loadRazorpayScript();   ← reads like synchronous code
//     const order  = await API.post('/payment/create-order', { bookingId });
//     // ...
//   }
//
// Key difference:
//   - Callbacks: inversion of control (you hand control to the library)
//   - Promises:  you stay in control; chain .then()/.catch() or use await
//   - async/await: syntactic sugar over Promises; same behaviour, cleaner code

// ─────────────────────────────────────────────────────────────────────────────
// 3. THE EVENT LOOP
// ─────────────────────────────────────────────────────────────────────────────
//
// JavaScript is single-threaded. The event loop coordinates:
//   ┌─────────────────────────────────────────────────────┐
//   │  Call Stack  →  executes synchronous code           │
//   │  Microtask Queue  →  Promise .then / async/await    │
//   │  Macrotask Queue  →  setTimeout, setInterval, I/O   │
//   └─────────────────────────────────────────────────────┘
//
// Microtasks (Promises) are always processed BEFORE the next macrotask (setTimeout).
//
// Example — execution order:
//
//   console.log('1 — sync');                       // runs immediately
//
//   setTimeout(() => console.log('4 — macro'), 0); // queued as macrotask
//
//   Promise.resolve()
//     .then(() => console.log('3 — micro'));        // queued as microtask
//
//   console.log('2 — sync');                        // runs immediately
//
//   // Output: 1, 2, 3, 4
//
// Why this matters in this app:
//   In useRazorpay, after `await chat.sendMessage(...)` resolves, any .then()
//   handlers queued on that Promise run as microtasks BEFORE the next
//   UI paint or setTimeout callback. This is why `setLoading(false)` takes
//   effect smoothly — it piggybacks on the microtask queue.

// ─────────────────────────────────────────────────────────────────────────────
// 4. HOISTING
// ─────────────────────────────────────────────────────────────────────────────
//
// Hoisting is JavaScript's behaviour of moving declarations to the top of
// their scope before code runs.
//
// var → declaration is hoisted AND initialised to undefined
// let/const → declaration is hoisted but NOT initialised (Temporal Dead Zone)
// function declarations → fully hoisted (callable before they appear in code)
//
// Example:
//
//   console.log(x);          // undefined  ← var is hoisted (no error, but risky)
//   var x = 5;
//
//   console.log(y);          // ReferenceError: Cannot access 'y' before init
//   let y = 5;
//
//   greet();                 // works! function declaration is fully hoisted
//   function greet() { console.log('hello'); }
//
//   greet2();                // TypeError: greet2 is not a function
//   var greet2 = () => {};   // arrow function assigned to var → not hoisted
//
// This app uses `const` and `let` everywhere (never `var`) to avoid the
// confusing implicit-undefined behaviour of var hoisting.
// All components are arrow functions assigned to const — they must be defined
// before they are used (no hoisting magic).
