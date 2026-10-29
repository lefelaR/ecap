import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { SessionUser } from '@/lib/types';
import { SESSION_COOKIE } from '@/lib/session-cookie';
import { getApiUrl, isApiConfigured } from '@/services/api-config';
import { getSession } from '@/services/auth';
import { saveProfilePhoto } from '@/services/profile-upload';
import { getSessionById, updateSessionUser } from '@/services/session-store';
import { updateAuthorityProfile } from '@/services/store';

async function syncProfileWithLambda(
  request: Request,
  name: string,
  remoteImageUrl: string | undefined,
): Promise<{ user: SessionUser } | { error: string; status: number }> {
  const cookieHeader = cookies()
    .getAll()
    .map((entry) => `${entry.name}=${entry.value}`)
    .join('; ');

  const upstream = await fetch(`${getApiUrl()}/auth/profile`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    },
    body: JSON.stringify({
      name,
      ...(remoteImageUrl ? { imageUrl: remoteImageUrl } : {}),
    }),
    cache: 'no-store',
  });

  const body = (await upstream.json()) as { user?: SessionUser; error?: string };
  if (!upstream.ok || !body.user) {
    return {
      error: body.error ?? 'Failed to update profile.',
      status: upstream.status,
    };
  }

  return { user: body.user };
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  const sessionId = cookies().get(SESSION_COOKIE)?.value ?? null;

  const formData = await request.formData();
  const name = String(formData.get('name') ?? '').trim();
  if (!name) {
    return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
  }

  let imageUrl = session.imageUrl;
  const photo = formData.get('photo');

  if (photo instanceof File && photo.size > 0) {
    try {
      imageUrl = await saveProfilePhoto(session.authorityId, photo);
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to save profile photo.' },
        { status: 400 },
      );
    }
  }

  const origin = new URL(request.url).origin;
  const remoteImageUrl = imageUrl?.startsWith('/') ? `${origin}${imageUrl}` : imageUrl;
  const localRecord = sessionId ? await getSessionById(sessionId) : null;

  // Cognito login with NEXT_PUBLIC_API_URL stores a local session id that Lambda does not
  // recognise. Only proxy profile updates when the session lives on Lambda (authority login).
  if (isApiConfigured() && !localRecord) {
    const remoteResult = await syncProfileWithLambda(request, name, remoteImageUrl);
    if ('error' in remoteResult) {
      return NextResponse.json({ error: remoteResult.error }, { status: remoteResult.status });
    }

    const syncedUser: SessionUser = {
      ...remoteResult.user,
      imageUrl: imageUrl ?? remoteResult.user.imageUrl,
    };

    return NextResponse.json({ user: syncedUser });
  }

  const updatedUser: SessionUser = {
    ...session,
    name,
    ...(imageUrl ? { imageUrl } : {}),
  };

  if (sessionId && localRecord) {
    await updateSessionUser(sessionId, updatedUser);
  }

  if (session.authSource === 'authority') {
    await updateAuthorityProfile(session.authorityId, { name, imageUrl });
  }

  return NextResponse.json({ user: updatedUser });
}
