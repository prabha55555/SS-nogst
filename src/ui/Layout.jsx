import { cn } from './cn';

/**
 * Page scaffold used inside the app shell: title row (with actions) + content, centred up to `max` width.
 * <Page title="Sales History" icon={History} actions={<Button/>}>…</Page>
 */
export function Page({ title, subtitle, icon: Icon, actions, max = '6xl', className, children }) {
  const widths = {
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-none',
  };
  return (
    <div
      className={cn(
        'mx-auto w-full px-3 py-4 sm:px-5 sm:py-6 lg:px-8',
        widths[max] ?? widths['6xl'],
        className,
      )}
    >
      {title ? (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 sm:mb-5">
          <div className="min-w-0">
            <h1 className="flex items-center gap-2.5 text-xl font-bold text-slate-900 sm:text-2xl">
              {Icon ? <Icon className="size-6 shrink-0 text-brand-600" aria-hidden /> : null}
              <span className="truncate">{title}</span>
            </h1>
            {subtitle ? <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p> : null}
          </div>
          {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
        </div>
      ) : null}
      {children}
    </div>
  );
}

/** Form on the left, sticky summary / payment / action card on the right (stacked on phones & tablets). */
export function TwoPane({ main, side, className }) {
  return (
    <div
      className={cn(
        'grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem]',
        className,
      )}
    >
      <div className="min-w-0 space-y-4">{main}</div>
      <div className="min-w-0 space-y-4 lg:sticky lg:top-4">{side}</div>
    </div>
  );
}

/** Responsive grid: <Grid cols={{ base: 1, sm: 2, lg: 4 }}> — written out so Tailwind can see every class. */
const COLS = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
};
const SM = { 1: 'sm:grid-cols-1', 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'sm:grid-cols-4' };
const LG = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
};

export function Grid({ cols = { base: 1, sm: 2, lg: 3 }, gap = 'gap-3', className, children }) {
  return (
    <div
      className={cn(
        'grid',
        COLS[cols.base ?? 1],
        cols.sm && SM[cols.sm],
        cols.lg && LG[cols.lg],
        gap,
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Pill-style single choice: <ChoiceChips value onChange options={[{value,label}]}/> */
export function ChoiceChips({ value, onChange, options, className }) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)} role="radiogroup">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cn(
              'min-h-9 rounded-full border px-3.5 text-sm font-medium transition',
              active
                ? 'border-brand-600 bg-brand-600 text-white'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
