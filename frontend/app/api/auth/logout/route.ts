import { NextResponse } from 'next/server';
import {
  clearCognitoSessionCookies,
  destroySession,
  SESSION_COOKIE,
  sessionCookieOptions,
} from '@/services/auth';
import { isApiConfigured } from '@/services/api-config';
import { proxyToLambda } from '@/services/lambda-proxy';

export async function POST(request: Request) {
  await destroySession();

  if (isApiConfigured()) {
    const response = await proxyToLambda(request, '/auth/logout');
    // Cognito cookies are owned by the Next.js origin (set on login), not API Gateway.
    clearCognitoSessionCookies(response);
    response.cookies.set(SESSION_COOKIE, '', { ...sessionCookieOptions, maxAge: 0 });
    return response;
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, '', { ...sessionCookieOptions, maxAge: 0 });
  clearCognitoSessionCookies(response);
  return response;
}
