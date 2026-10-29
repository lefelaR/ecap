'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PROFILE_PATH } from '@/lib/post-login-redirect';
import { LoadingSpinner } from '@/lib/react-spinners';
import { AlertMessage } from '@/components/atoms/AlertMessage';
import { ProfileForm } from '@/components/molecules/ProfileForm';
import { useSession } from '@/components/organisms/SessionProvider';
import { appApi } from '@/services/app-api';

export function ProfilePanel() {
  const router = useRouter();
  const { session, ready, refreshSession } = useSession();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ready) return;

    if (!session) {
      router.push(`/authentication/login?redirect=${encodeURIComponent(PROFILE_PATH)}`);
    }
  }, [ready, router, session]);

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    setMessage('');
    setError('');

    try {
      await appApi.updateProfile(formData);
      await refreshSession();
      setMessage('Profile updated successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  }

  if (!ready || !session) {
    return <LoadingSpinner message="Loading profile…" />;
  }

  return (
    <div className="row g-4">
      <div className="col-12 col-md-6 col-lg-3">
        {error && <AlertMessage message={error} className="mb-3" />}
        {message && <AlertMessage message={message} variant="info" className="mb-3" />}
        <ProfileForm
          key={`${session.name}-${session.imageUrl ?? ''}`}
          session={session}
          saving={saving}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
