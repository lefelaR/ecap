import { createElement } from 'react';
import { render } from 'react-email';
import type { MailMessage, RenderedMail } from './types';
import {
  ReportConfirmationEmail,
  reportConfirmationSubject,
  reportConfirmationText,
} from './templates/ReportConfirmationEmail';
import {
  ReportStatusUpdateEmail,
  reportStatusUpdateSubject,
  reportStatusUpdateText,
} from './templates/ReportStatusUpdateEmail';

function shouldSkipReportMail(report: MailMessage['report']): boolean {
  return report.anonymous || !report.contactEmail;
}

export async function renderMailMessage(message: MailMessage): Promise<RenderedMail | null> {
  if (shouldSkipReportMail(message.report)) {
    return null;
  }

  switch (message.type) {
    case 'reportConfirmation':
      return {
        to: message.report.contactEmail,
        subject: reportConfirmationSubject(message.report.referenceNumber),
        html: await render(createElement(ReportConfirmationEmail, { report: message.report })),
        text: reportConfirmationText(message.report),
        reportReference: message.report.referenceNumber,
      };
    case 'reportStatusUpdate':
      return {
        to: message.report.contactEmail,
        subject: reportStatusUpdateSubject(message.report.referenceNumber),
        html: await render(createElement(ReportStatusUpdateEmail, { report: message.report })),
        text: reportStatusUpdateText(message.report),
        reportReference: message.report.referenceNumber,
      };
    default: {
      const exhaustive: never = message;
      throw new Error(`Unsupported mail type: ${(exhaustive as MailMessage).type}`);
    }
  }
}
