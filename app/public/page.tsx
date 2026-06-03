import Link from 'next/link';

export default function PublicPage() {
  return (
    <main className="container">
      <header className="header">
        <p className="badge">Public User</p>
        <h1>Report Service Delivery or Crime</h1>
        <p>Submit a report anonymously or with your details. Choose manual location entry or current GPS location.</p>
      </header>

      <section className="card">
        <h2>Submit a New Report</h2>
        <form className="grid" style={{ gap: '1rem' }}>
          <div className="field">
            <label className="label" htmlFor="type">Incident type</label>
            <select id="type" className="select" defaultValue="service">
              <option value="service">Service delivery issue</option>
              <option value="crime">Crime incident</option>
            </select>
          </div>

          <div className="field">
            <label className="label" htmlFor="location">Location</label>
            <input id="location" className="input" placeholder="Enter address or landmark" />
          </div>

          <div className="field">
            <label className="label" htmlFor="anonymous">Report type</label>
            <select id="anonymous" className="select" defaultValue="false">
              <option value="false">Public report</option>
              <option value="true">Anonymous crime report</option>
            </select>
          </div>

          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label className="label" htmlFor="description">Description</label>
            <textarea id="description" className="textarea" placeholder="Describe the incident in detail." />
          </div>

          <button type="button" className="button" style={{ gridColumn: '1 / -1' }}>
            Submit report
          </button>
        </form>
      </section>

      <section className="grid grid-2" style={{ marginTop: '1.5rem' }}>
        <article className="card">
          <h3>Anonymous Crime Reporting</h3>
          <p>Your identity is protected from public view and only visible to authorized investigators.</p>
        </article>

        <article className="card">
          <h3>Coverage for All Municipalities</h3>
          <p>Designed for both urban and rural municipalities across South Africa.</p>
        </article>
      </section>

      <div style={{ marginTop: '1.5rem' }}>
        <Link href="/" className="button secondary">
          Back to ECAP home
        </Link>
      </div>
    </main>
  );
}
