import { NextResponse } from 'next/server';
import { getSession } from '../auth';
import type { SessionUser } from '../../lib/types';

export async function requireDashboardSession(): Promise<
  { session: SessionUser } | { error: NextResponse }
> {
  const session = await getSession();
  if (!session) {
    return { error: NextResponse.json({ error: 'Authentication required.' }, { status: 401 }) };
  }
  return { session };
}

export async function getDashboardSession(): Promise<SessionUser | null> {
  return getSession();
}
