'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import type { Authority } from '@/lib/types';
import { appApi } from '@/services/app-api';
import { AlertMessage } from '../atoms/AlertMessage';
import { BackHomeLink } from '../atoms/BackHomeLink';
import { AuthorityCard } from '../molecules/AuthorityCard';
import { AuthorityRegistrationForm } from '../molecules/AuthorityRegistrationForm';
import { useSession } from './SessionProvider';

export function AdminPanel() {
  const router = useRouter();
  const { session, ready } = useSession();
  const [authorities, setAuthorities] = useState<Authority[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!ready) return;

    if (!session || session.type !== 'Application Admin') {
      router.push('/authentication/login?redirect=/admin/authorities');
      setLoading(false);
      return;
    }

    fetch('/api/authorities', { credentials: 'include' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Failed to load authorities.');
        return response.json() as Promise<Authority[]>;
      })
      .then(setAuthorities)
      .catch(() => router.push('/authentication/login?redirect=/admin/authorities'))
      .finally(() => setLoading(false));
  }, [ready, router, session]);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch('/api/authorities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: form.get('name'),
          email: form.get('email'),
          type: form.get('type'),
          ward: form.get('ward'),
          municipality: form.get('municipality'),
        }),
      });

      const body = (await response.json()) as Authority & { error?: string };
      if (!response.ok) {
        throw new Error(body.error ?? 'Registration failed.');
      }

      setAuthorities((prev) => [body, ...prev]);
      setMessage(`Registered ${body.name} as ${body.type}.`);
      event.currentTarget.reset();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Registration failed.');
    }
  }

  if (!ready || loading) return <p>Loading admin panel…</p>;
  if (!session) return null;

  return (
    <>
      {message && <AlertMessage message={message} variant="success" className="mb-3" />}

      <AuthorityRegistrationForm onSubmit={handleRegister} />

      <section className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mt-4">
        {authorities.map((authority) => (
          <AuthorityCard key={authority.id} authority={authority} />
        ))}
      </section>

      <div className="mt-4">
        <BackHomeLink className="btn btn-secondary" />
      </div>
    </>
  );
}
