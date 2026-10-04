import { Pencil, Trash2 } from 'lucide-react';

import { IconButton } from '@/ui';

/** Edit + delete icon buttons of a table row / card. */
export default function RowActions({ onEdit, onDelete, editLabel = 'Edit', deleteLabel = 'Delete' }) {
  return (
    <div className="flex items-center justify-center gap-1">
      <IconButton
        icon={Pencil}
        label={editLabel}
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className="text-slate-500 hover:bg-gold-50 hover:text-gold-700"
      />
      <IconButton
        icon={Trash2}
        label={deleteLabel}
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="text-slate-500 hover:bg-red-50 hover:text-red-600"
      />
    </div>
  );
}
