import { Download, RefreshCw, WifiOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { Button } from '@/ui';

/** Banner shown when a new version of the app has been downloaded; the user decides when to reload. */
export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      // look for a new version every hour while the app stays open
      if (registration) setInterval(() => registration.update().catch(() => {}), 60 * 60 * 1000);
    },
  });
  if (!needRefresh) return null;
  return (
    <div className="no-print pb-safe fixed inset-x-3 bottom-20 z-[65] mx-auto flex max-w-md items-center gap-3 rounded-xl bg-slate-900 p-3 text-white shadow-pop lg:bottom-4">
      <RefreshCw className="size-5 shrink-0 text-brand-300" aria-hidden />
      <p className="flex-1 text-sm">A new version is available.</p>
      <Button size="sm" variant="primary" onClick={() => updateServiceWorker(true)}>
        Update
      </Button>
      <button type="button" className="px-1 text-sm text-slate-300" onClick={() => setNeedRefresh(false)}>
        Later
      </button>
    </div>
  );
}

/** Thin bar shown while the device is offline (data is read from the on-device cache). */
export function OfflineBanner() {
  const online = useOnlineStatus();
  if (online) return null;
  return (
    <div className="no-print flex items-center justify-center gap-2 bg-amber-400 px-3 py-1.5 text-center text-xs font-semibold text-slate-900">
      <WifiOff className="size-4" aria-hidden />
      You are offline — showing saved data. Changes need a connection.
    </div>
  );
}

/** Captures the browser's "install app" event so the dashboard can offer an Install button. */
export function useInstallPrompt() {
  const [deferred, setDeferred] = useState(null);
  const [installed, setInstalled] = useState(
    () => window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true,
  );

  useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault();
      setDeferred(e);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
  return {
    installed,
    canInstall: !!deferred,
    /** iOS Safari has no install event: users add the app from the Share menu */
    showIosHint: isIos && !installed,
    install: async () => {
      if (!deferred) return;
      deferred.prompt();
      await deferred.userChoice;
      setDeferred(null);
    },
  };
}

export function InstallButton({ className }) {
  const { canInstall, install } = useInstallPrompt();
  if (!canInstall) return null;
  return (
    <Button variant="outline" icon={Download} onClick={install} className={className}>
      Install app
    </Button>
  );
}
