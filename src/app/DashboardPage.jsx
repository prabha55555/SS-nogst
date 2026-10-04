import { ChevronRight, LogOut, PieChart, Receipt, Share, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router';

import background from '@/assets/background.jpg';
import logo from '@/assets/logo.png';
import { Button, useFeedback } from '@/ui';
import { useAuth } from './AuthProvider';
import { InstallButton, OfflineBanner, useInstallPrompt } from './pwa';

const CARDS = [
  { to: '/purchase/bill', title: 'Purchase Bill', text: 'Manage purchase entries', icon: ShoppingCart },
  {
    to: '/sales/bill',
    title: 'Sales Bill',
    text: 'Create and manage customer sales invoices',
    icon: Receipt,
  },
  { to: '/overview/revenue', title: 'Overview', text: 'View stocks, revenue and expenses', icon: PieChart },
];

export default function DashboardPage() {
  const { logout, username } = useAuth();
  const { confirm } = useFeedback();
  const { showIosHint } = useInstallPrompt();

  const onLogout = async () => {
    const ok = await confirm({
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      tone: 'danger',
      confirmText: 'Logout',
    });
    if (ok) await logout();
  };

  return (
    <div
      className="flex min-h-dvh flex-col bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgb(15 23 42 / 0.5), rgb(15 23 42 / 0.65)), url(${background})`,
      }}
    >
      <OfflineBanner />
      <main className="pt-safe pb-safe flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-4xl rounded-3xl bg-white/90 p-6 text-center shadow-pop backdrop-blur-md sm:p-10">
          <img src={logo} alt="" className="mx-auto size-20 object-contain" />
          <h1 className="mt-1 text-3xl font-bold text-brand-800 sm:text-4xl">Santhamani Textiles</h1>
          <p className="mt-1 text-slate-500">
            Billing &amp; Invoice Management{username ? <> · Welcome, {username}</> : null}
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {CARDS.map(({ to, title, text, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="group flex items-center gap-4 rounded-2xl border-2 border-slate-200 bg-slate-50 p-5 text-left transition hover:-translate-y-1 hover:border-brand-500 hover:shadow-lg md:flex-col md:py-8 md:text-center"
              >
                <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-brand-600 md:size-16">
                  <Icon className="size-7 md:size-8" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-bold text-slate-800">{title}</span>
                  <span className="mt-0.5 block text-sm text-slate-500">{text}</span>
                </span>
                <ChevronRight className="size-5 text-slate-400 md:hidden" aria-hidden />
              </Link>
            ))}
          </div>

          {showIosHint ? (
            <p className="mt-6 flex items-center justify-center gap-1.5 text-sm text-slate-500">
              To install: tap <Share className="size-4" aria-label="Share" /> then “Add to Home Screen”.
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <InstallButton />
            <Button variant="danger" icon={LogOut} onClick={onLogout}>
              Logout
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
