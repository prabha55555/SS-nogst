import { AlertCircle, Inbox, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { cn } from './cn';

export function Spinner({ className }) {
  return (
    <span
      className={cn(
        'inline-block size-6 animate-spin rounded-full border-[3px] border-brand-600 border-t-transparent',
        className,
      )}
      role="status"
      aria-label="Loading"
    />
  );
}

export function LoadingState({ label = 'Loading…', className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-16 text-slate-500', className)}>
      <Spinner className="size-8" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', message, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-2 px-4 py-14 text-center', className)}>
      <span className="flex size-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <Icon className="size-7" aria-hidden />
      </span>
      <h3 className="text-base font-semibold text-slate-700">{title}</h3>
      {message ? <p className="max-w-sm text-sm text-slate-500">{message}</p> : null}
      {action}
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong while loading.', onRetry, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 px-4 py-14 text-center', className)}>
      <span className="flex size-14 items-center justify-center rounded-full bg-red-50 text-red-500">
        <AlertCircle className="size-7" aria-hidden />
      </span>
      <p className="max-w-sm text-sm text-slate-600">{message}</p>
      {onRetry ? (
        <Button variant="outline" icon={RefreshCw} onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}

/** Pulsing placeholder block: <Skeleton className="h-4 w-32" /> */
export function Skeleton({ className }) {
  return <div className={cn('animate-pulse rounded-md bg-slate-200', className)} aria-hidden />;
}
