import { ChevronDown } from 'lucide-react';

import { Button } from '@/ui';

import { PAGE_SIZE } from './paging';

/** "Show more" button under a paged list (see usePagedRows); renders nothing when everything is shown. */
export default function ShowMore({ remaining, onClick }) {
  if (remaining <= 0) return null;
  return (
    <Button variant="outline" icon={ChevronDown} fullWidth className="mt-4" onClick={onClick}>
      Show more ({Math.min(remaining, PAGE_SIZE)} of {remaining} remaining)
    </Button>
  );
}
