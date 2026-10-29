export const DEFAULT_TABLE_PAGE_SIZE = 10;

export function filterTableRows<T>(
  rows: T[],
  query: string,
  getSearchableText: (row: T) => string,
): T[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return rows;

  return rows.filter((row) => getSearchableText(row).toLowerCase().includes(normalized));
}

export function paginateTableRows<T>(rows: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return rows.slice(start, start + pageSize);
}

export function getTablePageCount(totalRows: number, pageSize: number): number {
  return Math.max(1, Math.ceil(totalRows / pageSize));
}

export function getTablePageRange(page: number, pageSize: number, totalRows: number): { start: number; end: number } {
  if (totalRows === 0) {
    return { start: 0, end: 0 };
  }

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalRows);
  return { start, end };
}
