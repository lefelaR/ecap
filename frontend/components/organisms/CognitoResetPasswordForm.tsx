'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { isCognitoConfigured } from '@/lib/cognito';
import {
  AUTH_FORM_CLASS,
  fieldClassName,
  getFieldError,
  resetPasswordInitialValues,
  useAuthForm,
  validateResetPasswordForm,
} from '@/lib/formik';
import { fromError, success } from '@/lib/toaster';
import { cognitoResetPassword } from '@/services/cognito';
import { BackHomeLink } from '../atoms/BackHomeLink';
import { FormField } from '../atoms/FormField';
import { AuthFormLinks } from '../molecules/AuthFormLinks';

export function CognitoResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [resetComplete, setResetComplete] = useState(false);

  const form = useAuthForm({
    initialValues: resetPasswordInitialValues(searchParams.get('email') ?? ''),
    enableReinitialize: true,
    validate: validateResetPasswordForm,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await cognitoResetPassword(values.email, values.code, values.password);
        setResetComplete(true);
        success('Password updated. You can now sign in with your new password.');
        setTimeout(() => router.push('/authentication/login'), 1500);
      } catch (err) {
        fromError(err, 'Unable to reset password.');
      } finally {
        setSubmitting(false);
      }
    },
  });

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

        <FormField
          label="New password"
          htmlFor="password"
          error={getFieldError(form.errors, form.touched, 'password')}
        >
          <input
            id="password"
            name="password"
            type="password"
            className={fieldClassName(Boolean(form.touched.password && form.errors.password))}
            autoComplete="new-password"
            value={form.values.password}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          />
        </FormField>

        <FormField
          label="Confirm new password"
          htmlFor="confirmPassword"
          error={getFieldError(form.errors, form.touched, 'confirmPassword')}
        >
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className={fieldClassName(Boolean(form.touched.confirmPassword && form.errors.confirmPassword))}
            autoComplete="new-password"
            value={form.values.confirmPassword}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          />
        </FormField>

        <div className="col-12 d-grid">
          <button type="submit" className="btn btn-primary" disabled={form.isSubmitting}>
            {form.isSubmitting ? 'Updating password…' : 'Reset password'}
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
