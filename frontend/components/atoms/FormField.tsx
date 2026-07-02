import type { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
  error?: string;
}

export function FormField({ label, htmlFor, children, className = 'col-12', error }: FormFieldProps) {
  return (
    <div className={className}>
      <label className="form-label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
}
