interface DemoAccountButtonProps {
  label: string;
  description: string;
  loading: boolean;
  onSignIn: () => void;
}

export function DemoAccountButton({ label, description, loading, onSignIn }: DemoAccountButtonProps) {
  return (
    <div className="col-12">
      <button type="button" className="card shadow-sm w-100 text-start" onClick={onSignIn} disabled={loading}>
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <h2 className="h6 mb-1">{label}</h2>
            <p className="text-muted small mb-0">{description}</p>
          </div>
          <span className="btn btn-sm btn-primary">{loading ? 'Signing in…' : 'Sign in'}</span>
        </div>
      </button>
    </div>
  );
}
