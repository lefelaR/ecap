import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'ECAP - Electronic Councillor Action Platform',
  description: 'National municipal reporting and admin system for service delivery and crime response.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header py-3 mb-4 border-bottom bg-white shadow-sm">
          <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
            <a href="/" className="navbar-brand fw-bold mb-0 d-flex align-items-center">
              <img src="/logo.png" alt="ECAP logo" className="site-logo me-2" />
              <span className="d-none d-md-inline">ECAP</span>
            </a>
            <nav className="nav nav-pills">
              <a className="nav-link" href="/">
                Home
              </a>
              <a className="nav-link" href="/public">
                Report
              </a>
              <a className="nav-link" href="/authority">
                Authority
              </a>
              <a className="nav-link" href="/admin">
                Admin
              </a>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
