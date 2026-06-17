'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { isCognitoConfigured } from '../../lib/cognito';
import { fromError, info, success } from '../../lib/toaster';
import { cognitoSignUp } from '../../services/cognito';
import { BackHomeLink } from '../atoms/BackHomeLink';
import { FormField } from '../atoms/FormField';
import { AuthFormLinks } from '../molecules/AuthFormLinks';

export function CognitoRegisterForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

    if (password !== confirmPassword) {
      info('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await cognitoSignUp(email, password, name);
      success('Account created. Check your email for a verification code.');
      router.push(`/authentication/confirm?email=${encodeURIComponent(email.trim().toLowerCase())}`);
    } catch (err) {
      fromError(err, 'Registration failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
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

      <AuthFormLinks mode="register" />

      <div className="text-center mt-3">
        <BackHomeLink />
      </div>
    </>
  );
}
