'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { isCognitoConfigured } from '../../lib/cognito';
import { cognitoConfirmSignUp, cognitoResendConfirmationCode } from '../../services/cognito';
import { AlertMessage } from '../atoms/AlertMessage';
import { BackHomeLink } from '../atoms/BackHomeLink';
import { FormField } from '../atoms/FormField';
import { AuthFormLinks } from '../molecules/AuthFormLinks';

export function CognitoConfirmForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') ?? '');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await cognitoConfirmSignUp(email, code);
      setSuccess('Account confirmed. You can now sign in.');
      setTimeout(() => router.push('/authentication/login'), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Confirmation failed.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!email.trim()) {
      setError('Enter your email address first.');
      return;
    }

    setError('');
    setSuccess('');
    setResending(true);

    try {
      await cognitoResendConfirmationCode(email);
      setSuccess('A new verification code has been sent to your email.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to resend code.');
    } finally {
      setResending(false);
    }
  }

  return (
    <>
      {error && <AlertMessage message={error} className="mb-3" />}
      {success && <AlertMessage message={success} variant="success" className="mb-3" />}

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

        <div className="col-12 d-grid">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Confirming…' : 'Confirm account'}
          </button>
        </div>
      </form>

      {!success && (
        <div className="text-center mt-3">
          <button
            type="button"
            className="btn btn-link btn-sm"
            onClick={() => void handleResend()}
            disabled={resending}
          >
            {resending ? 'Sending…' : 'Resend verification code'}
          </button>
        </div>
      )}

      {success ? (
        <div className="text-center mt-4">
          <Link href="/authentication/login" className="btn btn-outline-primary">
            Go to sign in
          </Link>
        </div>
      ) : (
        <AuthFormLinks mode="confirm" />
      )}

      <div className="text-center mt-3">
        <BackHomeLink />
      </div>
    </>
  );
}
