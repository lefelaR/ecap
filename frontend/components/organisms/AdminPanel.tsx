'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import type { Authority, SessionUser } from '../../lib/types';
import { HttpService, http } from '../../services/http';
import { AlertMessage } from '../atoms/AlertMessage';
import { BackHomeLink } from '../atoms/BackHomeLink';
import { AuthorityCard } from '../molecules/AuthorityCard';
import { AuthorityRegistrationForm } from '../molecules/AuthorityRegistrationForm';

export function AdminPanel() {
  const router = useRouter();
  const [session, setSession] = useState<SessionUser | null>(null);
  const [authorities, setAuthorities] = useState<Authority[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    http
      .get<{ user: SessionUser }>('/auth/session')
      .then(({ data }) => {
        if (data.user.type !== 'Application Admin') {
          router.push('/login?redirect=/admin');
          return;
        }
        setSession(data.user);
        return http.get<Authority[]>('/authorities').then(({ data: list }) => list);
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

    try {
      const { data } = await http.post<Authority>('/authorities', {
        name: form.get('name'),
        email: form.get('email'),
        type: form.get('type'),
        ward: form.get('ward'),
        municipality: form.get('municipality'),
      });
      setAuthorities((prev) => [data, ...prev]);
      setMessage(`Registered ${data.name} as ${data.type}.`);
      event.currentTarget.reset();
    } catch (err) {
      setMessage(HttpService.getErrorMessage(err, 'Registration failed.'));
    }
  }

  if (loading) return <p>Loading admin panel…</p>;
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
