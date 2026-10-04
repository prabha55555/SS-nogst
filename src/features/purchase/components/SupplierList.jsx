import { useBreakpoint } from '@/hooks/useBreakpoint';
import { DataTable } from '@/ui';
import { formatRupees } from '@/core/format';
import { RevealablePhone } from './RevealablePhone';
import { SupplierSummaryCard } from './SupplierSummaryCard';

const num = (key, header, value) => ({ key, header, align: 'right', className: 'tabular-nums', value });

/** The columns of the original supplier table (supplier-details.html). */
export const SUPPLIER_COLUMNS = [
  {
    key: 'name',
    header: 'Supplier Name',
    mobile: 'title',
    render: (s) => <span className="font-semibold text-slate-900">{s.name}</span>,
  },
  { key: 'phone', header: 'Phone', render: (s) => <RevealablePhone phone={s.phone} /> },
  { key: 'address', header: 'Address', className: 'max-w-xs', value: (s) => s.address || '—' },
  num('bills', 'Bills', (s) => s.totalBills),
  num('amount', 'Total Amount', (s) => formatRupees(s.totalAmount)),
  num('paid', 'Amount Paid', (s) => formatRupees(s.totalPaid)),
  num('discount', 'Discount', (s) => formatRupees(s.totalDiscount)),
  {
    key: 'balance',
    header: 'Balance Due',
    align: 'right',
    className: 'tabular-nums',
    render: (s) => (
      <span className={s.balanceDue > 0 ? 'font-semibold text-red-600' : 'text-emerald-600'}>
        {formatRupees(s.balanceDue)}
      </span>
    ),
  },
];

/** Dense table on desktop windows (>= 1024px), a card grid (1 column on phones, 2 on tablets) otherwise. */
export function SupplierList({ suppliers, empty }) {
  const { isExpanded } = useBreakpoint();
  if (suppliers.length === 0)
    return <div className="rounded-xl border border-slate-200 bg-white">{empty}</div>;
  if (isExpanded) {
    return <DataTable columns={SUPPLIER_COLUMNS} rows={suppliers} rowKey={(s) => s.name} dense />;
  }
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {suppliers.map((s) => (
        <SupplierSummaryCard key={s.name} supplier={s} />
      ))}
    </div>
  );
}
