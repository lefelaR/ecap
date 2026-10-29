import { ApiRequestError } from '@/lib/api-error';

async function postCognitoApi<T = void>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`/api/auth/cognito${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  const data = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) {
    throw new ApiRequestError(data.error ?? 'Request failed.', response.status);
  }

  return data;
}

export interface CognitoTokens {
  idToken: string;
  accessToken: string;
  refreshToken: string;
}

export async function cognitoSignIn(email: string, password: string): Promise<CognitoTokens & { user: import('../lib/types').SessionUser }> {
  return postCognitoApi<CognitoTokens & { user: import('../lib/types').SessionUser }>('/login', {
    email,
    password,
  });
}

export async function cognitoSignUp(email: string, password: string, name: string): Promise<void> {
  await postCognitoApi('/register', { email, password, name });
}

export async function cognitoForgotPassword(email: string): Promise<void> {
  await postCognitoApi('/forgot-password', { email });
}

export async function cognitoResetPassword(email: string, code: string, newPassword: string): Promise<void> {
  await postCognitoApi('/reset-password', { email, code, password: newPassword });
}

export async function cognitoConfirmSignUp(email: string, code: string): Promise<void> {
  await postCognitoApi('/confirm', { email, code });
}

export async function cognitoResendConfirmationCode(email: string): Promise<void> {
  await postCognitoApi('/resend-confirmation', { email });
}
