interface ReportLookupFormProps {
  reference: string;
  email: string;
  loading: boolean;
  error: string;
  onReferenceChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onSubmit: () => void;
}

export function ReportLookupForm({
  reference,
  email,
  loading,
  error,
  onReferenceChange,
  onEmailChange,
  onSubmit,
}: ReportLookupFormProps) {
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="row g-3"
        >
          <div className="col-12">
            <label className="form-label" htmlFor="reference">
              Reference number
            </label>
            <input
              id="reference"
              className="form-control"
              value={reference}
              onChange={(e) => onReferenceChange(e.target.value)}
              placeholder="ECAP-2024-00102"
              required
            />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="email">
              Email (optional verification)
            </label>
            <input
              id="email"
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="Used to verify non-anonymous reports"
            />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Searching…' : 'Look up status'}
            </button>
          </div>
        </form>
        {error && <div className="alert alert-danger mt-3 mb-0 py-2">{error}</div>}
      </div>
    </div>
  );
}
