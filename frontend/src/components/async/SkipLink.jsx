import React from 'react';
import './skipLink.css';

/**
 * SkipLink – visible only when focused, allows keyboard users to jump straight to main content.
 */
export default function SkipLink() {
  return (
    <a href="#main-content" className="skip-link">
      Skip to main content
    </a>
  );
}
