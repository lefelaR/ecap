import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { cookies } from 'next/headers';
import { cognitoConfig, isCognitoConfigured } from '../lib/cognito';
import type { SessionUser } from '../lib/types';

export const COGNITO_ID_TOKEN_COOKIE = 'cognito_id_token';
export const COGNITO_REFRESH_TOKEN_COOKIE = 'cognito_refresh_token';

let verifier: ReturnType<typeof CognitoJwtVerifier.create> | null = null;

function getVerifier() {
  if (!verifier) {
    if (!isCognitoConfigured()) {
      throw new Error('Cognito is not configured.');
    }

    verifier = CognitoJwtVerifier.create({
      userPoolId: cognitoConfig.userPoolId,
      tokenUse: 'id',
      clientId: cognitoConfig.clientId,
    });
  }

  return verifier;
}

export function cognitoPayloadToSessionUser(payload: Record<string, unknown>): SessionUser {
  const email = typeof payload.email === 'string' ? payload.email : '';
  const name =
    (typeof payload.name === 'string' && payload.name) ||
    (typeof payload.given_name === 'string' && payload.given_name) ||
    email.split('@')[0] ||
    'User';
  const sub = typeof payload.sub === 'string' ? payload.sub : '';

  return {
    authorityId: sub,
    name,
    type: 'Councillor',
    ward: '',
    municipality: '',
    canViewAnonymousCrime: false,
    email,
    authSource: 'cognito',
  };
}

export async function getCognitoSession(): Promise<SessionUser | null> {
  if (!isCognitoConfigured()) return null;

  const idToken = cookies().get(COGNITO_ID_TOKEN_COOKIE)?.value;
  if (!idToken) return null;

  try {
    const payload = await getVerifier().verify(idToken);
    return cognitoPayloadToSessionUser(payload);
  } catch {
    return null;
  }
}

export function clearCognitoSessionCookies(response: { cookies: { delete: (name: string) => void } }) {
  response.cookies.delete(COGNITO_ID_TOKEN_COOKIE);
  response.cookies.delete(COGNITO_REFRESH_TOKEN_COOKIE);
}

export function setCognitoSessionCookies(
  response: {
    cookies: {
      set: (name: string, value: string, options: Record<string, unknown>) => void;
    };
  },
  tokens: { idToken: string; refreshToken: string },
) {
  const cookieOptions = {
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 8,
  };

  response.cookies.set(COGNITO_ID_TOKEN_COOKIE, tokens.idToken, cookieOptions);
  response.cookies.set(COGNITO_REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 30,
  });
}
