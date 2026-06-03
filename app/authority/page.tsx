import Link from 'next/link';

const mockReports = [
  { id: 'R-001', title: 'Blocked stormwater drain', ward: 'Ward 27', status: 'Open' },
  { id: 'R-002', title: 'Anonymous crime report', ward: 'Ward 12', status: 'Under review' },
  { id: 'R-003', title: 'Duplicate pothole incident', ward: 'Ward 9', status: 'Marked duplicate' },
];

export default function AuthorityPage() {
  return (
    <main className="container">
      <header className="header">
        <p className="badge">Authority</p>
        <h1>Authority Dashboard</h1>
        <p>Pull reports by area, inspect anonymous crime incidents, and preserve records with cancellation and duplicate marking.</p>
      </header>

      <section className="card">
        <h2>Assigned Ward Reports</h2>
        <div className="grid">
          {mockReports.map((report) => (
            <article key={report.id} className="card">
              <h3>{report.title}</h3>
              <p>
                <strong>{report.ward}</strong> · {report.status}
              </p>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
                <button className="button secondary">View</button>
                <button className="button secondary">Mark duplicate</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div style={{ marginTop: '1.5rem' }}>
        <Link href="/" className="button secondary">
          Back to home
        </Link>
      </div>
    </main>
  );
}
