# FinX — Roadmap

## Index

- [v1.0.0.x — Scaffold](#v1000)
- [v1.0.2.0 — Design System](#v1020)
- [v1.0.3.0 — Storage & Providers](#v1030)
- [v1.1.0.0 — Onboarding & Lock](#v1100)
- [v1.2.0.0 — Wallets](#v1200)
- [v1.3.0.0 — Records](#v1300)
- [v1.4.0.0 — Dashboard](#v1400)
- [v1.5.0.0 — Data Tools](#v1500)
- [v1.6.0.0 — AI Assistant](#v1600)
- [v1.7.0.0 — Settings & Help](#v1700)
- [v2.0.0.0 — Polish & Release](#v2000)

## v1.0.0.x — Scaffold

Vite + TS + Tailwind + PWA + routing + shell + docs. Fixed 0-byte file commit in v1.0.0.1.

## v1.0.2.0 — Design System

15 primitives in `src/ui/`: Button, Card, GlassPanel, Skeleton, Input, Select, Switch, Tabs, Tooltip, Dialog, Notice, Toast, ProgressBar, EmptyState, ErrorState, Icon, barrel.

## v1.0.3.0 — Storage & Providers

Types, IndexedDB, PBKDF2 crypto, format, hooks, provider stack, bootstrap.

## v1.1.0.0 — Onboarding & Lock

First-run wizard (signup → terms → PIN → personalize → finish). 4-digit PIN gate. Forced lock after onboarding. AuthProvider + AuthGuard. Sidebar "Lock now".

## v1.2.0.0 — Wallets

Wallets repo + store. List with loading/empty/error states. Card with icon + balance + goal bar. Progressive 5-step create wizard (back preserves edits). Detail view with meta grid, goal bar, archive/delete. Error code system: 11 codes across URL/Data/Auth/System buckets; ErrorPage component; Help shows the code tables.

## v1.3.0.0 — Records

Record repo + store. List with filters (class, wallet, date range). Form (date, amount, class, wallet, counterparty, note, tags, receipt upload). Transfer pairs. Audit log in WalletDetail becomes live. Wallet balance auto-updates via `adjustBalance`.

## v1.4.0.0 — Dashboard

Summary cards (total money, income, expenses, investments). Rate cards (monthly/daily/yearly income & expense rate). Net-worth and cashflow charts (Recharts). Empty dashboard state.

## v1.5.0.0 — Data Tools

Export (CSV / JSON / XLSX / PDF) with field picker. Import from file. Wallet/date filters. `lastBackupAt` stamp.

## v1.6.0.0 — AI Assistant

User-supplied API key, chat UI, presets for Groq / Gemini / OpenRouter, streaming.

## v1.7.0.0 — Settings & Help

Profile, security (PIN change, password change, re-onboard), appearance, data (export/import/wipe), about. Full Help index + troubleshooting replacing the temporary page.

## v2.0.0.0 — Polish & Release

Bug sweep, a11y audit, perf pass, real PWA icon set (192/512/maskable PNGs), docs freeze.
