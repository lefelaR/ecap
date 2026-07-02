import { NextResponse } from 'next/server';
import { destroySession, SESSION_COOKIE, sessionCookieOptions } from '@/services/auth';
import { isApiConfigured } from '@/services/lambda-api';
import { proxyToLambda } from '@/services/lambda-proxy';

export async function POST(request: Request) {
  if (isApiConfigured()) {
    return proxyToLambda(request, '/auth/logout');
  }

  await destroySession();

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, '', { ...sessionCookieOptions, maxAge: 0 });
  return response;
}
