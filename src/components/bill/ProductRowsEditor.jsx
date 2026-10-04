/**
 * Product lines of a bill (Sales Bill, Purchase Bill, Edit Purchase): S.No, description with shortcut
 * autocomplete, qty, rate, computed amount, remove, plus "Add Product". Table on tablets/desktops, one card per
 * line on phones.
 *
 * Props
 *  - rows: Array<{description: string, qty: string, rate: string}>   (strings, like the form state)
 *  - onChange(rows)                                                  receives the whole new array
 *  - shortcuts: Array<{shortcutKey, fullDescription}> | null         product catalogue (null = still loading)
 *  - readOnly?: boolean                                              hides add/remove, locks inputs
 *  - addLabel?: string                                               default "Add Product"
 * Removing the last row leaves one blank row. `EMPTY_ROW`, `matchShortcuts`, `isKnownProduct` are re-exported.
 */
import { PlusCircle, Trash2 } from 'lucide-react';
import { rowAmount } from '@/core/billing';
import { formatCurrency } from '@/core/format';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { Button, IconButton, NumberField } from '@/ui';
import { ProductDescriptionInput } from './ProductDescriptionInput';
import { EMPTY_ROW, removeRowAt } from './productMatch';

export { EMPTY_ROW, isKnownProduct, matchShortcuts } from './productMatch';

const rupees = (n) => `₹${formatCurrency(n)}`;

export function ProductRowsEditor({ rows, onChange, shortcuts, readOnly, addLabel = 'Add Product' }) {
  const { isCompact } = useBreakpoint();
  const update = (index, patch) => onChange(rows.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  const remove = (index) => onChange(removeRowAt(rows, index));
  const add = () => onChange([...rows, { ...EMPTY_ROW }]);

  return (
    <div>
      {isCompact ? (
        <ul className="space-y-3">
          {rows.map((row, i) => (
            <li key={i} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-bold text-brand-700">Item {i + 1}</span>
                {!readOnly ? (
                  <IconButton
                    icon={Trash2}
                    label={`Remove item ${i + 1}`}
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => remove(i)}
                  />
                ) : null}
              </div>
              <ProductDescriptionInput
                label={`Description of item ${i + 1}`}
                value={row.description}
                onChange={(description) => update(i, { description })}
                shortcuts={shortcuts}
                readOnly={readOnly}
              />
              <div className="mt-2 grid grid-cols-[1fr_1fr_1.1fr] items-end gap-2">
                <NumberField
                  label="Qty"
                  value={row.qty}
                  readOnly={readOnly}
                  onChange={(qty) => update(i, { qty })}
                />
                <NumberField
                  label="Rate"
                  value={row.rate}
                  readOnly={readOnly}
                  onChange={(rate) => update(i, { rate })}
                />
                <div className="pb-2 text-right">
                  <div className="text-xs text-slate-500">Amount</div>
                  <div className="truncate text-base font-bold text-slate-900 tabular-nums">
                    {rupees(rowAmount(row.qty, row.rate))}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <table className="w-full table-fixed border-separate border-spacing-0 text-sm">
          <thead>
            <tr className="text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
              <th className="w-14 border-b border-slate-200 px-2 pb-2">S.No</th>
              <th className="border-b border-slate-200 px-2 pb-2">Description</th>
              <th className="w-24 border-b border-slate-200 px-2 pb-2 text-right lg:w-28">Qty</th>
              <th className="w-28 border-b border-slate-200 px-2 pb-2 text-right lg:w-32">Rate</th>
              <th className="w-32 border-b border-slate-200 px-2 pb-2 text-right lg:w-36">Amount</th>
              {!readOnly ? (
                <th className="w-12 border-b border-slate-200 pb-2">
                  <span className="sr-only">Remove</span>
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="align-top">
                <td className="px-2 pt-4 text-slate-500 tabular-nums">{i + 1}</td>
                <td className="px-1 py-1.5">
                  <ProductDescriptionInput
                    label={`Description of item ${i + 1}`}
                    value={row.description}
                    onChange={(description) => update(i, { description })}
                    shortcuts={shortcuts}
                    readOnly={readOnly}
                  />
                </td>
                <td className="px-1 py-1.5">
                  <NumberField
                    aria-label={`Quantity of item ${i + 1}`}
                    value={row.qty}
                    readOnly={readOnly}
                    onChange={(qty) => update(i, { qty })}
                  />
                </td>
                <td className="px-1 py-1.5">
                  <NumberField
                    aria-label={`Rate of item ${i + 1}`}
                    value={row.rate}
                    readOnly={readOnly}
                    onChange={(rate) => update(i, { rate })}
                  />
                </td>
                <td className="px-2 pt-4 text-right font-semibold text-slate-900 tabular-nums">
                  {rupees(rowAmount(row.qty, row.rate))}
                </td>
                {!readOnly ? (
                  <td className="px-1 py-1.5 text-center">
                    <IconButton
                      icon={Trash2}
                      label={`Remove item ${i + 1}`}
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => remove(i)}
                    />
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!readOnly ? (
        <Button variant="outline" icon={PlusCircle} onClick={add} fullWidth={isCompact} className="mt-3">
          {addLabel}
        </Button>
      ) : null}
    </div>
  );
}
