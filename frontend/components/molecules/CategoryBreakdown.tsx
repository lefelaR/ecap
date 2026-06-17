import { CATEGORY_LABELS } from '@/lib/labels';

interface CategoryBreakdownProps {
  byCategory: Record<string, number>;
}

export function CategoryBreakdown({ byCategory }: CategoryBreakdownProps) {
  return (
    <div className="col-md-6">
      <div className="card shadow-sm h-100">
        <div className="card-body">
          <h2 className="h5">By category</h2>
          <ul className="list-group list-group-flush">
            {Object.entries(byCategory).map(([key, count]) => (
              <li key={key} className="list-group-item d-flex justify-content-between px-0">
                <span>{CATEGORY_LABELS[key as keyof typeof CATEGORY_LABELS] ?? key}</span>
                <strong>{count}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
