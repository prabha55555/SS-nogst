/**
 * HistoryDateGroupList – the date-grouped invoice list: one heading per day (with the day's invoice count)
 * followed by that day's invoices (table on desktop, cards on phone/tablet – see HistoryInvoiceGroupBody).
 * Days are rendered progressively (first `pageDays`, then more as the user scrolls / presses "Show more days")
 * so thousands of invoices stay light.
 *
 * Props:
 *   groups       DateGroup[]  (from lib/grouping: { key, date, invoices, totalInvoices })
 *   labels       { party, formatInvoiceNo? }
 *   actions      HistoryInvoiceActions (referentially stable)
 *   loading      bool         -> skeleton cards
 *   error        string|null  -> error state with retry
 *   onRetry()    retry after an error
 *   onFilterDate(day)  click on a day heading: show only that day (headings of undated groups are inert)
 *   pageDays     number of days rendered per step (default 8)
 *   emptyTitle   text of the empty state (default "No invoices found.")
 */
import { Calendar } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button, EmptyState, ErrorState } from '@/ui';
import { HistoryInvoiceGroupBody } from './HistoryInvoiceTable';
import { InvoiceListSkeleton } from './Skeleton';

function DateHeading({ group, onClick }) {
  const count = `${group.totalInvoices} Invoice${group.totalInvoices > 1 ? 's' : ''}`;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!group.key}
      aria-label={`${group.date}, ${count}. Show only this day`}
      className="flex min-h-12 w-full items-center justify-between gap-3 bg-slate-600 px-4 text-white transition focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none focus-visible:ring-inset enabled:hover:bg-slate-700"
    >
      <span className="flex items-center gap-2 text-base font-bold sm:text-lg">
        <Calendar className="size-[18px]" aria-hidden />
        {group.date}
      </span>
      <span className="text-sm font-semibold">{count}</span>
    </button>
  );
}

export function HistoryDateGroupList({
  groups,
  labels,
  actions,
  loading,
  error,
  onRetry,
  onFilterDate,
  pageDays = 8,
  emptyTitle = 'No invoices found.',
}) {
  const [shownDays, setShownDays] = useState(pageDays);
  const sentinel = useRef(null);
  const more = groups.length > shownDays;

  // infinite scroll: reveal the next days when the sentinel nears the viewport
  useEffect(() => {
    const node = sentinel.current;
    if (!more || !node || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setShownDays((n) => n + pageDays);
      },
      { rootMargin: '400px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [more, pageDays, shownDays]);

  if (loading) return <InvoiceListSkeleton />;
  if (error) {
    return (
      <ErrorState
        message="Error loading invoices. Please try again."
        onRetry={onRetry}
        className="rounded-xl bg-white shadow-card"
      />
    );
  }
  if (groups.length === 0) {
    return (
      <EmptyState title={emptyTitle} className="rounded-xl border border-slate-200 bg-white shadow-card" />
    );
  }

  return (
    <div className="space-y-4">
      {groups.slice(0, shownDays).map((group) => (
        <section
          key={group.key || 'no-date'}
          aria-label={group.date}
          className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card"
        >
          <DateHeading group={group} onClick={() => onFilterDate(group.key)} />
          <div className="p-2.5 sm:p-3 lg:p-1.5">
            <HistoryInvoiceGroupBody invoices={group.invoices} labels={labels} actions={actions} />
          </div>
        </section>
      ))}
      {more ? (
        <div ref={sentinel} className="flex justify-center py-2">
          <Button variant="outline" onClick={() => setShownDays((n) => n + pageDays)}>
            Show more days ({groups.length - shownDays} left)
          </Button>
        </div>
      ) : null}
    </div>
  );
}
