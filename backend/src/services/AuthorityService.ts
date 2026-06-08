import { Authority } from '../domain/entities/Authority';
import type { CreateAuthorityInput, SessionUser } from '../domain/types';
import { AuthorityRepository } from '../repositories/AuthorityRepository';

export class AuthorityService {
  constructor(private readonly authorityRepository: AuthorityRepository) {}

  async listAuthorities(session: SessionUser): Promise<Authority[]> {
    if (!session || session.type !== 'Application Admin') {
      throw new Error('FORBIDDEN');
    }

    return this.authorityRepository.findAll();
  }

  async registerAuthority(session: SessionUser, input: CreateAuthorityInput): Promise<Authority> {
    if (!session || session.type !== 'Application Admin') {
      throw new Error('FORBIDDEN');
    }

    if (!input.name || !input.email || !input.type) {
      throw new Error('Name, email, and type are required.');
    }

    const authority = Authority.create(input);
    await this.authorityRepository.save(authority);
    return authority;
  }

  async getAuthorityById(id: string): Promise<Authority | null> {
    return this.authorityRepository.findById(id);
  }
}
