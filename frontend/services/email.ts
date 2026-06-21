import type { Report } from '@/lib/types';
import { mail } from '@/lib/mail';
import { readData, writeData } from './store';

async function persistMailResult(result: NonNullable<Awaited<ReturnType<typeof mail.send>>>): Promise<void> {
  const data = await readData();
  data.emails.push({
    id: result.id,
    to: result.to,
    subject: result.subject,
    body: result.text,
    reportReference: result.reportReference,
    sentAt: result.sentAt,
  });
  await writeData(data);
}

export async function sendReportConfirmation(report: Report): Promise<void> {
  const result = await mail.send({ type: 'reportConfirmation', report });
  if (!result) return;
  await persistMailResult(result);
}

export async function sendStatusUpdate(report: Report): Promise<void> {
  const result = await mail.send({ type: 'reportStatusUpdate', report });
  if (!result) return;
  await persistMailResult(result);
}
