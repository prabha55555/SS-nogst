import { MapPin, Pencil, Phone, Trash2 } from 'lucide-react';
import { Button } from '@/ui';

/** One supplier of the directory on phones (a row of the desktop table) with its Edit / Delete actions. */
export function SupplierAdminCard({ supplier, onEdit, onDelete }) {
  return (
    <div>
      <div className="font-semibold text-slate-900">{supplier.name}</div>
      <div className="mt-1.5 flex items-start gap-2 text-sm text-slate-600">
        <Phone className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden />
        <span className="tabular-nums">{supplier.phone || 'N/A'}</span>
      </div>
      <div className="mt-1 flex items-start gap-2 text-sm text-slate-600">
        <MapPin className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden />
        <span className="min-w-0 break-words">{supplier.address || 'N/A'}</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          icon={Pencil}
          onClick={() => onEdit(supplier)}
          aria-label={`Edit ${supplier.name}`}
        >
          Edit
        </Button>
        <Button
          variant="outlineDanger"
          icon={Trash2}
          onClick={() => onDelete(supplier)}
          aria-label={`Delete ${supplier.name}`}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
