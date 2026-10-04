import { cn } from '@/ui';

const COLS = {
  2: 'grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-3',
  4: 'grid-cols-2 lg:grid-cols-4',
};

/** Row of <StatCard>s on top of a page: `cols` KPI tiles (4 → 2x2 on phones, 3 → stacked on phones). */
export default function KpiRow({ cols = 4, className, children }) {
  return <div className={cn('mb-4 grid gap-2.5 sm:gap-3', COLS[cols], className)}>{children}</div>;
}
