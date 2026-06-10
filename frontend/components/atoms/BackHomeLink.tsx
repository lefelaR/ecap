import Link from 'next/link';

interface BackHomeLinkProps {
  className?: string;
  label?: string;
}

export function BackHomeLink({ className = 'btn btn-outline-secondary', label = 'Back to home' }: BackHomeLinkProps) {
  return (
    <Link href="/" className={className}>
      {label}
    </Link>
  );
}
