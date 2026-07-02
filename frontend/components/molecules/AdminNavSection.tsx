'use client';

import type { ReactNode } from 'react';

interface AdminNavSectionProps {
  title: string;
  children: ReactNode;
}

export function AdminNavSection({ title, children }: AdminNavSectionProps) {
  return (
    <div className="admin-nav__section">
      <p className="admin-nav__section-title">{title}</p>
      <nav className="admin-nav__section-links" aria-label={title}>
        {children}
      </nav>
    </div>
  );
}
