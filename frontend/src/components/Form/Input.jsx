import React from 'react';

export const Input = React.forwardRef(({ type = 'text', className = '', ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={className}
      style={{
        width: '100%',
        padding: '10px 14px',
        backgroundColor: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: '5px',
        color: '#fff',
        outline: 'none',
        transition: 'border-color 0.2s',
        ...props.style
      }}
      onFocus={(e) => {
        e.target.style.borderColor = '#d4af37';
        if (props.onFocus) props.onFocus(e);
      }}
      onBlur={(e) => {
        e.target.style.borderColor = '#333';
        if (props.onBlur) props.onBlur(e);
      }}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export const Select = React.forwardRef(({ children, className = '', ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={className}
      style={{
        width: '100%',
        padding: '10px 14px',
        backgroundColor: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: '5px',
        color: '#fff',
        outline: 'none',
        transition: 'border-color 0.2s',
        appearance: 'none',
        ...props.style
      }}
      onFocus={(e) => {
        e.target.style.borderColor = '#d4af37';
        if (props.onFocus) props.onFocus(e);
      }}
      onBlur={(e) => {
        e.target.style.borderColor = '#333';
        if (props.onBlur) props.onBlur(e);
      }}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = 'Select';

export const TextArea = React.forwardRef(({ className = '', ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={className}
      style={{
        width: '100%',
        padding: '10px 14px',
        backgroundColor: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: '5px',
        color: '#fff',
        outline: 'none',
        transition: 'border-color 0.2s',
        minHeight: '100px',
        ...props.style
      }}
      onFocus={(e) => {
        e.target.style.borderColor = '#d4af37';
        if (props.onFocus) props.onFocus(e);
      }}
      onBlur={(e) => {
        e.target.style.borderColor = '#333';
        if (props.onBlur) props.onBlur(e);
      }}
      {...props}
    />
  );
});

TextArea.displayName = 'TextArea';
