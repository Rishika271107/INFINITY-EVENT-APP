import React from 'react';
import './asyncStyles.css';

/**
 * LoadingButton – a button that shows a spinner and disables itself while loading.
 * Props:
 *   loading: boolean – when true, shows spinner and disables the button
 *   children: ReactNode – button label
 *   ...rest: other button props (onClick, type, etc.)
 */
export default function LoadingButton({ loading = false, children, ...rest }) {
  return (
    <button
      disabled={loading}
      aria-busy={loading}
      className={`loading-button ${loading ? 'loading' : ''}`}
      {...rest}
    >
      {loading ? (
        <>
          <span className="spinner" aria-hidden="true" />
          <span className="sr-only">Loading</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
