'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { isCognitoConfigured } from '../../lib/cognito';
import { fromError, info, success } from '../../lib/toaster';
import { cognitoConfirmSignUp, cognitoResendConfirmationCode } from '../../services/cognito';
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
  const [confirmed, setConfirmed] = useState(false);

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
      await cognitoConfirmSignUp(email, code);
      setConfirmed(true);
      success('Account confirmed. You can now sign in.');
      setTimeout(() => router.push('/authentication/login'), 1500);
    } catch (err) {
      fromError(err, 'Confirmation failed.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!email.trim()) {
      info('Enter your email address first.');
      return;
    }

    setResending(true);

    try {
      await cognitoResendConfirmationCode(email);
      info('A new verification code has been sent to your email.');
    } catch (err) {
      fromError(err, 'Unable to resend code.');
    } finally {
      setResending(false);
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

        <div className="col-12 d-grid">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Confirming…' : 'Confirm account'}
          </button>
        </div>
      </form>

      {!confirmed && (
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

      {confirmed ? (
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
