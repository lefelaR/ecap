import Link from 'next/link';

const mockReports = [
  { id: 'R-001', title: 'Blocked stormwater drain', ward: 'Ward 27', status: 'Open' },
  { id: 'R-002', title: 'Anonymous crime report', ward: 'Ward 12', status: 'Under review' },
  { id: 'R-003', title: 'Duplicate pothole incident', ward: 'Ward 9', status: 'Marked duplicate' },
];

export default function AuthorityPage() {
  return (
    <main className="container py-5">
      <section className="page-banner">
        <span className="badge rounded-pill bg-primary">Authority</span>
        <h1 className="display-6 fw-bold mt-3">Authority Dashboard</h1>
        <p className="lead">Pull reports by area, inspect anonymous crime incidents, and preserve records with cancellation and duplicate marking.</p>
      </section>

      <section className="row g-4 mt-4">
        {mockReports.map((report) => (
          <div key={report.id} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h3 className="h5">{report.title}</h3>
                <p className="text-muted mb-3">
                  <strong>{report.ward}</strong> · {report.status}
                </p>
                <button className="btn btn-outline-primary btn-sm me-2">View</button>
                <button className="btn btn-outline-secondary btn-sm">Mark duplicate</button>
              </div>
            </div>
          </div>
        ))}
      </section>

      <div className="mt-4">
        <Link href="/" className="btn btn-secondary">
          Back to home
        </Link>
      </div>
    </main>
  );
}
