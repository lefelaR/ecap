import type { EmailNotificationRecord } from '../types';
import type { RenderedMail } from '../../mail/types';

export class EmailNotification {
  private constructor(private readonly record: EmailNotificationRecord) {}

  static fromRendered(mail: RenderedMail): EmailNotification {
    return new EmailNotification({
      id: `email-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      to: mail.to,
      subject: mail.subject,
      body: mail.text,
      reportReference: mail.reportReference,
      sentAt: new Date().toISOString(),
    });
  }

  toJSON(): EmailNotificationRecord {
    return { ...this.record };
  }
}
