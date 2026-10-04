import { MapPin } from 'lucide-react';
import { Card, Divider, KeyValue } from '@/ui';
import { formatRupees } from '@/core/format';
import { RevealablePhone } from './RevealablePhone';

/** One supplier of the Supplier Details list on phones / tablets (a row of the desktop table). */
export function SupplierSummaryCard({ supplier }) {
  const owing = supplier.balanceDue > 0;
  return (
    <Card>
      <h3 className="font-semibold text-slate-900">{supplier.name}</h3>
      <div className="mt-1.5">
        <RevealablePhone phone={supplier.phone} />
      </div>
      <div className="mt-1 flex items-start gap-2 text-sm text-slate-500">
        <MapPin className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden />
        <span className="min-w-0 break-words">{supplier.address || '—'}</span>
      </div>
      <Divider />
      <KeyValue label="Total Bills" value={String(supplier.totalBills)} />
      <KeyValue label="Total Amount" value={formatRupees(supplier.totalAmount)} />
      <KeyValue label="Amount Paid" value={formatRupees(supplier.totalPaid)} />
      <KeyValue label="Discount" value={formatRupees(supplier.totalDiscount)} />
      <KeyValue
        label="Balance Due"
        bold={owing}
        value={formatRupees(supplier.balanceDue)}
        valueClassName={owing ? 'text-red-600' : 'text-emerald-600'}
      />
    </Card>
  );
}
