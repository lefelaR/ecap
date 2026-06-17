'use client';

import { useRouter } from 'next/navigation';
import { isCognitoConfigured } from '@/lib/cognito';
import {
  AUTH_FORM_CLASS,
  fieldClassName,
  getFieldError,
  registerInitialValues,
  useAuthForm,
  validateRegisterForm,
} from '@/lib/formik';
import { fromError, success } from '@/lib/toaster';
import { cognitoSignUp } from '@/services/cognito';
import { BackHomeLink } from '../atoms/BackHomeLink';
import { FormField } from '../atoms/FormField';
import { AuthFormLinks } from '../molecules/AuthFormLinks';

export function CognitoRegisterForm() {
  const router = useRouter();

  const form = useAuthForm({
    initialValues: registerInitialValues,
    validate: validateRegisterForm,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await cognitoSignUp(values.email, values.password, values.name);
        success('Account created. Check your email for a verification code.');
        router.push(`/authentication/confirm?email=${encodeURIComponent(values.email.trim().toLowerCase())}`);
      } catch (err) {
        fromError(err, 'Registration failed.');
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
        <FormField label="Full name" htmlFor="name" error={getFieldError(form.errors, form.touched, 'name')}>
          <input
            id="name"
            name="name"
            type="text"
            className={fieldClassName(Boolean(form.touched.name && form.errors.name))}
            autoComplete="name"
            value={form.values.name}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          />
        </FormField>

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
            autoComplete="new-password"
            value={form.values.password}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          />
        </FormField>

        <FormField
          label="Confirm password"
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
            {form.isSubmitting ? 'Creating account…' : 'Register'}
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
