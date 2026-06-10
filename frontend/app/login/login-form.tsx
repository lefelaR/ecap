'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { HttpService, http } from '../../services/http';
import type { AuthorityType } from '../../lib/types';

const DEMO_ACCOUNTS = [
  { id: 'auth-admin', label: 'Application Admin', description: 'Full system access' },
  { id: 'auth-councillor-23', label: 'Councillor – Ward 23', description: 'Ward-limited service reports' },
  { id: 'auth-saps', label: 'SAPS Officer', description: 'Anonymous crime report access' },
  { id: 'auth-jmpd', label: 'JMPD Inspector', description: 'Safety and traffic incidents' },
];

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '/authority';
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function signIn(authorityId: string) {
    setLoading(authorityId);
    setError('');

    try {
      const { data } = await http.post<{ type: AuthorityType }>('/auth/login', { authorityId });
      const destination =
        data.type === 'Application Admin' && redirect === '/authority' ? '/admin' : redirect;
      router.push(destination);
    } catch (err) {
      setError(HttpService.getErrorMessage(err, 'Login failed.'));
    } finally {
      setLoading(null);
    }
  }

  return (
    <>
      {error && (
        <div className="alert alert-danger mx-auto" style={{ maxWidth: 560 }}>
          {error}
        </div>
      )}

      <div className="row g-3 mx-auto" style={{ maxWidth: 640 }}>
        {DEMO_ACCOUNTS.map((account) => (
          <div key={account.id} className="col-12">
            <button
              type="button"
              className="card shadow-sm w-100 text-start"
              onClick={() => signIn(account.id)}
              disabled={loading !== null}
            >
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="h6 mb-1">{account.label}</h2>
                  <p className="text-muted small mb-0">{account.description}</p>
                </div>
                <span className="btn btn-sm btn-primary">{loading === account.id ? 'Signing in…' : 'Sign in'}</span>
              </div>
            </button>
          </div>
        ))}
      </div>

      <div className="text-center mt-4">
        <Link href="/" className="btn btn-outline-secondary">
          Back to home
        </Link>
      </div>
    </>
  );
}
