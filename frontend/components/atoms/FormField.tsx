import type { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({ label, htmlFor, children, className = 'col-12' }: FormFieldProps) {
  return (
    <div className={className}>
      <label className="form-label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
    </div>
  );
}
