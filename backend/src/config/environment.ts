import { getDeploymentRegion } from './serverlessConfig';

export class Environment {
  static get serviceReportsTable(): string {
    return this.require('SERVICE_REPORTS_TABLE');
  }

  static get authoritiesTable(): string {
    return this.require('AUTHORITIES_TABLE');
  }

  static get emailNotificationsTable(): string {
    return this.require('EMAIL_NOTIFICATIONS_TABLE');
  }

  static get userSessionsTable(): string {
    return this.require('USER_SESSIONS_TABLE');
  }

  static get sessionCookieName(): string {
    return process.env.SESSION_COOKIE_NAME ?? 'ecap_session';
  }

  static get sessionTtlHours(): number {
    return Number(process.env.SESSION_TTL_HOURS ?? 8);
  }

  static get awsRegion(): string {
    return process.env.AWS_REGION ?? getDeploymentRegion();
  }

  static get cognitoUserPoolId(): string {
    return this.require('COGNITO_USER_POOL_ID');
  }

  static get cognitoClientId(): string {
    return this.require('COGNITO_CLIENT_ID');
  }

  static isCognitoConfigured(): boolean {
    return Boolean(process.env.COGNITO_USER_POOL_ID && process.env.COGNITO_CLIENT_ID);
  }

  private static require(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
  }
}
