# Santhamani Textiles — Billing System

Sales & purchase billing, customer / supplier ledgers, stock, revenue and expenses for Santhamani Textiles.

This is the **React (JSX) + Tailwind CSS** version of the original HTML site, built as an installable **PWA**:
open it in a browser on desktop, or "Install app" / "Add to Home Screen" on a phone or tablet.

| | |
| --- | --- |
| UI | React 19, React Router 8, Tailwind CSS 4, lucide-react icons |
| Build | Vite 8, `vite-plugin-pwa` (Workbox) |
| Data | Firebase Firestore (modular SDK, IndexedDB offline cache) — the **same live project** as the original site |
| Tests | Vitest + Testing Library |

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173  (add --host to open it from a phone on the same Wi-Fi)
npm test           # unit tests (business logic, never touches Firestore)
npm run build      # production build + service worker in dist/
npm run preview    # serve the production build locally (this is where PWA install works)
```

Login (same credentials as the original site) is checked on the device — see *Security* below.

## Project layout

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md). In short:

```
src/app/        shell, routes, login, dashboard, PWA helpers
src/core/       business logic + Firestore data layer (no React / DOM)
src/platform/   browser adapters: print, download, share, clipboard, links, storage
src/ui/         Tailwind design system (Button, fields, Modal, DataTable, toasts …)
src/features/   screens grouped by area (sales bill, history, customers, purchase, overview, recycle bin)
legacy/         the original HTML / JS / CSS site, untouched (reference only)
```

## PWA

* Installable (manifest with icons + app shortcuts for Sales Bill, Purchase Bill, Overview).
* The app shell is precached, so it **opens offline**; Firestore serves its on-device cache while offline
  (changes need a connection). An offline banner is shown.
* New versions are downloaded in the background and the user chooses when to **Update** (no surprise reload while a
  bill is half typed).
* Responsive: sidebar layout on desktop, header + bottom tab bar on phones/tablets, tables turn into cards, dialogs
  into bottom sheets.

## Deploy

`vercel.json` is included (SPA rewrite + cache headers). Any static host works: build with `npm run build` and serve
`dist/` with a fallback to `index.html`. The service worker requires HTTPS (localhost is exempt).

## Configuration

Firebase uses the `billing-56b7b` project. The remaining Firebase settings can be overridden with
`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_STORAGE_BUCKET`,
`VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`, and `VITE_FIREBASE_MEASUREMENT_ID` in `.env.local`.
`VITE_FIREBASE_PROJECT_ID` is intentionally rejected if it is not `billing-56b7b`, preventing accidental writes to
the old database.

## Security (inherited from the original — please read)

* The login is a **client-side check** against two base64 strings copied from the original `login.js`. It only hides
  the UI.
* `firestore.rules` allows `read, write: if true`: anyone with the (public) Firebase config can read or modify the data.
  Recommended next step: Firebase Authentication + rules that require `request.auth != null`.

## Migration notes

[`docs/MIGRATION_NOTES.md`](docs/MIGRATION_NOTES.md) lists the original behaviours that were preserved on purpose
(some look like bugs), what changed, and open questions.
