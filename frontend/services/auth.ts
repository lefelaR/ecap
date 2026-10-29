import { cookies } from 'next/headers';
import type { NextResponse } from 'next/server';
import {
  COGNITO_ID_TOKEN_COOKIE,
  COGNITO_REFRESH_TOKEN_COOKIE,
  COGNITO_REFRESH_TTL_SECONDS,
} from '@/lib/cognito-cookies';
import type { SessionUser } from '@/lib/types';
import { SESSION_COOKIE, SESSION_TTL_HOURS } from '@/lib/session-cookie';
import { isApiConfigured } from '@/services/api-config';
import { getAuthorityById } from './store';
import { createSession, deleteSession, getSessionById, purgeExpiredSessions } from './session-store';

export { SESSION_COOKIE, SESSION_TTL_HOURS } from '@/lib/session-cookie';

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_TTL_HOURS * 60 * 60,
  secure: process.env.NODE_ENV === 'production',
};

/** Set Cognito auth cookies on the browser via the Next.js response (not API Gateway Set-Cookie). */
export function setCognitoSessionCookies(
  response: NextResponse,
  tokens: { idToken: string; refreshToken: string },
): void {
  response.cookies.set(COGNITO_ID_TOKEN_COOKIE, tokens.idToken, sessionCookieOptions);
  response.cookies.set(COGNITO_REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
    ...sessionCookieOptions,
    maxAge: COGNITO_REFRESH_TTL_SECONDS,
  });
}

export async function establishSession(user: SessionUser, cognitoIdToken?: string): Promise<string> {
  await purgeExpiredSessions();
  const record = await createSession(user, SESSION_TTL_HOURS, cognitoIdToken);
  return record.id;
}

export async function destroySession(): Promise<void> {
  const sessionId = cookies().get(SESSION_COOKIE)?.value;
  if (!sessionId) return;

  try {
    await deleteSession(sessionId);
  } catch {
    // Filesystem session store is unavailable on read-only hosts (e.g. Vercel).
  }
}

async function resolveLocalSession(): Promise<SessionUser | null> {
  const sessionId = cookies().get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;

  try {
    const record = await getSessionById(sessionId);
    if (record) return record.user;

    const legacyAuthority = await getAuthorityById(sessionId);
    if (legacyAuthority) {
      return {
        authorityId: legacyAuthority.id,
        name: legacyAuthority.name,
        type: legacyAuthority.type,
        ward: legacyAuthority.ward,
        municipality: legacyAuthority.municipality,
        canViewAnonymousCrime: legacyAuthority.canViewAnonymousCrime,
        imageUrl: legacyAuthority.imageUrl,
        authSource: 'authority',
      };
    }
  } catch {
    // Filesystem session store is unavailable on read-only hosts (e.g. Vercel).
  }

  return null;
}

async function resolveRemoteSession(): Promise<SessionUser | null> {
  const cookieHeader = cookies()
    .getAll()
    .map((entry) => `${entry.name}=${entry.value}`)
    .join('; ');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL!.replace(/\/$/, '');
  const response = await fetch(`${apiUrl}/auth/session`, {
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    cache: 'no-store',
  });

  if (!response.ok) {
    return null;
  }

  const body = (await response.json()) as { authenticated?: boolean; user?: SessionUser };
  return body.authenticated && body.user ? body.user : null;
}

export async function getSession(): Promise<SessionUser | null> {
  const localSession = await resolveLocalSession();
  if (localSession) {
    return localSession;
  }

  if (isApiConfigured()) {
    return resolveRemoteSession();
  }

  return null;
}

export function canAccessReport(
  session: SessionUser,
  report: { type: string; ward: string; anonymous: boolean; contactEmail?: string },
): boolean {
  if (session.type === 'Application Admin') return true;

  if (session.authSource === 'cognito' && session.email && report.contactEmail) {
    return report.contactEmail.toLowerCase() === session.email.toLowerCase();
  }

  if (report.type === 'crime') {
    if (report.anonymous) return session.canViewAnonymousCrime;
    if (session.ward === 'All') return ['SAPS', 'JMPD', 'Councillor', 'Urban inspector'].includes(session.type);
    return session.ward === report.ward;
  }

  if (session.ward === 'All') return true;
  return session.ward === report.ward;
}
