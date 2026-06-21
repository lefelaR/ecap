'use client';

import { useRouter } from 'next/navigation';
import { isCognitoConfigured } from '@/lib/cognito';
import {
  AUTH_FORM_CLASS,
  fieldClassName,
  getFieldError,
  loginInitialValues,
  useAuthForm,
  validateLoginForm,
} from '@/lib/formik';
import { getPostLoginRedirect } from '@/lib/post-login-redirect';
import { fromError, success } from '@/lib/toaster';
import { appApi } from '@/services/app-api';
import { BackHomeLink } from '../atoms/BackHomeLink';
import { FormField } from '../atoms/FormField';
import { AuthFormLinks } from '../molecules/AuthFormLinks';
import { useSession } from './SessionProvider';

export function CognitoLoginForm() {
  const router = useRouter();
  const { refreshSession } = useSession();

  const form = useAuthForm({
    initialValues: loginInitialValues,
    validate: validateLoginForm,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await appApi.cognitoSignIn(values.email, values.password);
        await refreshSession();
        success('Signed in successfully.');
        router.push(getPostLoginRedirect());
      } catch (err) {
        fromError(err, 'Sign in failed.');
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
        <FormField
          label="Email"
          htmlFor="email"
          error={getFieldError(form.errors, form.touched, 'email')}
        >
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

        <FormField
          label="Password"
          htmlFor="password"
          error={getFieldError(form.errors, form.touched, 'password')}
        >
          <input
            id="password"
            name="password"
            type="password"
            className={fieldClassName(Boolean(form.touched.password && form.errors.password))}
            autoComplete="current-password"
            value={form.values.password}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          />
        </FormField>

        <div className="col-12 d-grid">
          <button type="submit" className="btn btn-primary" disabled={form.isSubmitting}>
            {form.isSubmitting ? 'Signing in…' : 'Sign in'}
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
