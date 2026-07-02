import type { Report } from '@/lib/types';
import { buildReportSubmittedMessages, renderMailMessage } from './mail/render';
import { createDefaultMailTransport } from './mail/transport';
import type { MailMessage, MailResult, MailTransport } from './mail/types';

class MailService {
  #transport: MailTransport = createDefaultMailTransport();

  setTransport(transport: MailTransport): void {
    this.#transport = transport;
  }

  async send(message: MailMessage): Promise<MailResult | null> {
    const rendered = await renderMailMessage(message);
    if (!rendered) {
      return null;
    }

    await this.#transport(rendered);

    return {
      ...rendered,
      id: `email-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      sentAt: new Date().toISOString(),
    };
  }

  async sendReportSubmitted(report: Report): Promise<MailResult[]> {
    const results = await Promise.all(buildReportSubmittedMessages(report).map((message) => this.send(message)));
    return results.filter((result): result is MailResult => result !== null);
  }

  reportConfirmation(report: Report): Promise<MailResult | null> {
    return this.send({ type: 'reportConfirmation', report });
  }

  reportStatusUpdate(report: Report): Promise<MailResult | null> {
    return this.send({ type: 'reportStatusUpdate', report });
  }
}

export const mail = new MailService();

export type { MailMessage, MailMessageType, MailResult, MailTransport, RenderedMail } from './mail/types';
