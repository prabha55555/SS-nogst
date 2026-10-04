import { EyeOff, Trash2 } from 'lucide-react';
import { useRef } from 'react';

import { formatCurrency, formatDateIN } from '@/core/format';
import { Button, Divider, EmptyState, KeyValue, Modal } from '@/ui';
import { buildBinDetail } from './binLogic';

const rupees = (n) => `₹${formatCurrency(n)}`;

function Box({ children, className = '' }) {
  return (
    <div className={`rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 ${className}`}>{children}</div>
  );
}

function SectionTitle({ children }) {
  return <h3 className="mt-4 mb-2 text-base font-bold text-slate-900">{children}</h3>;
}

function Line({ first, title, sub, amount }) {
  return (
    <div className={`py-2 ${first ? '' : 'border-t border-slate-200'}`}>
      <div className="font-semibold text-slate-900">{title}</div>
      <div className="mt-0.5 flex justify-between gap-3 text-sm">
        <span className="text-slate-500">{sub}</span>
        <span className="font-bold text-slate-900 tabular-nums">{amount}</span>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <p className="text-slate-900">
      <span className="font-bold">{label}: </span>
      {value}
    </p>
  );
}

function DetailBody({ detail }) {
  const { summary } = detail;
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-200 pb-2">
        <h3 className="text-lg font-bold text-brand-700">{detail.heading}</h3>
        <span className="text-sm text-slate-500">Date: {detail.dateText}</span>
      </div>

      <div className="mb-3 space-y-1">
        <Info label={detail.partyLabel} value={detail.partyName} />
        <Info label="Phone" value={detail.phone} />
        <Info label="Address" value={detail.address} />
        <p className="flex items-center gap-1.5 text-sm text-red-600">
          <Trash2 className="size-3.5" aria-hidden /> Deleted: {detail.deletedText}
        </p>
      </div>

      <SectionTitle>Items</SectionTitle>
      <Box>
        {detail.lines.length === 0 ? (
          <p className="py-3 text-center text-slate-500">No items found</p>
        ) : (
          detail.lines.map((l, i) => (
            <Line
              key={i}
              first={i === 0}
              title={l.description}
              sub={`${l.qty} × ${rupees(l.rate)}`}
              amount={rupees(l.amount)}
            />
          ))
        )}
      </Box>

      <Box className="mt-3">
        <KeyValue label="Subtotal:" value={rupees(summary.subtotal)} />
        <KeyValue label="Old Balance:" value={rupees(summary.oldBalance)} />
        <Divider />
        <KeyValue label="Grand Total:" value={rupees(summary.grandTotal)} bold />
        <KeyValue label="Paid:" value={rupees(summary.paid)} valueClassName="text-emerald-600" />
        <KeyValue
          label="Balance Due:"
          value={rupees(summary.balanceDue)}
          valueClassName="text-red-600"
          bold
        />
      </Box>

      {detail.payments.length > 0 ? (
        <>
          <SectionTitle>Payments ({detail.payments.length})</SectionTitle>
          <Box>
            {detail.payments.map((p, i) => (
              <Line
                key={p.id}
                first={i === 0}
                title={`${formatDateIN(p.date)} · ${p.method}`}
                sub={p.type}
                amount={rupees(p.amount)}
              />
            ))}
          </Box>
        </>
      ) : null}

      {detail.returns.length > 0 ? (
        <>
          <SectionTitle>Returns ({detail.returns.length})</SectionTitle>
          <Box>
            {detail.returns.map((r, i) => (
              <Line
                key={r.id}
                first={i === 0}
                title={r.description}
                sub={`${formatDateIN(r.date)} · Qty ${r.qty}`}
                amount={rupees(r.amount)}
              />
            ))}
          </Box>
        </>
      ) : null}
    </div>
  );
}

/** "View Details" dialog of the web bin (products + totals) plus the payments / returns that come back on restore. */
export function BinDetailSheet({ item, config, onClose }) {
  // keep showing the last item while the dialog closes
  const lastItem = useRef(null);
  if (item) lastItem.current = item;
  const shown = item ?? lastItem.current;
  const detail = shown ? buildBinDetail(shown, config) : null;
  return (
    <Modal
      open={item !== null}
      onClose={onClose}
      title="View Details"
      footer={
        <Button variant="secondary" onClick={onClose} className="flex-1 sm:flex-none">
          Close
        </Button>
      }
    >
      {detail ? (
        <DetailBody detail={detail} />
      ) : (
        <EmptyState icon={EyeOff} title="Preview not available for this item type." />
      )}
    </Modal>
  );
}
