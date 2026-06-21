import { Section, Text } from 'react-email';
import type { Report } from '@/lib/types';
import { formatDate, STATUS_LABELS } from '@/lib/labels';
import { EcapLayout } from './EcapLayout';

interface ReportStatusUpdateEmailProps {
  report: Report;
}

export function ReportStatusUpdateEmail({ report }: ReportStatusUpdateEmailProps) {
  const recipient = report.contactName || 'resident';

  return (
    <EcapLayout
      preview={`Your ECAP report ${report.referenceNumber} status is now ${STATUS_LABELS[report.status]}.`}
      title="Status update"
    >
      <Text style={paragraph}>Dear {recipient},</Text>
      <Text style={paragraph}>Your report {report.referenceNumber} has been updated.</Text>

      <Section style={details}>
        <Text style={detailRow}>
          <strong>Current status:</strong> {STATUS_LABELS[report.status]}
        </Text>
        {report.resolvedAt ? (
          <Text style={detailRow}>
            <strong>Resolved on:</strong> {formatDate(report.resolvedAt)}
          </Text>
        ) : null}
        {report.expenditure != null ? (
          <Text style={detailRow}>
            <strong>Expenditure:</strong> R {report.expenditure.toLocaleString('en-ZA')}
          </Text>
        ) : null}
        {report.notes ? (
          <Text style={detailRow}>
            <strong>Notes:</strong> {report.notes}
          </Text>
        ) : null}
      </Section>

      <Text style={paragraph}>Visit the ECAP status page to view full details.</Text>
    </EcapLayout>
  );
}

export function reportStatusUpdateSubject(referenceNumber: string): string {
  return `ECAP Status Update – ${referenceNumber}`;
}

export function reportStatusUpdateText(report: Report): string {
  const recipient = report.contactName || 'resident';

  return [
    `Dear ${recipient},`,
    '',
    `Your report ${report.referenceNumber} has been updated.`,
    '',
    `Current status: ${STATUS_LABELS[report.status]}`,
    report.resolvedAt ? `Resolved on: ${formatDate(report.resolvedAt)}` : '',
    report.expenditure != null ? `Expenditure: R ${report.expenditure.toLocaleString('en-ZA')}` : '',
    report.notes ? `Notes: ${report.notes}` : '',
    '',
    'Visit the ECAP status page to view full details.',
  ]
    .filter(Boolean)
    .join('\n');
}

const paragraph = {
  color: '#334155',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 16px',
};

const details = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '6px',
  margin: '0 0 16px',
  padding: '16px',
};

const detailRow = {
  color: '#334155',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0 0 8px',
};
