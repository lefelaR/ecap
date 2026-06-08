import { Environment } from '../config/environment';
import { EmailNotification } from '../domain/entities/EmailNotification';
import type { EmailNotificationRecord } from '../domain/types';
import { BaseRepository } from './BaseRepository';

export class EmailNotificationRepository extends BaseRepository<EmailNotificationRecord> {
  private static singleton: EmailNotificationRepository | null = null;

  constructor() {
    super(Environment.emailNotificationsTable);
  }

  static getInstance(): EmailNotificationRepository {
    if (!this.singleton) {
      this.singleton = new EmailNotificationRepository();
    }
    return this.singleton;
  }

  async save(notification: EmailNotification): Promise<EmailNotification> {
    const record = notification.toJSON();
    await this.put(record);
    console.info(`[ECAP email] To: ${record.to} | ${record.subject}`);
    return notification;
  }
}
