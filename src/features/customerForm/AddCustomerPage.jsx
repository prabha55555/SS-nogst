/**
 * Add Customer / Manage Customers — replaces original-app/manage-customers.html + js/manage-customers.js.
 * Desktop: directory table with the add / edit form card beside it. Phones & tablets: customer cards, a floating
 * "Add" button and the form in a bottom sheet. `?phone=` (sent by the Sales Bill) pre-fills the add form.
 */
import { RefreshCw, Search, UserPlus, Users } from 'lucide-react';

import { Badge, Button, EmptyState, ErrorState, IconButton, LoadingState, Page, SearchBar, TwoPane } from '@/ui';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { CustomerFormCard } from './CustomerFormCard';
import { CustomerFormSheet } from './CustomerFormSheet';
import { CustomerTable } from './CustomerTable';
import { useCustomerManager } from './useCustomerManager';

export default function AddCustomerPage() {
  const manager = useCustomerManager();
  const { isExpanded } = useBreakpoint();
  const { customers, visible, query } = manager;

  const actionButton = !isExpanded ? (
    <IconButton
      variant="primary"
      icon={UserPlus}
      label="Add Customer"
      onClick={() => manager.openAdd()}
      className="rounded-full"
    />
  ) : null;
  const pageProps = { title: 'Manage Customers', subtitle: 'Add, edit, or delete customers', icon: Users };

  if (manager.loading) {
    return (
      <Page {...pageProps}>
        <LoadingState label="Loading customers..." />
      </Page>
    );
  }
  if (manager.error && customers.length === 0) {
    return (
      <Page {...pageProps}>
        <ErrorState message={manager.error} onRetry={() => void manager.reload()} />
      </Page>
    );
  }

  const toolbar = (
    <div className="mb-4 flex flex-col gap-2.5 sm:flex-row sm:items-center">
      <SearchBar
        value={query}
        onChange={manager.setQuery}
        placeholder="Search name, phone or address"
        aria-label="Search customers"
        className="min-w-0 flex-1"
      />
      <Badge tone="brand" className="self-start px-3 py-1 text-[13px] tabular-nums sm:self-auto">
        {query.trim()
          ? `${visible.length} of ${customers.length} customers`
          : `${customers.length} customers`}
      </Badge>
    </div>
  );

  if (isExpanded) {
    return (
      <Page {...pageProps} actions={actionButton}>
        <TwoPane
          main={
            <>
              {toolbar}
              <CustomerTable
                customers={visible}
                emptyText={customers.length === 0 ? 'No customers found.' : 'No matching customers.'}
                onEdit={manager.openEdit}
                onDelete={manager.remove}
              />
            </>
          }
          side={
            <CustomerFormCard
              mode={manager.form.mode}
              initial={manager.form.initial}
              onCancel={manager.form.reset}
              onSubmit={manager.form.submit}
            />
          }
        />
      </Page>
    );
  }

  return (
    <Page {...pageProps} actions={actionButton}>
      {toolbar}
      {customers.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white shadow-card">
          <EmptyState
            icon={Users}
            title="No customers found."
            message="Add your first customer to start billing."
          />
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white shadow-card">
          <EmptyState
            icon={Search}
            title="No matching customers"
            message="Try a different name, phone number or address."
          />
        </div>
      ) : (
        <CustomerTable
          customers={visible}
          emptyText="No matching customers."
          onEdit={manager.openEdit}
          onDelete={manager.remove}
        />
      )}



      <CustomerFormSheet
        visible={manager.form.open}
        mode={manager.form.mode}
        initial={manager.form.initial}
        onClose={manager.form.close}
        onSubmit={manager.form.submit}
      />
    </Page>
  );
}
