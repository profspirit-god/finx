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

Vite + TS + Tailwind + PWA + routing + shell + docs (v1.0.0.1 fixed the empty-file commit). Design system (v1.0.2.0). Storage, crypto, format, hooks, providers, bootstrap (v1.0.3.0).

## v1.1.0.0 — Onboarding & Lock

First-run wizard, forced lock after onboarding, 4-digit PIN gate. AuthProvider + AuthGuard. Sidebar "Lock now".

## v1.2.0.0 — Wallets

Wallets repo + store. List, 5-step progressive create wizard, detail with meta grid + goal bar, archive/delete. Error code system (11 codes) + ErrorPage + Help reference.

## v1.3.0.0 — Records

Records repo + receipts + store. List with filters. Form with per-field inline errors, sticky action bar, toast feedback, receipt upload, transfer pairs. Detail with inline edit, pair-aware delete, receipt viewer. Wallet audit log wired to live records.

## v1.4.0.0 — Dashboard

Summary cards (total money, income, expenses, investments). Rate cards (monthly / daily / yearly income & expense rates). Net-worth + cashflow charts (Recharts). Empty dashboard state with quick actions.

## v1.5.0.0 — Data Tools

Export (CSV / JSON / XLSX / PDF) with field picker. Import from file. Wallet / date filters. `lastBackupAt` stamp.

## v1.6.0.0 — AI Assistant

User-supplied API key, chat UI, presets (Groq / Gemini / OpenRouter), streaming.

## v1.7.0.0 — Settings & Help

Profile, security (PIN change, password change, re-onboard), appearance, data (export/import/wipe), about. Full Help index + troubleshooting, replacing the temporary page.

## v2.0.0.0 — Polish & Release

Bug sweep, a11y audit, perf pass, real PWA icon set (192 / 512 / maskable PNGs), live cross-tab sync, docs freeze.
