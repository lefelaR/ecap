'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { fromError, success } from '@/lib/toaster';
import { getPostLoginRedirect } from '@/lib/post-login-redirect';
import { appApi } from '@/services/app-api';
import { BackHomeLink } from '../atoms/BackHomeLink';
import { DemoAccountButton } from '../molecules/DemoAccountButton';
import { useSession } from './SessionProvider';

const DEMO_ACCOUNTS = [
  { id: 'auth-admin', label: 'Application Admin', description: 'Full system access' },
  { id: 'auth-councillor-23', label: 'Councillor – Ward 23', description: 'Ward-limited service reports' },
  { id: 'auth-saps', label: 'SAPS Officer', description: 'Anonymous crime report access' },
  { id: 'auth-jmpd', label: 'JMPD Inspector', description: 'Safety and traffic incidents' },
];

export function LoginPanel() {
  const router = useRouter();
  const { refreshSession } = useSession();
  const [loading, setLoading] = useState<string | null>(null);

  async function signIn(authorityId: string) {
    setLoading(authorityId);

    try {
      await appApi.authorityLogin(authorityId);
      await refreshSession();
      success('Signed in successfully.');
      router.push(getPostLoginRedirect());
    } catch (err) {
      fromError(err, 'Login failed.');
    } finally {
      setLoading(null);
    }
  }

  return (
    <>
      <div className="row g-3 mx-auto" style={{ maxWidth: 640 }}>
        {DEMO_ACCOUNTS.map((account) => (
          <DemoAccountButton
            key={account.id}
            label={account.label}
            description={account.description}
            loading={loading === account.id}
            onSignIn={() => signIn(account.id)}
          />
        ))}
      </div>

      <div className="text-center mt-4">
        <BackHomeLink />
      </div>
    </>
  );
}
