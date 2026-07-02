import { http } from './http';

export interface CognitoTokens {
  idToken: string;
  accessToken: string;
  refreshToken: string;
}

export async function cognitoSignIn(email: string, password: string): Promise<CognitoTokens & { user: import('../lib/types').SessionUser }> {
  const { data } = await http.post<CognitoTokens & { user: import('../lib/types').SessionUser }>(
    '/auth/cognito/login',
    { email, password },
  );
  return data;
}

export async function cognitoSignUp(email: string, password: string, name: string): Promise<void> {
  await http.post('/auth/cognito/register', { email, password, name });
}

export async function cognitoForgotPassword(email: string): Promise<void> {
  await http.post('/auth/cognito/forgot-password', { email });
}

export async function cognitoResetPassword(email: string, code: string, newPassword: string): Promise<void> {
  await http.post('/auth/cognito/reset-password', { email, code, password: newPassword });
}

export async function cognitoConfirmSignUp(email: string, code: string): Promise<void> {
  await http.post('/auth/cognito/confirm', { email, code });
}

export async function cognitoResendConfirmationCode(email: string): Promise<void> {
  await http.post('/auth/cognito/resend-confirmation', { email });
}
