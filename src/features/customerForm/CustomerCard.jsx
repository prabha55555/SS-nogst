import { MapPin, Pencil, Phone, Trash2 } from 'lucide-react';
import { memo } from 'react';

import { Button } from '@/ui';

function InfoRow({ icon: Icon, text }) {
  return (
    <div className="flex items-start gap-2 py-0.5 text-sm text-slate-800">
      <Icon className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden />
      <span className="min-w-0 break-words">{text}</span>
    </div>
  );
}

/** One row of the "Customer Directory" table as a card body (DataTable draws the card frame): name, phone, address, Edit / Delete. */
export const CustomerCard = memo(function CustomerCard({ customer, onEdit, onDelete }) {
  return (
    <div>
      <h3 className="mb-1 text-lg font-bold text-slate-900">{customer.name || '(no name)'}</h3>
      <InfoRow icon={Phone} text={customer.phone || 'N/A'} />
      <InfoRow icon={MapPin} text={customer.address || 'N/A'} />
      <div className="mt-3 flex gap-3" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="outline"
          icon={Pencil}
          onClick={() => onEdit(customer)}
          aria-label={`Edit ${customer.name}`}
          className="flex-1"
        >
          Edit
        </Button>
        {customer.phone ? (
          <Button
            variant="outlineDanger"
            icon={Trash2}
            onClick={() => onDelete(customer)}
            aria-label={`Delete ${customer.name}`}
            className="flex-1"
          >
            Delete
          </Button>
        ) : null}
      </div>
    </div>
  );
});
