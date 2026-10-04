import {
  ArrowLeft,
  Boxes,
  FilePlus2,
  History,
  Home,
  LayoutDashboard,
  LogOut,
  PieChart,
  ShoppingCart,
  Receipt,
  TrendingUp,
  Trash2,
  UserPlus,
  Users,
  Wallet,
  Zap,
} from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router';

import logo from '@/assets/logo.png';
import { useAuth } from '@/app/AuthProvider';
import { cn, useFeedback } from '@/ui';
import { OfflineBanner } from './pwa';

/** The three modules of the app. `items` drive the sidebar (desktop) and bottom tab bar (phones / tablets). */
export const MODULES = {
  sales: {
    title: 'Sales',
    icon: Receipt,
    home: '/sales/bill',
    items: [
      { to: '/sales/bill', label: 'Sales Bill', short: 'Bill', icon: FilePlus2 },
      { to: '/sales/history', label: 'Sales History', short: 'History', icon: History },
      { to: '/sales/add-customer', label: 'Add Customer', short: 'Add', icon: UserPlus },
      { to: '/sales/customers', label: 'Customer Details', short: 'Customers', icon: Users },
      { to: '/sales/bin', label: 'Recycle Bin', short: 'Bin', icon: Trash2 },
    ],
  },
  purchase: {
    title: 'Purchase',
    icon: ShoppingCart,
    home: '/purchase/bill',
    items: [
      { to: '/purchase/bill', label: 'Purchase Bill', short: 'Bill', icon: FilePlus2 },
      { to: '/purchase/history', label: 'Purchase History', short: 'History', icon: History },
      { to: '/purchase/add-supplier', label: 'Add Supplier', short: 'Add', icon: UserPlus },
      { to: '/purchase/suppliers', label: 'Supplier Details', short: 'Suppliers', icon: Users },
      { to: '/purchase/bin', label: 'Recycle Bin', short: 'Bin', icon: Trash2 },
    ],
  },
  overview: {
    title: 'Overview',
    icon: PieChart,
    home: '/overview/revenue',
    items: [
      { to: '/overview/revenue', label: 'Revenue', short: 'Revenue', icon: TrendingUp },
      { to: '/overview/stocks', label: 'Stocks', short: 'Stocks', icon: Boxes },
      { to: '/overview/expenses', label: 'Expenses', short: 'Expenses', icon: Wallet },
      { to: '/overview/shortcuts', label: 'Shortcuts', short: 'Shortcuts', icon: Zap },
    ],
  },
};

function useLogout() {
  const { logout } = useAuth();
  const { confirm } = useFeedback();
  return async () => {
    const ok = await confirm({
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      tone: 'danger',
      confirmText: 'Logout',
    });
    if (ok) await logout();
  };
}

function Sidebar({ module }) {
  const onLogout = useLogout();
  const { username } = useAuth();
  return (
    <aside className="no-print hidden w-64 shrink-0 flex-col bg-brand-800 text-white lg:flex">
      <div className="flex items-center gap-3 px-5 py-5">
        <img src={logo} alt="" className="size-10 rounded-lg bg-white object-contain p-0.5" />
        <div className="leading-tight">
          <div className="text-sm font-bold">Santhamani</div>
          <div className="text-xs text-brand-200">Textiles Billing</div>
        </div>
      </div>

      <div className="px-3 pb-1 text-[11px] font-semibold tracking-wider text-brand-300 uppercase">
        <span className="px-2">{module.title}</span>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3" aria-label={`${module.title} navigation`}>
        {module.items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
                isActive ? 'bg-white/15 text-white' : 'text-brand-100 hover:bg-white/10',
              )
            }
          >
            <Icon className="size-[18px]" aria-hidden />
            {label}
          </NavLink>
        ))}

        <div className="px-2 pt-5 pb-1 text-[11px] font-semibold tracking-wider text-brand-300 uppercase">
          Modules
        </div>
        <NavLink
          to="/"
          end
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-brand-100 hover:bg-white/10"
        >
          <LayoutDashboard className="size-[18px]" aria-hidden /> Dashboard
        </NavLink>
        {Object.entries(MODULES)
          .filter(([, m]) => m !== module)
          .map(([key, m]) => (
            <NavLink
              key={key}
              to={m.home}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-brand-100 hover:bg-white/10"
            >
              <m.icon className="size-[18px]" aria-hidden /> {m.title}
            </NavLink>
          ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        {username ? (
          <div className="truncate px-3 pb-2 text-xs text-brand-200">Signed in as {username}</div>
        ) : null}
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-200 hover:bg-red-500/20"
        >
          <LogOut className="size-[18px]" aria-hidden /> Logout
        </button>
      </div>
    </aside>
  );
}

function MobileHeader({ module }) {
  const navigate = useNavigate();
  const onLogout = useLogout();
  return (
    <header className="no-print pt-safe sticky top-0 z-30 flex items-center gap-2 bg-brand-800 px-3 py-2.5 text-white lg:hidden">
      <button
        type="button"
        onClick={() => navigate('/')}
        aria-label="Dashboard"
        className="rounded-lg p-2 hover:bg-white/10"
      >
        <ArrowLeft className="size-5" />
      </button>
      <module.icon className="size-5 text-brand-200" aria-hidden />
      <h1 className="flex-1 truncate text-base font-semibold">{module.title}</h1>
      <button
        type="button"
        onClick={() => navigate('/')}
        aria-label="Home"
        className="rounded-lg p-2 hover:bg-white/10"
      >
        <Home className="size-5" />
      </button>
      <button
        type="button"
        onClick={onLogout}
        aria-label="Logout"
        className="rounded-lg p-2 hover:bg-white/10"
      >
        <LogOut className="size-5" />
      </button>
    </header>
  );
}

function BottomTabs({ module }) {
  return (
    <nav
      className="no-print pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white lg:hidden"
      aria-label={`${module.title} navigation`}
    >
      <ul className="mx-auto flex max-w-2xl">
        {module.items.map(({ to, short, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 text-[11px] font-medium transition',
                  isActive ? 'text-brand-700' : 'text-slate-500',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span className={cn('rounded-full px-4 py-1', isActive && 'bg-brand-100')}>
                    <Icon className="size-5" aria-hidden />
                  </span>
                  {short}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Shell of the Sales / Purchase / Overview modules: sidebar on desktop, header + bottom tabs on phones & tablets. */
export function ModuleLayout({ module: key }) {
  const module = MODULES[key];
  return (
    <div className="flex min-h-dvh">
      <Sidebar module={module} />
      <div className="flex min-w-0 flex-1 flex-col">
        <OfflineBanner />
        <MobileHeader module={module} />
        <main className="flex-1 pb-24 lg:pb-8">
          <Outlet />
        </main>
        <BottomTabs module={module} />
      </div>
    </div>
  );
}
