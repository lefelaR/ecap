'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  DEFAULT_TABLE_PAGE_SIZE,
  filterTableRows,
  getTablePageCount,
  paginateTableRows,
} from '@/lib/table-pagination';
import { TablePagination } from '@/components/atoms/TablePagination';
import { TableSearch } from '@/components/atoms/TableSearch';
import { AlertMessage } from '@/components/atoms/AlertMessage';

interface PaginatedDataTableProps<T> {
  rows: T[];
  getSearchableText: (row: T) => string;
  searchId: string;
  searchPlaceholder?: string;
  pageSize?: number;
  toolbarExtra?: ReactNode;
  noResultsMessage?: string;
  children: (paginatedRows: T[]) => ReactNode;
}

export function PaginatedDataTable<T>({
  rows,
  getSearchableText,
  searchId,
  searchPlaceholder = 'Search…',
  pageSize = DEFAULT_TABLE_PAGE_SIZE,
  toolbarExtra,
  noResultsMessage = 'No results match your search.',
  children,
}: PaginatedDataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filteredRows = useMemo(
    () => filterTableRows(rows, search, getSearchableText),
    [rows, search, getSearchableText],
  );

  const pageCount = getTablePageCount(filteredRows.length, pageSize);
  const currentPage = Math.min(page, pageCount);

  const paginatedRows = useMemo(
    () => paginateTableRows(filteredRows, currentPage, pageSize),
    [filteredRows, currentPage, pageSize],
  );

  useEffect(() => {
    setPage(1);
  }, [search, rows]);

  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount);
    }
  }, [page, pageCount]);

  return (
    <>
      <div className="table-toolbar d-flex flex-column flex-md-row gap-3 mb-3">
        <TableSearch
          id={searchId}
          value={search}
          onChange={setSearch}
          placeholder={searchPlaceholder}
          className="table-toolbar__search"
        />
        {toolbarExtra}
      </div>

      {filteredRows.length === 0 ? (
        <AlertMessage message={noResultsMessage} variant="secondary" />
      ) : (
        <>
          {children(paginatedRows)}
          <TablePagination
            className="mt-3"
            page={currentPage}
            pageCount={pageCount}
            totalItems={filteredRows.length}
            pageSize={pageSize}
            onPageChange={setPage}
          />
        </>
      )}
    </>
  );
}
