import type { ServiceReportRecord } from '../domain/types';

export type MailReport = ServiceReportRecord;

export type MailMessageType =
  | 'reportConfirmation'
  | 'reportStatusUpdate'
  | 'reportAdminAlert'
  | 'reportDepartmentAlert';

export type MailMessage =
  | { type: 'reportConfirmation'; report: MailReport }
  | { type: 'reportStatusUpdate'; report: MailReport }
  | { type: 'reportAdminAlert'; report: MailReport }
  | { type: 'reportDepartmentAlert'; report: MailReport };

export interface RenderedMail {
  to: string;
  subject: string;
  html: string;
  text: string;
  reportReference?: string;
}
