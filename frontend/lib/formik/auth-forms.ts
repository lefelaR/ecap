export interface LoginFormValues {
  email: string;
  password: string;
}

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ConfirmFormValues {
  email: string;
  code: string;
}

export interface ForgotPasswordFormValues {
  email: string;
}

export interface ResetPasswordFormValues {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
}

export const loginInitialValues: LoginFormValues = {
  email: '',
  password: '',
};

export const registerInitialValues: RegisterFormValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export const confirmInitialValues = (email = ''): ConfirmFormValues => ({
  email,
  code: '',
});

export const forgotPasswordInitialValues: ForgotPasswordFormValues = {
  email: '',
};

export const resetPasswordInitialValues = (email = ''): ResetPasswordFormValues => ({
  email,
  code: '',
  password: '',
  confirmPassword: '',
});

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function validateEmailField(value: string): string | undefined {
  if (!value.trim()) return 'Email is required.';
  if (!isValidEmail(value)) return 'Enter a valid email address.';
  return undefined;
}

function validatePasswordField(value: string, label = 'Password'): string | undefined {
  if (!value) return `${label} is required.`;
  if (value.length < 8) return `${label} must be at least 8 characters.`;
  return undefined;
}

export function validateLoginForm(values: LoginFormValues) {
  const errors: Partial<Record<keyof LoginFormValues, string>> = {};
  const emailError = validateEmailField(values.email);
  const passwordError = validatePasswordField(values.password);

  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;

  return errors;
}

export function validateRegisterForm(values: RegisterFormValues) {
  const errors: Partial<Record<keyof RegisterFormValues, string>> = {};

  if (!values.name.trim()) errors.name = 'Full name is required.';

  const emailError = validateEmailField(values.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePasswordField(values.password);
  if (passwordError) errors.password = passwordError;

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
}

export function validateConfirmForm(values: ConfirmFormValues) {
  const errors: Partial<Record<keyof ConfirmFormValues, string>> = {};

  const emailError = validateEmailField(values.email);
  if (emailError) errors.email = emailError;

  if (!values.code.trim()) errors.code = 'Verification code is required.';

  return errors;
}

export function validateForgotPasswordForm(values: ForgotPasswordFormValues) {
  const errors: Partial<Record<keyof ForgotPasswordFormValues, string>> = {};
  const emailError = validateEmailField(values.email);
  if (emailError) errors.email = emailError;
  return errors;
}

export function validateResetPasswordForm(values: ResetPasswordFormValues) {
  const errors: Partial<Record<keyof ResetPasswordFormValues, string>> = {};

  const emailError = validateEmailField(values.email);
  if (emailError) errors.email = emailError;

  if (!values.code.trim()) errors.code = 'Verification code is required.';

  const passwordError = validatePasswordField(values.password, 'New password');
  if (passwordError) errors.password = passwordError;

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm your new password.';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
}
