import { Environment } from '../config/environment';
import { UserSession } from '../domain/entities/UserSession';
import type { SessionUser } from '../domain/types';
import { AuthorityRepository } from '../repositories/AuthorityRepository';
import { UserSessionRepository } from '../repositories/UserSessionRepository';

export class AuthService {
  constructor(
    private readonly authorityRepository: AuthorityRepository,
    private readonly sessionRepository: UserSessionRepository,
  ) {}

  async login(authorityId: string): Promise<{ sessionId: string; user: SessionUser }> {
    const authority = await this.authorityRepository.findById(authorityId);
    if (!authority) {
      throw new Error('INVALID_ACCOUNT');
    }

    const session = UserSession.create(authorityId, Environment.sessionTtlHours);
    await this.sessionRepository.save(session);

    return {
      sessionId: session.sessionId,
      user: authority.toSessionUser(),
    };
  }

  async logout(sessionId: string): Promise<void> {
    if (sessionId) {
      await this.sessionRepository.delete(sessionId);
    }
  }

  async resolveSession(sessionId: string | null): Promise<SessionUser | null> {
    if (!sessionId) return null;

    const session = await this.sessionRepository.findById(sessionId);
    if (!session) return null;

    const authority = await this.authorityRepository.findById(session.authorityId);
    return authority?.toSessionUser() ?? null;
  }
}
