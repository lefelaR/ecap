'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import type { Authority, AuthorityType, SessionUser } from '../../lib/types';

export default function AdminPage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionUser | null>(null);
  const [authorities, setAuthorities] = useState<Authority[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (data.user.type !== 'Application Admin') {
          router.push('/login?redirect=/admin');
          return;
        }
        setSession(data.user);
        return fetch('/api/authorities').then((res) => res.json());
      })
      .then((data) => {
        if (Array.isArray(data)) setAuthorities(data);
      })
      .catch(() => router.push('/login?redirect=/admin'))
      .finally(() => setLoading(false));
  }, [router]);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const response = await fetch('/api/authorities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.get('name'),
        email: form.get('email'),
        type: form.get('type'),
        ward: form.get('ward'),
        municipality: form.get('municipality'),
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error ?? 'Registration failed.');
      return;
    }

    setAuthorities((prev) => [data, ...prev]);
    setMessage(`Registered ${data.name} as ${data.type}.`);
    event.currentTarget.reset();
  }

  if (loading) {
    return (
      <main className="container py-5">
        <p>Loading admin panel…</p>
      </main>
    );
  }

  if (!session) return null;

  return (
    <main className="container py-5">
      <section className="page-banner">
        <span className="badge rounded-pill bg-success">Application Admin</span>
        <h1 className="display-6 fw-bold mt-3">Admin Control Panel</h1>
        <p className="lead">Register authorities, assign area-limited rights, and preserve data integrity without deletion.</p>
      </section>

      {message && <div className="alert alert-success py-2">{message}</div>}

      <section className="card shadow-sm">
        <div className="card-body">
          <h2 className="h5 mb-4">Register authority</h2>
          <form className="row g-3" onSubmit={handleRegister}>
            <div className="col-md-6">
              <label className="form-label" htmlFor="name">Full name</label>
              <input id="name" name="name" className="form-control" required />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="email">Email</label>
              <input id="email" name="email" type="email" className="form-control" required />
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="authority-type">Authority type</label>
              <select id="authority-type" name="type" className="form-select" defaultValue="Councillor">
                {(['SAPS', 'JMPD', 'Councillor', 'Urban inspector'] as AuthorityType[]).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="authority-area">Assigned ward</label>
              <input id="authority-area" name="ward" className="form-control" placeholder="e.g. Ward 15 or All" defaultValue="Ward 15" />
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="municipality">Municipality</label>
              <input id="municipality" name="municipality" className="form-control" defaultValue="City of Johannesburg" />
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-success">
                Register authority
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mt-4">
        {authorities.map((authority) => (
          <div key={authority.id} className="col">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h3 className="h6">{authority.name}</h3>
                <p className="card-text small mb-1">
                  <strong>{authority.type}</strong> · {authority.ward}
                </p>
                <p className="card-text small text-muted mb-0">{authority.email}</p>
                {authority.canViewAnonymousCrime && (
                  <span className="badge bg-warning text-dark mt-2">Anonymous crime access</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </section>

      <div className="mt-4">
        <Link href="/" className="btn btn-secondary">
          Back to home
        </Link>
      </div>
    </main>
  );
}
