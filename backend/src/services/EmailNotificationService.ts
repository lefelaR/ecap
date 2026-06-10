import { EmailNotification } from '../domain/entities/EmailNotification';
import type { ServiceReport } from '../domain/entities/ServiceReport';
import { EmailNotificationRepository } from '../repositories/EmailNotificationRepository';

export class EmailNotificationService {
  constructor(private readonly repository: EmailNotificationRepository) {}

  async sendConfirmation(report: ServiceReport): Promise<void> {
    try {
      const notification = EmailNotification.confirmation(report);
      await this.repository.save(notification);
    } catch (error) {
      if (error instanceof Error && error.message === 'SKIP_EMAIL') return;
      throw error;
    }
  }

  async sendStatusUpdate(report: ServiceReport): Promise<void> {
    try {
      const notification = EmailNotification.statusUpdate(report);
      await this.repository.save(notification);
    } catch (error) {
      if (error instanceof Error && error.message === 'SKIP_EMAIL') return;
      throw error;
    }
  }
}
