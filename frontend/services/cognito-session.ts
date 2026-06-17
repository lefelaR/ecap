import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { cognitoConfig, isCognitoConfigured } from '@/lib/cognito';
import type { SessionUser } from '@/lib/types';

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

export async function verifyCognitoIdToken(idToken: string): Promise<SessionUser> {
  const payload = await getVerifier().verify(idToken);
  return cognitoPayloadToSessionUser(payload);
}
