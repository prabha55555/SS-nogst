import { Loader2 } from 'lucide-react';
import { cn } from './cn';

const VARIANTS = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-300',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-300',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-300',
  warning: 'bg-amber-400 text-slate-900 hover:bg-amber-500 focus-visible:ring-amber-200',
  info: 'bg-sky-600 text-white hover:bg-sky-700 focus-visible:ring-sky-300',
  secondary: 'bg-slate-600 text-white hover:bg-slate-700 focus-visible:ring-slate-300',
  purple: 'bg-violet-600 text-white hover:bg-violet-700 focus-visible:ring-violet-300',
  whatsapp: 'bg-whatsapp text-white hover:bg-whatsapp-dark focus-visible:ring-green-300',
  outline: 'border border-brand-600 bg-white text-brand-700 hover:bg-brand-50 focus-visible:ring-brand-200',
  outlineDanger: 'border border-red-500 bg-white text-red-600 hover:bg-red-50 focus-visible:ring-red-200',
  ghost: 'text-brand-700 hover:bg-brand-50 focus-visible:ring-brand-200',
  subtle: 'bg-slate-100 text-slate-700 hover:bg-slate-200 focus-visible:ring-slate-300',
};

const SIZES = {
  sm: 'min-h-9 px-3 text-sm',
  md: 'min-h-11 px-4 text-sm sm:min-h-10',
  lg: 'min-h-12 px-6 text-base',
};

/**
 * <Button variant="primary" icon={Save} onClick={...}>Save</Button>
 * `icon` is a lucide-react component; `loading` shows a spinner and disables the button.
 * Variants: primary success danger warning info secondary purple whatsapp outline outlineDanger ghost subtle.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading = false,
  disabled = false,
  fullWidth = false,
  type = 'button',
  className,
  children,
  ...rest
}) {
  const inactive = disabled || loading;
  return (
    <button
      type={type}
      disabled={inactive}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-semibold whitespace-nowrap transition',
        'focus-visible:ring-2 focus-visible:outline-none active:scale-[0.98]',
        'disabled:cursor-not-allowed disabled:opacity-55',
        VARIANTS[variant],
        SIZES[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : Icon ? (
        <Icon className="size-4" aria-hidden />
      ) : null}
      {children}
    </button>
  );
}

/** Square icon-only button (toolbar actions). Always pass `label` for screen readers. */
export function IconButton({ icon: Icon, label, variant = 'ghost', className, ...rest }) {
  return (
    <Button
      variant={variant}
      aria-label={label}
      title={label}
      className={cn('min-h-10! w-10! px-0! sm:min-h-9! sm:w-9!', className)}
      {...rest}
    >
      <Icon className="size-5" aria-hidden />
    </Button>
  );
}
