import { useFormik, type FormikConfig, type FormikErrors, type FormikTouched } from 'formik';

export const AUTH_FORM_CLASS = 'row g-3';

export function useAuthForm<T extends object>(config: FormikConfig<T>) {
  return useFormik<T>({
    validateOnBlur: true,
    validateOnChange: false,
    ...config,
  });
}

export function fieldClassName(hasError: boolean): string {
  return `form-control${hasError ? ' is-invalid' : ''}`;
}

export function getFieldError<T extends object>(
  errors: FormikErrors<T>,
  touched: FormikTouched<T>,
  field: keyof T,
): string | undefined {
  if (!touched[field] || !errors[field]) return undefined;
  return String(errors[field]);
}

export * from './auth-forms';
