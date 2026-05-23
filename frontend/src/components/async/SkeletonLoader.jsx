import React from 'react';
import './asyncStyles.css';

/**
 * SkeletonLoader – generic placeholder component for async data.
 * Props:
 *   type: 'text' | 'card' | 'table' | 'image' (default: 'text')
 *   rows: number of rows for text placeholders (default 3)
 *   width: optional width for custom size (e.g., '200px' or '100%')
 */
export default function SkeletonLoader({ type = 'text', rows = 3, width }) {
  const style = width ? { width } : {};
  switch (type) {
    case 'card':
      return (
        <div className="skeleton-card shimmer" aria-hidden="true" style={style} />
      );
    case 'table':
      return (
        <div className="skeleton-table shimmer" aria-hidden="true" style={style}>
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="skeleton-table-row" />
          ))}
        </div>
      );
    case 'image':
      return (
        <div className="skeleton-image shimmer" aria-hidden="true" style={style} />
      );
    default:
      // text lines
      return (
        <div className="skeleton-text-group" aria-hidden="true" style={style}>
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="skeleton-text-line" />
          ))}
        </div>
      );
  }
}
