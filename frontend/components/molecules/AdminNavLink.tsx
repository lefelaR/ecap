'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isAdminNavItemActive } from '@/lib/admin-nav';
import { AdminNavIcon } from '@/components/atoms/AdminNavIcon';

interface AdminNavLinkProps {
  href: string;
  label: string;
  icon: string;
}

export function AdminNavLink({ href, label, icon }: AdminNavLinkProps) {
  const pathname = usePathname();
  const active = isAdminNavItemActive(pathname, href);

  return (
    <Link
      href={href}
      className={`admin-nav__link${active ? ' admin-nav__link--active' : ''}`}
      aria-current={active ? 'page' : undefined}
    >
      <AdminNavIcon icon={icon} />
      <span>{label}</span>
    </Link>
  );
}
