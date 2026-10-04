/**
 * The four buttons of the web page's side menu (Generate BILL / Share BILL / Save BILL / Reset BILL).
 *
 * Props
 *  - layout: 'bar' (phones: one row of icon-over-label buttons, Save widest) | 'panel' (desktop side card)
 *  - saveLabel: string          "Save Bill" or "Update Bill" (edit mode)
 *  - onSave / onGenerate / onShare / onReset: () => void
 */
import { FileText, MessageCircle, RotateCcw, Save } from 'lucide-react';
import { Button } from '@/ui';
import { cn } from '@/ui/cn';

const barBtn = 'min-h-14! flex-col! gap-0.5! px-1! text-xs!';

export function BillActionBar({ layout = 'bar', saveLabel, onSave, onGenerate, onShare, onReset }) {
  const saveA11y = `${saveLabel.split(' ')[0]} BILL`;
  if (layout === 'panel') {
    return (
      <div className="space-y-2.5">
        <Button fullWidth size="lg" icon={Save} aria-label={saveA11y} onClick={onSave}>
          {saveLabel}
        </Button>
        <div className="grid grid-cols-2 gap-2.5">
          <Button variant="secondary" icon={FileText} aria-label="Generate BILL" onClick={onGenerate}>
            Generate BILL
          </Button>
          <Button variant="whatsapp" icon={MessageCircle} aria-label="Share BILL" onClick={onShare}>
            Share BILL
          </Button>
        </div>
        <Button variant="outline" fullWidth icon={RotateCcw} aria-label="Reset BILL" onClick={onReset}>
          Reset BILL
        </Button>
        <p className="pt-0.5 text-center text-xs text-slate-400">
          Shortcut:{' '}
          <kbd className="rounded-md bg-slate-100 px-1.5 py-0.5 font-sans font-semibold text-slate-600">
            Ctrl
          </kbd>{' '}
          +{' '}
          <kbd className="rounded-md bg-slate-100 px-1.5 py-0.5 font-sans font-semibold text-slate-600">
            S
          </kbd>{' '}
          to save
        </p>
      </div>
    );
  }
  return (
    <div className="flex gap-2">
      <Button className={cn(barBtn, 'flex-[1.4]')} icon={Save} aria-label={saveA11y} onClick={onSave}>
        {saveLabel}
      </Button>
      <Button
        className={cn(barBtn, 'flex-1')}
        variant="secondary"
        icon={FileText}
        aria-label="Generate BILL"
        onClick={onGenerate}
      >
        Generate
      </Button>
      <Button
        className={cn(barBtn, 'flex-1')}
        variant="whatsapp"
        icon={MessageCircle}
        aria-label="Share BILL"
        onClick={onShare}
      >
        Share
      </Button>
      <Button
        className={cn(barBtn, 'flex-1')}
        variant="outline"
        icon={RotateCcw}
        aria-label="Reset BILL"
        onClick={onReset}
      >
        Reset
      </Button>
    </div>
  );
}
