/**
 * Add Supplier — replaces legacy/manage-suppliers.html + js/manage-suppliers.js.
 * Add form (the `?phone=` query pre-fills the phone), searchable supplier directory, edit sheet and delete (confirm).
 * Wide desktops (xl): add form as a side card; everything narrower: form on top, directory below.
 */
import { ListChecks, RefreshCw, Save, UserPlus, Users } from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  Modal,
  Page,
  SearchBar,
  SectionHeader,
} from '@/ui';
import { SupplierDirectory } from '../components/SupplierDirectory';
import { SupplierFormFields } from '../components/SupplierFormFields';
import { useSupplierDirectory } from '../hooks/useSupplierDirectory';

const EDIT_FORM_ID = 'edit-supplier-form';

export default function AddSupplierPage() {
  const dir = useSupplierDirectory();

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
      actions={
        <Button variant="subtle" icon={RefreshCw} loading={dir.refreshing} onClick={dir.refresh}>
          Refresh
        </Button>
      }
    >
      <div className="grid items-start gap-4 xl:grid-cols-[22rem_minmax(0,1fr)]">
        <Card as="form" onSubmit={submitAdd} className="xl:sticky xl:top-4">
          <SectionHeader title="Add New Supplier" icon={UserPlus} />
          <SupplierFormFields
            value={dir.newSupplier}
            onChange={dir.setNewSupplier}
            layout="row"
            idPrefix="new-supplier"
          />
          <Button
            type="submit"
            icon={UserPlus}
            fullWidth
            loading={dir.adding}
            className="mt-4 sm:w-auto xl:w-full"
          >
            Add Supplier
          </Button>
        </Card>

        <section className="min-w-0 space-y-3" aria-label="Supplier Directory">
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
          <SupplierDirectory
            suppliers={dir.visible}
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
        </section>
      </div>

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
