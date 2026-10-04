/**
 * HistoryFilterBar – the history filters of the original page: free-text search (party name / invoice number),
 * invoice-number range, date range, plus "Search" and "Clear Filters". Nothing is applied until Search / Enter.
 * Desktop: two rows. Tablet: stacked. Phone: search row, the ranges fold behind "More filters".
 *
 * Props:
 *   value     HistoryFilters { search, fromInvoiceNo, toInvoiceNo, fromDate, toDate }  (draft, owned by the controller)
 *   onChange(next)   draft changed
 *   onSearch()       apply the draft (Search button / Enter)
 *   onClear()        reset everything
 *   labels    { party } – "Search customer name or invoice no"
 */
import { Search as SearchIcon, SlidersHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';
import { digitsOnly } from '@/core/format';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { Button, DateField, SearchBar, TextField } from '@/ui';

export function HistoryFilterBar({ value, onChange, onSearch, onClear, labels }) {
  const { isCompact } = useBreakpoint();
  const [moreOpen, setMoreOpen] = useState(false);
  const anyRange = !!(value.fromInvoiceNo || value.toInvoiceNo || value.fromDate || value.toDate);
  // a range set from elsewhere (clicking a day heading) must be visible on phones
  useEffect(() => {
    if (anyRange) setMoreOpen(true);
  }, [anyRange]);
  const showRanges = !isCompact || moreOpen;
  const set = (patch) => onChange({ ...value, ...patch });
  const party = labels.party.toLowerCase();

  return (
    <form
      role="search"
      aria-label="Filter invoices"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch();
      }}
      className="space-y-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-card sm:p-4"
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
        <SearchBar
          value={value.search}
          onChange={(search) => set({ search })}
          placeholder={`Search ${party} name or invoice no`}
          aria-label="Search invoices"
          autoComplete="off"
        />
        {isCompact ? (
          <button
            type="button"
            aria-expanded={showRanges}
            onClick={() => setMoreOpen((v) => !v)}
            className="flex min-h-9 items-center gap-1.5 text-sm font-semibold text-brand-700"
          >
            <SlidersHorizontal className="size-4" aria-hidden />
            {showRanges ? 'Fewer filters' : 'More filters (invoice range, dates)'}
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <TextField
              className="flex-1"
              inputMode="numeric"
              placeholder="From Invoice No"
              aria-label="From invoice number"
              value={value.fromInvoiceNo}
              onChange={(v) => set({ fromInvoiceNo: digitsOnly(v) })}
            />
            <span className="text-sm text-slate-500">to</span>
            <TextField
              className="flex-1"
              inputMode="numeric"
              placeholder="To Invoice No"
              aria-label="To invoice number"
              value={value.toInvoiceNo}
              onChange={(v) => set({ toInvoiceNo: digitsOnly(v) })}
            />
          </div>
        )}
      </div>

      {showRanges ? (
        <div className="grid gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
          <div className="flex items-center gap-2">
            <DateField
              className="flex-1"
              aria-label="From date"
              value={value.fromDate}
              onChange={(fromDate) => set({ fromDate })}
            />
            <span className="text-sm text-slate-500">to</span>
            <DateField
              className="flex-1"
              aria-label="To date"
              value={value.toDate}
              onChange={(toDate) => set({ toDate })}
            />
          </div>
          {isCompact ? (
            <div className="flex items-center gap-2">
              <TextField
                className="flex-1"
                inputMode="numeric"
                placeholder="From Invoice No"
                aria-label="From invoice number"
                value={value.fromInvoiceNo}
                onChange={(v) => set({ fromInvoiceNo: digitsOnly(v) })}
              />
              <span className="text-sm text-slate-500">to</span>
              <TextField
                className="flex-1"
                inputMode="numeric"
                placeholder="To Invoice No"
                aria-label="To invoice number"
                value={value.toInvoiceNo}
                onChange={(v) => set({ toInvoiceNo: digitsOnly(v) })}
              />
            </div>
          ) : (
            <Buttons onClear={onClear} />
          )}
        </div>
      ) : null}

      {isCompact ? <Buttons onClear={onClear} /> : null}
    </form>
  );
}

function Buttons({ onClear }) {
  return (
    <div className="flex gap-2 lg:justify-end">
      <Button type="submit" icon={SearchIcon} className="flex-1 lg:flex-none">
        Search
      </Button>
      <Button variant="secondary" onClick={onClear} className="flex-1 lg:flex-none">
        Clear Filters
      </Button>
    </div>
  );
}
