import { cn } from './cn';

export function Card({ className, children, as: Tag = 'div', ...rest }) {
  return (
    <Tag
      className={cn('rounded-xl border border-slate-200 bg-white p-4 shadow-card sm:p-5', className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Card heading row: icon + title on the left, optional actions (`right`) on the right. */
export function SectionHeader({ title, icon: Icon, right, className }) {
  return (
    <div className={cn('mb-3 flex flex-wrap items-center justify-between gap-2', className)}>
      <h2 className="flex items-center gap-2 text-base font-semibold text-slate-800">
        {Icon ? <Icon className="size-5 text-brand-600" aria-hidden /> : null}
        {title}
      </h2>
      {right}
    </div>
  );
}

export function Divider({ className }) {
  return <hr className={cn('my-3 border-slate-200', className)} />;
}

const TONES = {
  success: 'bg-emerald-100 text-emerald-800',
  danger: 'bg-red-100 text-red-800',
  warning: 'bg-amber-100 text-amber-800',
  info: 'bg-sky-100 text-sky-800',
  neutral: 'bg-slate-100 text-slate-700',
  brand: 'bg-brand-100 text-brand-800',
};

export function Badge({ tone = 'neutral', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** label ........ value row used in summaries and invoice cards */
export function KeyValue({ label, value, bold, valueClassName, className }) {
  return (
    <div className={cn('flex items-baseline justify-between gap-3 py-0.5 text-sm', className)}>
      <span className={cn('text-slate-500', bold && 'font-semibold text-slate-700')}>{label}</span>
      <span className={cn('text-right font-semibold text-slate-800 tabular-nums', valueClassName)}>
        {value}
      </span>
    </div>
  );
}

const TINTS = {
  brand: 'bg-brand-50 text-brand-600',
  green: 'bg-emerald-50 text-emerald-600',
  red: 'bg-red-50 text-red-600',
  amber: 'bg-amber-50 text-amber-600',
  sky: 'bg-sky-50 text-sky-600',
  violet: 'bg-violet-50 text-violet-600',
};

/** KPI tile: icon, big value, small label. */
export function StatCard({ icon: Icon, value, label, tint = 'brand', valueClassName, className }) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-card',
        className,
      )}
    >
      {Icon ? (
        <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-full', TINTS[tint])}>
          <Icon className="size-5" aria-hidden />
        </span>
      ) : null}
      <div className="min-w-0">
        <div
          className={cn(
            'truncate text-lg leading-tight font-bold text-slate-900 tabular-nums',
            valueClassName,
          )}
        >
          {value}
        </div>
        <div className="truncate text-xs text-slate-500">{label}</div>
      </div>
    </div>
  );
}
