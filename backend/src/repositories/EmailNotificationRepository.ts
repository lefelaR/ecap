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
    await this.put(notification.toJSON());
    return notification;
  }
}
