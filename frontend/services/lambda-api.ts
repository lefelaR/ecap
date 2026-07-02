import { cookies } from 'next/headers';

export function getApiUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!url) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured.');
  }
  return url.replace(/\/$/, '');
}

export function isApiConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_API_URL?.trim());
}

export function buildCookieHeader(): string {
  return cookies()
    .getAll()
    .map((entry) => `${entry.name}=${entry.value}`)
    .join('; ');
}

export async function lambdaFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const url = `${getApiUrl()}${path.startsWith('/') ? path : `/${path}`}`;
  const headers = new Headers(init.headers);

  if (!headers.has('cookie')) {
    const cookieHeader = buildCookieHeader();
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
