import { Download } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { formatRupees } from '@/core/format';
import { Button, Checkbox, ChoiceChips, Modal } from '@/ui';
import { computeStats } from './aggregate';
import { formatCount } from './display';
import { EXPORT_COLUMN_OPTIONS } from './exportData';

const FORMAT_OPTIONS = [
  { value: 'csv', label: 'CSV (Excel)' },
  { value: 'json', label: 'JSON' },
];
const ALL_COLUMNS = EXPORT_COLUMN_OPTIONS.map((o) => o.value);

function SummaryItem({ value, label }) {
  return (
    <div className="min-w-0 flex-1 rounded-lg bg-slate-100 p-3 text-center">
      <div className="truncate text-sm font-bold text-slate-900 tabular-nums">{value}</div>
      <div className="mt-0.5 text-xs text-slate-500">{label}</div>
    </div>
  );
}

/** "Export Customer Data" dialog: format, columns to include, data summary. `customers` = the full list (web ignored the search). */
export function ExportSheet({ visible, customers, onClose, onExport }) {
  const [format, setFormat] = useState('csv');
  const [columns, setColumns] = useState(ALL_COLUMNS);
  const summary = useMemo(() => computeStats(customers), [customers]);

  // the web built a fresh dialog every time: always start from CSV with every column ticked
  useEffect(() => {
    if (visible) {
      setFormat('csv');
      setColumns(ALL_COLUMNS);
    }
  }, [visible]);

  const toggle = (column) =>
    setColumns((current) =>
      current.includes(column) ? current.filter((c) => c !== column) : [...current, column],
    );

  return (
    <Modal
      open={visible}
      onClose={onClose}
      title="Export Customer Data"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} className="flex-1 sm:flex-none">
            Cancel
          </Button>
          <Button icon={Download} onClick={() => onExport(format, columns)} className="flex-1 sm:flex-none">
            Export Data
          </Button>
        </>
      }
    >
      <p className="mb-2 text-sm font-semibold text-slate-800">Export Format:</p>
      <ChoiceChips options={FORMAT_OPTIONS} value={format} onChange={setFormat} />

      <p className="mt-5 mb-1 text-sm font-semibold text-slate-800">Include Columns:</p>
      <div className="flex flex-col">
        {EXPORT_COLUMN_OPTIONS.map((o) => (
          <Checkbox
            key={o.value}
            label={o.label}
            checked={columns.includes(o.value)}
            onChange={() => toggle(o.value)}
            className="min-h-11"
          />
        ))}
      </div>

      <p className="mt-5 mb-2 text-sm font-semibold text-slate-800">Data Summary:</p>
      <div className="flex gap-2">
        <SummaryItem value={formatCount(summary.totalCustomers)} label="Customers" />
        <SummaryItem value={formatCount(summary.totalInvoices)} label="Total Invoices" />
        <SummaryItem value={formatRupees(summary.totalCurrentBillAmount)} label="Total Amount" />
      </div>
    </Modal>
  );
}
