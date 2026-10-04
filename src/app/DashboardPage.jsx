import {
  ArrowUpRight,
  Boxes,
  CalendarDays,
  Clock,
  Globe,
  Mail,
  MapPin,
  PieChart,
  Phone,
  Receipt,
  Share,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router';

import { COMPANY, PRODUCT, SERVICES } from '@/core/branding';
import { formatDateShort, todayISO } from '@/core/format';
import { cn } from '@/ui';
import { useAuth } from './AuthProvider';
import { BrandLockup } from './Brand';
import { GoldWaves, Sparkle } from './Decor';
import { InstallButton, OfflineBanner, useInstallPrompt } from './pwa';

const MODULE_CARDS = [
  {
    to: '/purchase/bill',
    title: 'Purchase',
    text: 'Record purchases, track supplier balances and acknowledge goods received.',
    icon: ShoppingCart,
    points: ['Purchase bills', 'Supplier ledger', 'Payments & returns'],
  },
  {
    to: '/sales/bill',
    title: 'Sales',
    text: 'Create invoices, collect payments and keep every customer ledger in order.',
    icon: Receipt,
    points: ['Sales bills & printing', 'History & statements', 'Customer details'],
  },
  {
    to: '/overview/revenue',
    title: 'Overview',
    text: 'Understand revenue, stock and expenses at a glance.',
    icon: PieChart,
    points: ['Revenue & profit', 'Live stock levels', 'Expense tracking'],
  },
];

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

export default function DashboardPage() {
  const { username } = useAuth();
  const { showIosHint } = useInstallPrompt();

  return (
    <div className="min-h-dvh bg-canvas">
      <OfflineBanner />

      {/* ---------------------------------------------------------------- hero */}
      <header className="pt-safe relative overflow-hidden rounded-b-[2.25rem] surface-ink pb-28 text-white sm:pb-32">
        <GoldWaves />
        <Sparkle className="absolute top-28 right-[14%] hidden size-6 animate-float text-gold-300 opacity-80 sm:block" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 py-5">
            <BrandLockup />
            <div className="flex items-center gap-2">
              <InstallButton className="hidden sm:inline-flex" />
            </div>
          </div>

          <div className="animate-rise pt-6 pb-2 sm:pt-10">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-gold-300">
              <Sparkles className="size-4" /> {greeting()}
              {username ? `, ${username}` : ''}
            </p>
            <h1 className="mt-2 max-w-2xl font-display text-3xl leading-[1.12] font-extrabold sm:text-5xl">
              Welcome to <span className="text-gold-gradient">{PRODUCT.name}</span>
            </h1>
            <p className="mt-3 max-w-xl text-base text-brand-200 sm:text-lg">{COMPANY.tagline}.</p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-brand-100 ring-1 ring-white/10 backdrop-blur">
              <CalendarDays className="size-4 text-gold-400" /> {formatDateShort(todayISO())}
            </div>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------ content */}
      <main className="pb-safe relative mx-auto -mt-20 max-w-6xl px-4 pb-12 sm:-mt-24 sm:px-6 lg:px-8">
        <section aria-label="Modules" className="grid gap-4 md:grid-cols-3 md:gap-5">
          {MODULE_CARDS.map(({ to, title, text, icon: Icon, points }, i) => (
            <Link
              key={to}
              to={to}
              style={{ animationDelay: `${120 + i * 90}ms` }}
              className="group relative flex animate-rise flex-col overflow-hidden rounded-3xl border border-line bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1.5 hover:border-gold-300 hover:shadow-lift focus-visible:ring-4 focus-visible:ring-gold-200 focus-visible:outline-none"
            >
              <span className="absolute inset-x-0 top-0 h-[2px] hairline-gold opacity-0 transition group-hover:opacity-100" />
              <div className="flex items-start justify-between">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-gold-sheen text-brand-900 shadow-gold">
                  <Icon className="size-7" aria-hidden />
                </span>
                <span className="flex size-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition group-hover:bg-brand-800 group-hover:text-gold-300">
                  <ArrowUpRight className="size-[18px]" aria-hidden />
                </span>
              </div>
              <h2 className="mt-5 font-display text-xl font-extrabold text-brand-800">{title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{text}</p>
              <ul className="mt-5 hidden space-y-1.5 border-t border-line pt-4 md:block">
                {points.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-[13px] font-medium text-slate-600">
                    <span className="size-1.5 rounded-full bg-gold-400" /> {p}
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </section>

        {showIosHint ? (
          <p className="mt-6 flex items-center justify-center gap-1.5 text-sm text-slate-500">
            Install this app: tap <Share className="size-4" aria-label="Share" /> then “Add to Home Screen”.
          </p>
        ) : null}
        <div className="mt-6 flex justify-center sm:hidden">
          <InstallButton />
        </div>
      </main>

      {/* ------------------------------------------------------ full footer with watermark */}
      <footer className="relative mt-4 overflow-hidden rounded-t-[2.25rem] surface-ink text-white">
        {/* Watermark */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden opacity-[0.04] select-none">
          <span className="font-display text-[clamp(4rem,9vw,12rem)] leading-none font-black tracking-tighter whitespace-nowrap">
            {COMPANY.name?.toUpperCase() || COMPANY.displayName.toUpperCase()}
          </span>
        </div>

        <GoldWaves className="absolute inset-0 opacity-40 mix-blend-overlay" />

        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="flex flex-col gap-10 md:flex-row md:justify-between md:gap-8">
            {/* Brand & Info */}
            <div className="space-y-4 md:max-w-sm">
              <div className="inline-flex items-center gap-2">
                <span className="flex size-10 items-center justify-center rounded-xl bg-gold-sheen text-brand-900 shadow-gold">
                  <Sparkles className="size-6" />
                </span>
                <h2 className="font-display text-2xl font-extrabold tracking-tight">{COMPANY.displayName}</h2>
              </div>
              <p className="text-sm leading-relaxed text-brand-200">
                {COMPANY.tagline}. Elevating your business with premium solutions and unmatched dedication.
              </p>
            </div>

            {/* Services */}
            <div className="md:max-w-xs">
              <h3 className="mb-4 font-display text-sm font-bold tracking-widest text-gold-400 uppercase">
                Our Services
              </h3>
              <ul className="flex flex-wrap gap-2">
                {SERVICES.map((s) => (
                  <li
                    key={s}
                    className="rounded-full bg-white/5 px-4 py-2 text-xs font-semibold text-brand-100 ring-1 ring-white/10 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="md:max-w-xs">
              <h3 className="mb-4 font-display text-sm font-bold tracking-widest text-gold-400 uppercase">
                Contact Us
              </h3>
              <ul className="space-y-4 text-sm text-brand-100">
                {[
                  { Icon: Phone, text: COMPANY.cell, href: COMPANY.cell ? `tel:${COMPANY.cell.replace(/[^0-9+]/g, '')}` : null },
                  { Icon: Mail, text: COMPANY.email, href: COMPANY.email ? `mailto:${COMPANY.email}` : null },
                  { Icon: Globe, text: COMPANY.website, href: COMPANY.website ? (COMPANY.website.startsWith('http') ? COMPANY.website : `https://${COMPANY.website}`) : null },
                  { Icon: MapPin, text: COMPANY.address, href: COMPANY.address ? `https://maps.google.com/?q=${encodeURIComponent(COMPANY.address)}` : null },
                  { Icon: Clock, text: `Business hours: ${COMPANY.hours}` },
                ].map(({ Icon, text, href }) => (
                  <li key={text} className="flex items-start gap-3 transition-colors hover:text-white">
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-gold-300 ring-1 ring-white/20">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    {href ? (
                      <a href={href} target="_blank" rel="noreferrer" className="mt-1 leading-snug hover:underline hover:text-gold-300">
                        {text}
                      </a>
                    ) : (
                      <span className="mt-1 leading-snug">{text}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pb-safe relative mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
            <p className="text-xs font-medium text-brand-300">
              &copy; {new Date().getFullYear()} {COMPANY.displayName}. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs font-medium text-brand-400">
              <Link to="/privacy-policy" className="transition-colors hover:text-gold-300">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="transition-colors hover:text-gold-300">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
