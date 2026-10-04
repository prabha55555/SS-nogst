/**
 * Shared recycle-bin screen: list deleted bills, view, restore, delete permanently, empty the bin.
 * Configured per bin through `BIN_CONFIG[kind]` (sales = invoices, purchase = purchase bills).
 */
import { Clock, Database, FileText, RefreshCw, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import { formatCurrency, formatDateIN } from '@/core/format';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useFocusLoad } from '@/hooks/useFocusLoad';
import {
  Button,
  ChoiceChips,
  DataTable,
  EmptyState,
  ErrorState,
  Page,
  SearchBar,
  Skeleton,
  useFeedback,
} from '@/ui';
import { BinDetailSheet } from './BinDetailSheet';
import { BinItemCard, BinRowActions, deletedAtText } from './BinItemCard';
import {
  BIN_CONFIG,
  binItemName,
  computeBinStats,
  displayBillNo,
  filterBinItems,
  partyName,
} from './binLogic';
import { emptyBin, loadBinItems, permanentlyDeleteBinItem, restoreBinItem } from './binService';

const LOAD_ERROR = 'Failed to load recycle bin items. Please try again.';
const PAGE_SIZE = 50;

function StatTile({ icon: Icon, value, label }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-0.5 rounded-xl border border-slate-200 bg-white px-2 py-3 shadow-card">
      <Icon className="size-[18px] text-brand-600" aria-hidden />
      <div className="max-w-full truncate text-lg font-bold text-slate-900 tabular-nums">{value}</div>
      <div className="max-w-full truncate text-xs text-slate-500">{label}</div>
    </div>
  );
}

