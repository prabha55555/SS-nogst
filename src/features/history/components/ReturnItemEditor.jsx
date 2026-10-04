/**
 * ReturnItemEditor – one line of the return sheet: product picker (invoice products or a custom one),
 * qty, rate, read-only amount, reason. Used by ReturnSheet.
 *
 * Props: index (0-based) · item (ReturnDraftItem, see lib/returns.js) · products (invoice product lines) ·
 *        returnedQty (Map description -> qty already returned) · onChange(nextItem) · onRemove().
 */
import { X } from 'lucide-react';
import { formatCurrency } from '@/core/format';
import { NumberField, SelectField, TextField } from '@/ui';
import { chooseReturnProduct, returnItemAmount } from '../lib/returns';

const rs = (n) => `₹${formatCurrency(n)}`;

const choiceToValue = (choice) => (choice === null ? '' : String(choice));
const valueToChoice = (value) => (value === '' ? null : value === 'custom' ? 'custom' : Number(value));

export function ReturnItemEditor({ index, item, products, returnedQty, onChange, onRemove }) {
  const selected = typeof item.choice === 'number' ? products[item.choice] : undefined;
  const alreadyReturned = selected ? (returnedQty.get(selected.description) ?? 0) : 0;
  return (
    <fieldset className="mb-3 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <legend className="sr-only">Return item {index + 1}</legend>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-800">Return Item {index + 1}</h4>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove return item ${index + 1}`}
          className="rounded-full p-1.5 text-red-600 hover:bg-red-50"
        >
          <X className="size-5" aria-hidden />
        </button>
      </div>

      <SelectField
        label="Product Description"
        value={choiceToValue(item.choice)}
        onChange={(v) => onChange(chooseReturnProduct(item, valueToChoice(v), products))}
      >
        <option value="">-- Select Product --</option>
        {products.map((p, i) => (
          <option key={`${i}-${p.description}`} value={String(i)}>
            {`${p.description} (Avail: ${p.qty} @ ${rs(p.rate)})`}
          </option>
        ))}
        <option value="custom">-- Enter Custom Product --</option>
      </SelectField>
      {item.choice === 'custom' ? (
        <TextField
          placeholder="Enter custom product"
          aria-label="Custom product description"
          value={item.custom}
          onChange={(custom) => onChange({ ...item, custom })}
        />
      ) : null}

      <div className="grid grid-cols-3 gap-2">
        <NumberField label="Qty" value={item.qty} onChange={(qty) => onChange({ ...item, qty })} />
        <NumberField label="Rate (₹)" value={item.rate} onChange={(rate) => onChange({ ...item, rate })} />
        <NumberField
          label="Amount (₹)"
          value={returnItemAmount(item).toFixed(2)}
          onChange={() => undefined}
          readOnly
        />
      </div>
      {alreadyReturned > 0 ? (
        <p className="text-xs text-slate-500">Already returned: {alreadyReturned}</p>
      ) : null}
      <TextField
        label="Reason"
        placeholder="Reason for return"
        value={item.reason}
        onChange={(reason) => onChange({ ...item, reason })}
      />
    </fieldset>
  );
}
