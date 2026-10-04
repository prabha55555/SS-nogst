/** Phone-only bar that sticks just above the bottom tab bar (used for running totals). */
export default function StickyBar({ children }) {
  return (
    <div className="sticky bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-20 mt-3 rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-pop backdrop-blur lg:hidden">
      {children}
    </div>
  );
}
