import Link from 'next/link';

const admins = [
  { id: 'A-001', role: 'Application Admin', rights: 'Full system access' },
  { id: 'A-002', role: 'SAPS Officer', rights: 'Access anonymous crime reports' },
  { id: 'A-003', role: 'Municipal Councillor', rights: 'Ward-limited service reports' },
];

export default function AdminPage() {
  return (
    <main className="container">
      <header className="header">
        <p className="badge">Application Admin</p>
        <h1>Admin Control Panel</h1>
        <p>Register authorities, assign area-limited rights, and ensure no data is deleted from the platform.</p>
      </header>

      <section className="card">
        <h2>Authority Registration</h2>
        <div className="field">
          <label className="label" htmlFor="authority-type">Authority type</label>
          <select id="authority-type" className="select">
            <option>SAPS</option>
            <option>JMPD</option>
            <option>Councillor</option>
            <option>Urban inspector</option>
          </select>
        </div>
        <div className="field">
          <label className="label" htmlFor="authority-area">Assigned area / ward</label>
          <input id="authority-area" className="input" placeholder="e.g. Ward 15" />
        </div>
        <button type="button" className="button" style={{ marginTop: '1rem' }}>
          Register Authority
        </button>
      </section>

      <section className="card" style={{ marginTop: '1.5rem' }}>
        <h2>Registered Authorities</h2>
        <div className="grid">
          {admins.map((admin) => (
            <article key={admin.id} className="card">
              <h3>{admin.role}</h3>
              <p>{admin.rights}</p>
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
