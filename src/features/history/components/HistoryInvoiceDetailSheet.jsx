/**
 * HistoryInvoiceDetailSheet – full detail of one invoice (summary, products, history links, every action).
 * Opened by clicking a table row on desktop.
 *
 * Props: invoice (HistoryInvoice | null; null = closed) · labels ({ party, formatInvoiceNo? }) ·
 *        actions (HistoryInvoiceActions) · onClose().
 * The page should pass actions that close the sheet first (a stacked dialog would hide toasts / confirms).
 */
import { displayInvoiceNo } from '../lib/types';
import { HistorySheet } from './HistorySheet';
import {
  InvoiceActionButtons,
  InvoiceHistoryLinks,
  InvoiceProducts,
  InvoiceSummaryBox,
} from './InvoiceParts';

export function HistoryInvoiceDetailSheet({ invoice, labels, actions, onClose }) {
  return (
    <HistorySheet
      open={!!invoice}
      onClose={onClose}
      title={invoice ? `Invoice #${displayInvoiceNo(labels, invoice.invoiceNo)}` : ''}
      size="lg"
    >
      {invoice ? (
        <>
          <p className="text-sm text-slate-600">
            <span className="font-bold">{labels.party}: </span>
            {invoice.partyName}
          </p>
          <InvoiceSummaryBox invoice={invoice} />
          <h3 className="mb-1 text-sm font-bold text-slate-800">Products</h3>
          <InvoiceProducts invoice={invoice} />
          <InvoiceHistoryLinks
            invoice={invoice}
            onViewPayments={() => actions.viewPayments(invoice.invoiceNo)}
            onViewReturns={() => actions.viewReturns(invoice.invoiceNo)}
          />
          <InvoiceActionButtons invoice={invoice} actions={actions} />
        </>
      ) : null}
    </HistorySheet>
  );
}
