import { Environment } from '../config/environment';
import { UserSession } from '../domain/entities/UserSession';
import type { UserSessionRecord } from '../domain/types';
import { BaseRepository } from './BaseRepository';

export class UserSessionRepository extends BaseRepository<UserSessionRecord> {
  private static singleton: UserSessionRepository | null = null;

  constructor() {
    super(Environment.userSessionsTable);
  }

  static getInstance(): UserSessionRepository {
    if (!this.singleton) {
      this.singleton = new UserSessionRepository();
    }
    return this.singleton;
  }

  async save(session: UserSession): Promise<UserSession> {
    await this.put(session.toJSON());
    return session;
  }

  async findById(sessionId: string): Promise<UserSession | null> {
    const record = await this.getByKey({ sessionId });
    if (!record) return null;

    const session = UserSession.fromRecord(record);
    if (session.isExpired()) {
      await this.deleteByKey({ sessionId });
      return null;
    }

    return session;
  }

  async delete(sessionId: string): Promise<void> {
    await this.deleteByKey({ sessionId });
  }
}
