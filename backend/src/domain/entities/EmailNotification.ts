import type { EmailNotificationRecord } from '../types';
import type { ServiceReport } from './ServiceReport';
import {
  canEmailReporter,
  getAdminNotificationEmail,
  getDepartmentLabel,
  getDepartmentNotificationEmail,
  reportDetailLines,
  reporterContactLines,
} from '../../config/mailRecipients';

export class EmailNotification {
  private constructor(private readonly record: EmailNotificationRecord) {}

  static confirmation(report: ServiceReport): EmailNotification {
    const data = report.toJSON();

    if (!canEmailReporter(data)) {
      throw new Error('SKIP_EMAIL');
    }

    const body = [
      `Dear ${data.contactName || 'resident'},`,
      '',
      'Your report has been received on the Electronic Councillor Action Platform.',
      '',
      ...reportDetailLines(data),
      '',
      'You can check the status of your issue at any time using your reference number.',
      '',
      'Thank you for helping improve service delivery in your community.',
    ].join('\n');

    return EmailNotification.build(
      data.contactEmail,
      `ECAP Report Received – ${data.referenceNumber}`,
      body,
      data.referenceNumber,
    );
  }

  static adminAlert(report: ServiceReport): EmailNotification {
    const data = report.toJSON();

    const body = [
      'Hello,',
      '',
      'A new report has been submitted on the Electronic Councillor Action Platform.',
      '',
      ...reportDetailLines(data),
      ...reporterContactLines(data),
      '',
      'Review this report in the ECAP dashboard.',
    ].join('\n');

    return EmailNotification.build(
      getAdminNotificationEmail(),
      `ECAP Admin Alert – New report ${data.referenceNumber}`,
      body,
      data.referenceNumber,
    );
  }

  static departmentAlert(report: ServiceReport): EmailNotification {
    const data = report.toJSON();
    const department = getDepartmentLabel(data);

    const body = [
      'Hello,',
      '',
      'A new report has been routed to your department on the Electronic Councillor Action Platform.',
      '',
      ...reportDetailLines(data),
      data.anonymous ? 'Reporter: Anonymous reporter' : `Reporter: ${data.contactName || data.contactEmail}`,
      '',
      'Please review and action this report through ECAP.',
    ].join('\n');

    return EmailNotification.build(
      getDepartmentNotificationEmail(data),
      `ECAP Department Alert – ${department} – ${data.referenceNumber}`,
      body,
      data.referenceNumber,
    );
  }

  static statusUpdate(report: ServiceReport): EmailNotification {
    const data = report.toJSON();

    if (!canEmailReporter(data)) {
      throw new Error('SKIP_EMAIL');
    }

    const body = [
      `Dear ${data.contactName || 'resident'},`,
      '',
      `Your report ${data.referenceNumber} has been updated.`,
      '',
      `Current status: ${data.status}`,
      data.resolvedAt ? `Resolved on: ${new Date(data.resolvedAt).toLocaleDateString('en-ZA')}` : '',
      data.expenditure != null ? `Expenditure: R ${data.expenditure.toLocaleString('en-ZA')}` : '',
      data.notes ? `Notes: ${data.notes}` : '',
      '',
      'Visit the ECAP status page to view full details.',
    ]
      .filter(Boolean)
      .join('\n');

    return EmailNotification.build(
      data.contactEmail,
      `ECAP Status Update – ${data.referenceNumber}`,
      body,
      data.referenceNumber,
    );
  }

  private static build(to: string, subject: string, body: string, reportReference: string): EmailNotification {
    return new EmailNotification({
      id: `email-${Date.now()}`,
      to,
      subject,
      body,
      reportReference,
      sentAt: new Date().toISOString(),
    });
  }

  toJSON(): EmailNotificationRecord {
    return { ...this.record };
  }
}
