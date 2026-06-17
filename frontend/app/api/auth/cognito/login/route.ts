import { NextResponse } from 'next/server';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { cognitoConfig, isCognitoConfigured } from '../../../../../lib/cognito';
import { cognitoPayloadToSessionUser, setCognitoSessionCookies } from '../../../../../services/cognito-session';

export async function POST(request: Request) {
  if (!isCognitoConfigured()) {
    return NextResponse.json({ error: 'Cognito is not configured.' }, { status: 503 });
  }

  const { idToken, refreshToken } = (await request.json()) as {
    idToken?: string;
    refreshToken?: string;
  };

  if (!idToken || !refreshToken) {
    return NextResponse.json({ error: 'Missing Cognito tokens.' }, { status: 400 });
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
