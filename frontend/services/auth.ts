import { cookies } from 'next/headers';
import type { SessionUser } from '@/lib/types';
import { getAuthorityById } from './store';
import { createSession, deleteSession, getSessionById, purgeExpiredSessions } from './session-store';
import { isApiConfigured } from './lambda-api';

export const SESSION_COOKIE = 'ecap_session';
export const SESSION_TTL_HOURS = 8;

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_TTL_HOURS * 60 * 60,
  secure: process.env.NODE_ENV === 'production',
};

export async function establishSession(user: SessionUser): Promise<string> {
  await purgeExpiredSessions();
  const record = await createSession(user, SESSION_TTL_HOURS);
  return record.id;
}

export async function destroySession(): Promise<void> {
  const sessionId = cookies().get(SESSION_COOKIE)?.value;
  if (sessionId) {
    await deleteSession(sessionId);
  }
}

async function resolveLocalSession(): Promise<SessionUser | null> {
  const sessionId = cookies().get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;

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
      authSource: 'authority',
    };
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

export function canAccessReport(session: SessionUser, report: { type: string; ward: string; anonymous: boolean }): boolean {
  if (session.type === 'Application Admin') return true;

  if (report.type === 'crime') {
    if (report.anonymous) return session.canViewAnonymousCrime;
    if (session.ward === 'All') return ['SAPS', 'JMPD', 'Councillor', 'Urban inspector'].includes(session.type);
    return session.ward === report.ward;
  }

  if (session.ward === 'All') return true;
  return session.ward === report.ward;
}
