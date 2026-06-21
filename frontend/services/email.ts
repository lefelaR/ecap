import type { Report } from '@/lib/types';
import { mail } from '@/lib/mail';
import { readData, writeData } from './store';

async function persistMailResults(results: NonNullable<Awaited<ReturnType<typeof mail.send>>>[]): Promise<void> {
  if (results.length === 0) return;

  const data = await readData();
  for (const result of results) {
    data.emails.push({
      id: result.id,
      to: result.to,
      subject: result.subject,
      body: result.text,
      reportReference: result.reportReference,
      sentAt: result.sentAt,
    });
  }
  await writeData(data);
}

export async function sendReportConfirmation(report: Report): Promise<void> {
  const results = await mail.sendReportSubmitted(report);
  await persistMailResults(results);
}

export async function sendStatusUpdate(report: Report): Promise<void> {
  const result = await mail.send({ type: 'reportStatusUpdate', report });
  if (!result) return;
  await persistMailResults([result]);
}
