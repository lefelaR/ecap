import { NextResponse } from 'next/server';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { cognitoConfig, isCognitoConfigured } from '@/lib/cognito';
import { establishSession, sessionCookieOptions, SESSION_COOKIE } from '@/services/auth';
import { cognitoPayloadToSessionUser } from '@/services/cognito-session';
import { isApiConfigured } from '@/services/lambda-api';
import { proxyToLambda } from '@/services/lambda-proxy';

export async function POST(request: Request) {
  if (!isCognitoConfigured()) {
    return NextResponse.json({ error: 'Cognito is not configured.' }, { status: 503 });
  }

  if (isApiConfigured()) {
    return proxyToLambda(request, '/auth/cognito/login');
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
    const sessionId = await establishSession(user);
    const response = NextResponse.json({ user });
    response.cookies.set(SESSION_COOKIE, sessionId, sessionCookieOptions);
    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid Cognito session.' }, { status: 401 });
  }
}
