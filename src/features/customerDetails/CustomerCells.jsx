/** Small pieces shared by the phone card and the desktop table row. */
import { MapPin, MessageCircle, Phone, RefreshCcw, User } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Button, cn } from '@/ui';
import {
  isAddressTruncated,
  isPhoneMasked,
  maskPhone,
  PHONE_REVEAL_MS,
  previewAddress,
  revealPhone,
} from './display';
import { canSendReminder } from './reminder';

export const TONE_CLASS = {
  positive: 'text-emerald-600',
  negative: 'text-red-600',
  neutral: 'text-slate-800',
};

/** Masked phone that shows the full number for 5 seconds when clicked (web: togglePhoneNumber). */
function usePhoneReveal(phone) {
  const [revealed, setRevealed] = useState(false);
  const timer = useRef(null);
  const canReveal = isPhoneMasked(phone);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const toggle = useCallback(() => {
    if (!canReveal) return;
    if (timer.current) clearTimeout(timer.current);
    if (revealed) {
      setRevealed(false);
      return;
    }
    setRevealed(true);
    timer.current = setTimeout(() => setRevealed(false), PHONE_REVEAL_MS);
  }, [canReveal, revealed]);

  return { text: revealed ? revealPhone(phone) : maskPhone(phone), revealed, canReveal, toggle };
}

export function PhoneReveal({ phone, showIcon }) {
  const { text, revealed, canReveal, toggle } = usePhoneReveal(phone);
  return (
    <button
      type="button"
      onClick={toggle}
      disabled={!canReveal}
      title={canReveal ? 'Click to reveal full number' : undefined}
      aria-label={`Phone ${text}`}
      className={cn(
        'flex min-h-7 items-center gap-2 text-left text-sm tabular-nums',
        revealed ? 'font-bold text-slate-900' : 'font-medium text-slate-500',
        canReveal && 'cursor-pointer hover:text-brand-600',
      )}
    >
      {showIcon ? <Phone className="size-4 shrink-0 text-slate-400" aria-hidden /> : null}
      {text}
    </button>
  );
}

/** First 30 characters; the full address is in the tooltip, and a tap expands it (phones have no hover). */
export function AddressText({ address, showIcon }) {
  const [expanded, setExpanded] = useState(false);
  const truncated = isAddressTruncated(address);
  return (
    <button
      type="button"
      onClick={() => setExpanded((v) => !v)}
      disabled={!truncated}
      title={address || 'N/A'}
      aria-label={`Address ${address || 'N/A'}`}
      className={cn(
        'flex min-h-7 items-start gap-2 text-left text-sm font-medium text-slate-500',
        truncated && 'cursor-pointer',
      )}
    >
      {showIcon ? <MapPin className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden /> : null}
      <span className="min-w-0 break-words">{expanded ? address : previewAddress(address)}</span>
    </button>
  );
}

/** `card` = large name with a person icon; `table` = compact bold name. */
export function CustomerName({ name, hasReturns, size = 'card' }) {
  return (
    <div className="flex items-center gap-2">
      {size === 'card' ? <User className="size-[18px] shrink-0 text-brand-600" aria-hidden /> : null}
      <span
        className={cn(
          'min-w-0 font-bold break-words text-slate-900',
          size === 'card' ? 'text-lg' : 'text-sm',
        )}
      >
        {name}
      </span>
      {hasReturns ? (
        <span
          className="inline-flex items-center rounded-full border border-amber-400 bg-amber-300 px-1.5 py-px"
          title="This customer has returns"
          aria-label="This customer has returns"
        >
          <RefreshCcw className="size-2.5" aria-hidden />
        </span>
      ) : null}
    </div>
  );
}

/** "Send Reminder" button, or the muted "No balance/phone" note when no reminder applies. */
export function ReminderAction({ customer, onRemind, dense }) {
  if (!canSendReminder(customer)) {
    return <span className="block text-center text-sm text-slate-400">No balance/phone</span>;
  }
  return (
    <Button
      variant="whatsapp"
      icon={MessageCircle}
      size={dense ? 'sm' : 'md'}
      fullWidth={!dense}
      onClick={() => onRemind(customer)}
      aria-label={`Send WhatsApp payment reminder to ${customer.name}`}
    >
      Send Reminder
    </Button>
  );
}
