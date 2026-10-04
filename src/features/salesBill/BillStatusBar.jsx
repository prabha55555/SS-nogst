/**
 * Saved / unsaved indicator and the edit-mode banner of the Sales Bill screen.
 * (The web page had no visual cue for `isBillSaved`, only the blocked-button toasts.)
 *
 * SaveBadge props:  saved: boolean
 * EditBanner props: saved: boolean · editingNo: string | null (renders nothing for a new bill) · onNewBill()
 */
import { FilePenLine, PlusCircle } from 'lucide-react';
import { Badge, Button } from '@/ui';

export function SaveBadge({ saved }) {
  return <Badge tone={saved ? 'success' : 'warning'}>{saved ? 'Saved' : 'Not saved'}</Badge>;
}

export function EditBanner({ saved, editingNo, onNewBill }) {
  if (editingNo === null) return null;
  return (
    <div
      role="status"
      className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-sky-50 p-3 text-sky-900 ring-1 ring-sky-200"
    >
      <div className="flex min-w-0 items-center gap-2">
        <FilePenLine className="size-5 shrink-0" aria-hidden />
        <span className="truncate font-bold">Editing invoice #{editingNo}</span>
        <SaveBadge saved={saved} />
      </div>
      <Button variant="outline" size="sm" icon={PlusCircle} onClick={onNewBill}>
        New bill
      </Button>
    </div>
  );
}
