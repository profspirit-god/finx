# FinX — Roadmap

## Index

- [v1.0.x — Scaffold + Foundation](#v1000)
- [v1.1.0.0 — Onboarding & Lock](#v1100)
- [v1.2.0.0 — Wallets](#v1200)
- [v1.3.0.0 — Records](#v1300)
- [v1.4.0.0 — Dashboard](#v1400)
- [v1.5.0.0 — Data Tools](#v1500)
- [v1.6.0.0 — AI Assistant](#v1600)
- [v1.7.0.0 — Settings & Help](#v1700)
- [v2.0.0.0 — Polish & Release](#v2000)

## v1.0.x — Scaffold + Foundation

Vite + TS + Tailwind + PWA + routing + shell + docs. Design system. Storage, crypto, format, hooks, providers, bootstrap.

## v1.1.0.0 — Onboarding & Lock

First-run wizard, forced lock after onboarding, 4-digit PIN gate. AuthProvider + AuthGuard. Sidebar "Lock now".

## v1.2.0.0 — Wallets

Wallets repo + store, 5-step progressive wizard, detail with meta grid + goal bar, archive/delete. Error code system (11 codes) + ErrorPage + Help reference tables.

## v1.3.0.0 — Records

Records repo + receipts + store. List with filters, create form (inline errors, sticky bar, toasts, receipt upload, transfers), detail with inline edit + pair-aware delete + receipt viewer. Wallet audit log wired to live records.

## v1.4.0.0 — Dashboard

Stats layer, summary cards, rate cards, net worth / cashflow / investment charts, recent activity, time range selector, empty state.

## v1.5.0.0 — Data Tools

Full backup export (JSON), record export (CSV / JSON / XLSX / PDF with field picker + filters), full backup import (merge / replace with custom Dialog), currency plumbing (`useCurrency`), wipe-all-data on Help page.

## v1.6.0.0 — AI Assistant

User-supplied API key, chat UI, presets (Groq / Gemini / OpenRouter), streaming responses, provider settings.

## v1.7.0.0 — Settings & Help

Profile, security (PIN change, password change, re-onboard), appearance, data (export/import/wipe), about. **Retroactive currency migration** — convert existing wallets when the settings currency changes. Full Help index + troubleshooting, replacing the temporary page.

## v2.0.0.0 — Polish & Release

Bug sweep, a11y audit, perf pass (lazy-load Data Tools to fix bundle size), real PWA icon set (192 / 512 / maskable PNGs), live cross-tab sync, dashboard grid gap fix, docs freeze.
