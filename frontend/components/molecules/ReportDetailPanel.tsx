import { CATEGORY_LABELS } from '@/lib/labels';
import type { Report, ReportStatus } from '@/lib/types';

interface ReportDetailPanelProps {
  report: Report;
  notes: string;
  expenditure: string;
  onNotesChange: (value: string) => void;
  onExpenditureChange: (value: string) => void;
  onUpdateStatus: (status: ReportStatus) => void;
}

export function ReportDetailPanel({
  report,
  notes,
  expenditure,
  onNotesChange,
  onExpenditureChange,
  onUpdateStatus,
}: ReportDetailPanelProps) {
  return (
    <div className="card shadow-sm sticky-top" style={{ top: '5rem' }}>
      <div className="card-body">
        <h2 className="h5">{report.referenceNumber}</h2>
        <p className="text-muted">
          {CATEGORY_LABELS[report.category]} · {report.ward}
        </p>
        <p>{report.description}</p>
        {!report.anonymous && (
          <p className="small text-muted">
            Contact: {report.contactName} · {report.contactEmail}
          </p>
        )}

        <div className="mb-3">
          <label className="form-label" htmlFor="notes">
            Authority notes
          </label>
          <textarea id="notes" className="form-control" rows={3} value={notes} onChange={(e) => onNotesChange(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="expenditure">
            Expenditure (R, when resolving)
          </label>
          <input
            id="expenditure"
            type="number"
            className="form-control"
            value={expenditure}
            onChange={(e) => onExpenditureChange(e.target.value)}
          />
        </div>

        <div className="d-flex flex-wrap gap-2">
          <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => onUpdateStatus('Under review')}>
            Under review
          </button>
          <button type="button" className="btn btn-sm btn-success" onClick={() => onUpdateStatus('Resolved')}>
            Resolve
          </button>
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => onUpdateStatus('Duplicate')}>
            Mark duplicate
          </button>
          <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onUpdateStatus('Cancelled')}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
