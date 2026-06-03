import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="container">
      <header className="header">
        <p className="badge">ECAP</p>
        <h1>Electronic Councillor Action Platform</h1>
        <p>
          A national municipal reporting system for service delivery issues, anonymous crime reports,
          authority dashboards, and admin management.
        </p>
      </header>

      <section className="grid grid-3">
        <article className="card">
          <h2>Public Reporting</h2>
          <p>Submit service delivery or crime reports, including anonymous incident reporting and location capture.</p>
          <Link href="/public" className="button">
            Report an Issue
          </Link>
        </article>

        <article className="card">
          <h2>Authority Dashboard</h2>
          <p>View ward-level reports, filter by area and status, and mark incidents as duplicate or cancelled.</p>
          <Link href="/authority" className="button secondary">
            View Authority Tools
          </Link>
        </article>

        <article className="card">
          <h2>Admin Control</h2>
          <p>Register authorities, assign area-limited rights, and preserve data integrity without deletion.</p>
          <Link href="/admin" className="button secondary">
            Open Admin Panel
          </Link>
        </article>
      </section>

      <section className="card" style={{ marginTop: '1.5rem' }}>
        <h2>Why ECAP?</h2>
        <ul>
          <li>Anonymous crime reporting for the public while preserving investigation access for SAPS/JMPD.</li>
          <li>Service delivery reports routed to the correct ward and responsible entity.</li>
          <li>Authority filtering, duplicate marking, and cancellation without data deletion.</li>
          <li>Designed for every South African municipality, from urban centers to rural wards.</li>
        </ul>
      </section>

      <footer className="footer">
        Built to support transparent municipal reporting and executive hotspot monitoring across South Africa.
      </footer>
    </main>
  );
}
