import { ApiRequestError } from '../lib/api-error';

async function parseJson<T>(response: Response): Promise<T> {
  const body = (await response.json()) as T & { error?: string };
  if (!response.ok) {
    throw new ApiRequestError(body.error ?? 'Request failed.', response.status);
  }
  return body;
}

export const appApi = {
  async getSession() {
    const response = await fetch('/api/auth/session', { credentials: 'include' });
    if (response.status === 401) {
      return { authenticated: false as const, user: null };
    }
    return parseJson<{ authenticated: boolean; user: import('../lib/types').SessionUser | null }>(response);
  },

  async cognitoSignIn(email: string, password: string) {
    const response = await fetch('/api/auth/cognito/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    return parseJson<{ user: import('../lib/types').SessionUser }>(response);
  },

  async logout() {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    return parseJson<{ ok: boolean }>(response);
  },
};
