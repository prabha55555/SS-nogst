import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';

import { Button, IconButton, cn } from '@/ui';

import { openingActions, stockTone } from './stocksLogic';

export const TONE_CLASS = { positive: 'text-emerald-700', negative: 'text-red-600', zero: 'text-slate-500' };

/** Available quantity coloured green / red / grey. */
export function AvailableValue({ row, className }) {
  return (
    <span className={cn('font-bold tabular-nums', TONE_CLASS[stockTone(row.available)], className)}>
      {row.available}
    </span>
  );
}

/** Opening stock value: a blue badge when there is one, a grey 0 otherwise. */
export function OpeningValue({ row }) {
  if (openingActions(row) === 'edit') {
    return (
      <span className="inline-block rounded-full bg-sky-100 px-2.5 py-0.5 text-sm font-bold text-sky-800 tabular-nums">
        {row.opening}
      </span>
    );
  }
  return <span className="text-slate-400 tabular-nums">0</span>;
}

/**
 * "View History" plus "Add Old Stock", or "Edit Old Stock" + "Delete Old Stock" when an opening stock exists.
 * `compact` (table rows) turns Delete into an icon-only button so the actions stay on one line.
 */
export function StockActions({ row, onViewHistory, onEditOpening, onDeleteOpening, compact }) {
  const hasOpening = openingActions(row) === 'edit';
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="info" size="sm" icon={Eye} onClick={onViewHistory} className="max-sm:min-h-11">
        View History
      </Button>
      {hasOpening ? (
        <>
          <Button
            variant="warning"
            size="sm"
            icon={Pencil}
            onClick={onEditOpening}
            className="max-sm:min-h-11"
          >
            Edit Old Stock
          </Button>
          {compact ? (
            <IconButton icon={Trash2} label="Delete Old Stock" variant="danger" onClick={onDeleteOpening} />
          ) : (
            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={onDeleteOpening}
              className="max-sm:min-h-11"
            >
              Delete Old Stock
            </Button>
          )}
        </>
      ) : (
        <Button variant="success" size="sm" icon={Plus} onClick={onEditOpening} className="max-sm:min-h-11">
          Add Old Stock
        </Button>
      )}
    </div>
  );
}

function Metric({ label, children }) {
  return (
    <div className="min-w-0">
      <div className="text-[11px] text-slate-500">{label}</div>
      <div className="text-base">{children}</div>
    </div>
  );
}

/** One product as a phone card: opening / purchased / sold / available, history and opening-stock actions. */
export function StockCard({ row, ...actions }) {
  return (
    <div className="space-y-3">
      <div className="text-base font-bold break-words text-slate-900">{row.description}</div>
      <div className="grid grid-cols-4 gap-2">
        <Metric label="Opening">
          <OpeningValue row={row} />
        </Metric>
        <Metric label="Purchased">
          <span className="font-semibold tabular-nums">{row.purchased}</span>
        </Metric>
        <Metric label="Sold">
          <span className="font-semibold tabular-nums">{row.sold}</span>
        </Metric>
        <Metric label="Available">
          <AvailableValue row={row} />
        </Metric>
      </div>
      <StockActions row={row} {...actions} />
    </div>
  );
}
