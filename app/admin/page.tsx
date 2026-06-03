import Link from 'next/link';

const admins = [
  { id: 'A-001', role: 'Application Admin', rights: 'Full system access' },
  { id: 'A-002', role: 'SAPS Officer', rights: 'Access anonymous crime reports' },
  { id: 'A-003', role: 'Municipal Councillor', rights: 'Ward-limited service reports' },
];

export default function AdminPage() {
  return (
    <main className="container py-5">
      <section className="page-banner">
        <span className="badge rounded-pill bg-success">Application Admin</span>
        <h1 className="display-6 fw-bold mt-3">Admin Control Panel</h1>
        <p className="lead">Register authorities, assign area-limited rights, and ensure no data is deleted from the platform.</p>
      </section>

      <section className="card shadow-sm mt-4">
        <div className="card-body">
          <h2 className="h5 mb-4">Authority Registration</h2>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label" htmlFor="authority-type">Authority type</label>
              <select id="authority-type" className="form-select">
                <option>SAPS</option>
                <option>JMPD</option>
                <option>Councillor</option>
                <option>Urban inspector</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="authority-area">Assigned area / ward</label>
              <input id="authority-area" className="form-control" placeholder="e.g. Ward 15" />
            </div>
            <div className="col-12">
              <button type="button" className="btn btn-success">
                Register Authority
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="row row-cols-1 row-cols-md-3 g-4 mt-4">
        {admins.map((admin) => (
          <div key={admin.id} className="col">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h3 className="h6">{admin.role}</h3>
                <p className="card-text">{admin.rights}</p>
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
