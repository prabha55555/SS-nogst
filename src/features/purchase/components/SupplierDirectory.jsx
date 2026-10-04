import { Pencil, Trash2 } from 'lucide-react';
import { Button, DataTable } from '@/ui';
import { SupplierAdminCard } from './SupplierAdminCard';

/** The Supplier Directory: a table on tablets / desktops, cards on phones. */
export function SupplierDirectory({ suppliers, empty, onEdit, onDelete }) {
  const columns = [
    {
      key: 'name',
      header: 'Supplier Name',
      mobile: 'title',
      render: (s) => <span className="font-semibold text-slate-900">{s.name}</span>,
    },
    { key: 'phone', header: 'Phone', className: 'tabular-nums', value: (s) => s.phone || 'N/A' },
    { key: 'address', header: 'Address', className: 'max-w-xs', value: (s) => s.address || 'N/A' },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (s) => (
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            icon={Pencil}
            onClick={() => onEdit(s)}
            aria-label={`Edit ${s.name}`}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="outlineDanger"
            icon={Trash2}
            onClick={() => onDelete(s)}
            aria-label={`Delete ${s.name}`}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];
  return (
    <DataTable
      columns={columns}
      rows={suppliers}
      rowKey={(s, i) => s.phone || String(i)}
      renderCard={(s) => <SupplierAdminCard supplier={s} onEdit={onEdit} onDelete={onDelete} />}
      empty={empty}
      dense
    />
  );
}
