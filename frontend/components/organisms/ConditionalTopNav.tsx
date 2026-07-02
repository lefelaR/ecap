'use client';

import { usePathname } from 'next/navigation';
import { shouldShowTopNav } from '@/lib/site-nav';
import { NavBar } from '@/components/organisms/NavBar';

export function ConditionalTopNav() {
  const pathname = usePathname();

  if (!shouldShowTopNav(pathname)) {
    return null;
  }

  return <NavBar />;
}