export default function RecycleBinScreen({ kind, title }) {
  const config = BIN_CONFIG[kind];
  const { toast, confirm, loading: overlay } = useFeedback();
  const { isExpanded, isMedium } = useBreakpoint();
  const [items, setItems] = useState([]);
  const [now, setNow] = useState(() => new Date());
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewItem, setViewItem] = useState(null);
  const [limit, setLimit] = useState(PAGE_SIZE);

  const { loading, refreshing, error, refresh, reload } = useFocusLoad(async () => {
    try {
      setItems(await loadBinItems(kind));
      setNow(new Date());
    } catch (e) {
      console.error('Error loading recycle bin items:', e);
      toast('Failed to load recycle bin items', undefined, 'error');
      throw new Error(LOAD_ERROR);
    }
  });

  const stats = useMemo(() => computeBinStats(items, config.itemType, now), [items, config.itemType, now]);
  const visible = useMemo(
    () => filterBinItems(items, typeFilter, search, now),
    [items, typeFilter, search, now],
  );
  const shown = visible.slice(0, limit);
  const remaining = visible.length - shown.length;

  const changeSearch = (v) => {
    setSearch(v);
    setLimit(PAGE_SIZE);
  };
  const changeFilter = (v) => {
    setTypeFilter(v);
    setLimit(PAGE_SIZE);
  };

  const onRestore = async (item) => {
    const ok = await confirm({
      title: 'Restore Item',
      message: `Are you sure you want to restore this item?\n\n${binItemName(item)} will be restored to its original location.`,
      confirmText: 'Restore',
    });
    if (!ok) return;
    try {
      await overlay.run(
        'Restoring Item',
        async () => {
          await restoreBinItem(kind, item.id);
          await reload();
        },
        'Please wait while we restore the item...',
      );
      toast('Item restored successfully!', undefined, 'success');
    } catch (e) {
      console.error('Error restoring item:', e);
      toast('Failed to restore item', undefined, 'error');
    }
  };

  const onPermanentDelete = async (item) => {
    const ok = await confirm({
      title: 'Permanent Delete',
      message: `This action cannot be undone. The item will be permanently deleted.\n\n${binItemName(item)} will be permanently deleted.\n\nThis action is irreversible!`,
      tone: 'danger',
      confirmText: 'Permanently Delete',
    });
    if (!ok) return;
    try {
      await overlay.run(
        'Deleting Item',
        async () => {
          await permanentlyDeleteBinItem(kind, item.id);
          await reload();
        },
        'Permanently removing item from database...',
      );
      toast('Item permanently deleted!', undefined, 'success');
    } catch (e) {
      console.error('Error deleting item:', e);
      toast('Failed to delete item', undefined, 'error');
    }
  };

  const onEmptyBin = async () => {
    const ok = await confirm({
      title: config.emptyButton,
      message: `${config.emptyConfirmMessage}\n\nAll items will be permanently lost!`,
      tone: 'danger',
      confirmText: config.emptyButton,
    });
    if (!ok) return;
    try {
      const deletedCount = await overlay.run(
        'Emptying Recycle Bin',
        async () => {
          const count = await emptyBin(kind);
          await reload();
          return count;
        },
        'Permanently deleting all items...',
      );
      toast(`Recycle bin emptied! ${deletedCount} items deleted.`, undefined, 'success');
    } catch (e) {
      console.error('Error emptying recycle bin:', e);
      toast('Failed to empty recycle bin', undefined, 'error');
    }
  };

  const actionsFor = (item) => ({
    onView: () => setViewItem(item),
    onRestore: () => void onRestore(item),
    onDelete: () => void onPermanentDelete(item),
  });

  const columns = [
    { key: 'no', header: 'Invoice No', render: (i) => <span className="font-bold">{displayBillNo(i)}</span> },
    { key: 'party', header: config.partyLabel, value: (i) => partyName(i) || '-' },
    { key: 'date', header: 'Date', value: (i) => (i.invoiceDate ? formatDateIN(i.invoiceDate) : '-') },
    {
      key: 'total',
      header: 'Total',
      align: 'right',
      className: 'whitespace-nowrap tabular-nums',
      value: (i) => `₹${formatCurrency(i.grandTotal)}`,
    },
    { key: 'deleted', header: 'Deleted At', value: (i) => deletedAtText(i, now) },
    { key: 'actions', header: 'Actions', render: (i) => <BinRowActions item={i} {...actionsFor(i)} /> },
  ];

  const empty =
    items.length === 0 ? (
      <EmptyState icon={Trash2} title={config.emptyTitle} message={config.emptyMessage} />
    ) : (
      <EmptyState icon={Search} title="No matching items" message="Try a different search or filter." />
    );

  let body;
  if (loading) {
    body = (
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-36 w-full rounded-xl" />
        ))}
      </div>
    );
  } else if (error) {
    body = <ErrorState message={error} onRetry={() => void reload()} />;
  } else if (visible.length === 0) {
    body = <div className="rounded-xl border border-slate-200 bg-white">{empty}</div>;
  } else {
    body = (
      <>
        {isExpanded ? (
          <DataTable rows={shown} columns={columns} rowKey={(i) => i.id} onRowClick={setViewItem} />
        ) : (
          <ul className={isMedium ? 'grid grid-cols-2 gap-3' : 'space-y-3'}>
            {shown.map((i) => (
              <li key={i.id}>
                <BinItemCard item={i} now={now} {...actionsFor(i)} />
              </li>
            ))}
          </ul>
        )}
        {remaining > 0 ? (
          <div className="mt-4 text-center">
            <Button variant="outline" onClick={() => setLimit((l) => l + PAGE_SIZE)}>
              Show more ({remaining} more)
            </Button>
          </div>
        ) : null}
      </>
    );
  }

  return (
    <Page
      title={title}
      subtitle={config.headerText}
      icon={Trash2}
      actions={
        <>
          <Button
            variant="danger"
            icon={Trash2}
            onClick={onEmptyBin}
            disabled={items.length === 0}
            className="max-sm:flex-1"
          >
            {config.emptyButton}
          </Button>
          <Button variant="secondary" icon={RefreshCw} loading={refreshing} onClick={() => void refresh()}>
            Refresh
          </Button>
        </>
      }
    >
      <div className="mb-4 grid grid-cols-3 gap-2 sm:gap-3">
        <StatTile icon={FileText} value={String(stats.totalItems)} label="Total Items" />
        <StatTile
          icon={Clock}
          value={stats.oldestDays === null ? '-' : `${stats.oldestDays} days`}
          label="Oldest Item"
        />
        <StatTile icon={Database} value={String(stats.invoiceItems)} label={config.countLabel} />
      </div>

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <SearchBar
          value={search}
          onChange={changeSearch}
          placeholder="Search deleted items..."
          aria-label="Search deleted items"
          className="lg:flex-1"
        />
        <ChoiceChips
          value={typeFilter}
          onChange={changeFilter}
          options={[
            { value: 'all', label: 'All Items' },
            { value: config.itemType, label: config.typeFilterLabel },
          ]}
        />
      </div>

      {body}
      <BinDetailSheet item={viewItem} config={config} onClose={() => setViewItem(null)} />
    </Page>
  );
}
