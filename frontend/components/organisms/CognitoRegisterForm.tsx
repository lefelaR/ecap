'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { isCognitoConfigured } from '../../lib/cognito';
import { cognitoSignUp } from '../../services/cognito';
import { AlertMessage } from '../atoms/AlertMessage';
import { BackHomeLink } from '../atoms/BackHomeLink';
import { FormField } from '../atoms/FormField';
import { AuthFormLinks } from '../molecules/AuthFormLinks';

export function CognitoRegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
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

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await cognitoSignUp(email, password, name);
      setSuccess('Account created. Check your email for a verification code, then sign in.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {error && <AlertMessage message={error} className="mb-3" />}
      {success && <AlertMessage message={success} variant="success" className="mb-3" />}

      <form className="row g-3" onSubmit={handleSubmit}>
        <FormField label="Full name" htmlFor="name">
          <input
            id="name"
            name="name"
            type="text"
            className="form-control"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </FormField>

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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
        </FormField>

        <FormField label="Confirm password" htmlFor="confirmPassword">
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
            {loading ? 'Creating account…' : 'Register'}
          </button>
        </div>
      </form>

      {success ? (
        <div className="text-center mt-4">
          <Link href="/authentication/login" className="btn btn-outline-primary">
            Go to sign in
          </Link>
        </div>
      ) : (
        <AuthFormLinks mode="register" />
      )}

      <div className="text-center mt-3">
        <BackHomeLink />
      </div>
    </>
  );
}
