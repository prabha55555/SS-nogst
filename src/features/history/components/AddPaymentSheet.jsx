/**
 * AddPaymentSheet – "Add Payment - Invoice #x": cash / UPI / account split + payment date (addPayment dialog).
 * Validation and save errors are shown inside the sheet.
 *
 * Props:
 *   open (bool) · invoiceNo · balanceDue? (number, shows "Current Balance Due") · onClose()
 *   title?                 default `Add Payment - Invoice #<no>`
 *   invalidAmountMessage?  shown when no amount was entered (default: the sales wording)
 *   onSubmit({ cash, upi, account, paymentDate }) => Promise<string | null>
 *                          string = inline error, null = saved (the caller closes the sheet)
 */
import { Banknote, Check, Landmark, Smartphone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatCurrency, todayISO } from '@/core/format';
import { Button, DateField, NumberField } from '@/ui';
import { parsePaymentAmounts, totalOf, validatePaymentInput } from '../lib/payments';
import { HistorySheet } from './HistorySheet';

const EMPTY = { cash: '0', upi: '0', account: '0' };

export function AddPaymentSheet({
  open,
  invoiceNo,
  balanceDue,
  title,
  invalidAmountMessage,
  onClose,
  onSubmit,
}) {
  const [values, setValues] = useState(EMPTY);
  const [paymentDate, setPaymentDate] = useState(todayISO());
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setValues(EMPTY);
      setPaymentDate(todayISO());
      setError(null);
      setBusy(false);
    }
  }, [open]);

  const amounts = parsePaymentAmounts(values);
  const set = (key) => (v) => setValues((cur) => ({ ...cur, [key]: v }));

  const submit = async () => {
    if (busy) return;
    const invalid = validatePaymentInput(amounts, paymentDate, invalidAmountMessage);
    if (invalid) {
      setError(invalid.message);
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const failure = await onSubmit({ ...amounts, paymentDate });
      if (failure) setError(failure);
    } finally {
      setBusy(false);
    }
  };

  return (
    <HistorySheet
      open={open}
      onClose={onClose}
      title={title ?? `Add Payment - Invoice #${invoiceNo}`}
      size="sm"
      actions={
        <>
          <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-none">
            Cancel
          </Button>
          <Button
            variant="success"
            icon={Check}
            onClick={submit}
            loading={busy}
            className="flex-1 sm:flex-none"
          >
            Add Payment
          </Button>
        </>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
        className="space-y-4"
      >
        {balanceDue !== undefined ? (
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-slate-500">Current Balance Due</span>
            <span className="font-bold text-red-600 tabular-nums">₹{formatCurrency(balanceDue)}</span>
          </div>
        ) : null}
        <div className="grid grid-cols-3 gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <NumberField
            label={
              <span className="flex items-center gap-1 text-xs font-semibold">
                <Banknote className="size-3.5 text-emerald-600" aria-hidden /> CASH
              </span>
            }
            aria-label="Cash amount"
            value={values.cash}
            onChange={set('cash')}
          />
          <NumberField
            label={
              <span className="flex items-center gap-1 text-xs font-semibold">
                <Smartphone className="size-3.5 text-sky-600" aria-hidden /> UPI
              </span>
            }
            aria-label="UPI amount"
            value={values.upi}
            onChange={set('upi')}
          />
          <NumberField
            label={
              <span className="flex items-center gap-1 text-xs font-semibold">
                <Landmark className="size-3.5 text-violet-600" aria-hidden /> ACCOUNT
              </span>
            }
            aria-label="Account amount"
            value={values.account}
            onChange={set('account')}
          />
          <div className="col-span-3 flex items-center justify-between rounded-lg border border-brand-100 bg-brand-50 px-3 py-2 text-sm font-bold">
            <span className="text-slate-700">Total:</span>
            <span className="text-base text-brand-700 tabular-nums" aria-live="polite">
              ₹{formatCurrency(totalOf(amounts))}
            </span>
          </div>
        </div>
        <DateField label="Payment Date" value={paymentDate} onChange={setPaymentDate} />
        {error ? (
          <p
            role="alert"
            className="rounded-lg bg-red-50 p-3 text-sm font-semibold whitespace-pre-line text-red-700"
          >
            {error}
          </p>
        ) : null}
        <button type="submit" className="hidden" aria-hidden tabIndex={-1} />
      </form>
    </HistorySheet>
  );
}
