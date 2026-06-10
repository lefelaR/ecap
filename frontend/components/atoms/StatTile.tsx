interface StatTileProps {
  value: number | string;
  label: string;
  valueClass?: string;
}

export function StatTile({ value, label, valueClass = 'text-primary' }: StatTileProps) {
  return (
    <div className="col-6 col-md-3">
      <div className="card shadow-sm text-center h-100">
        <div className="card-body">
          <div className={`display-6 fw-bold ${valueClass}`}>{value}</div>
          <div className="text-muted small">{label}</div>
        </div>
      </div>
    </div>
  );
}
