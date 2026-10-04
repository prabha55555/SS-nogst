import { RefreshCw } from 'lucide-react';

import { Button } from '@/ui';

/** Page-header refresh action (drops the in-memory cache, see useFocusLoad().refresh). */
export default function RefreshButton({ onClick, refreshing }) {
  return (
    <Button variant="subtle" onClick={onClick} disabled={refreshing} aria-label="Refresh" title="Refresh">
      <RefreshCw className={refreshing ? 'size-4 animate-spin' : 'size-4'} aria-hidden />
      <span className="hidden sm:inline">Refresh</span>
    </Button>
  );
}
