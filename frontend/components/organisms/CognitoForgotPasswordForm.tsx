'use client';

import { useRouter } from 'next/navigation';
import { isCognitoConfigured } from '@/lib/cognito';
import {
  AUTH_FORM_CLASS,
  fieldClassName,
  forgotPasswordInitialValues,
  getFieldError,
  useAuthForm,
  validateForgotPasswordForm,
} from '@/lib/formik';
import { fromError, info } from '@/lib/toaster';
import { cognitoForgotPassword } from '@/services/cognito';
import { BackHomeLink } from '../atoms/BackHomeLink';
import { FormField } from '../atoms/FormField';
import { AuthFormLinks } from '../molecules/AuthFormLinks';

export function CognitoForgotPasswordForm() {
  const router = useRouter();

  const form = useAuthForm({
    initialValues: forgotPasswordInitialValues,
    validate: validateForgotPasswordForm,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await cognitoForgotPassword(values.email);
        info('If an account exists for that email, a reset code has been sent.');
        router.push(`/authentication/reset-password?email=${encodeURIComponent(values.email.trim().toLowerCase())}`);
      } catch (err) {
        fromError(err, 'Unable to send reset code.');
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

        <div className="col-12 d-grid">
          <button type="submit" className="btn btn-primary" disabled={form.isSubmitting}>
            {form.isSubmitting ? 'Sending code…' : 'Send reset code'}
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
