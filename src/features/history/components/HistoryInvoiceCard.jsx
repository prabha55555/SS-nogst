/**
 * HistoryInvoiceCard – phone / tablet presentation of one invoice (the web's `.invoice-item`).
 * Products expand on demand ("View Details").
 *
 * Props: invoice (HistoryInvoice) · labels ({ party, formatInvoiceNo? }) · actions (HistoryInvoiceActions, keep it stable).
 */
import { ChevronDown, ChevronUp } from 'lucide-react';
import { memo, useState } from 'react';
import { displayInvoiceNo } from '../lib/types';
import {
  InvoiceActionButtons,
  InvoiceHistoryLinks,
  InvoiceProducts,
  InvoiceSummaryBox,
} from './InvoiceParts';

export const HistoryInvoiceCard = memo(function HistoryInvoiceCard({ invoice, labels, actions }) {
  const [showProducts, setShowProducts] = useState(false);
  const no = invoice.invoiceNo;

  return (
    <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-3.5 shadow-card sm:p-4">
      <h3 className="mb-1.5 border-l-[3px] border-brand-600 pl-2 text-base font-bold text-slate-900">
        Invoice #{displayInvoiceNo(labels, no)}
      </h3>
      <p className="text-sm text-slate-600">
        <span className="font-bold">{labels.party}: </span>
        {invoice.partyName}
      </p>

      <InvoiceSummaryBox invoice={invoice} />

      <button
        type="button"
        aria-expanded={showProducts}
        onClick={() => setShowProducts((v) => !v)}
        className="mb-1 flex min-h-11 w-full items-center justify-between rounded-lg px-2 text-sm font-semibold text-brand-700 hover:bg-slate-50"
      >
        View Details
        {showProducts ? (
          <ChevronUp className="size-4" aria-hidden />
        ) : (
          <ChevronDown className="size-4" aria-hidden />
        )}
      </button>
      {showProducts ? <InvoiceProducts invoice={invoice} /> : null}

      <InvoiceHistoryLinks
        invoice={invoice}
        onViewPayments={() => actions.viewPayments(no)}
        onViewReturns={() => actions.viewReturns(no)}
      />
      <div className="mt-auto">
        <InvoiceActionButtons invoice={invoice} actions={actions} compact />
      </div>
    </article>
  );
});
