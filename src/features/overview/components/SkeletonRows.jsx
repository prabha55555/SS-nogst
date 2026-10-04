import { Skeleton } from '@/ui';

/** Placeholder blocks shown while a page loads. `height` is a Tailwind height class. */
export default function SkeletonRows({ count = 4, height = 'h-24', className = '' }) {
  return (
    <div className={`space-y-2.5 ${className}`} aria-busy="true" aria-label="Loading">
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} className={`${height} w-full rounded-xl`} />
      ))}
    </div>
  );
}
