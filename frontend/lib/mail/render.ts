import { createElement } from 'react';
import { render } from 'react-email';
import { CATEGORY_SERVICE_PROVIDERS } from '@/lib/labels';
import { canEmailReporter, getAdminNotificationEmail, getDepartmentNotificationEmail } from './recipients';
import type { MailMessage, RenderedMail } from './types';
import {
  ReportConfirmationEmail,
  reportConfirmationSubject,
  reportConfirmationText,
} from './templates/ReportConfirmationEmail';
import {
  ReportAdminAlertEmail,
  ReportDepartmentAlertEmail,
  reportAdminAlertSubject,
  reportAdminAlertText,
  reportDepartmentAlertSubject,
  reportDepartmentAlertText,
} from './templates/ReportSubmittedEmails';
import {
  ReportStatusUpdateEmail,
  reportStatusUpdateSubject,
  reportStatusUpdateText,
} from './templates/ReportStatusUpdateEmail';

export async function renderMailMessage(message: MailMessage): Promise<RenderedMail | null> {
  const { report } = message;

  switch (message.type) {
    case 'reportConfirmation':
      if (!canEmailReporter(report)) return null;
      return {
        to: report.contactEmail,
        subject: reportConfirmationSubject(report.referenceNumber),
        html: await render(createElement(ReportConfirmationEmail, { report })),
        text: reportConfirmationText(report),
        reportReference: report.referenceNumber,
      };
    case 'reportAdminAlert':
      return {
        to: getAdminNotificationEmail(),
        subject: reportAdminAlertSubject(report.referenceNumber),
        html: await render(createElement(ReportAdminAlertEmail, { report })),
        text: reportAdminAlertText(report),
        reportReference: report.referenceNumber,
      };
    case 'reportDepartmentAlert': {
      const department = CATEGORY_SERVICE_PROVIDERS[report.category];
      return {
        to: getDepartmentNotificationEmail(report),
        subject: reportDepartmentAlertSubject(report.referenceNumber, department),
        html: await render(createElement(ReportDepartmentAlertEmail, { report })),
        text: reportDepartmentAlertText(report),
        reportReference: report.referenceNumber,
      };
    }
    case 'reportStatusUpdate':
      if (!canEmailReporter(report)) return null;
      return {
        to: report.contactEmail,
        subject: reportStatusUpdateSubject(report.referenceNumber),
        html: await render(createElement(ReportStatusUpdateEmail, { report })),
        text: reportStatusUpdateText(report),
        reportReference: report.referenceNumber,
      };
    default: {
      const exhaustive: never = message;
      throw new Error(`Unsupported mail type: ${(exhaustive as MailMessage).type}`);
    }
  }
}

export function buildReportSubmittedMessages(report: MailMessage['report']): MailMessage[] {
  const messages: MailMessage[] = [
    { type: 'reportAdminAlert', report },
  ];

  if (canEmailReporter(report)) {
    messages.push({ type: 'reportConfirmation', report });
  }

  messages.push({ type: 'reportDepartmentAlert', report });
  return messages;
}
