import React from 'react';
import './asyncStyles.css';

/**
 * RetryState – displays an error message with a retry button.
 * Props:
 *   message: string – error description
 *   onRetry: () => void – callback when retry is clicked
 */
export default function RetryState({ message, onRetry }) {
  return (
    <div className="retry-state" role="alert" aria-live="assertive">
      <p className="retry-message">{message}</p>
      <button className="gold-btn" onClick={onRetry}>Try Again</button>
    </div>
  );
}
