/**
 * PaymentHistorySheet – viewPaymentHistory(): every payment record of one invoice with undo per payment
 * and "Undo All Payments".
 *
 * Props:
 *   open (bool) · invoiceNo · partyName · balanceDue (number) · payments (HistoryPayment[]) · onClose()
 *   title?              default `Payment History - Invoice #<no>`
 *   onUndo(paymentId)   undo one payment (the caller confirms)
 *   onUndoAll()         undo all payments (the caller confirms)
 *   onAddPayment?()     "Add Payment" footer button – only pass it when the invoice may take another payment
 */
import { Plus, Undo2 } from 'lucide-react';
import { useMemo } from 'react';
import { formatCurrency, formatDateIN } from '@/core/format';
import { Button, EmptyState } from '@/ui';
import { sumPaymentAmounts } from '../lib/lookups';
import { paymentMethodLabel, sortPaymentsByDate } from '../lib/payments';
import { HistorySheet } from './HistorySheet';

export function PaymentHistorySheet({
  open,
  invoiceNo,
  partyName,
  balanceDue,
  payments,
  title,
  onClose,
  onUndo,
  onUndoAll,
  onAddPayment,
}) {
  const sorted = useMemo(() => sortPaymentsByDate(payments), [payments]);
  return (
    <HistorySheet
      open={open}
      onClose={onClose}
      title={title ?? `Payment History - Invoice #${invoiceNo}`}
      actions={
        <>
          {onAddPayment ? (
            <Button variant="success" icon={Plus} onClick={onAddPayment} className="flex-1 sm:flex-none">
              Add Payment
            </Button>
          ) : null}
          {payments.length > 0 ? (
            <Button variant="danger" icon={Undo2} onClick={onUndoAll} className="flex-1 sm:flex-none">
              Undo All Payments
            </Button>
          ) : null}
        </>
      }
    >
      <div className="mb-4 rounded-xl bg-sky-50 p-3">
        <p className="text-base font-bold text-slate-900">{partyName}</p>
        <p className="text-sm text-slate-500">Total Payments: {payments.length}</p>
        <p className="text-sm text-slate-500">Current Balance Due: ₹{formatCurrency(balanceDue)}</p>
      </div>

      {payments.length === 0 ? (
        <EmptyState title="No payment records found for this invoice." />
      ) : (
        <ul className="space-y-3">
          {sorted.map((payment, index) => {
            const id = payment.id || `payment_${index}`;
            return (
              <li
                key={`${id}-${index}`}
                className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm"
              >
                <div className="mb-2 flex justify-between gap-2 border-b border-dashed border-slate-300 pb-2">
                  <span className="font-bold text-brand-700">Payment #{index + 1}</span>
                  <span className="text-slate-500">{formatDateIN(payment.paymentDate)}</span>
                </div>
                <p>
                  <span className="font-bold">Amount: </span>₹{formatCurrency(payment.amount)}
                </p>
                <p>
                  <span className="font-bold">Method: </span>
                  {paymentMethodLabel(payment, 'CASH')}
                </p>
                <p>
                  <span className="font-bold">Type: </span>
                  {payment.paymentType === 'initial' ? 'Initial Payment' : 'Additional Payment'}
                </p>
                {payment.note ? (
                  <p>
                    <span className="font-bold">Notes: </span>
                    {payment.note}
                  </p>
                ) : null}
                <p className="break-all">
                  <span className="font-bold">Payment ID: </span>
                  {id}
                </p>
                <div className="mt-2 flex justify-end">
                  <Button variant="warning" size="sm" icon={Undo2} onClick={() => onUndo(id)}>
                    Undo This Payment
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {payments.length > 0 ? (
        <p className="mt-3 border-t-2 border-brand-600 pt-2 text-right text-lg font-bold text-brand-700 tabular-nums">
          Total Amount Paid: ₹{formatCurrency(sumPaymentAmounts(payments))}
        </p>
      ) : null}
    </HistorySheet>
  );
}
