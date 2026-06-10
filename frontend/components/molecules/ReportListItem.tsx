import type { Report } from '../../lib/types';

interface ReportListItemProps {
  report: Report;
  selected: boolean;
  onSelect: (report: Report) => void;
}

export function ReportListItem({ report, selected, onSelect }: ReportListItemProps) {
  return (
    <div className="col-12">
      <button
        type="button"
        className={`card shadow-sm w-100 text-start border ${selected ? 'border-primary' : ''}`}
        onClick={() => onSelect(report)}
      >
        <div className="card-body">
          <div className="d-flex justify-content-between gap-2">
            <div>
              <h3 className="h6 mb-1">{report.summary}</h3>
              <p className="text-muted small mb-0">
                {report.referenceNumber} · {report.ward}
                {report.anonymous && ' · Anonymous'}
              </p>
            </div>
            <span className="badge bg-secondary align-self-start">{report.status}</span>
          </div>
        </div>
      </button>
    </div>
  );
}
