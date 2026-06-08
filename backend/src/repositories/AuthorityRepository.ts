import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { Environment } from '../config/environment';
import { Authority } from '../domain/entities/Authority';
import type { AuthorityRecord } from '../domain/types';
import { BaseRepository } from './BaseRepository';

export class AuthorityRepository extends BaseRepository<AuthorityRecord> {
  private static singleton: AuthorityRepository | null = null;

  constructor() {
    super(Environment.authoritiesTable);
  }

  static getInstance(): AuthorityRepository {
    if (!this.singleton) {
      this.singleton = new AuthorityRepository();
    }
    return this.singleton;
  }

  async save(authority: Authority): Promise<Authority> {
    await this.put(authority.toJSON());
    return authority;
  }

  async findById(id: string): Promise<Authority | null> {
    const record = await this.getByKey({ id });
    return record ? Authority.fromRecord(record) : null;
  }

  async findByEmail(email: string): Promise<Authority | null> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'EmailIndex',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: { ':email': email.toLowerCase() },
        Limit: 1,
      }),
    );

    const record = result.Items?.[0] as AuthorityRecord | undefined;
    return record ? Authority.fromRecord(record) : null;
  }

  async findAll(): Promise<Authority[]> {
    const records = await this.scanAll();
    return records.map((record) => Authority.fromRecord(record));
  }
}
