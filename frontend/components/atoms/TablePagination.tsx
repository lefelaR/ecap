import { getTablePageRange } from '@/lib/table-pagination';

interface TablePaginationProps {
  page: number;
  pageCount: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function TablePagination({
  page,
  pageCount,
  totalItems,
  pageSize,
  onPageChange,
  className = '',
}: TablePaginationProps) {
  const { start, end } = getTablePageRange(page, pageSize, totalItems);
  const canGoBack = page > 1;
  const canGoForward = page < pageCount;

  return (
    <nav
      className={`table-pagination d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 ${className}`.trim()}
      aria-label="Table pagination"
    >
      <p className="table-pagination__summary text-muted small mb-0">
        {totalItems === 0 ? 'No results' : `Showing ${start}–${end} of ${totalItems}`}
      </p>

      <div className="d-flex align-items-center gap-2">
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => onPageChange(page - 1)}
          disabled={!canGoBack}
          aria-label="Previous page"
        >
          Previous
        </button>
        <span className="text-muted small text-nowrap">
          Page {page} of {pageCount}
        </span>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => onPageChange(page + 1)}
          disabled={!canGoForward}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </nav>
  );
}
