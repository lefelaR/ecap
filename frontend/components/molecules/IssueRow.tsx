import Link from 'next/link';
import type { Report } from '@/lib/types';
import { CATEGORY_LABELS, STATUS_LABELS, formatDate } from '@/lib/labels';

interface IssueRowProps {
  report: Report;
}

export function IssueRow({ report }: IssueRowProps) {
  const statusHref = `/status?reference=${encodeURIComponent(report.referenceNumber)}`;

  return (
    <div className="list-group-item list-group-item-action px-0 py-3 border-0 border-bottom">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-2">
        <div className="flex-grow-1">
          <h3 className="h6 mb-1">
            <Link href={statusHref} className="text-decoration-none">
              {report.summary}
            </Link>
          </h3>
          <p className="text-muted small mb-1">
            <Link href={statusHref} className="text-muted">
              {report.referenceNumber}
            </Link>
            {' · '}
            {report.ward}
            {' · '}
            {CATEGORY_LABELS[report.category]}
            {report.anonymous && ' · Anonymous'}
          </p>
          <p className="text-muted small mb-0">Reported {formatDate(report.createdAt)}</p>
        </div>
        <div className="d-flex flex-column align-items-md-end gap-2">
          <span className="badge bg-secondary">{STATUS_LABELS[report.status]}</span>
          <Link href={statusHref} className="btn btn-sm btn-outline-primary">
            View status
          </Link>
        </div>
      </div>
    </div>
  );
}
