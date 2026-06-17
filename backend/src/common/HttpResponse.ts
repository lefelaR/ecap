import type { APIGatewayProxyResultV2 } from 'aws-lambda';
import { COGNITO_ID_TOKEN_COOKIE, COGNITO_REFRESH_TOKEN_COOKIE } from '../config/cognito';
import { Environment } from '../config/environment';

export class HttpResponse {
  static json(statusCode: number, body: unknown, headers: Record<string, string> = {}): APIGatewayProxyResultV2 {
    return {
      statusCode,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body),
    };
  }

  static jsonWithCookies(
    statusCode: number,
    body: unknown,
    cookies: string[],
    headers: Record<string, string> = {},
  ): APIGatewayProxyResultV2 {
    return {
      statusCode,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      cookies,
      body: JSON.stringify(body),
    };
  }

  static ok(body: unknown, headers: Record<string, string> = {}): APIGatewayProxyResultV2 {
    return this.json(200, body, headers);
  }

  static okWithCookies(body: unknown, cookies: string[]): APIGatewayProxyResultV2 {
    return this.jsonWithCookies(200, body, cookies);
  }

  static created(body: unknown, headers: Record<string, string> = {}): APIGatewayProxyResultV2 {
    return this.json(201, body, headers);
  }

  static noContent(): APIGatewayProxyResultV2 {
    return { statusCode: 204 };
  }

  static setSessionCookie(sessionId: string): Record<string, string> {
    const maxAge = Environment.sessionTtlHours * 3600;
    return {
      'Set-Cookie': `${Environment.sessionCookieName}=${sessionId}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax`,
    };
  }

  static clearSessionCookie(): Record<string, string> {
    return {
      'Set-Cookie': `${Environment.sessionCookieName}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`,
    };
  }

  static setCognitoSessionCookies(tokens: { idToken: string; refreshToken: string }): string[] {
    const secure = process.env.STAGE === 'prod' ? '; Secure' : '';
    return [
      `${COGNITO_ID_TOKEN_COOKIE}=${tokens.idToken}; HttpOnly; Path=/; Max-Age=${Environment.sessionTtlHours * 3600}; SameSite=Lax${secure}`,
      `${COGNITO_REFRESH_TOKEN_COOKIE}=${tokens.refreshToken}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax${secure}`,
    ];
  }

  static clearCognitoSessionCookies(): string[] {
    return [
      `${COGNITO_ID_TOKEN_COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`,
      `${COGNITO_REFRESH_TOKEN_COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`,
    ];
  }
}
