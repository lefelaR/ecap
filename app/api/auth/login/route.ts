import { NextResponse } from 'next/server';
import { SESSION_COOKIE } from '../../../../lib/auth';
import { getAuthorityById } from '../../../../lib/store';

export async function POST(request: Request) {
  const { authorityId } = (await request.json()) as { authorityId?: string };

  if (!authorityId) {
    return NextResponse.json({ error: 'Authority ID is required.' }, { status: 400 });
  }

  const authority = await getAuthorityById(authorityId);
  if (!authority) {
    return NextResponse.json({ error: 'Invalid account.' }, { status: 401 });
  }

  const response = NextResponse.json({
    authorityId: authority.id,
    name: authority.name,
    type: authority.type,
    ward: authority.ward,
    municipality: authority.municipality,
  });

  response.cookies.set(SESSION_COOKIE, authority.id, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8,
  });

  return response;
}
