import type { ReactNode } from 'react';
import type { Report } from '@/lib/types';
import {
  CATEGORY_LABELS,
  formatDateTime,
  REPORT_TYPE_LABELS,
  STATUS_LABELS,
} from '@/lib/labels';

interface IssueDetailsCardProps {
  report: Report;
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  if (!value) return null;

  return (
    <>
      <dt className="col-sm-4 text-muted">{label}</dt>
      <dd className="col-sm-8">{value}</dd>
    </>
  );
}

export function IssueDetailsCard({ report }: IssueDetailsCardProps) {
  const mapUrl = `https://www.openstreetmap.org/?mlat=${report.lat}&mlon=${report.lng}#map=17/${report.lat}/${report.lng}`;

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3 mb-4">
          <div>
            <h2 className="h5 mb-1">{report.referenceNumber}</h2>
            <p className="mb-0">{report.summary}</p>
          </div>
          <span className="badge bg-secondary align-self-start">{STATUS_LABELS[report.status]}</span>
        </div>

        <dl className="row mb-0">
          <DetailRow label="Type" value={REPORT_TYPE_LABELS[report.type]} />
          <DetailRow label="Category" value={CATEGORY_LABELS[report.category]} />
          <DetailRow label="Ward" value={report.ward} />
          <DetailRow label="Municipality" value={report.municipality} />
          <DetailRow label="Location" value={report.location} />
          <DetailRow
            label="Address"
            value={
              <>
                {report.address}
                <span className="d-block small mt-1">
                  <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                    View on map ({report.lat.toFixed(5)}, {report.lng.toFixed(5)})
                  </a>
                </span>
              </>
            }
          />
          <DetailRow label="Description" value={report.description} />
          <DetailRow
            label="Reporter"
            value={
              report.anonymous
                ? 'Anonymous'
                : `${report.contactName} · ${report.contactEmail}${report.contactPhone ? ` · ${report.contactPhone}` : ''}`
            }
          />
          <DetailRow label="Reported" value={formatDateTime(report.createdAt)} />
          <DetailRow label="Last updated" value={formatDateTime(report.updatedAt)} />
          <DetailRow label="Resolved" value={report.resolvedAt ? formatDateTime(report.resolvedAt) : null} />
          <DetailRow
            label="Expenditure"
            value={report.expenditure != null ? `R ${report.expenditure.toLocaleString('en-ZA')}` : null}
          />
          <DetailRow label="Authority notes" value={report.notes} />
          <DetailRow
            label="Photos"
            value={report.photoNames.length > 0 ? report.photoNames.join(', ') : null}
          />
        </dl>
      </div>
    </div>
  );
}
