'use client';

import Link from 'next/link';
import { SYSTEM_DASHBOARD_PATH } from '@/lib/post-login-redirect';
import { useSession } from './SessionProvider';

export function NavBar() {
  const { session } = useSession();

  return (
    <header className="site-header py-3 mb-0">
      <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
        <Link href="/" className="navbar-brand mb-0 text-decoration-none">
          ECAP
        </Link>
        <nav className="nav site-nav flex-wrap">
          <Link className="nav-link" href="/">
            Home
          </Link>
          <Link className="nav-link" href="/status">
            Status
          </Link>
          {session ? (
            <Link className="nav-link" href={SYSTEM_DASHBOARD_PATH}>
              Dashboard
            </Link>
          ) : (
            <Link className="nav-link" href="/authentication/login">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
