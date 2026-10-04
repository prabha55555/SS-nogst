/**
 * The calculation block of purchase.html / edit-purchase.html: current subtotal, previous balance, opening balance,
 * discount, total due, payment methods, total paid and the balance still due.
 *
 * Props
 *  - form: { previousBalance, manualPreviousBalance, discountAmount, cash, upi, account }
 *  - totals: { subtotal, grandTotal, totalPaid, balanceDue }   (grand total is never below zero)
 *  - onChange(patch)            merged into the form
 *  - additionalPaid?: number    edit screen: payments added later from Purchase History (already inside totalPaid)
 */
import { Calculator } from 'lucide-react';
import { PaymentMethodsEditor } from '@/components/bill';
import { formatCurrency } from '@/core/format';
import { Card, Divider, KeyValue, NumberField, SectionHeader } from '@/ui';

const rupees = (n) => `₹${formatCurrency(n)}`;

export function PurchaseTotalsCard({ form, totals, onChange, additionalPaid }) {
  return (
    <Card>
      <SectionHeader title="Bill Summary" icon={Calculator} />
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
      {additionalPaid > 0 ? (
        <p className="mt-2 text-xs text-slate-500">
          Includes {rupees(additionalPaid)} paid later (added from Purchase History).
        </p>
      ) : null}
      <Divider />
      <KeyValue
        label="Balance Due"
        value={rupees(totals.balanceDue)}
        bold
        valueClassName={totals.balanceDue > 0 ? 'text-base text-red-600' : 'text-base text-emerald-600'}
      />
    </Card>
  );
}
