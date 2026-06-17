import { NextResponse } from 'next/server';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { cognitoConfig, isCognitoConfigured } from '../../../../../lib/cognito';
import { cognitoPayloadToSessionUser, setCognitoSessionCookies } from '../../../../../services/cognito-session';

async function proxyCognitoLogin(email: string, password: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
  if (!apiUrl) {
    return null;
  }

  const upstream = await fetch(`${apiUrl}/auth/cognito/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = (await upstream.json()) as {
    error?: string;
    user?: ReturnType<typeof cognitoPayloadToSessionUser>;
    idToken?: string;
    refreshToken?: string;
  };

  if (!upstream.ok) {
    return NextResponse.json({ error: data.error ?? 'Sign in failed.' }, { status: upstream.status });
  }

  if (!data.user || !data.idToken || !data.refreshToken) {
    return NextResponse.json({ error: 'Invalid Cognito session.' }, { status: 502 });
  }

  const response = NextResponse.json({ user: data.user });
  setCognitoSessionCookies(response, { idToken: data.idToken, refreshToken: data.refreshToken });
  return response;
}

export async function POST(request: Request) {
  if (!isCognitoConfigured()) {
    return NextResponse.json({ error: 'Cognito is not configured.' }, { status: 503 });
  }

  const body = (await request.json()) as {
    email?: string;
    password?: string;
    idToken?: string;
    refreshToken?: string;
  };

  if (body.email && body.password) {
    const proxied = await proxyCognitoLogin(body.email, body.password);
    if (proxied) {
      return proxied;
    }
  }

  const { idToken, refreshToken } = body;

  if (!idToken || !refreshToken) {
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
    const response = NextResponse.json({ user });
    setCognitoSessionCookies(response, { idToken, refreshToken });
    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid Cognito session.' }, { status: 401 });
  }
}
