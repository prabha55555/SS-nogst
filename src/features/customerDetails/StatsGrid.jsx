import { Banknote, CheckCircle2, Clock, FileText, Tag, Undo2, Users } from 'lucide-react';
import { memo, useMemo } from 'react';

import { cn } from '@/ui';
import { buildStatTiles } from './statTiles';

const ICONS = {
  people: Users,
  'document-text': FileText,
  cash: Banknote,
  'checkmark-circle': CheckCircle2,
  pricetag: Tag,
  'arrow-undo': Undo2,
  time: Clock,
};
// The web used a grey card border for green / neutral cards and red for negative ones; icon green / red / blue.
const BORDER = {
  positive: 'border-l-slate-400',
  negative: 'border-l-red-500',
  neutral: 'border-l-slate-400',
};
const ICON = { positive: 'text-emerald-600', negative: 'text-red-600', neutral: 'text-brand-600' };

/** Stat tiles of the Customer Details page (Customers, Invoices, Amount, Paid, Discount, [Returns], Balance). */
export const StatsGrid = memo(function StatsGrid({ stats }) {
  const tiles = useMemo(() => buildStatTiles(stats), [stats]);
  return (
    <div
      className={cn(
        'mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3',
        tiles.length > 6 ? 'lg:grid-cols-4' : 'lg:grid-cols-3',
      )}
    >
      {tiles.map((t) => {
        const Icon = ICONS[t.icon] ?? Users;
        return (
          <div
            key={t.key}
            className={cn(
              'min-w-0 rounded-xl border border-l-[5px] border-slate-200 bg-white p-3 shadow-card',
              BORDER[t.tone],
            )}
          >
            <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Icon className={cn('size-[18px] shrink-0', ICON[t.tone])} aria-hidden />
              <span className="truncate">{t.label}</span>
            </div>
            <div className="truncate text-lg font-bold text-slate-900 tabular-nums">{t.value}</div>
            {t.subtitle ? <div className="mt-0.5 text-xs font-bold text-brand-600">{t.subtitle}</div> : null}
          </div>
        );
      })}
    </div>
  );
});
