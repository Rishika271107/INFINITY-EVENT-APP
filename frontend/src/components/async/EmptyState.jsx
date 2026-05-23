import React from 'react';
import './asyncStyles.css';

/**
 * EmptyState – displays a friendly message when there is no data.
 * Props:
 *   title: string – heading text
 *   description?: string – optional supporting text
 *   ctaLabel?: string – label for optional call‑to‑action button
 *   onCta?: () => void – callback for CTA click
 */
export default function EmptyState({ title, description, ctaLabel, onCta }) {
  return (
    <div className="empty-state" role="status" aria-live="polite">
      <div className="empty-icon" aria-hidden="true" />
      <h2 className="empty-title">{title}</h2>
      {description && <p className="empty-description">{description}</p>}
      {ctaLabel && onCta && (
        <button className="empty-cta" onClick={onCta}>
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
