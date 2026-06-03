import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="container py-5">
      <section className="page-banner text-center">
        <span className="badge rounded-pill bg-info text-dark">ECAP</span>
        <h1 className="display-5 fw-bold mt-3">Electronic Councillor Action Platform</h1>
        <p className="lead mx-auto" style={{ maxWidth: '720px' }}>
          A national municipal reporting system for service delivery issues, anonymous crime reports,
          authority dashboards, and admin management.
        </p>
      </section>

      <div className="row row-cols-1 row-cols-md-3 g-4">
        <div className="col">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title h5">Public Reporting</h2>
              <p className="card-text">Submit service delivery or crime reports, including anonymous incident reporting and location capture.</p>
              <Link href="/public" className="btn btn-primary">
                Report an Issue
              </Link>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title h5">Authority Dashboard</h2>
              <p className="card-text">View ward-level reports, filter by area and status, and mark incidents as duplicate or cancelled.</p>
              <Link href="/authority" className="btn btn-outline-primary">
                View Authority Tools
              </Link>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title h5">Admin Control</h2>
              <p className="card-text">Register authorities, assign area-limited rights, and preserve data integrity without deletion.</p>
              <Link href="/admin" className="btn btn-outline-primary">
                Open Admin Panel
              </Link>
            </div>
          </div>
        </div>
      </div>

      <section className="card shadow-sm mt-5">
        <div className="card-body">
          <h2>Why ECAP?</h2>
          <ul>
            <li>Anonymous crime reporting for the public while preserving investigation access for SAPS/JMPD.</li>
            <li>Service delivery reports routed to the correct ward and responsible entity.</li>
            <li>Authority filtering, duplicate marking, and cancellation without data deletion.</li>
            <li>Designed for every South African municipality, from urban centers to rural wards.</li>
          </ul>
        </div>
      </section>

      <footer className="footer-custom text-center">
        Built to support transparent municipal reporting and executive hotspot monitoring across South Africa.
      </footer>
    </main>
  );
}
