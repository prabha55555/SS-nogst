/**
 * Loading placeholders (the web page's skeleton-loader).
 *
 * SkeletonBlock({ className })        – one pulsing block, size it with Tailwind (`h-24 w-48`).
 * InvoiceListSkeleton({ count = 3 })  – placeholder invoice cards while the list loads.
 */
import { Skeleton } from '@/ui';

export function SkeletonBlock({ className = 'h-12 w-full' }) {
  return <Skeleton className={className} />;
}

export function InvoiceListSkeleton({ count = 3 }) {
  return (
    <div className="space-y-3" role="status" aria-label="Loading invoices">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-card">
          <SkeletonBlock className="h-5 w-40" />
          <SkeletonBlock className="h-4 w-56 max-w-full" />
          <SkeletonBlock className="h-28 w-full" />
          <div className="flex gap-2">
            <SkeletonBlock className="h-10 flex-1" />
            <SkeletonBlock className="h-10 flex-1" />
            <SkeletonBlock className="h-10 flex-1" />
          </div>
        </div>
      ))}
    </div>
  );
}
