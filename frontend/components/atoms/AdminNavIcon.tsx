interface AdminNavIconProps {
  icon: string;
  className?: string;
}

export function AdminNavIcon({ icon, className = '' }: AdminNavIconProps) {
  return <i className={`fas ${icon} admin-nav__icon ${className}`.trim()} aria-hidden="true" />;
}
