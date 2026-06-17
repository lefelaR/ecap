import { NextResponse } from 'next/server';
import { SESSION_COOKIE } from '../../../../services/auth';
import { clearCognitoSessionCookies } from '../../../../services/cognito-session';

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
  clearCognitoSessionCookies(response);
  return response;
}
