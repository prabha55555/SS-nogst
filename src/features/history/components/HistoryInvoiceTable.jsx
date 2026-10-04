/**
 * HistoryInvoiceGroupBody – the invoices of ONE date group.
 *   desktop (>= 1024px): dense table (Invoice, Date, party, Total, Paid, Returns, Balance, icon actions);
 *                        clicking a row calls `actions.open(invoiceNo)` (the detail sheet).
 *   phone / tablet:      HistoryInvoiceCards, 1 column on phones and 2 columns on tablets.
 *
 * Props: invoices (HistoryInvoice[]) · labels ({ party, formatInvoiceNo? }) · actions (HistoryInvoiceActions, stable).
 * Also exports `HistoryInvoiceTable` (just the table) and `buildInvoiceColumns(labels, actions)`.
 */
import { Banknote, MessageCircle, RotateCcw, SquarePen, Trash2, FileDown } from 'lucide-react';
import { memo, useMemo } from 'react';
import { formatCurrency, formatDateIN } from '@/core/format';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { cn } from '@/ui';
import { displayInvoiceNo } from '../lib/types';
import { HistoryInvoiceCard } from './HistoryInvoiceCard';

const money = (n) => `₹${formatCurrency(n)}`;
const balanceOf = (i) => (i.totalReturns > 0 ? i.adjustedBalanceDue : i.balanceDue);

function IconAction({ icon: Icon, label, tone, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        'flex size-8 items-center justify-center rounded-md hover:bg-slate-200/70 focus-visible:ring-2 focus-visible:ring-brand-200 focus-visible:outline-none',
        tone,
      )}
    >
      <Icon className="size-[18px]" aria-hidden />
    </button>
  );
}

/** Table columns of the wide layout. `align`: 'left' | 'right'. */
export function buildInvoiceColumns(labels, actions) {
  return [
    {
      key: 'no',
      header: 'Invoice',
      render: (i) => <span className="font-semibold">#{displayInvoiceNo(labels, i.invoiceNo)}</span>,
    },
    { key: 'date', header: 'Date', render: (i) => formatDateIN(i.invoiceDate) },
    { key: 'party', header: labels.party, render: (i) => i.partyName, className: 'w-full max-w-0 truncate' },
    { key: 'total', header: 'Total', align: 'right', render: (i) => money(i.grandTotal) },
    {
      key: 'paid',
      header: 'Paid',
      align: 'right',
      render: (i) => <span className="text-emerald-700">{money(i.amountPaid)}</span>,
    },
    {
      key: 'returns',
      header: 'Returns',
      align: 'right',
      render: (i) =>
        i.totalReturns > 0 ? (
          <span className="text-amber-700">-{money(i.totalReturns)}</span>
        ) : (
          <span className="text-slate-400">-</span>
        ),
    },
    {
      key: 'balance',
      header: 'Balance',
      align: 'right',
      render: (i) => (
        <span className={cn('font-semibold', balanceOf(i) > 0 ? 'text-red-600' : 'text-emerald-700')}>
          {money(balanceOf(i))}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (i) => {
        const no = i.invoiceNo;
        return (
          <div className="flex justify-end">
            <IconAction
              icon={SquarePen}
              label={`Edit invoice ${no}`}
              tone="text-sky-600"
              onClick={() => actions.edit(no)}
            />
            <IconAction
              icon={FileDown}
              label={`Download statement ${no}`}
              tone="text-brand-600"
              onClick={() => actions.downloadStatement(no)}
            />
            <IconAction
              icon={MessageCircle}
              label={`Share statement ${no} on WhatsApp`}
              tone="text-whatsapp-dark"
              onClick={() => (actions.whatsAppMessage ?? actions.shareStatement)(no)}
            />
            <IconAction
              icon={Banknote}
              label={`Payments of invoice ${no}`}
              tone="text-emerald-600"
              onClick={() => actions.viewPayments(no)}
            />
            <IconAction
              icon={RotateCcw}
              label={`Returns of invoice ${no}`}
              tone="text-amber-600"
              onClick={() => actions.viewReturns(no)}
            />
            <IconAction
              icon={Trash2}
              label={`Delete invoice ${no}`}
              tone="text-red-600"
              onClick={() => actions.remove(no)}
            />
          </div>
        );
      },
    },
  ];
}

export function HistoryInvoiceTable({ invoices, labels, actions }) {
  const columns = useMemo(() => buildInvoiceColumns(labels, actions), [labels, actions]);
  const { open } = actions;
  return (
    <table className="w-full text-sm">
      <thead className="text-xs tracking-wide text-slate-500 uppercase">
        <tr>
          {columns.map((c) => (
            <th
              key={c.key}
              scope="col"
              className={cn(
                'px-2.5 py-2 font-semibold whitespace-nowrap',
                c.align === 'right' ? 'text-right' : 'text-left',
              )}
            >
              {c.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {invoices.map((invoice) => (
          <tr
            key={invoice.invoiceNo}
            onClick={open ? () => open(invoice.invoiceNo) : undefined}
            className={cn('tabular-nums', open && 'cursor-pointer hover:bg-brand-50')}
          >
            {columns.map((c) => (
              <td
                key={c.key}
                className={cn(
                  'px-2.5 py-1.5 whitespace-nowrap',
                  c.align === 'right' && 'text-right',
                  c.className,
                )}
              >
                {c.render(invoice)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export const HistoryInvoiceGroupBody = memo(function HistoryInvoiceGroupBody({ invoices, labels, actions }) {
  const { isExpanded } = useBreakpoint();
  if (isExpanded) return <HistoryInvoiceTable invoices={invoices} labels={labels} actions={actions} />;
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {invoices.map((invoice) => (
        <HistoryInvoiceCard key={invoice.invoiceNo} invoice={invoice} labels={labels} actions={actions} />
      ))}
    </div>
  );
});
