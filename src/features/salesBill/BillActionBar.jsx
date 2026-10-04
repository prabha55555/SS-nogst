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
          <Button variant="info" icon={FileText} aria-label="Generate BILL" onClick={onGenerate}>
            Generate BILL
          </Button>
          <Button variant="whatsapp" icon={MessageCircle} aria-label="Share BILL" onClick={onShare}>
            Share BILL
          </Button>
        </div>
        <Button variant="warning" fullWidth icon={RotateCcw} aria-label="Reset BILL" onClick={onReset}>
          Reset BILL
        </Button>
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
        variant="info"
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
        variant="warning"
        icon={RotateCcw}
        aria-label="Reset BILL"
        onClick={onReset}
      >
        Reset
      </Button>
    </div>
  );
}
