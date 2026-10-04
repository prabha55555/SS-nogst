/**
 * Invoice number + date block with the "Last Invoice / Suggested Next / Apply Suggestion" strip. Shared by the
 * Sales and Purchase bill screens.
 *
 * Props
 *  - lastLabel?: string                 default "Last Invoice"
 *  - last: string                       last invoice number of the financial year ('-' when none)
 *  - suggested: string                  suggested next number ('-' when none)
 *  - cycleRestarted?: boolean           shows "(Cycle Restarted)"
 *  - onApplySuggestion()                the "Apply Suggestion" button
 *  - invoiceNo: string, onInvoiceNoChange(value)
 *  - invoiceNoLabel?: string            default "Invoice No"
 *  - invoiceNoReadOnly?: boolean        edit mode: the number cannot change (the suggestion strip is hidden)
 *  - date: string (YYYY-MM-DD), onDateChange(value)
 *  - dateLabel?: string                 default "Invoice Date"
 *  - dateReadOnly?: boolean
 *  - hideSuggestion?: boolean
 */
import { Sparkles } from 'lucide-react';
import { Button, DateField, TextField } from '@/ui';

export function InvoiceHeaderFields({
  lastLabel = 'Last Invoice',
  last,
  suggested,
  cycleRestarted,
  onApplySuggestion,
  invoiceNo,
  onInvoiceNoChange,
  invoiceNoLabel = 'Invoice No',
  invoiceNoReadOnly,
  date,
  onDateChange,
  dateLabel = 'Invoice Date',
  dateReadOnly,
  hideSuggestion,
}) {
  const noSuggestion = !suggested || suggested === '-';
  return (
    <div className="space-y-3">
      {!invoiceNoReadOnly && !hideSuggestion ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-brand-50 p-3">
          <div className="min-w-0 text-sm text-slate-600">
            <div>
              {lastLabel}: <strong className="text-brand-700">{last || '-'}</strong>
            </div>
            <div>
              Suggested Next: <strong className="text-brand-700">{suggested || '-'}</strong>
              {cycleRestarted ? <span className="ml-1 text-xs text-red-600">(Cycle Restarted)</span> : null}
            </div>
          </div>
          <Button
            variant="info"
            size="sm"
            icon={Sparkles}
            disabled={noSuggestion}
            onClick={onApplySuggestion}
          >
            Apply Suggestion
          </Button>
        </div>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField
          label={invoiceNoLabel}
          placeholder="Invoice no."
          value={invoiceNo}
          readOnly={invoiceNoReadOnly}
          onChange={onInvoiceNoChange}
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
        />
        <DateField label={dateLabel} value={date} readOnly={dateReadOnly} onChange={onDateChange} />
      </div>
    </div>
  );
}
