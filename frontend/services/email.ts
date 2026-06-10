import type { Report } from '../lib/types';
import { readData, writeData } from './store';

export async function sendReportConfirmation(report: Report): Promise<void> {
  if (!report.contactEmail || report.anonymous) return;

  const data = await readData();
  const subject = `ECAP Report Received – ${report.referenceNumber}`;
  const body = [
    `Dear ${report.contactName || 'resident'},`,
    '',
    'Your report has been received on the Electronic Councillor Action Platform.',
    '',
    `Reference number: ${report.referenceNumber}`,
    `Category: ${report.category}`,
    `Ward: ${report.ward}`,
    `Status: ${report.status}`,
    '',
    'You can check the status of your issue at any time using your reference number on the ECAP status page.',
    '',
    'Thank you for helping improve service delivery in your community.',
  ].join('\n');

  data.emails.push({
    id: `email-${Date.now()}`,
    to: report.contactEmail,
    subject,
    body,
    reportReference: report.referenceNumber,
    sentAt: new Date().toISOString(),
  });

  await writeData(data);
  console.info(`[ECAP email] To: ${report.contactEmail} | ${subject}`);
}

export async function sendStatusUpdate(report: Report): Promise<void> {
  if (!report.contactEmail || report.anonymous) return;

  const data = await readData();
  const subject = `ECAP Status Update – ${report.referenceNumber}`;
  const body = [
    `Dear ${report.contactName || 'resident'},`,
    '',
    `Your report ${report.referenceNumber} has been updated.`,
    '',
    `Current status: ${report.status}`,
    report.resolvedAt ? `Resolved on: ${new Date(report.resolvedAt).toLocaleDateString('en-ZA')}` : '',
    report.expenditure != null ? `Expenditure: R ${report.expenditure.toLocaleString('en-ZA')}` : '',
    report.notes ? `Notes: ${report.notes}` : '',
    '',
    'Visit the ECAP status page to view full details.',
  ]
    .filter(Boolean)
    .join('\n');

  data.emails.push({
    id: `email-${Date.now()}`,
    to: report.contactEmail,
    subject,
    body,
    reportReference: report.referenceNumber,
    sentAt: new Date().toISOString(),
  });

  await writeData(data);
  console.info(`[ECAP email] To: ${report.contactEmail} | ${subject}`);
}
