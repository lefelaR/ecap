import type { Authority } from '../../lib/types';

interface AuthorityCardProps {
  authority: Authority;
}

export function AuthorityCard({ authority }: AuthorityCardProps) {
  return (
    <div className="col">
      <div className="card h-100 shadow-sm">
        <div className="card-body">
          <h3 className="h6">{authority.name}</h3>
          <p className="card-text small mb-1">
            <strong>{authority.type}</strong> · {authority.ward}
          </p>
          <p className="card-text small text-muted mb-0">{authority.email}</p>
          {authority.canViewAnonymousCrime && (
            <span className="badge bg-warning text-dark mt-2">Anonymous crime access</span>
          )}
        </div>
      </div>
    </div>
  );
}
