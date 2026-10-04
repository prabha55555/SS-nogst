import { cn } from '@/ui';

/**
 * Hero KPI tile on the dark ink surface: gold-tinted icon, display-font figure (gold, or red when `negative`) and a
 * muted label. Sits next to the light <StatCard>s in a <KpiRow>.
 */
export default function InkStat({ icon: Icon, value, label, negative = false, valueClassName, className }) {
  return (
    <div
      className={cn(
        'group relative flex items-center gap-3.5 overflow-hidden rounded-2xl border border-white/10 surface-ink p-4 text-white shadow-lift',
        'transition duration-200 hover:-translate-y-0.5',
        className,
      )}
    >
      <span className="absolute inset-x-0 top-0 h-px hairline-gold" aria-hidden />
      {Icon ? (
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-gold-300 ring-1 ring-white/15 ring-inset">
          <Icon className="size-5" aria-hidden />
        </span>
      ) : null}
      <div className="min-w-0">
        <div
          className={cn(
            'truncate font-display text-xl leading-tight font-extrabold tabular-nums',
            negative ? 'text-red-300' : 'text-gold-300',
            valueClassName,
          )}
        >
          {value}
        </div>
        <div className="truncate text-xs font-medium text-brand-300">{label}</div>
      </div>
    </div>
  );
}
