/**
 * Customer Details — replaces legacy/customer-details.html + js/customer-details.js.
 * Search toolbar, stat tiles, customer list (table on desktop, cards on phones / tablets), export and WhatsApp
 * reminder dialogs. Customers are derived from the sales invoices (see aggregate.js).
 */
import { Download, RefreshCw, Users } from 'lucide-react';

import { useBreakpoint } from '@/hooks/useBreakpoint';
import { Button, EmptyState, ErrorState, LoadingState, Page } from '@/ui';
import { CustomerCard } from './CustomerCard';
import { CustomerTable } from './CustomerTable';
import { ExportSheet } from './ExportSheet';
import { ReminderSheet } from './ReminderSheet';
import { SearchToolbar } from './SearchToolbar';
import { StatsGrid } from './StatsGrid';
import { useCustomerDetails } from './useCustomerDetails';

export default function CustomerDetailsPage() {
  const model = useCustomerDetails();
  const { isExpanded, isMedium } = useBreakpoint();
  const { visible, stats, refreshing, refresh, setTerm, setReminderFor, openExport } = model;

  const actions = (
    <>
      <Button variant="success" icon={Download} onClick={openExport}>
        Export
      </Button>
      <Button variant="danger" icon={RefreshCw} loading={refreshing} onClick={() => void refresh()}>
        Refresh
      </Button>
    </>
  );
  const head = {
    title: 'Sales Customer Details',
    subtitle: 'Search and manage all customer information',
    icon: Users,
  };

  if (model.loading) {
    return (
      <Page {...head} max="7xl">
        <LoadingState label="Loading customers…" />
      </Page>
    );
  }
  if (model.error) {
    return (
      <Page {...head} max="7xl">
        <ErrorState message={`Error loading customer data: ${model.error}`} onRetry={() => void refresh()} />
      </Page>
    );
  }

  let list;
  if (isExpanded) {
    list = <CustomerTable rows={visible} onRemind={setReminderFor} />;
  } else if (visible.length === 0) {
    list = (
      <div className="rounded-xl border border-slate-200 bg-white">
        <EmptyState
          title="No Customers Found"
          message="Start by creating invoices to see customer data here"
        />
      </div>
    );
  } else {
    list = (
      <ul className={isMedium ? 'grid grid-cols-2 gap-3' : 'space-y-3'}>
        {visible.map((c) => (
          <li key={c.name}>
            <CustomerCard customer={c} onRemind={setReminderFor} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <Page {...head} max="7xl" actions={actions}>
      <SearchToolbar onTermChange={setTerm} />
      <StatsGrid stats={stats} />
      <h2 className="mb-3 text-base font-bold text-slate-800">Customer List</h2>
      {list}

      <ReminderSheet customer={model.reminderFor} onClose={() => setReminderFor(null)} />
      <ExportSheet
        visible={model.exportOpen}
        customers={model.customers}
        onClose={() => model.setExportOpen(false)}
        onExport={model.runExport}
      />
    </Page>
  );
}
