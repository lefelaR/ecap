'use client';

import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  type CognitoUserSession,
} from 'amazon-cognito-identity-js';
import { cognitoConfig, isCognitoConfigured, mapCognitoError } from '../lib/cognito';

export interface CognitoTokens {
  idToken: string;
  accessToken: string;
  refreshToken: string;
}

function getUserPool(): CognitoUserPool {
  if (!isCognitoConfigured()) {
    throw new Error('Cognito is not configured. Set NEXT_PUBLIC_COGNITO_USER_POOL_ID and NEXT_PUBLIC_COGNITO_CLIENT_ID.');
  }

  return new CognitoUserPool({
    UserPoolId: cognitoConfig.userPoolId,
    ClientId: cognitoConfig.clientId,
  });
}

function getCognitoUser(email: string): CognitoUser {
  return new CognitoUser({
    Username: email.trim().toLowerCase(),
    Pool: getUserPool(),
  });
}

function sessionToTokens(session: CognitoUserSession): CognitoTokens {
  return {
    idToken: session.getIdToken().getJwtToken(),
    accessToken: session.getAccessToken().getJwtToken(),
    refreshToken: session.getRefreshToken().getToken(),
  };
}

function runCognito<T>(operation: (resolve: (value: T) => void, reject: (reason?: unknown) => void) => void): Promise<T> {
  return new Promise((resolve, reject) => {
    operation(resolve, (reason) => reject(reason));
  });
}

export async function cognitoSignIn(email: string, password: string): Promise<CognitoTokens> {
  const user = getCognitoUser(email);
  const authDetails = new AuthenticationDetails({
    Username: email.trim().toLowerCase(),
    Password: password,
  });

  try {
    const session = await runCognito<CognitoUserSession>((resolve, reject) => {
      user.authenticateUser(authDetails, {
        onSuccess: resolve,
        onFailure: reject,
        newPasswordRequired: () => {
          reject(new Error('A new password is required before you can sign in.'));
        },
      });
    });

    return sessionToTokens(session);
  } catch (error) {
    throw new Error(mapCognitoError(error));
  }
}

export async function cognitoSignUp(email: string, password: string, name: string): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();

  try {
    await runCognito<void>((resolve, reject) => {
      getUserPool().signUp(
        normalizedEmail,
        password,
        [
          new CognitoUserAttribute({ Name: 'email', Value: normalizedEmail }),
          new CognitoUserAttribute({ Name: 'name', Value: name.trim() }),
        ],
        [],
        (error) => {
          if (error) reject(error);
          else resolve();
        },
      );
    });
  } catch (error) {
    throw new Error(mapCognitoError(error));
  }
}

export async function cognitoForgotPassword(email: string): Promise<void> {
  const user = getCognitoUser(email);

  try {
    await runCognito<void>((resolve, reject) => {
      user.forgotPassword({
        onSuccess: () => resolve(),
        onFailure: reject,
      });
    });
  } catch (error) {
    throw new Error(mapCognitoError(error));
  }
}

export async function cognitoResetPassword(email: string, code: string, newPassword: string): Promise<void> {
  const user = getCognitoUser(email);

  try {
    await runCognito<void>((resolve, reject) => {
      user.confirmPassword(code.trim(), newPassword, {
        onSuccess: () => resolve(),
        onFailure: reject,
      });
    });
  } catch (error) {
    throw new Error(mapCognitoError(error));
  }
}
