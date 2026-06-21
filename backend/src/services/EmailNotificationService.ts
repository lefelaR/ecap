import { MailSender } from '../common/MailSender';
import { EmailNotification } from '../domain/entities/EmailNotification';
import type { ServiceReport } from '../domain/entities/ServiceReport';
import { EmailNotificationRepository } from '../repositories/EmailNotificationRepository';

export class EmailNotificationService {
  constructor(private readonly repository: EmailNotificationRepository) {}

  private async dispatch(notification: EmailNotification): Promise<void> {
    const record = notification.toJSON();
    await this.repository.save(notification);
    await MailSender.send({
      to: record.to,
      subject: record.subject,
      text: record.body,
    });
  }

  async sendConfirmation(report: ServiceReport): Promise<void> {
    try {
      await this.dispatch(EmailNotification.confirmation(report));
    } catch (error) {
      if (error instanceof Error && error.message === 'SKIP_EMAIL') return;
      throw error;
    }
  }

  async sendStatusUpdate(report: ServiceReport): Promise<void> {
    try {
      await this.dispatch(EmailNotification.statusUpdate(report));
    } catch (error) {
      if (error instanceof Error && error.message === 'SKIP_EMAIL') return;
      throw error;
    }
  }
}
