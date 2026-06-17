'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { isCognitoConfigured } from '../../lib/cognito';
import { fromError, success } from '../../lib/toaster';
import { getPostLoginRedirect } from '../../lib/post-login-redirect';
import { appApi } from '../../services/app-api';
import { BackHomeLink } from '../atoms/BackHomeLink';
import { FormField } from '../atoms/FormField';
import { AuthFormLinks } from '../molecules/AuthFormLinks';

export function CognitoLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isCognitoConfigured()) {
    return (
      <div className="alert alert-warning">
        Cognito is not configured. Set <code>NEXT_PUBLIC_COGNITO_USER_POOL_ID</code> and{' '}
        <code>NEXT_PUBLIC_COGNITO_CLIENT_ID</code> in <code>frontend/.env</code>.
      </div>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const { user } = await appApi.cognitoSignIn(email, password);
      success('Signed in successfully.');
      router.push(getPostLoginRedirect(user.type, searchParams.get('redirect')));
    } catch (err) {
      fromError(err, 'Sign in failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form className="row g-3" onSubmit={handleSubmit}>
        <FormField label="Email" htmlFor="email">
          <input
            id="email"
            name="email"
            type="email"
            className="form-control"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormField>

        <FormField label="Password" htmlFor="password">
          <input
            id="password"
            name="password"
            type="password"
            className="form-control"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormField>

        <div className="col-12 d-grid">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </div>
      </form>

      <AuthFormLinks mode="login" />

      <div className="text-center mt-3">
        <BackHomeLink />
      </div>
    </>
  );
}
