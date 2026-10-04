/**
 * Add Customer / Manage Customers — replaces legacy/manage-customers.html + js/manage-customers.js.
 * Desktop: directory table with the add / edit form card beside it. Phones & tablets: customer cards, a floating
 * "Add" button and the form in a bottom sheet. `?phone=` (sent by the Sales Bill) pre-fills the add form.
 */
import { RefreshCw, UserPlus, Users } from 'lucide-react';

import { Button, EmptyState, ErrorState, LoadingState, Page, SearchBar, TwoPane } from '@/ui';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { CustomerFormCard } from './CustomerFormCard';
import { CustomerFormSheet } from './CustomerFormSheet';
import { CustomerTable } from './CustomerTable';
import { useCustomerManager } from './useCustomerManager';

export default function AddCustomerPage() {
  const manager = useCustomerManager();
  const { isExpanded } = useBreakpoint();
  const { customers, visible, query } = manager;

  const refreshButton = (
    <Button
      variant="outline"
      icon={RefreshCw}
      onClick={() => void manager.refresh()}
      loading={manager.refreshing}
    >
      <span className="hidden sm:inline">Refresh</span>
    </Button>
  );
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

  const count = (
    <p className="mt-1.5 mb-3 ml-1 text-sm text-slate-500">
      {query.trim() ? `${visible.length} of ${customers.length} customers` : `${customers.length} customers`}
    </p>
  );
  const search = (
    <SearchBar
      value={query}
      onChange={manager.setQuery}
      placeholder="Search name, phone or address"
      aria-label="Search customers"
    />
  );

  if (isExpanded) {
    return (
      <Page {...pageProps} actions={refreshButton}>
        <TwoPane
          main={
            <>
              {search}
              {count}
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
    <Page {...pageProps} actions={refreshButton}>
      {search}
      {count}
      {customers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No customers found."
          message="Add your first customer to start billing."
          action={
            <Button icon={UserPlus} onClick={() => manager.openAdd()}>
              Add New Customer
            </Button>
          }
        />
      ) : visible.length === 0 ? (
        <EmptyState title="No matching customers" message="Try a different name, phone number or address." />
      ) : (
        <CustomerTable
          customers={visible}
          emptyText="No matching customers."
          onEdit={manager.openEdit}
          onDelete={manager.remove}
        />
      )}

      <button
        type="button"
        onClick={() => manager.openAdd()}
        aria-label="Add New Customer"
        className="fixed right-4 bottom-24 z-30 flex size-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-pop transition hover:bg-brand-700 active:scale-95 sm:right-6"
      >
        <UserPlus className="size-6" aria-hidden />
      </button>

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
