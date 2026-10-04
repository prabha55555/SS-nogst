/**
 * The calculation block of sales.html: subtotal, previous balance, opening balance, discount, total due,
 * payment methods, total paid and the new balance due.
 *
 * Props
 *  - form: the sales form (previousBalance, manualPreviousBalance, discountAmount, cash, upi, account,
 *          additionalPaymentsTotal)
 *  - totals: result of salesFormTotals(form)  { subtotal, grandTotal, totalPaid, balanceDue }
 *  - onChange(patch)            merged into the form
 */
import { Calculator } from 'lucide-react';
import { PaymentMethodsEditor } from '@/components/bill';
import { formatCurrency } from '@/core/format';
import { Card, Divider, KeyValue, NumberField, SectionHeader } from '@/ui';

const rupees = (n) => `₹${formatCurrency(n)}`;

export function CalculationSection({ form, totals, onChange }) {
  return (
    <Card>
      <SectionHeader title="Calculation" icon={Calculator} />
      <KeyValue label="Current Bill Subtotal" value={rupees(totals.subtotal)} />
      <KeyValue
        label="Previous Balance Due"
        value={rupees(form.previousBalance)}
        valueClassName="text-red-600"
      />
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <NumberField
          label="Opening Balance"
          allowNegative
          value={String(form.manualPreviousBalance)}
          onChange={(manualPreviousBalance) => onChange({ manualPreviousBalance })}
        />
        <NumberField
          label="Discount Amount"
          value={String(form.discountAmount)}
          onChange={(discountAmount) => onChange({ discountAmount })}
        />
      </div>
      <Divider />
      <KeyValue label="Total Amount Due" value={rupees(totals.grandTotal)} bold valueClassName="text-base" />
      <h3 className="mt-4 mb-2 text-sm font-bold text-brand-700">Payment Methods</h3>
      <PaymentMethodsEditor
        values={{ cash: String(form.cash), upi: String(form.upi), account: String(form.account) }}
        totalPaid={totals.totalPaid}
        onChange={onChange}
      />
      {form.additionalPaymentsTotal > 0 ? (
        <p className="mt-2 text-xs text-slate-500">
          Includes {rupees(form.additionalPaymentsTotal)} of payments added later from Sales History.
        </p>
      ) : null}
      <Divider />
      <KeyValue
        label="New Balance Due"
        value={rupees(totals.balanceDue)}
        bold
        valueClassName={totals.balanceDue > 0 ? 'text-base text-red-600' : 'text-base text-emerald-600'}
      />
    </Card>
  );
}
