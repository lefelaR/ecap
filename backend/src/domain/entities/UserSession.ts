import { v4 as uuidv4 } from 'uuid';
import type { UserSessionRecord } from '../types';

export class UserSession {
  private constructor(private readonly record: UserSessionRecord) {}

  static create(authorityId: string, ttlHours: number): UserSession {
    const now = Date.now();
    const expiresAt = Math.floor(now / 1000) + ttlHours * 3600;

    return new UserSession({
      sessionId: uuidv4(),
      authorityId,
      createdAt: new Date(now).toISOString(),
      expiresAt,
    });
  }

  static fromRecord(record: UserSessionRecord): UserSession {
    return new UserSession(record);
  }

  get sessionId(): string {
    return this.record.sessionId;
  }

  get authorityId(): string {
    return this.record.authorityId;
  }

  toJSON(): UserSessionRecord {
    return { ...this.record };
  }

  isExpired(): boolean {
    return this.record.expiresAt < Math.floor(Date.now() / 1000);
  }
}
