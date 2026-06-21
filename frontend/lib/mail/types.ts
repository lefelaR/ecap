import type { Report } from '@/lib/types';

export type MailMessageType = 'reportConfirmation' | 'reportStatusUpdate';

export type MailMessage =
  | { type: 'reportConfirmation'; report: Report }
  | { type: 'reportStatusUpdate'; report: Report };

export interface RenderedMail {
  to: string;
  subject: string;
  html: string;
  text: string;
  reportReference?: string;
}

export interface MailResult extends RenderedMail {
  id: string;
  sentAt: string;
}

export type MailTransport = (mail: RenderedMail) => Promise<void>;
