'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { SessionUser } from '../../lib/types';
import { http } from '../../services/http';

export function NavBar() {
  const [session, setSession] = useState<SessionUser | null>(null);

  useEffect(() => {
    http
      .get<{ user: SessionUser }>('/auth/session')
      .then(({ data }) => setSession(data.user ?? null))
      .catch(() => setSession(null));
  }, []);

  async function logout() {
    await http.post('/auth/logout');
    setSession(null);
    window.location.href = '/';
  }

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
              {session.type === 'Application Admin' ? (
                <Link className="nav-link" href="/admin">
                  Admin
                </Link>
              ) : (
                <Link className="nav-link" href="/authority">
                  Authority
                </Link>
              )}
              <button type="button" className="nav-link btn btn-link" onClick={logout}>
                Logout ({session.name.split(' ')[0]})
              </button>
            </>
          ) : (
            <Link className="nav-link" href="/login">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
