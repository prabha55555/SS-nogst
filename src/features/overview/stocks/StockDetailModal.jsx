import { useRef } from 'react';

import { formatRupees } from '@/core/format';
import { Button, DataTable, Modal, cn } from '@/ui';

import { historyDate, historyInvoiceNo, historyTotal } from './stocksLogic';

const PURCHASE = {
  title: 'Purchase History',
  party: 'Supplier',
  empty: 'No purchases found.',
  tone: 'text-emerald-700 border-emerald-600',
};
const SALES = {
  title: 'Sales History',
  party: 'Customer',
  empty: 'No sales found.',
  tone: 'text-sky-700 border-sky-600',
};

function HistorySection({ kind, entries }) {
  const columns = [
    { key: 'date', header: 'Date', className: 'whitespace-nowrap', value: (e) => historyDate(e.date) },
    { key: 'invoice', header: 'Invoice No', value: (e) => historyInvoiceNo(e.invoiceNo) },
    { key: 'party', header: kind.party, value: (e) => e.party },
    { key: 'qty', header: 'Qty', align: 'right', className: 'tabular-nums', value: (e) => e.qty },
    {
      key: 'rate',
      header: 'Rate',
      align: 'right',
      className: 'tabular-nums',
      value: (e) => formatRupees(e.rate),
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      className: 'font-semibold tabular-nums',
      value: (e) => formatRupees(e.amount),
    },
  ];
  return (
    <section className="mb-6 last:mb-0">
      <h3 className={cn('mb-3 border-b-2 pb-1 text-lg font-bold', kind.tone)}>{kind.title}</h3>
      <DataTable
        columns={columns}
        rows={entries}
        rowKey={(_, i) => i}
        dense
        empty={<p className="py-4 text-center text-sm text-slate-500">{kind.empty}</p>}
        renderCard={(e) => (
          <div className="space-y-0.5 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">{historyDate(e.date)}</span>
              <span className="font-bold text-slate-800">#{historyInvoiceNo(e.invoiceNo)}</span>
            </div>
            <div className="text-slate-800">
              {kind.party}: {e.party}
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 tabular-nums">
                {e.qty} × {formatRupees(e.rate)}
              </span>
              <span className="font-bold text-slate-900 tabular-nums">{formatRupees(e.amount)}</span>
            </div>
          </div>
        )}
        footer={
          <div className="flex justify-between font-bold text-slate-800">
            <span>Total</span>
            <span className="tabular-nums">{formatRupees(historyTotal(entries))}</span>
          </div>
        }
      />
    </section>
  );
}

/** The original "Stock Details" modal: purchase history and sales history of one product. `row` null = closed. */
export default function StockDetailModal({ row, onClose }) {
  // keep the content while the dialog is closing / for the title
  const last = useRef(null);
  if (row) last.current = row;
  const shown = row ?? last.current;
  return (
    <Modal
      open={row !== null}
      onClose={onClose}
      title={shown?.description ?? 'Product Details'}
      size="lg"
      footer={
        <Button variant="secondary" onClick={onClose} className="max-sm:w-full">
          Close
        </Button>
      }
    >
      {shown ? (
        <>
          <HistorySection kind={PURCHASE} entries={shown.purchaseHistory} />
          <HistorySection kind={SALES} entries={shown.salesHistory} />
        </>
      ) : null}
    </Modal>
  );
}
