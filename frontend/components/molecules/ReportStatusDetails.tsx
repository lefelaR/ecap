import { CATEGORY_LABELS } from '@/lib/labels';
import type { ReportLookupResult } from '@/lib/types';

interface ReportStatusDetailsProps {
  result: ReportLookupResult | null;
}

export function ReportStatusDetails({ result }: ReportStatusDetailsProps) {
  if (!result) {
    return (
      <div className="card shadow-sm border-0 bg-light">
        <div className="card-body text-muted">Enter a reference number to view report status and resolution details.</div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h2 className="h5 mb-1">{result.referenceNumber}</h2>
            <p className="text-muted mb-0">{result.summary}</p>
          </div>
          <span className="badge bg-primary">{result.status}</span>
        </div>
        <dl className="row mb-0">
          <dt className="col-sm-4">Category</dt>
          <dd className="col-sm-8">{CATEGORY_LABELS[result.category] ?? result.category}</dd>
          <dt className="col-sm-4">Ward</dt>
          <dd className="col-sm-8">{result.ward}</dd>
          <dt className="col-sm-4">Reported</dt>
          <dd className="col-sm-8">{new Date(result.createdAt).toLocaleString('en-ZA')}</dd>
          <dt className="col-sm-4">Last updated</dt>
          <dd className="col-sm-8">{new Date(result.updatedAt).toLocaleString('en-ZA')}</dd>
          {result.resolvedAt && (
            <>
              <dt className="col-sm-4">Resolved</dt>
              <dd className="col-sm-8">{new Date(result.resolvedAt).toLocaleString('en-ZA')}</dd>
            </>
          )}
          {result.expenditure != null && (
            <>
              <dt className="col-sm-4">Expenditure</dt>
              <dd className="col-sm-8">R {result.expenditure.toLocaleString('en-ZA')}</dd>
            </>
          )}
          <dt className="col-sm-4">Details</dt>
          <dd className="col-sm-8">{result.description}</dd>
          {result.notes && (
            <>
              <dt className="col-sm-4">Authority notes</dt>
              <dd className="col-sm-8">{result.notes}</dd>
            </>
          )}
        </dl>
      </div>
    </div>
  );
}
