import { NextResponse } from 'next/server';
import { destroySession, SESSION_COOKIE, sessionCookieOptions } from '@/services/auth';

export async function POST() {
  await destroySession();

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, '', { ...sessionCookieOptions, maxAge: 0 });
  return response;
}
