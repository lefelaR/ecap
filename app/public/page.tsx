import Link from 'next/link';

export default function PublicPage() {
  return (
    <main className="container py-5">
      <section className="page-banner">
        <span className="badge rounded-pill bg-secondary text-white">Public User</span>
        <h1 className="display-6 fw-bold mt-3">Report Service Delivery or Crime</h1>
        <p className="lead">Submit a report anonymously or with your details. Choose manual location entry or current GPS location.</p>
      </section>

      <section className="card shadow-sm mt-4">
        <div className="card-body">
          <h2 className="h5 mb-4">Submit a New Report</h2>
          <form className="row g-3">
            <div className="col-md-6">
              <label className="form-label" htmlFor="type">Incident type</label>
              <select id="type" className="form-select" defaultValue="service">
                <option value="service">Service delivery issue</option>
                <option value="crime">Crime incident</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label" htmlFor="anonymous">Report type</label>
              <select id="anonymous" className="form-select" defaultValue="false">
                <option value="false">Public report</option>
                <option value="true">Anonymous crime report</option>
              </select>
            </div>

            <div className="col-12">
              <label className="form-label" htmlFor="location">Location</label>
              <input id="location" className="form-control" placeholder="Enter address or landmark" />
            </div>

            <div className="col-12">
              <label className="form-label" htmlFor="description">Description</label>
              <textarea id="description" className="form-control" rows={5} placeholder="Describe the incident in detail." />
            </div>

            <div className="col-12">
              <button type="button" className="btn btn-primary">
                Submit report
              </button>
            </div>
          </form>
        </div>
      </section>

      <div className="row row-cols-1 row-cols-md-2 g-4 mt-4">
        <article className="col">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h3 className="h6">Anonymous Crime Reporting</h3>
              <p className="card-text">Your identity is protected from public view and only visible to authorized investigators.</p>
            </div>
          </div>
        </article>

        <article className="col">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h3 className="h6">Coverage for All Municipalities</h3>
              <p className="card-text">Designed for both urban and rural municipalities across South Africa.</p>
            </div>
          </div>
        </article>
      </div>

      <div className="mt-4">
        <Link href="/" className="btn btn-outline-secondary">
          Back to ECAP home
        </Link>
      </div>
    </main>
  );
}
