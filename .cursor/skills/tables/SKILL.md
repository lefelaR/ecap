---
name: tables
description: >-
  Requires pagination and a search field on every ECAP data table. Use when
  creating or updating tables, list views, data grids, or tabular UI in the
  frontend.
---

# Tables

## Rule

All tables should have pagination and and a search field.

Every `<table>` or tabular data view in ECAP must include:

1. **Search field** — filters rows client-side across visible columns
2. **Pagination** — splits results into pages (default 10 rows per page)

## Implementation

Reuse the shared table kit; do not build one-off pagination or search per screen.

| Piece | Location | Role |
|-------|----------|------|
| Utilities | `frontend/lib/table-pagination.ts` | Filter, paginate, page count |
| Search input | `frontend/components/atoms/TableSearch.tsx` | Search field atom |
| Page controls | `frontend/components/atoms/TablePagination.tsx` | Previous / next + range summary |
| Wrapper | `frontend/components/molecules/PaginatedDataTable.tsx` | Search + pagination shell around table body |

### Adding pagination to a table

1. Keep the table molecule **presentational** — it receives only the current page of rows.
2. Wrap it in `PaginatedDataTable` in the organism that owns the data.
3. Pass `getSearchableText` covering every column users would search (reference, summary, ward, labels, etc.).
4. Put existing filters (status, ward) in `toolbarExtra` beside the search field.

```tsx
<PaginatedDataTable
  rows={items}
  getSearchableText={(item) => `${item.ref} ${item.name}`}
  searchId="unique-search-id"
  searchPlaceholder="Search…"
  toolbarExtra={<StatusFilter />}
>
  {(paginatedItems) => <MyTable rows={paginatedItems} />}
</PaginatedDataTable>
```

### Defaults

- Page size: `DEFAULT_TABLE_PAGE_SIZE` (10) from `lib/table-pagination.ts`
- Search: case-insensitive substring match across `getSearchableText`
- Reset to page 1 when search query or source rows change
- Empty search results: show a secondary alert, not an empty table

### New tables checklist

- [ ] Search field above the table
- [ ] Pagination below the table
- [ ] `getSearchableText` covers all searchable columns
- [ ] Unique `searchId` for accessibility
- [ ] Table molecule stays free of pagination logic

## Anti-patterns

- ❌ Rendering all rows with no pagination
- ❌ Duplicating search/pagination markup per page
- ❌ Putting fetch or filter state inside the table molecule
- ❌ Server-only tables without client search when data is already loaded
