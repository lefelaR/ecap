'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { isCognitoConfigured } from '../../lib/cognito';
import { fromError, info } from '../../lib/toaster';
import { cognitoForgotPassword } from '../../services/cognito';
import { BackHomeLink } from '../atoms/BackHomeLink';
import { FormField } from '../atoms/FormField';
import { AuthFormLinks } from '../molecules/AuthFormLinks';

export function CognitoForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
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
      await cognitoForgotPassword(email);
      info('If an account exists for that email, a reset code has been sent.');
      router.push(`/authentication/reset-password?email=${encodeURIComponent(email.trim().toLowerCase())}`);
    } catch (err) {
      fromError(err, 'Unable to send reset code.');
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

        <div className="col-12 d-grid">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Sending code…' : 'Send reset code'}
          </button>
        </div>
      </form>

      <AuthFormLinks mode="forgot-password" />

      <div className="text-center mt-3">
        <BackHomeLink />
      </div>
    </>
  );
}
