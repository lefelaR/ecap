import Link from 'next/link';
import type { ReactNode } from 'react';

interface ActionCardProps {
  title: string;
  description: string;
  href: string;
  buttonLabel: string;
  buttonClass?: string;
  children?: ReactNode;
}

export function ActionCard({
  title,
  description,
  href,
  buttonLabel,
  buttonClass = 'btn btn-outline-primary',
}: ActionCardProps) {
  return (
    <div className="col">
      <div className="card h-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title h5">{title}</h2>
          <p className="card-text">{description}</p>
          <Link href={href} className={buttonClass}>
            {buttonLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
