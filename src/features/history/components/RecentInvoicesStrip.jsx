/**
 * RecentInvoicesStrip – "Recent Invoices": the newest invoice numbers as a horizontal strip;
 * clicking one filters the list to it.
 *
 * Props: invoices ([{ invoiceNo, partyName, invoiceDate, subtotal }]) · loading (bool) ·
 *        labels ({ party, formatInvoiceNo? }) · onSelect(invoiceNo) · title (default "Recent Invoices").
 */
import { formatCurrency, formatDateIN } from '@/core/format';
import { displayInvoiceNo } from '../lib/types';
import { SkeletonBlock } from './Skeleton';

export function RecentInvoicesStrip({ invoices, loading, labels, onSelect, title = 'Recent Invoices' }) {
  return (
    <section
      aria-label={title}
      className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-card sm:p-4"
    >
      <h2 className="mb-2.5 text-base font-semibold text-slate-800">{title}</h2>
      {loading ? (
        <div className="flex gap-3 overflow-hidden">
          {[0, 1, 2].map((i) => (
            <SkeletonBlock key={i} className="h-[86px] w-52 shrink-0" />
          ))}
        </div>
      ) : invoices.length === 0 ? (
        <p className="py-3 text-center text-sm text-slate-500">No recent invoices found.</p>
      ) : (
        <ul className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
          {invoices.map((invoice) => (
            <li key={invoice.invoiceNo} className="shrink-0">
              <button
                type="button"
                onClick={() => onSelect(invoice.invoiceNo)}
                aria-label={`Show invoice ${invoice.invoiceNo}`}
                title={labels.party ? `${labels.party}: ${invoice.partyName}` : undefined}
                className="min-h-[86px] w-52 rounded-xl border border-brand-100 bg-brand-50 p-3 text-left transition hover:bg-brand-100 focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:outline-none"
              >
                <div className="text-base font-bold text-brand-700">
                  #{displayInvoiceNo(labels, invoice.invoiceNo)}
                </div>
                <div className="truncate text-sm text-slate-700">{invoice.partyName}</div>
                <div className="flex items-baseline justify-between gap-2 text-xs text-slate-500">
                  <span>{formatDateIN(invoice.invoiceDate)}</span>
                  <span className="text-sm font-semibold text-slate-800 tabular-nums">
                    ₹{formatCurrency(invoice.subtotal)}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
