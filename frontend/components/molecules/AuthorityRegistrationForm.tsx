import type { FormEvent } from 'react';
import type { AuthorityType } from '../../lib/types';

interface AuthorityRegistrationFormProps {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const AUTHORITY_TYPES: AuthorityType[] = ['SAPS', 'JMPD', 'Councillor', 'Urban inspector'];

export function AuthorityRegistrationForm({ onSubmit }: AuthorityRegistrationFormProps) {
  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <h2 className="h5 mb-4">Register authority</h2>
        <form className="row g-3" onSubmit={onSubmit}>
          <div className="col-md-6">
            <label className="form-label" htmlFor="name">
              Full name
            </label>
            <input id="name" name="name" className="form-control" required />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input id="email" name="email" type="email" className="form-control" required />
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="authority-type">
              Authority type
            </label>
            <select id="authority-type" name="type" className="form-select" defaultValue="Councillor">
              {AUTHORITY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="authority-area">
              Assigned ward
            </label>
            <input id="authority-area" name="ward" className="form-control" placeholder="e.g. Ward 15 or All" defaultValue="Ward 15" />
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="municipality">
              Municipality
            </label>
            <input id="municipality" name="municipality" className="form-control" defaultValue="City of Johannesburg" />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-success">
              Register authority
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
