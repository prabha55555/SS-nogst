/**
 * Other Expenses — replaces legacy/expenses.html + js/expenses.js (+ css/expenses.css).
 * KPI row (day / month / overall totals of the filtered list), date + reason filters, expense log (table → cards on
 * phones) with edit / delete, and an add / edit sheet (header button, floating "+" on phones).
 */
import { CalendarDays, CalendarRange, Plus, Sigma, Wallet } from 'lucide-react';
import { useMemo, useState } from 'react';

import { db } from '@/core/db';
import { formatCurrency, formatDateShort, toNum, todayISO } from '@/core/format';
import { useFocusLoad } from '@/hooks/useFocusLoad';
import { Button, DataTable, EmptyState, ErrorState, Page, StatCard, useFeedback } from '@/ui';

import FilterBar from '../components/FilterBar';
import FloatingAddButton from '../components/FloatingAddButton';
import KpiRow from '../components/KpiRow';
import RefreshButton from '../components/RefreshButton';
import RowActions from '../components/RowActions';
import ShowMore from '../components/ShowMore';
import SkeletonRows from '../components/SkeletonRows';
import { usePagedRows } from '../components/paging';
import ExpenseFormModal from './ExpenseFormModal';
import {
  buildExpense,
  computeExpenseTotals,
  emptyExpenseForm,
  expenseToForm,
  filterExpenses,
  validateExpense,
} from './expensesLogic';

const rs = (n) => `Rs. ${formatCurrency(n)}`;
/** "Today's Total:" -> "Today's Total" (KPI labels have no trailing colon) */
const kpiLabel = (text) => text.replace(/:$/, '');

export default function ExpensesPage() {
  const { toast, confirm } = useFeedback();
  const [expenses, setExpenses] = useState([]);
  const [dateTerm, setDateTerm] = useState('');
  const [reasonTerm, setReasonTerm] = useState('');
  const [form, setForm] = useState(null); // null = sheet closed
  const [saving, setSaving] = useState(false);

  const { loading, refreshing, error, refresh, reload } = useFocusLoad(async () => {
    try {
      setExpenses(await db.getAllExpenses());
    } catch (e) {
      console.error('Error loading expenses:', e);
      toast('Error', 'Failed to load expenses', 'error');
      throw new Error('Error loading expenses');
    }
  });

  // totals are always computed from the full filtered list, never from the visible page
  const shown = useMemo(
    () => filterExpenses(expenses, dateTerm, reasonTerm),
    [expenses, dateTerm, reasonTerm],
  );
  const totals = useMemo(() => computeExpenseTotals(shown, dateTerm, todayISO()), [shown, dateTerm]);
  const paged = usePagedRows(shown, `${dateTerm}|${reasonTerm}`);

  const save = async () => {
    const invalid = validateExpense(form);
    if (invalid) {
      toast('Warning', invalid, 'warning');
      return;
    }
    setSaving(true);
    try {
      await db.saveExpense(buildExpense(form));
      toast('Success', 'Expense saved successfully!', 'success');
      setForm(null);
      await reload();
    } catch (e) {
      console.error('Error saving expense:', e);
      toast('Error', 'Failed to save expense.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (expense) => {
    const ok = await confirm({
      title: 'Are you sure?',
      message: "You won't be able to revert this!",
      tone: 'danger',
      confirmText: 'Yes, delete it!',
    });
    if (!ok) return;
    try {
      await db.deleteExpense(expense.id);
      toast('Deleted!', 'Expense has been deleted.', 'success');
      await reload();
    } catch (e) {
      console.error('Error deleting expense:', e);
      toast('Error', 'Failed to delete expense.', 'error');
    }
  };

  const openAdd = () => setForm(emptyExpenseForm(todayISO()));
  const actions = (e) => (
    <RowActions
      editLabel="Edit expense"
      deleteLabel="Delete expense"
      onEdit={() => setForm(expenseToForm(e))}
      onDelete={() => void remove(e)}
    />
  );

  const columns = [
    { key: 'date', header: 'Date', className: 'whitespace-nowrap', value: (e) => formatDateShort(e.date) },
    { key: 'reason', header: 'Reason', className: 'min-w-48', value: (e) => e.reason || '-' },
    {
      key: 'amount',
      header: 'Amount (Rs.)',
      align: 'right',
      className: 'font-semibold tabular-nums whitespace-nowrap',
      value: (e) => rs(toNum(e.amount)),
    },
    { key: 'actions', header: 'Actions', align: 'center', render: actions },
  ];

  let body;
  if (loading) body = <SkeletonRows count={4} height="h-20" />;
  else if (error) body = <ErrorState message={error} onRetry={() => void reload()} />;
  else
    body = (
      <>
        <DataTable
          columns={columns}
          rows={paged.rows}
          rowKey={(e) => e.id}
          renderCard={(e) => (
            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <div className="text-sm text-slate-500">{formatDateShort(e.date)}</div>
                <div className="break-words text-slate-800">{e.reason || '-'}</div>
                <div className="text-lg font-bold text-slate-900 tabular-nums">{rs(toNum(e.amount))}</div>
              </div>
              {actions(e)}
            </div>
          )}
          empty={<EmptyState icon={Wallet} title="No expenses found." />}
        />
        <ShowMore remaining={paged.remaining} onClick={paged.showMore} />
      </>
    );

  return (
    <Page
      title="Other Expenses"
      icon={Wallet}
      actions={
        <>
          <RefreshButton onClick={refresh} refreshing={refreshing} />
          <Button icon={Plus} onClick={openAdd} className="max-sm:hidden">
            Add Expense
          </Button>
        </>
      }
    >
      <KpiRow cols={3}>
        <StatCard
          icon={CalendarDays}
          label={kpiLabel(totals.dayLabel)}
          value={rs(totals.dayTotal)}
          tint="sky"
        />
        <StatCard
          icon={CalendarRange}
          label={kpiLabel(totals.monthLabel)}
          value={rs(totals.monthTotal)}
          tint="green"
        />
        <StatCard icon={Sigma} label="Overall Total" value={rs(totals.total)} tint="red" />
      </KpiRow>
      <FilterBar
        date={dateTerm}
        onDateChange={setDateTerm}
        text={reasonTerm}
        onTextChange={setReasonTerm}
        textPlaceholder="Search by Reason..."
        onClear={() => {
          setDateTerm('');
          setReasonTerm('');
        }}
      />
      {body}
      <FloatingAddButton label="Add expense" onClick={openAdd} />
      <ExpenseFormModal
        form={form}
        onChange={setForm}
        saving={saving}
        onClose={() => setForm(null)}
        onSave={() => void save()}
      />
    </Page>
  );
}
