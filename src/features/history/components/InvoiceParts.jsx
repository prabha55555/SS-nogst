/**
 * Building blocks shared by the invoice card and the invoice detail sheet.
 *
 * InvoiceSummaryBox({ invoice })                       – bill, previous balance, discount, total, paid split, returns, balance.
 * InvoiceProducts({ invoice })                         – Product / Qty / Rate list ("View Details").
 * InvoiceHistoryLinks({ invoice, onViewPayments, onViewReturns })
 *                                                      – "Payment History (₹x)" / "Return History (₹x)" rows.
 * InvoiceActionButtons({ invoice, actions, compact })  – wrapped button grid (see HistoryInvoiceActions in ./types.js);
 *                                                        `compact` (phone/tablet card) folds the rare actions behind "More actions".
 *
 * `invoice` is a HistoryInvoice view model, so the same parts serve sales and purchase.
 */
import {
  Banknote,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Download,
  FileText,
  MessageCircle,
  Printer,
  RotateCcw,
  Share2,
  SquarePen,
  Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { formatCurrency } from '@/core/format';
import { Button, cn } from '@/ui';
import { additionalPaymentsLabel, splitPayments } from '../lib/payments';

const rs = (amount) => `₹${formatCurrency(amount)}`;

function Line({ label, value, valueClassName, bold, className }) {
  return (
    <div className={cn('flex items-baseline justify-between gap-3 text-sm', className)}>
      <span className={cn('text-slate-600', bold && 'font-semibold text-slate-800')}>{label}</span>
      <span
        className={cn(
          'font-semibold text-slate-800 tabular-nums',
          bold && 'text-base font-bold',
          valueClassName,
        )}
      >
        {value}
      </span>
    </div>
  );
}

export function InvoiceSummaryBox({ invoice }) {
  const { payments } = invoice;
  const split = useMemo(() => splitPayments(payments), [payments]);
  const additional = additionalPaymentsLabel(split.additional);
  const hasReturns = invoice.totalReturns > 0;

  return (
    <div className="my-3 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <Line
        label="Current Bill Amount:"
        value={rs(invoice.subtotal)}
        className="border-b border-slate-200 pb-2"
      />
      <Line label="Previous Balance:" value={rs(invoice.previousBalance)} valueClassName="text-red-600" />
      {invoice.discountAmount ? (
        <Line
          label="Discount Amount:"
          value={`-${rs(invoice.discountAmount)}`}
          valueClassName="text-emerald-600"
        />
      ) : null}
      <Line
        label="Total Amount:"
        value={rs(invoice.grandTotal)}
        bold
        className="border-b border-dashed border-slate-300 pb-2"
      />

      <div className="space-y-1.5 rounded-lg border border-emerald-200 bg-emerald-50 p-2.5 text-xs text-emerald-800 sm:text-sm">
        <div className="flex justify-between gap-3">
          <span>Initial Amount Paid:</span>
          <span className="font-semibold tabular-nums">
            {split.initial.length > 0 ? rs(split.initialTotal) : '-'}
          </span>
        </div>
        <div className="flex justify-between gap-3">
          <span>Additional Amount Paid:</span>
          <span className="text-right font-semibold tabular-nums">{additional || '-'}</span>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-emerald-300 pt-1.5 font-semibold text-emerald-900">
          <span>Total Amount Paid:</span>
          <span className="flex items-center gap-1.5 font-bold tabular-nums">
            {rs(invoice.amountPaid)}
            {invoice.legacyPaymentMethod && payments.length === 0 ? (
              <span className="rounded bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {invoice.legacyPaymentMethod.toUpperCase()}
              </span>
            ) : null}
          </span>
        </div>
      </div>

      {hasReturns ? (
        <Line
          label="Return Amount:"
          value={`-${rs(invoice.totalReturns)}`}
          valueClassName="text-emerald-600"
        />
      ) : null}
      <div className="flex items-baseline justify-between gap-3 border-t-2 border-slate-200 pt-2 font-bold text-red-600">
        <span>{hasReturns ? 'Current Adjusted Balance Due:' : 'Balance Due:'}</span>
        <span className="text-lg tabular-nums">
          {rs(hasReturns ? invoice.adjustedBalanceDue : invoice.balanceDue)}
        </span>
      </div>
    </div>
  );
}

export function InvoiceProducts({ invoice }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 text-sm">
      <div className="flex gap-2 bg-slate-50 px-2.5 py-1.5 font-semibold text-slate-500">
        <span className="flex-1">Product</span>
        <span className="w-16 text-right">Qty</span>
        <span className="w-20 text-right">Rate</span>
      </div>
      {invoice.products.length > 0 ? (
        invoice.products.map((p, i) => (
          <div key={`${i}-${p.description}`} className="flex gap-2 border-t border-slate-100 px-2.5 py-1.5">
            <span className="min-w-0 flex-1 break-words">{p.description}</span>
            <span className="w-16 text-right tabular-nums">{p.qty}</span>
            <span className="w-20 text-right tabular-nums">{rs(p.rate)}</span>
          </div>
        ))
      ) : (
        <p className="p-2 text-center text-slate-500">No products found</p>
      )}
    </div>
  );
}

