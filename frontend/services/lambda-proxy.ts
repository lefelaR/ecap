import { NextResponse } from 'next/server';
import { getApiUrl } from './lambda-api';

function applyUpstreamCookies(response: NextResponse, upstream: Response): void {
  const setCookies =
    typeof upstream.headers.getSetCookie === 'function'
      ? upstream.headers.getSetCookie()
      : upstream.headers.get('set-cookie')
        ? [upstream.headers.get('set-cookie')!]
        : [];

  for (const cookie of setCookies) {
    response.headers.append('Set-Cookie', cookie);
  }
}

export async function proxyToLambda(request: Request, path: string): Promise<NextResponse> {
  const requestUrl = new URL(request.url);
  const targetUrl = new URL(path, getApiUrl());

  for (const [key, value] of requestUrl.searchParams.entries()) {
    targetUrl.searchParams.set(key, value);
  }

  const headers = new Headers();
  const contentType = request.headers.get('content-type');
  if (contentType) {
    headers.set('content-type', contentType);
  }

  const cookie = request.headers.get('cookie');
  if (cookie) {
    headers.set('cookie', cookie);
  }

  const upstream = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.arrayBuffer(),
    cache: 'no-store',
  });

  const response = new NextResponse(upstream.body, {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('Content-Type') ?? 'application/json',
    },
  });

  applyUpstreamCookies(response, upstream);
  return response;
}
