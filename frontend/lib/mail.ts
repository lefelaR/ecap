import type { Report } from '@/lib/types';
import { renderMailMessage } from './mail/render';
import { consoleMailTransport } from './mail/transport';
import type { MailMessage, MailResult, MailTransport } from './mail/types';

class MailService {
  #transport: MailTransport = consoleMailTransport;

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
      id: `email-${Date.now()}`,
      sentAt: new Date().toISOString(),
    };
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
