import {
  AuthFlowType,
  CognitoIdentityProviderClient,
  ConfirmForgotPasswordCommand,
  ConfirmSignUpCommand,
  ForgotPasswordCommand,
  InitiateAuthCommand,
  ResendConfirmationCodeCommand,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { Environment } from '../config/environment';
import type { SessionUser } from '../domain/types';
import { mapCognitoError } from '../utils/mapCognitoError';

export interface CognitoTokens {
  idToken: string;
  accessToken: string;
  refreshToken: string;
}

export class CognitoService {
  private readonly client = new CognitoIdentityProviderClient({ region: Environment.awsRegion });
  private verifier: ReturnType<typeof CognitoJwtVerifier.create> | null = null;

  private getVerifier(): ReturnType<typeof CognitoJwtVerifier.create> {
    if (!this.verifier) {
      this.verifier = CognitoJwtVerifier.create({
        userPoolId: Environment.cognitoUserPoolId,
        tokenUse: 'id',
        clientId: Environment.cognitoClientId,
      });
    }

    return this.verifier;
  }

  async signIn(email: string, password: string): Promise<{ tokens: CognitoTokens; user: SessionUser }> {
    try {
      const response = await this.client.send(
        new InitiateAuthCommand({
          ClientId: Environment.cognitoClientId,
          AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
          AuthParameters: {
            USERNAME: email.trim().toLowerCase(),
            PASSWORD: password,
          },
        }),
      );

      if (response.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
        throw new Error('A new password is required before you can sign in.');
      }

      const result = response.AuthenticationResult;
      if (!result?.IdToken || !result.AccessToken || !result.RefreshToken) {
        throw new Error('Sign in failed.');
      }

      const tokens: CognitoTokens = {
        idToken: result.IdToken,
        accessToken: result.AccessToken,
        refreshToken: result.RefreshToken,
      };

      const user = await this.sessionUserFromIdToken(tokens.idToken);
      return { tokens, user };
    } catch (error) {
      if (error instanceof Error && error.message.includes('new password')) {
        throw error;
      }
      throw new Error(mapCognitoError(error));
    }
  }

  async signUp(email: string, password: string, name: string): Promise<void> {
    const normalizedEmail = email.trim().toLowerCase();

    try {
      await this.client.send(
        new SignUpCommand({
          ClientId: Environment.cognitoClientId,
          Username: normalizedEmail,
          Password: password,
          UserAttributes: [
            { Name: 'email', Value: normalizedEmail },
            { Name: 'name', Value: name.trim() },
          ],
        }),
      );
    } catch (error) {
      throw new Error(mapCognitoError(error));
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await this.client.send(
        new ForgotPasswordCommand({
          ClientId: Environment.cognitoClientId,
          Username: email.trim().toLowerCase(),
        }),
      );
    } catch (error) {
      throw new Error(mapCognitoError(error));
    }
  }

  async resetPassword(email: string, code: string, newPassword: string): Promise<void> {
    try {
      await this.client.send(
        new ConfirmForgotPasswordCommand({
          ClientId: Environment.cognitoClientId,
          Username: email.trim().toLowerCase(),
          ConfirmationCode: code.trim(),
          Password: newPassword,
        }),
      );
    } catch (error) {
      throw new Error(mapCognitoError(error));
    }
  }

  async confirmSignUp(email: string, code: string): Promise<void> {
    try {
      await this.client.send(
        new ConfirmSignUpCommand({
          ClientId: Environment.cognitoClientId,
          Username: email.trim().toLowerCase(),
          ConfirmationCode: code.trim(),
        }),
      );
    } catch (error) {
      throw new Error(mapCognitoError(error));
    }
  }

  async resendConfirmationCode(email: string): Promise<void> {
    try {
      await this.client.send(
        new ResendConfirmationCodeCommand({
          ClientId: Environment.cognitoClientId,
          Username: email.trim().toLowerCase(),
        }),
      );
    } catch (error) {
      throw new Error(mapCognitoError(error));
    }
  }

  async sessionUserFromIdToken(idToken: string): Promise<SessionUser> {
    const payload = await this.getVerifier().verify(idToken);
    return this.payloadToSessionUser(payload as Record<string, unknown>);
  }

  async resolveSession(idToken: string | null): Promise<SessionUser | null> {
    if (!idToken) return null;

    try {
      return await this.sessionUserFromIdToken(idToken);
    } catch {
      return null;
    }
  }

  private payloadToSessionUser(payload: Record<string, unknown>): SessionUser {
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
}
