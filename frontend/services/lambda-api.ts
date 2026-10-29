import { cookies } from 'next/headers';
import { COGNITO_ID_TOKEN_COOKIE } from '@/lib/cognito-cookies';
import { SESSION_COOKIE } from '@/lib/session-cookie';
import { getSessionById } from '@/services/session-store';
import { getApiUrl } from './api-config';

export { getApiUrl, isApiConfigured } from './api-config';

export async function buildCookieHeader(): Promise<string> {
  const parts = cookies()
    .getAll()
    .map((entry) => `${entry.name}=${entry.value}`);

  const sessionId = cookies().get(SESSION_COOKIE)?.value;
  if (sessionId && !parts.some((part) => part.startsWith(`${SESSION_COOKIE}=`))) {
    parts.push(`${SESSION_COOKIE}=${sessionId}`);
  }

  if (!parts.some((part) => part.startsWith(`${COGNITO_ID_TOKEN_COOKIE}=`))) {
    try {
      const record = sessionId ? await getSessionById(sessionId) : null;
      if (record?.cognitoIdToken) {
        parts.push(`${COGNITO_ID_TOKEN_COOKIE}=${record.cognitoIdToken}`);
      }
    } catch {
      // Filesystem session store is unavailable on read-only hosts (e.g. Vercel).
    }
  }

  return parts.join('; ');
}

export async function lambdaFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const url = `${getApiUrl()}${path.startsWith('/') ? path : `/${path}`}`;
  const headers = new Headers(init.headers);

  if (!headers.has('cookie')) {
    const cookieHeader = await buildCookieHeader();
    if (cookieHeader) {
      headers.set('cookie', cookieHeader);
    }
  }

  return fetch(url, {
    ...init,
    headers,
    cache: 'no-store',
  });
}
