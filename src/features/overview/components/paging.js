import { useEffect, useState } from 'react';
export const PAGE_SIZE = 100;
/** First `limit` rows plus how many were left out. Pure so it can be tested. */
export function pageSlice(rows, limit) {
  if (rows.length <= limit) return { rows, remaining: 0 };
  return { rows: rows.slice(0, limit), remaining: rows.length - limit };
}
/**
 * Renders long lists in pages of {@link PAGE_SIZE}: the table / card grids are plain (non-virtualised) views, so a
 * year of invoices must not be mounted at once. Totals are always computed from the full list by the caller.
 * `resetKey` (e.g. the search terms) starts again from the first page.
 */
export function usePagedRows(rows, resetKey) {
  const [limit, setLimit] = useState(PAGE_SIZE);
  useEffect(() => setLimit(PAGE_SIZE), [resetKey]);
  const page = pageSlice(rows, limit);
  return { rows: page.rows, remaining: page.remaining, showMore: () => setLimit((l) => l + PAGE_SIZE) };
}
