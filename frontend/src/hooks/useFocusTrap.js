import { useEffect, useRef } from 'react';

/**
 * useFocusTrap – traps focus within the given container while it is mounted.
 * Pass a ref to the element that should contain the focus trap.
 */
export default function useFocusTrap(containerRef) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');
    const focusableElements = Array.from(container.querySelectorAll(focusableSelectors));
    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    const handleKey = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKey);
    first?.focus();

    return () => {
      document.removeEventListener('keydown', handleKey);
    };
  }, [containerRef]);
}
