'use client';

import Link from 'next/link';
import { useSession } from './SessionProvider';

export function NavBar() {
  const { session, logout } = useSession();

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
          <Link className="nav-link" href="/public">
            Report
          </Link>
          <Link className="nav-link" href="/status">
            Status
          </Link>
          <Link className="nav-link" href="/statistics">
            Statistics
          </Link>
          {session ? (
            <>
              {session.authSource !== 'cognito' && (
                <>
                  <Link className="nav-link" href="/admin">
                    Dashboard
                  </Link>
                  {session.type === 'Application Admin' && (
                    <Link className="nav-link" href="/admin/authorities">
                      Authorities
                    </Link>
                  )}
                </>
              )}
              <button type="button" className="nav-link btn btn-link" onClick={() => void logout()}>
                Logout ({session.name.split(' ')[0]})
              </button>
            </>
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
