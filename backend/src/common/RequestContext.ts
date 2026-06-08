import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { Environment } from '../config/environment';

export class RequestContext {
  constructor(private readonly event: APIGatewayProxyEventV2) {}

  get query(): Record<string, string | undefined> {
    return this.event.queryStringParameters ?? {};
  }

  get pathId(): string | undefined {
    return this.event.pathParameters?.id;
  }

  get sessionId(): string | null {
    const cookieHeader = this.event.headers.cookie ?? this.event.headers.Cookie;
    if (!cookieHeader) return null;

    const cookieName = Environment.sessionCookieName;
    const match = cookieHeader.split(';').find((part) => part.trim().startsWith(`${cookieName}=`));
    if (!match) return null;

    return match.split('=')[1]?.trim() ?? null;
  }

  async parseJsonBody<T>(): Promise<T> {
    if (!this.event.body) {
      throw new Error('Request body is required.');
    }

    const raw = this.event.isBase64Encoded
      ? Buffer.from(this.event.body, 'base64').toString('utf-8')
      : this.event.body;

    return JSON.parse(raw) as T;
  }

  get contentType(): string {
    return this.event.headers['content-type'] ?? this.event.headers['Content-Type'] ?? '';
  }

  get rawBody(): string | null {
    if (!this.event.body) return null;
    return this.event.isBase64Encoded
      ? Buffer.from(this.event.body, 'base64').toString('utf-8')
      : this.event.body;
  }
}
