import { Section, Text } from 'react-email';
import type { Report } from '@/lib/types';
import { CATEGORY_LABELS, STATUS_LABELS } from '@/lib/labels';
import { EcapLayout } from './EcapLayout';

interface ReportConfirmationEmailProps {
  report: Report;
}

export function ReportConfirmationEmail({ report }: ReportConfirmationEmailProps) {
  const recipient = report.contactName || 'resident';

  return (
    <EcapLayout
      preview={`Your ECAP report ${report.referenceNumber} has been received.`}
      title="Report received"
    >
      <Text style={paragraph}>Dear {recipient},</Text>
      <Text style={paragraph}>
        Your report has been received on the Electronic Councillor Action Platform.
      </Text>

      <Section style={details}>
        <Text style={detailRow}>
          <strong>Reference:</strong> {report.referenceNumber}
        </Text>
        <Text style={detailRow}>
          <strong>Category:</strong> {CATEGORY_LABELS[report.category]}
        </Text>
        <Text style={detailRow}>
          <strong>Ward:</strong> {report.ward}
        </Text>
        <Text style={detailRow}>
          <strong>Status:</strong> {STATUS_LABELS[report.status]}
        </Text>
      </Section>

      <Text style={paragraph}>
        You can check the status of your issue at any time using your reference number on the ECAP
        status page.
      </Text>
      <Text style={paragraph}>Thank you for helping improve service delivery in your community.</Text>
    </EcapLayout>
  );
}

export function reportConfirmationSubject(referenceNumber: string): string {
  return `ECAP Report Received – ${referenceNumber}`;
}

export function reportConfirmationText(report: Report): string {
  const recipient = report.contactName || 'resident';

  return [
    `Dear ${recipient},`,
    '',
    'Your report has been received on the Electronic Councillor Action Platform.',
    '',
    `Reference number: ${report.referenceNumber}`,
    `Category: ${CATEGORY_LABELS[report.category]}`,
    `Ward: ${report.ward}`,
    `Status: ${STATUS_LABELS[report.status]}`,
    '',
    'You can check the status of your issue at any time using your reference number on the ECAP status page.',
    '',
    'Thank you for helping improve service delivery in your community.',
  ].join('\n');
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
