import { Banknote, PackagePlus, ShoppingBag, TrendingDown, TrendingUp } from 'lucide-react';

import { formatRupees } from '@/core/format';
import { StatCard } from '@/ui';

import KpiRow from '../components/KpiRow';

/** Label with the original tile's small caption underneath (hidden on phones to keep the tiles compact). */
const tileLabel = (title, caption) => (
  <>
    {title}
    <span className="block truncate text-[11px] text-slate-400 max-sm:hidden">{caption}</span>
  </>
);

/** The four "Financial Summary" tiles at the top of the stocks page. */
export default function FinancialSummary({ summary }) {
  const loss = summary.netProfitLoss < 0;
  return (
    <KpiRow>
      <StatCard
        icon={ShoppingBag}
        tint="sky"
        value={formatRupees(summary.totalSales)}
        label={tileLabel('Total Sales', 'Total value of all sales')}
      />
      <StatCard
        icon={PackagePlus}
        tint="amber"
        value={formatRupees(summary.totalPurchases)}
        label={tileLabel('Total Purchases', 'Total value of all purchases')}
      />
      <StatCard
        icon={Banknote}
        tint="green"
        value={formatRupees(summary.cashReceived)}
        label={tileLabel('Cash Received', 'Money collected from sales')}
      />
      <StatCard
        icon={loss ? TrendingDown : TrendingUp}
        tint={loss ? 'red' : 'green'}
        value={formatRupees(summary.netProfitLoss)}
        valueClassName={loss ? 'text-red-600' : 'text-emerald-700'}
        label={tileLabel('Net Profit / Loss', 'Total Sales minus Total Purchases')}
      />
    </KpiRow>
  );
}
