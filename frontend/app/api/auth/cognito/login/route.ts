import { NextResponse } from 'next/server';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { cognitoConfig, isCognitoConfigured } from '@/lib/cognito';
import { establishSession, sessionCookieOptions, SESSION_COOKIE } from '@/services/auth';
import { cognitoPayloadToSessionUser } from '@/services/cognito-session';
import { getApiUrl, isApiConfigured } from '@/services/api-config';
import { forwardUpstreamCookies } from '@/services/lambda-proxy';

export async function POST(request: Request) {
  if (!isCognitoConfigured()) {
    return NextResponse.json({ error: 'Cognito is not configured.' }, { status: 503 });
  }

  if (isApiConfigured()) {
    // On Vercel the filesystem session store is not writable. Rely on Lambda
    // Cognito cookies (forwarded below) and resolveSession via /auth/session.
    try {
      const upstream = await fetch(`${getApiUrl()}/auth/cognito/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(request.headers.get('cookie') ? { cookie: request.headers.get('cookie')! } : {}),
        },
        body: await request.text(),
        cache: 'no-store',
      });

      const data = (await upstream.json()) as {
        error?: string;
        user?: ReturnType<typeof cognitoPayloadToSessionUser>;
      };

      if (!upstream.ok) {
        return NextResponse.json({ error: data.error ?? 'Sign in failed.' }, { status: upstream.status });
      }

      if (!data.user) {
        return NextResponse.json({ error: 'Invalid Cognito session.' }, { status: 502 });
      }

      const response = NextResponse.json({ user: data.user });
      forwardUpstreamCookies(response, upstream);
      return response;
    } catch {
      return NextResponse.json({ error: 'Sign in failed.' }, { status: 500 });
    }
  }

  const body = (await request.json()) as {
    email?: string;
    password?: string;
    idToken?: string;
    refreshToken?: string;
  };

  const { idToken } = body;

  if (!idToken) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }

  try {
    const verifier = CognitoJwtVerifier.create({
      userPoolId: cognitoConfig.userPoolId,
      tokenUse: 'id',
      clientId: cognitoConfig.clientId,
    });

    const payload = await verifier.verify(idToken);
    const user = cognitoPayloadToSessionUser(payload);
    const sessionId = await establishSession(user, idToken);
    const response = NextResponse.json({ user });
    response.cookies.set(SESSION_COOKIE, sessionId, sessionCookieOptions);
    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid Cognito session.' }, { status: 401 });
  }
}
