import type { AuthorityRecord, AuthorityType, CreateAuthorityInput, SessionUser } from '../types';

export class Authority {
  private constructor(private readonly record: AuthorityRecord) {}

  static fromRecord(record: AuthorityRecord): Authority {
    return new Authority(record);
  }

  static create(input: CreateAuthorityInput): Authority {
    const canViewAnonymousCrime =
      input.type === 'SAPS' || input.type === 'JMPD' || input.type === 'Application Admin';

    return new Authority({
      id: `auth-${Date.now()}`,
      name: input.name,
      email: input.email,
      type: input.type,
      ward: input.ward || 'All',
      municipality: input.municipality || 'City of Johannesburg',
      canViewAnonymousCrime,
    });
  }

  get id(): string {
    return this.record.id;
  }

  get type(): AuthorityType {
    return this.record.type;
  }

  toJSON(): AuthorityRecord {
    return { ...this.record };
  }

  toSessionUser(): SessionUser {
    return {
      authorityId: this.record.id,
      name: this.record.name,
      type: this.record.type,
      ward: this.record.ward,
      municipality: this.record.municipality,
      canViewAnonymousCrime: this.record.canViewAnonymousCrime,
    };
  }

  isAdmin(): boolean {
    return this.record.type === 'Application Admin';
  }
}
