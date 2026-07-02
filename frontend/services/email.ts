import type { Report } from '@/lib/types';
import { mail } from '@/lib/mail';

export async function sendReportConfirmation(report: Report): Promise<void> {
  const results = await mail.sendReportSubmitted(report);
  console.info(`[ECAP email] Sent ${results.length} report submission email(s) for ${report.referenceNumber}`);
}

export async function sendStatusUpdate(report: Report): Promise<void> {
  await mail.send({ type: 'reportStatusUpdate', report });
}
