import type { SessionUser } from '../domain/types';
import { AuthorityRepository } from '../repositories/AuthorityRepository';
import { CognitoService } from './CognitoService';

export class ProfileService {
  constructor(
    private readonly authorityRepository: AuthorityRepository,
    private readonly cognitoService: CognitoService,
  ) {}

  async updateProfile(
    session: SessionUser,
    input: { name: string; imageUrl?: string },
    refreshToken: string | null,
  ): Promise<SessionUser> {
    if (session.authSource === 'cognito') {
      if (!refreshToken) {
        throw new Error('Session expired.');
      }

      const accessToken = await this.cognitoService.getAccessToken(refreshToken);
      await this.cognitoService.updateUserAttributes(accessToken, {
        name: input.name,
        ...(input.imageUrl ? { picture: input.imageUrl } : {}),
      });

      return {
        ...session,
        name: input.name,
        imageUrl: input.imageUrl ?? session.imageUrl,
      };
    }

    const authority = await this.authorityRepository.findById(session.authorityId);
    if (!authority) {
      throw new Error('INVALID_ACCOUNT');
    }

    const updated = authority.withProfile({
      name: input.name,
      ...(input.imageUrl !== undefined ? { imageUrl: input.imageUrl } : {}),
    });
    await this.authorityRepository.save(updated);

    return updated.toSessionUser();
  }
}
