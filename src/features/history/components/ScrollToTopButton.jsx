/**
 * ScrollToTopButton – round floating button that appears once the page is scrolled down
 * (the web page's scroll-to-top button). Listens to the window scroll itself.
 *
 * Props: threshold (px, default 300) · className (extra positioning classes).
 */
import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/ui';

export function ScrollToTopButton({ threshold = 300, className }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  if (!visible) return null;
  return (
    <button
      type="button"
      aria-label="Scroll to top"
      title="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={cn(
        'fixed right-4 bottom-24 z-30 flex size-12 items-center justify-center rounded-full bg-brand-600 text-white shadow-pop transition hover:bg-brand-700 focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:outline-none lg:right-8 lg:bottom-8',
        className,
      )}
    >
      <ArrowUp className="size-6" aria-hidden />
    </button>
  );
}
