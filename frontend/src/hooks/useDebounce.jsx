import { useState, useEffect } from 'react';

/**
 * useDebounce — delays updating a value until the user stops typing.
 *
 * Concept: Closures
 * The setTimeout callback below is a closure — it "closes over" the `value`
 * and `setDebouncedValue` variables from the enclosing useEffect scope.
 * Even after useEffect returns, the inner callback still holds a reference
 * to those variables and can use them when the timer fires.
 *
 * Concept: Side effects with useEffect
 * Setting a timer is a side effect. We return a cleanup function that
 * cancels the previous timer whenever value/delay changes — this prevents
 * stale closures from updating state with outdated values.
 *
 * @param {*}      value - the value to debounce
 * @param {number} delay - milliseconds to wait before committing the value
 * @returns the debounced value
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // The arrow function below is a closure:
    // it captures `value` and `setDebouncedValue` from this useEffect call.
    // Even after useEffect returns, the closure holds those references.
    const handler = setTimeout(() => {
      setDebouncedValue(value);   // closure over `value`
    }, delay);

    // Cleanup: if value or delay changes before the timer fires,
    // cancel the previous timer (prevents stale closure side effect).
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

