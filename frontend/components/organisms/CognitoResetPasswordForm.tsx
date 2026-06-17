'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { isCognitoConfigured } from '../../lib/cognito';
import { fromError, info, success } from '../../lib/toaster';
import { cognitoResetPassword } from '../../services/cognito';
import { BackHomeLink } from '../atoms/BackHomeLink';
import { FormField } from '../atoms/FormField';
import { AuthFormLinks } from '../molecules/AuthFormLinks';

export function CognitoResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') ?? '');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);

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

    if (password !== confirmPassword) {
      info('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await cognitoResetPassword(email, code, password);
      setResetComplete(true);
      success('Password updated. You can now sign in with your new password.');
      setTimeout(() => router.push('/authentication/login'), 1500);
    } catch (err) {
      fromError(err, 'Unable to reset password.');
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

        <FormField label="Verification code" htmlFor="code">
          <input
            id="code"
            name="code"
            type="text"
            className="form-control"
            autoComplete="one-time-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </FormField>

        <FormField label="New password" htmlFor="password">
          <input
            id="password"
            name="password"
            type="password"
            className="form-control"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
        </FormField>

        <FormField label="Confirm new password" htmlFor="confirmPassword">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className="form-control"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={8}
            required
          />
        </FormField>

        <div className="col-12 d-grid">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Updating password…' : 'Reset password'}
          </button>
        </div>
      </form>

      {resetComplete ? (
        <div className="text-center mt-4">
          <Link href="/authentication/login" className="btn btn-outline-primary">
            Go to sign in
          </Link>
        </div>
      ) : (
        <AuthFormLinks mode="reset-password" />
      )}

      <div className="text-center mt-3">
        <BackHomeLink />
      </div>
    </>
  );
}
