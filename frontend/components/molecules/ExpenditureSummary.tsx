interface ExpenditureSummaryProps {
  totalExpenditure: number;
}

export function ExpenditureSummary({ totalExpenditure }: ExpenditureSummaryProps) {
  return (
    <div className="col-12">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="h5">Total public expenditure on resolved issues</h2>
          <p className="display-6 fw-bold text-success mb-0">R {totalExpenditure.toLocaleString('en-ZA')}</p>
        </div>
      </div>
    </div>
  );
}
