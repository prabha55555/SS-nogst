/**
 * Shared shell of the Purchase Bill and Edit Purchase screens (the web pages had a side menu with the Save and
 * "Share Acknowledgement" buttons next to the form).
 * Desktop (expanded): form on the left, totals + Actions card in the sticky right column (TwoPane).
 * Phones/tablets: stacked cards with a sticky action bar (Save + Share Acknowledgement) above the tab bar.
 * Ctrl/Cmd + S saves on keyboards (the browser's "save page" is suppressed on this screen).
 *
 * Props
 *  - title: string · icon?: lucide component · subtitle?: string
 *  - main: ReactNode            invoice, supplier and product cards
 *  - summary: ReactNode         the totals card
 *  - saveLabel: string          "Save Purchase Bill" | "Update Purchase Bill"
 *  - saving: boolean
 *  - onSave() · onShare()
 *  - onRefresh?() · refreshing?: boolean     adds a refresh button to the page header
 */
import { MessageCircle, Receipt, RefreshCw, Save, Zap } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { Button, Card, IconButton, Page, SectionHeader, TwoPane } from '@/ui';
import { cn } from '@/ui/cn';

const barBtn = 'min-h-14! flex-col! gap-0.5! px-1! text-xs!';

function ActionButtons({ layout, saveLabel, saving, onSave, onShare }) {
  if (layout === 'panel') {
    return (
      <div className="space-y-2.5">
        <Button fullWidth size="lg" icon={Save} loading={saving} onClick={onSave}>
          {saveLabel}
        </Button>
        <Button fullWidth size="lg" variant="whatsapp" icon={MessageCircle} onClick={onShare}>
          Share Acknowledgement
        </Button>
      </div>
    );
  }
  return (
    <div className="flex gap-2">
      <Button
        className={cn(barBtn, 'flex-1')}
        icon={Save}
        loading={saving}
        aria-label={saveLabel}
        onClick={onSave}
      >
        {saveLabel.split(' ')[0]}
      </Button>
      <Button
        className={cn(barBtn, 'flex-[1.4]')}
        variant="whatsapp"
        icon={MessageCircle}
        aria-label="Share Acknowledgement"
        onClick={onShare}
      >
        Share Acknowledgement
      </Button>
    </div>
  );
}

export function PurchaseBillLayout({
  title,
  icon = Receipt,
  subtitle,
  main,
  summary,
  saveLabel,
  saving,
  onSave,
  onShare,
  onRefresh,
  refreshing,
}) {
  const { isExpanded } = useBreakpoint();
  const saveRef = useRef(onSave);
  saveRef.current = onSave;
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        void saveRef.current();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const buttons = (layout) => (
    <ActionButtons layout={layout} saveLabel={saveLabel} saving={saving} onSave={onSave} onShare={onShare} />
  );
  return (
    <Page
      title={title}
      subtitle={subtitle}
      icon={icon}
      max="7xl"
      actions={
        onRefresh ? (
          <IconButton
            icon={RefreshCw}
            label="Refresh suppliers and invoice numbers"
            onClick={onRefresh}
            disabled={refreshing}
          />
        ) : null
      }
    >
      <TwoPane
        main={main}
        side={
          <>
            {summary}
            {isExpanded ? (
              <Card>
                <SectionHeader title="Actions" icon={Zap} />
                {buttons('panel')}
              </Card>
            ) : null}
          </>
        }
      />
      {isExpanded ? null : (
        <div className="no-print sticky bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-20 mt-4 rounded-xl border border-slate-200 bg-white/95 p-2 shadow-pop backdrop-blur">
          {buttons('bar')}
        </div>
      )}
    </Page>
  );
}
