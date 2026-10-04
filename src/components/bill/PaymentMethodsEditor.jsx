/**
 * Cash / UPI / Account amounts paid on a bill (the web app's "Payment Methods" block) + the total paid.
 *
 * Props
 *  - values: { cash: string, upi: string, account: string }
 *  - onChange(values)           receives the whole object, e.g. `patch(values)` merges the three form fields
 *  - totalPaid: number          shown as "Total Amount Paid" (includes any later payments, computed by the caller)
 *  - totalLabel?: string        default "Total Amount Paid"
 *  - readOnly?: boolean
 */
import { Building2, Banknote, Smartphone } from 'lucide-react';
import { formatCurrency } from '@/core/format';
import { NumberField } from '@/ui';

const METHODS = [
  { key: 'cash', label: 'CASH', icon: Banknote, tint: 'text-emerald-600' },
  { key: 'upi', label: 'UPI', icon: Smartphone, tint: 'text-sky-600' },
  { key: 'account', label: 'ACCOUNT', icon: Building2, tint: 'text-violet-600' },
];

export function PaymentMethodsEditor({
  values,
  onChange,
  totalPaid,
  totalLabel = 'Total Amount Paid',
  readOnly,
}) {
  return (
    <div>
      <div className="space-y-2">
        {METHODS.map(({ key, label, icon: Icon, tint }) => (
          <div key={key} className="flex items-center gap-3">
            <span className="flex w-28 shrink-0 items-center gap-2 text-sm font-bold text-slate-800">
              <Icon className={`size-5 ${tint}`} aria-hidden />
              {label}
            </span>
            <NumberField
              className="flex-1"
              aria-label={`${label.charAt(0)}${label.slice(1).toLowerCase()} amount paid`}
              value={values[key]}
              readOnly={readOnly}
              onChange={(v) => onChange({ ...values, [key]: v })}
            />
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3 border-t border-slate-200 pt-2">
        <span className="text-sm font-bold text-slate-800">{totalLabel}</span>
        <span className="font-bold text-emerald-600 tabular-nums">₹{formatCurrency(totalPaid)}</span>
      </div>
    </div>
  );
}
