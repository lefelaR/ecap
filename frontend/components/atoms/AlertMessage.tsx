interface AlertMessageProps {
  message: string;
  variant?: 'danger' | 'success' | 'info' | 'secondary';
  className?: string;
}

export function AlertMessage({ message, variant = 'danger', className = '' }: AlertMessageProps) {
  return <div className={`alert alert-${variant} py-2 ${className}`.trim()}>{message}</div>;
}
