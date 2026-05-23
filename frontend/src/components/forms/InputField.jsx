import React from 'react';
import { useCustomForm } from './FormProvider';

/**
 * InputField renders an input tied to react-hook-form via the custom FormProvider.
 * Props:
 * - name: field name (required)
 * - label: visible label text
 * - type: input type (default 'text')
 * - placeholder: optional placeholder text
 * - ...rest: any additional input props
 */
export const InputField = ({ name, label, type = 'text', placeholder, options = [], ...rest }) => {
  const { register, formState: { errors } } = useCustomForm();
  const error = errors[name];

  const renderInput = () => {
    if (type === 'select') {
      return (
        <select
          id={name}
          {...register(name)}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          className={error ? 'input-error' : ''}
          {...rest}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }
    if (type === 'textarea') {
      return (
        <textarea
          id={name}
          {...register(name)}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          className={error ? 'input-error' : ''}
          {...rest}
        />
      );
    }
    return (
      <input
        id={name}
        {...register(name)}
        type={type}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={error ? 'input-error' : ''}
        {...rest}
      />
    );
  };

  return (
    <div className="form-group">
      {label && <label htmlFor={name}>{label}</label>}
      {renderInput()}
      {error && (
        <p id={`${name}-error`} className="error-message" style={{ color: 'red', marginTop: '4px' }}>
          {error.message}
        </p>
      )}
    </div>
  );
};