function HistoryLink({ label, tone, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        'flex min-h-11 w-full items-center justify-between gap-2 rounded-lg px-2 text-left text-sm font-semibold hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-brand-200 focus-visible:outline-none',
        tone,
      )}
    >
      <span>{label}</span>
      <ChevronRight className="size-4 shrink-0" aria-hidden />
    </button>
  );
}

export function InvoiceHistoryLinks({ invoice, onViewPayments, onViewReturns }) {
  if (!(invoice.amountPaid > 0 || invoice.totalReturns > 0)) return null;
  return (
    <div className="mt-1 space-y-0.5">
      {invoice.amountPaid > 0 ? (
        <HistoryLink
          label={`Payment History (${rs(invoice.amountPaid)})`}
          tone="text-emerald-700"
          onClick={onViewPayments}
        />
      ) : null}
      {invoice.totalReturns > 0 ? (
        <HistoryLink
          label={`Return History (${rs(invoice.totalReturns)})`}
          tone="text-red-600"
          onClick={onViewReturns}
        />
      ) : null}
    </div>
  );
}

export function InvoiceActionButtons({ invoice, actions, compact = false }) {
  const [moreOpen, setMoreOpen] = useState(false);
  const no = invoice.invoiceNo;
  const cell = 'grow basis-[46%]';
  const extras = (
    <>
      {actions.whatsAppMessage ? (
        <Button
          variant="outline"
          icon={MessageCircle}
          className={cell}
          onClick={() => actions.whatsAppMessage(no)}
        >
          WhatsApp Message
        </Button>
      ) : null}
      {actions.printInvoice ? (
        <Button variant="outline" icon={Printer} className={cell} onClick={() => actions.printInvoice(no)}>
          Print Invoice
        </Button>
      ) : null}
      {actions.shareInvoicePdf ? (
        <Button
          variant="outline"
          icon={FileText}
          className={cell}
          onClick={() => actions.shareInvoicePdf(no)}
        >
          Share Invoice PDF
        </Button>
      ) : null}
    </>
  );
  const hasExtras = !!(actions.whatsAppMessage || actions.printInvoice || actions.shareInvoicePdf);

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <Button variant="info" icon={SquarePen} className={cell} onClick={() => actions.edit(no)}>
        Edit
      </Button>
      {invoice.canAddPayment ? (
        <Button variant="success" icon={Banknote} className={cell} onClick={() => actions.addPayment(no)}>
          Add Payment
        </Button>
      ) : null}
      <Button variant="warning" icon={RotateCcw} className={cell} onClick={() => actions.addReturn(no)}>
        Add Return
      </Button>
      <Button
        icon={Download}
        className={cell}
        aria-label="Download Statement"
        onClick={() => actions.downloadStatement(no)}
      >
        {compact ? 'Statement' : 'Download Statement'}
      </Button>
      <Button
        variant="whatsapp"
        icon={Share2}
        className={cell}
        aria-label="Share Statement"
        onClick={() => actions.shareStatement(no)}
      >
        {compact ? 'Share' : 'Share Statement'}
      </Button>
      <Button variant="danger" icon={Trash2} className={cell} onClick={() => actions.remove(no)}>
        Delete
      </Button>
      {compact && hasExtras ? (
        <>
          <button
            type="button"
            aria-expanded={moreOpen}
            onClick={() => setMoreOpen((v) => !v)}
            className="flex min-h-10 w-full items-center justify-center gap-1 text-sm font-semibold text-brand-700"
          >
            {moreOpen ? 'Fewer actions' : 'More actions'}
            {moreOpen ? (
              <ChevronUp className="size-4" aria-hidden />
            ) : (
              <ChevronDown className="size-4" aria-hidden />
            )}
          </button>
          {moreOpen ? extras : null}
        </>
      ) : null}
      {!compact ? extras : null}
    </div>
  );
}
