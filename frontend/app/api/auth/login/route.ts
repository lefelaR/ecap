import { NextResponse } from 'next/server';
import { isApiConfigured } from '@/services/lambda-api';
import { proxyToLambda } from '@/services/lambda-proxy';
import { establishSession, sessionCookieOptions, SESSION_COOKIE } from '@/services/auth';
import { getAuthorityById } from '@/services/store';

export async function POST(request: Request) {
  if (isApiConfigured()) {
    return proxyToLambda(request, '/auth/login');
  }

  const { authorityId } = (await request.json()) as { authorityId?: string };

  if (!authorityId) {
    return NextResponse.json({ error: 'Authority ID is required.' }, { status: 400 });
  }

  const authority = await getAuthorityById(authorityId);
  if (!authority) {
    return NextResponse.json({ error: 'Invalid account.' }, { status: 401 });
  }

  const sessionId = await establishSession({
    authorityId: authority.id,
    name: authority.name,
    type: authority.type,
    ward: authority.ward,
    municipality: authority.municipality,
    canViewAnonymousCrime: authority.canViewAnonymousCrime,
    authSource: 'authority',
  });

  const response = NextResponse.json({
    authorityId: authority.id,
    name: authority.name,
    type: authority.type,
    ward: authority.ward,
    municipality: authority.municipality,
  });

  response.cookies.set(SESSION_COOKIE, sessionId, sessionCookieOptions);
  return response;
}
