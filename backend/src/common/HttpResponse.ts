import type { APIGatewayProxyResultV2 } from 'aws-lambda';
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

  static ok(body: unknown, headers: Record<string, string> = {}): APIGatewayProxyResultV2 {
    return this.json(200, body, headers);
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
}
