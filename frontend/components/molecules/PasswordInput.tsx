'use client';

import { useState, type InputHTMLAttributes } from 'react';

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

export function PasswordInput({ className = '', ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="position-relative">
      <input
        {...props}
        type={visible ? 'text' : 'password'}
        className={`pe-5 ${className}`.trim()}
        style={{ backgroundImage: 'none' }}
      />
      <button
        type="button"
        className="position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent text-secondary px-3"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
      >
        <i className={`fas ${visible ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true" />
      </button>
    </div>
  );
}
