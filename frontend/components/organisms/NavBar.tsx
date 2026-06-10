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
    <header className="site-header py-3 mb-4 border-bottom bg-white shadow-sm">
      <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
        <Link href="/" className="navbar-brand fw-bold mb-0 d-flex align-items-center text-decoration-none text-dark">
          <img src="/logo.png" alt="ECAP logo" className="site-logo me-2" />
          <span className="d-none d-md-inline">ECAP</span>
        </Link>
        <nav className="nav nav-pills flex-wrap">
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
