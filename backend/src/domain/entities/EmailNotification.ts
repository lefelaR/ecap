import type { EmailNotificationRecord } from '../types';
import type { ServiceReport } from './ServiceReport';

export class EmailNotification {
  private constructor(private readonly record: EmailNotificationRecord) {}

  static confirmation(report: ServiceReport): EmailNotification {
    const data = report.toJSON();

    if (!data.contactEmail || data.anonymous) {
      throw new Error('SKIP_EMAIL');
    }

    const body = [
      `Dear ${data.contactName || 'resident'},`,
      '',
      'Your report has been received on the Electronic Councillor Action Platform.',
      '',
      `Reference number: ${data.referenceNumber}`,
      `Category: ${data.category}`,
      `Ward: ${data.ward}`,
      `Status: ${data.status}`,
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

  static statusUpdate(report: ServiceReport): EmailNotification {
    const data = report.toJSON();

    if (!data.contactEmail || data.anonymous) {
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
