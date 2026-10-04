import { Banknote, Calendar, Eye, FileText, Trash2, Undo2, User } from 'lucide-react';

import { formatCurrency, formatDateIN } from '@/core/format';
import { Button, Card } from '@/ui';
import { binItemName, daysAgo, daysAgoText, formatBinDate, partyName, toDate } from './binLogic';

/** "3/10/2026 (2 days ago)" or "-" when the deletion time is unknown. */
export function deletedAtText(item, now) {
  const deleted = toDate(item.deletedAt);
  return deleted ? `${formatBinDate(deleted)} (${daysAgoText(daysAgo(deleted, now))})` : '-';
}

/** View / Restore / Delete as one compact row (table rows on the website). */
export function BinRowActions({ item, onView, onRestore, onDelete }) {
  const name = binItemName(item);
  return (
    <div className="flex flex-wrap items-center gap-2" onClick={(e) => e.stopPropagation()}>
      <Button size="sm" icon={Eye} onClick={onView} aria-label={`View ${name}`}>
        View
      </Button>
      <Button size="sm" variant="success" icon={Undo2} onClick={onRestore} aria-label={`Restore ${name}`}>
        Restore
      </Button>
      <Button
        size="sm"
        variant="danger"
        icon={Trash2}
        onClick={onDelete}
        aria-label={`Delete ${name} permanently`}
      >
        Delete
      </Button>
    </div>
  );
}

function MetaLine({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-500">
      <Icon className="size-3.5 shrink-0" aria-hidden />
      <span className="min-w-0 break-words">{text}</span>
    </div>
  );
}

/** One deleted bill (the web `.bin-item` row): name, dates, party, amount and the three actions. */
export function BinItemCard({ item, now, onView, onRestore, onDelete }) {
  const name = binItemName(item);
  return (
    <Card className="p-3.5">
      <div className="flex items-center gap-2">
        <FileText className="size-[18px] shrink-0 text-brand-600" aria-hidden />
        <h3 className="min-w-0 flex-1 truncate text-lg font-bold text-slate-900">{name}</h3>
      </div>
      <div className="mt-2 space-y-1">
        <MetaLine icon={Calendar} text={`Deleted ${deletedAtText(item, now)}`} />
        {item.invoiceDate ? (
          <MetaLine icon={FileText} text={`Invoice date ${formatDateIN(item.invoiceDate)}`} />
        ) : null}
        <MetaLine icon={User} text={partyName(item) || '-'} />
        <MetaLine icon={Banknote} text={`₹${formatCurrency(item.grandTotal)}`} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button icon={Eye} onClick={onView} aria-label={`View ${name}`}>
          View
        </Button>
        <Button variant="success" icon={Undo2} onClick={onRestore} aria-label={`Restore ${name}`}>
          Restore
        </Button>
      </div>
      <Button
        variant="danger"
        icon={Trash2}
        fullWidth
        className="mt-2"
        onClick={onDelete}
        aria-label={`Delete ${name} permanently`}
      >
        Delete Permanently
      </Button>
    </Card>
  );
}
