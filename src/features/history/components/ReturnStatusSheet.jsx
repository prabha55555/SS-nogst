/**
 * ReturnStatusSheet – viewReturnStatus(): every return record of one invoice with undo per return and
 * "Undo All Returns".
 *
 * Props: open (bool) · invoiceNo · partyName · returns (HistoryReturn[]) · onClose() ·
 *        onUndo(returnId) · onUndoAll() (callers confirm) · onAddReturn?() ("Add Return" footer button).
 */
import { Plus, Undo2 } from 'lucide-react';
import { useMemo } from 'react';
import { formatCurrency, formatDateIN } from '@/core/format';
import { Button, EmptyState } from '@/ui';
import { dateMillis } from '../lib/dates';
import { sumReturnAmounts } from '../lib/lookups';
import { HistorySheet } from './HistorySheet';

export function ReturnStatusSheet({
  open,
  invoiceNo,
  partyName,
  returns,
  onClose,
  onUndo,
  onUndoAll,
  onAddReturn,
}) {
  const sorted = useMemo(
    () => [...returns].sort((a, b) => dateMillis(a.returnDate) - dateMillis(b.returnDate)),
    [returns],
  );
  return (
    <HistorySheet
      open={open}
      onClose={onClose}
      title={`Return Status - Invoice #${invoiceNo}`}
      actions={
        <>
          {onAddReturn ? (
            <Button variant="warning" icon={Plus} onClick={onAddReturn} className="flex-1 sm:flex-none">
              Add Return
            </Button>
          ) : null}
          {returns.length > 0 ? (
            <Button variant="danger" icon={Undo2} onClick={onUndoAll} className="flex-1 sm:flex-none">
              Undo All Returns
            </Button>
          ) : null}
        </>
      }
    >
      <div className="mb-4 rounded-xl bg-red-50 p-3">
        <p className="text-base font-bold text-slate-900">{partyName}</p>
        <p className="text-sm text-slate-500">Total Returns: {returns.length}</p>
      </div>

      {returns.length === 0 ? (
        <EmptyState title="No return records found for this invoice." />
      ) : (
        <ul className="space-y-3">
          {sorted.map((item, index) => (
            <li
              key={`${item.id}-${index}`}
              className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm"
            >
              <div className="mb-2 flex justify-between gap-2 border-b border-dashed border-slate-300 pb-2">
                <span className="font-bold text-brand-700">Return #{index + 1}</span>
                <span className="text-slate-500">{formatDateIN(item.returnDate)}</span>
              </div>
              <p>
                <span className="font-bold">Product: </span>
                {item.description}
              </p>
              <p>
                <span className="font-bold">Quantity: </span>
                {item.qty}
              </p>
              <p>
                <span className="font-bold">Rate: </span>₹{formatCurrency(item.rate)}
              </p>
              <p>
                <span className="font-bold">Amount: </span>₹{formatCurrency(item.returnAmount)}
              </p>
              <p>
                <span className="font-bold">Reason: </span>
                {item.reason || 'N/A'}
              </p>
              <div className="mt-2 flex justify-end">
                <Button variant="warning" size="sm" icon={Undo2} onClick={() => onUndo(item.id)}>
                  Undo This Return
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {returns.length > 0 ? (
        <p className="mt-3 border-t-2 border-red-600 pt-2 text-right text-lg font-bold text-red-600 tabular-nums">
          Total Return Amount: ₹{formatCurrency(sumReturnAmounts(returns))}
        </p>
      ) : null}
    </HistorySheet>
  );
}
