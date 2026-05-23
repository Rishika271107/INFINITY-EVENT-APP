import React from 'react';

export const FormField = ({ label, name, error, required, children, id }) => {
  const fieldId = id || name;
  return (
    <div className="form-group mb-4">
      {label && (
        <label htmlFor={fieldId} className="form-label" style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#d4af37' }}>
          {label} {required && <span style={{ color: '#ef4444' }} aria-hidden="true">*</span>}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              id: fieldId,
              name: name,
              'aria-invalid': !!error ? 'true' : 'false',
              'aria-describedby': error ? `${fieldId}-error` : undefined,
              'aria-required': required ? 'true' : undefined,
            });
          }
          return child;
        })}
      </div>
      {error && (
        <p
          id={`${fieldId}-error`}
          className="error-message"
          role="alert"
          style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '5px', marginBottom: '0' }}
        >
          {error.message}
        </p>
      )}
    </div>
  );
};
