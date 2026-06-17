'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { isCognitoConfigured } from '@/lib/cognito';
import {
  AUTH_FORM_CLASS,
  confirmInitialValues,
  fieldClassName,
  getFieldError,
  useAuthForm,
  validateConfirmForm,
  validateForgotPasswordForm,
} from '@/lib/formik';
import { fromError, info, success } from '@/lib/toaster';
import { cognitoConfirmSignUp, cognitoResendConfirmationCode } from '@/services/cognito';
import { BackHomeLink } from '../atoms/BackHomeLink';
import { FormField } from '../atoms/FormField';
import { AuthFormLinks } from '../molecules/AuthFormLinks';

export function CognitoConfirmForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [confirmed, setConfirmed] = useState(false);
  const [resending, setResending] = useState(false);

  const form = useAuthForm({
    initialValues: confirmInitialValues(searchParams.get('email') ?? ''),
    enableReinitialize: true,
    validate: validateConfirmForm,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await cognitoConfirmSignUp(values.email, values.code);
        setConfirmed(true);
        success('Account confirmed. You can now sign in.');
        setTimeout(() => router.push('/authentication/login'), 1500);
      } catch (err) {
        fromError(err, 'Confirmation failed.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  async function handleResend() {
    if (validateForgotPasswordForm({ email: form.values.email }).email) {
      info('Enter your email address first.');
      return;
    }

    setResending(true);

    try {
      await cognitoResendConfirmationCode(form.values.email);
      info('A new verification code has been sent to your email.');
    } catch (err) {
      fromError(err, 'Unable to resend code.');
    } finally {
      setResending(false);
    }
  }

  if (!isCognitoConfigured()) {
    return (
      <div className="alert alert-warning">
        Cognito is not configured. Set <code>NEXT_PUBLIC_COGNITO_USER_POOL_ID</code> and{' '}
        <code>NEXT_PUBLIC_COGNITO_CLIENT_ID</code> in <code>frontend/.env</code>.
      </div>
    );
  }

  return (
    <>
      <form className={AUTH_FORM_CLASS} onSubmit={form.handleSubmit} noValidate>
        <FormField label="Email" htmlFor="email" error={getFieldError(form.errors, form.touched, 'email')}>
          <input
            id="email"
            name="email"
            type="email"
            className={fieldClassName(Boolean(form.touched.email && form.errors.email))}
            autoComplete="email"
            value={form.values.email}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          />
        </FormField>

        <FormField label="Verification code" htmlFor="code" error={getFieldError(form.errors, form.touched, 'code')}>
          <input
            id="code"
            name="code"
            type="text"
            className={fieldClassName(Boolean(form.touched.code && form.errors.code))}
            autoComplete="one-time-code"
            value={form.values.code}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          />
        </FormField>

        <div className="col-12 d-grid">
          <button type="submit" className="btn btn-primary" disabled={form.isSubmitting}>
            {form.isSubmitting ? 'Confirming…' : 'Confirm account'}
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
