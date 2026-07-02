import type { ReportType } from '@/lib/types';

interface ReportTypeToggleProps {
  value: ReportType;
  onChange: (type: ReportType) => void;
}

export function ReportTypeToggle({ value, onChange }: ReportTypeToggleProps) {
  return (
    <div className="btn-group w-100" role="group">
      <button
        type="button"
        className={`btn ${value === 'service' ? 'btn-primary' : 'btn-outline-primary'}`}
        onClick={() => onChange('service')}
      >
        Service delivery
      </button>
      <button
        type="button"
        className={`btn ${value === 'crime' ? 'btn-primary' : 'btn-outline-primary'}`}
        onClick={() => onChange('crime')}
      >
        Crime / safety
      </button>
    </div>
  );
}
