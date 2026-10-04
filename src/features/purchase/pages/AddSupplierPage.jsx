/**
 * Add Supplier — replaces original-app/manage-suppliers.html + js/manage-suppliers.js.
 * Add form (the `?phone=` query pre-fills the phone), searchable supplier directory, edit sheet and delete (confirm).
 * Wide desktops (xl): add form as a side card; everything narrower: form on top, directory below.
 */
import { ListChecks, Save, UserPlus, Users } from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  Modal,
  Page,
  Pagination,
  RefreshButton,
  SearchBar,
  SectionHeader,
  usePagination,
} from '@/ui';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { SupplierDirectory } from '../components/SupplierDirectory';
import { SupplierFormFields } from '../components/SupplierFormFields';
import { useSupplierDirectory } from '../hooks/useSupplierDirectory';

const EDIT_FORM_ID = 'edit-supplier-form';
const ADD_FORM_ID = 'add-supplier-form';

export default function AddSupplierPage() {
  const dir = useSupplierDirectory();
  const { isExpanded } = useBreakpoint();
  const pager = usePagination(dir.visible, { resetKey: dir.query });

  if (dir.loading && dir.suppliers.length === 0) {
    return (
      <Page title="Add Supplier" icon={UserPlus}>
        <LoadingState label="Loading suppliers…" />
      </Page>
    );
  }
  if (dir.error && dir.suppliers.length === 0) {
    return (
      <Page title="Add Supplier" icon={UserPlus}>
        <ErrorState message={dir.error} onRetry={dir.refresh} />
      </Page>
    );
  }

  const submitAdd = (e) => {
    e.preventDefault();
    if (!dir.adding) dir.add();
  };
  const submitEdit = (e) => {
    e.preventDefault();
    if (!dir.savingEdit) dir.saveEdit();
  };

  return (
    <Page
      title="Add Supplier"
      icon={UserPlus}
      actions={<RefreshButton loading={dir.refreshing} onClick={dir.refresh} />}
    >
      <div className="grid items-start gap-4 xl:grid-cols-[22rem_minmax(0,1fr)]">
        <Card
          as="form"
          id={ADD_FORM_ID}
          onSubmit={submitAdd}
          className="relative overflow-hidden xl:sticky xl:top-20"
        >
          <span className="absolute inset-x-0 top-0 h-[2px] hairline-gold" aria-hidden />
          <SectionHeader title="Add New Supplier" icon={UserPlus} className="mb-1" />
          <p className="mb-4 text-[13px] text-slate-500">
            Phone number and name are required; address is optional.
          </p>
          <SupplierFormFields
            value={dir.newSupplier}
            onChange={dir.setNewSupplier}
            layout="row"
            idPrefix="new-supplier"
          />
          {isExpanded ? (
            <Button
              type="submit"
              icon={UserPlus}
              fullWidth
              loading={dir.adding}
              className="mt-5 sm:w-auto xl:w-full"
            >
              Add Supplier
            </Button>
          ) : null}
        </Card>

        <section className="min-w-0 space-y-3.5" aria-label="Supplier Directory">
          <SectionHeader
            title="Supplier Directory"
            icon={ListChecks}
            className="mb-0"
            right={<Badge tone="brand">{dir.suppliers.length}</Badge>}
          />
          <SearchBar
            value={dir.query}
            onChange={dir.setQuery}
            placeholder="Search by name, phone or address..."
            aria-label="Search suppliers"
          />
          <div ref={pager.anchorRef} className="scroll-mt-32" />
          <SupplierDirectory
            suppliers={pager.rows}
            onEdit={dir.startEdit}
            onDelete={dir.remove}
            empty={
              <EmptyState
                icon={Users}
                title="No suppliers found."
                message={dir.query.trim() ? 'No supplier matches your search.' : 'Add your first supplier.'}
              />
            }
          />
          <Pagination pager={pager} noun="suppliers" />
        </section>
      </div>

      {isExpanded ? null : (
        // floating Add button (submits the form above); fixed bottom-right above the tab bar
        <button
          type="submit"
          form={ADD_FORM_ID}
          disabled={dir.adding}
          aria-label="Add Supplier"
          title="Add Supplier"
          className="no-print fixed right-4 bottom-[calc(4.6rem+env(safe-area-inset-bottom))] z-30 flex size-14 items-center justify-center rounded-full bg-gold-sheen text-brand-900 shadow-gold ring-4 ring-white/80 transition hover:brightness-105 focus-visible:ring-gold-300 focus-visible:outline-none active:scale-95 disabled:opacity-60 sm:right-6"
        >
          <UserPlus className="size-6" aria-hidden />
        </button>
      )}

      <Modal
        open={!!dir.editing}
        onClose={() => dir.setEditing(null)}
        title="Edit Supplier"
        footer={
          <>
            <Button variant="outline" onClick={() => dir.setEditing(null)}>
              Cancel
            </Button>
            <Button type="submit" form={EDIT_FORM_ID} variant="success" icon={Save} loading={dir.savingEdit}>
              Save
            </Button>
          </>
        }
      >
        {dir.editing ? (
          <form id={EDIT_FORM_ID} onSubmit={submitEdit}>
            <SupplierFormFields
              value={dir.editing.draft}
              onChange={(draft) => dir.setEditing({ ...dir.editing, draft })}
              idPrefix="edit-supplier"
            />
            <p className="mt-3 text-xs text-slate-500">
              The new details are also applied to every purchase bill of this supplier.
            </p>
          </form>
        ) : null}
      </Modal>
    </Page>
  );
}
