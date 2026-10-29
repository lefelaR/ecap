import { EmailNotification } from '../domain/entities/EmailNotification';
import type { ServiceReport } from '../domain/entities/ServiceReport';
import { EmailNotificationRepository } from '../repositories/EmailNotificationRepository';
import { MailSender } from '../common/MailSender';
import { buildReportSubmittedMessages, renderMailMessage } from '../mail/render';
import type { MailMessage, RenderedMail } from '../mail/types';

export class MailService {
  constructor(private readonly repository: EmailNotificationRepository) {}

  private async deliver(rendered: RenderedMail): Promise<void> {
    const notification = EmailNotification.fromRendered(rendered);
    await this.repository.save(notification);
    await MailSender.send({
      to: rendered.to,
      subject: rendered.subject,
      text: rendered.text,
      html: rendered.html,
    });
  }

  private async sendMessage(message: MailMessage): Promise<void> {
    const rendered = await renderMailMessage(message);
    if (!rendered) return;
    await this.deliver(rendered);
  }

  async sendReportSubmitted(report: ServiceReport): Promise<void> {
    const messages = buildReportSubmittedMessages(report.toJSON());
    await Promise.all(messages.map((message) => this.sendMessage(message)));
  }

  async sendStatusUpdate(report: ServiceReport): Promise<void> {
    await this.sendMessage({ type: 'reportStatusUpdate', report: report.toJSON() });
  }
}
