import { cookies } from 'next/headers';
import type { SessionUser } from '../lib/types';
import { getCognitoSession } from './cognito-session';
import { getAuthorityById } from './store';

export const SESSION_COOKIE = 'ecap_session';

export async function getSession(): Promise<SessionUser | null> {
  const authorityId = cookies().get(SESSION_COOKIE)?.value;
  if (authorityId) {
    const authority = await getAuthorityById(authorityId);
    if (authority) {
      return {
        authorityId: authority.id,
        name: authority.name,
        type: authority.type,
        ward: authority.ward,
        municipality: authority.municipality,
        canViewAnonymousCrime: authority.canViewAnonymousCrime,
        authSource: 'authority',
      };
    }
  }

  return getCognitoSession();
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
