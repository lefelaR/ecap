import { Section, Text } from 'react-email';
import type { Report } from '@/lib/types';
import { reporterContactLines, reporterDisplayName, reportDetailLines } from '../report-details';
import { EcapLayout } from './EcapLayout';

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

interface ReportAdminAlertEmailProps {
  report: Report;
}

export function ReportAdminAlertEmail({ report }: ReportAdminAlertEmailProps) {
  return (
    <EcapLayout
      preview={`New ECAP report ${report.referenceNumber} submitted.`}
      title="New report activity"
    >
      <Text style={paragraph}>Hello,</Text>
      <Text style={paragraph}>
        A new report has been submitted on the Electronic Councillor Action Platform and requires
        your attention.
      </Text>

      <Section style={details}>
        {reportDetailLines(report).map((line) => (
          <Text key={line} style={detailRow}>
            {line}
          </Text>
        ))}
        {reporterContactLines(report).map((line) => (
          <Text key={line} style={detailRow}>
            {line}
          </Text>
        ))}
      </Section>

      <Text style={paragraph}>Signed in administrators can review this report in the ECAP dashboard.</Text>
    </EcapLayout>
  );
}

export function reportAdminAlertSubject(referenceNumber: string): string {
  return `ECAP Admin Alert – New report ${referenceNumber}`;
}

export function reportAdminAlertText(report: Report): string {
  return [
    'Hello,',
    '',
    'A new report has been submitted on the Electronic Councillor Action Platform.',
    '',
    ...reportDetailLines(report),
    ...reporterContactLines(report),
    '',
    'Review this report in the ECAP dashboard.',
  ].join('\n');
}

interface ReportDepartmentAlertEmailProps {
  report: Report;
}

export function ReportDepartmentAlertEmail({ report }: ReportDepartmentAlertEmailProps) {
  const department = reportDetailLines(report).find((line) => line.startsWith('Department:'))?.replace('Department: ', '');

  return (
    <EcapLayout
      preview={`New ${department ?? 'department'} report ${report.referenceNumber}.`}
      title="New report for your department"
    >
      <Text style={paragraph}>Hello,</Text>
      <Text style={paragraph}>
        A new report has been routed to your department on the Electronic Councillor Action Platform.
      </Text>

      <Section style={details}>
        {reportDetailLines(report).map((line) => (
          <Text key={line} style={detailRow}>
            {line}
          </Text>
        ))}
        <Text style={detailRow}>
          <strong>Reporter:</strong> {reporterDisplayName(report)}
        </Text>
        {!report.anonymous && report.contactEmail ? (
          <Text style={detailRow}>
            <strong>Contact email:</strong> {report.contactEmail}
          </Text>
        ) : null}
      </Section>

      <Text style={paragraph}>Please review and action this report through ECAP.</Text>
    </EcapLayout>
  );
}

export function reportDepartmentAlertSubject(referenceNumber: string, department: string): string {
  return `ECAP Department Alert – ${department} – ${referenceNumber}`;
}

export function reportDepartmentAlertText(report: Report): string {
  const departmentLine = reportDetailLines(report).find((line) => line.startsWith('Department:')) ?? 'Department: ECAP';

  return [
    'Hello,',
    '',
    'A new report has been routed to your department on the Electronic Councillor Action Platform.',
    '',
    ...reportDetailLines(report),
    `Reporter: ${reporterDisplayName(report)}`,
    '',
    'Please review and action this report through ECAP.',
  ].join('\n');
}

export { paragraph, details, detailRow };
