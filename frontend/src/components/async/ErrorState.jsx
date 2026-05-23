import React from 'react';
import './asyncStyles.css';

/**
 * ErrorState – displays an error message with optional retry button.
 * Props:
 *   message: string – error description
 *   retryLabel?: string – label for retry button (e.g., "Try Again")
 *   onRetry?: () => void – callback when retry button is clicked
 */
export default function ErrorState({ message, retryLabel, onRetry }) {
  return (
    <div className="error-state" role="alert" aria-live="assertive">
      <div className="error-icon" aria-hidden="true" />
      <h2 className="error-title">Error</h2>
      <p className="error-message">{message}</p>
      {retryLabel && onRetry && (
        <button className="error-retry" onClick={onRetry}>
          {retryLabel}
        </button>
      )}
    </div>
  );
}
