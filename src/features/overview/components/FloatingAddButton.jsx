import { Plus } from 'lucide-react';

/** Phone-only floating "add" button, parked above the bottom tab bar. */
export default function FloatingAddButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="no-print fixed right-4 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-20 flex size-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-pop transition hover:bg-brand-700 focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:outline-none active:scale-95 sm:hidden"
    >
      <Plus className="size-7" aria-hidden />
    </button>
  );
}
