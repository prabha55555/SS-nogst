import { Pencil, Trash2 } from 'lucide-react';
import { useMemo } from 'react';

import { DataTable, EmptyState, IconButton } from '@/ui';
import { CustomerCard } from './CustomerCard';

/**
 * The website's "Customer Directory" table (Name, Phone, Address, Actions). Clicking a row edits it; the pencil / bin
 * icons do the same explicitly. On phones `DataTable` falls back to `CustomerCard`s.
 */
export function CustomerTable({ customers, emptyText, onEdit, onDelete }) {
  const columns = useMemo(
    () => [
      { key: 'name', header: 'Customer Name', value: (c) => c.name || '(no name)', className: 'font-medium' },
      {
        key: 'phone',
        header: 'Phone',
        value: (c) => c.phone || 'N/A',
        className: 'whitespace-nowrap tabular-nums',
      },
      { key: 'address', header: 'Address', value: (c) => c.address || 'N/A' },
      {
        key: 'actions',
        header: 'Actions',
        align: 'center',
        render: (c) => (
          <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
            <IconButton icon={Pencil} label={`Edit ${c.name}`} onClick={() => onEdit(c)} />
            {c.phone ? (
              <IconButton
                icon={Trash2}
                label={`Delete ${c.name}`}
                className="text-red-600 hover:bg-red-50"
                onClick={() => onDelete(c)}
              />
            ) : null}
          </div>
        ),
      },
    ],
    [onDelete, onEdit],
  );

  return (
    <DataTable
      rows={customers}
      rowKey={(c, i) => c.phone || `customer_${i}`}
      columns={columns}
      renderCard={(c) => <CustomerCard customer={c} onEdit={onEdit} onDelete={onDelete} />}
      onRowClick={onEdit}
      empty={<EmptyState title={emptyText} />}
    />
  );
}
