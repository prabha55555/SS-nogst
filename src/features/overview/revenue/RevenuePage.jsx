/**
 * Revenue & Profit Tracking — replaces legacy/revenue.html + js/revenue.js.
 * KPI row (bills / revenue / cost / net profit of the filtered list), date + customer filters, per-invoice profit
 * lines (table on tablets/desktops, cards on phones) and the "Total Net Profit" row.
 */
import { IndianRupee, Receipt, ReceiptText, TrendingUp, Wallet } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router';

import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useFocusLoad } from '@/hooks/useFocusLoad';
import { formatCurrency, formatDateShort } from '@/core/format';
import { DataTable, EmptyState, ErrorState, Page, StatCard, cn } from '@/ui';

import FilterBar from '../components/FilterBar';
import KpiRow from '../components/KpiRow';
import RefreshButton from '../components/RefreshButton';
import ShowMore from '../components/ShowMore';
import SkeletonRows from '../components/SkeletonRows';
import StickyBar from '../components/StickyBar';
import { usePagedRows } from '../components/paging';
import { filterRevenueRows, revenueTotals } from './revenueLogic';
import { loadRevenueRows } from './revenueService';

const rupees = (n) => `₹${formatCurrency(n)}`;
const profitColor = (n) => (n >= 0 ? 'text-emerald-700' : 'text-red-600');

function BillLink({ row }) {
  return (
    <Link
      to={`/sales/bill?edit=${encodeURIComponent(row.rawBillNo)}`}
      aria-label={`Open bill ${row.billNo} for editing`}
      className="inline-flex min-h-9 items-center font-bold text-brand-600 hover:text-brand-800 hover:underline"
    >
      #{row.billNo}
    </Link>
  );
}

/** "Shirt (₹150.00 - ₹110.00) ₹40.00 × 4 = ₹160.00" per product, then the discount. */
function DetailLines({ row }) {
  return (
    <div className="space-y-1 text-left text-[13px] leading-snug text-slate-700">
      {row.lines.map((l, i) => (
        <div key={i} className="sm:whitespace-nowrap">
          {l.description} ({rupees(l.sellingRate)} - {rupees(l.costRate)}) {rupees(l.profitPerUnit)} × {l.qty}{' '}
          = <strong>{rupees(l.totalProfit)}</strong>
        </div>
      ))}
      {row.discount > 0 ? <div className="text-red-600">Discount: -{rupees(row.discount)}</div> : null}
    </div>
  );
}

function RevenueCard({ row }) {
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <BillLink row={row} />
        <span className="text-sm text-slate-500">{formatDateShort(row.date)}</span>
      </div>
      <div className="font-semibold text-slate-900">{row.name}</div>
      <div className="mt-2">
        <DetailLines row={row} />
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2">
        <span className="text-sm font-semibold text-slate-500">Profit</span>
        <span className={cn('text-lg font-bold tabular-nums', profitColor(row.profit))}>
          {rupees(row.profit)}
        </span>
      </div>
    </>
  );
}

function TotalLine({ total }) {
  return (
    <div className="flex items-center justify-between gap-3 lg:justify-end">
      <span className="font-bold text-slate-800">Total Net Profit:</span>
      <span className={cn('text-xl font-bold tabular-nums', profitColor(total))}>{rupees(total)}</span>
    </div>
  );
}

const COLUMNS = [
  { key: 'bill', header: 'Bill No', render: (r) => <BillLink row={r} /> },
  { key: 'date', header: 'Date', className: 'whitespace-nowrap', value: (r) => formatDateShort(r.date) },
  { key: 'name', header: 'Customer Name', value: (r) => r.name },
  { key: 'details', header: 'Details', render: (r) => <DetailLines row={r} /> },
  {
    key: 'profit',
    header: 'Profit Amount',
    align: 'right',
    className: 'font-semibold tabular-nums whitespace-nowrap',
    render: (r) => <span className={profitColor(r.profit)}>{rupees(r.profit)}</span>,
  },
];

export default function RevenuePage() {
  const { isExpanded } = useBreakpoint();
  const [rows, setRows] = useState([]);
  const [dateTerm, setDateTerm] = useState('');
  const [nameTerm, setNameTerm] = useState('');

  const { loading, refreshing, error, refresh, reload } = useFocusLoad(async () => {
    try {
      setRows(await loadRevenueRows());
    } catch (e) {
      console.error('Error loading revenue:', e);
      throw new Error('Error loading data.');
    }
  });

  // totals are always taken from the whole filtered list, never from the visible page
  const visible = useMemo(() => filterRevenueRows(rows, dateTerm, nameTerm), [rows, dateTerm, nameTerm]);
  const totals = useMemo(() => revenueTotals(visible), [visible]);
  const paged = usePagedRows(visible, `${dateTerm}|${nameTerm}`);
  const showTotal = !loading && !error && visible.length > 0;

  let body;
  if (loading) body = <SkeletonRows count={4} height="h-32" />;
  else if (error) body = <ErrorState message={error} onRetry={() => void reload()} />;
  else
    body = (
      <>
        <DataTable
          columns={COLUMNS}
          rows={paged.rows}
          rowKey={(r, i) => `${r.rawBillNo}-${i}`}
          renderCard={(r) => <RevenueCard row={r} />}
          empty={<EmptyState icon={Receipt} title="No bills found." />}
          footer={showTotal && isExpanded ? <TotalLine total={totals.profit} /> : undefined}
        />
        <ShowMore remaining={paged.remaining} onClick={paged.showMore} />
        {showTotal ? (
          <StickyBar>
            <TotalLine total={totals.profit} />
          </StickyBar>
        ) : null}
      </>
    );

  return (
    <Page
      title="Revenue & Profit Tracking"
      icon={TrendingUp}
      actions={<RefreshButton onClick={refresh} refreshing={refreshing} />}
    >
      <KpiRow>
        <StatCard icon={ReceiptText} label="Bills" value={loading ? '…' : totals.bills} tint="brand" />
        <StatCard
          icon={IndianRupee}
          label="Revenue"
          value={loading ? '…' : rupees(totals.revenue)}
          tint="sky"
        />
        <StatCard icon={Wallet} label="Cost" value={loading ? '…' : rupees(totals.cost)} tint="amber" />
        <StatCard
          icon={TrendingUp}
          label="Net Profit"
          value={loading ? '…' : rupees(totals.profit)}
          tint={totals.profit >= 0 ? 'green' : 'red'}
          valueClassName={loading ? '' : profitColor(totals.profit)}
        />
      </KpiRow>
      <FilterBar
        date={dateTerm}
        onDateChange={setDateTerm}
        text={nameTerm}
        onTextChange={setNameTerm}
        textPlaceholder="Search by Customer Name..."
        onClear={() => {
          setDateTerm('');
          setNameTerm('');
        }}
      />
      {body}
    </Page>
  );
}
