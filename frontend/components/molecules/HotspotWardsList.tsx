interface HotspotWardsListProps {
  hotspotWards: { ward: string; count: number }[];
}

export function HotspotWardsList({ hotspotWards }: HotspotWardsListProps) {
  return (
    <div className="col-md-6">
      <div className="card shadow-sm h-100">
        <div className="card-body">
          <h2 className="h5">Hotspot wards</h2>
          {hotspotWards.length === 0 ? (
            <p className="text-muted mb-0">No active hotspots.</p>
          ) : (
            <ul className="list-group list-group-flush">
              {hotspotWards.map((entry) => (
                <li key={entry.ward} className="list-group-item d-flex justify-content-between px-0">
                  <span>{entry.ward}</span>
                  <strong>{entry.count} reports</strong>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
