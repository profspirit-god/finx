# FinX — Roadmap

## Index

- [v1.0.x — Scaffold + Foundation](#v1000)
- [v1.1.0.0 — Onboarding & Lock](#v1100)
- [v1.2.0.0 — Wallets](#v1200)
- [v1.3.0.0 — Records](#v1300)
- [v1.4.0.0 — Dashboard](#v1400)
- [v1.5.0.0 — Data Tools](#v1500)
- [v1.5.0.1 — Circular import + TDZ hotfix](#v1501)
- [v1.6.0.0 — Supabase Feedback + Dev Mode](#v1600)
- [v1.7.0.0 — AI Assistant (deferred)](#v1700)
- [v1.8.0.0 — Settings & Help](#v1800)
- [v2.0.0.0 — Polish & Release](#v2000)
- [Roadmap change log](#changelog)

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

Full backup export (JSON), record export (CSV / JSON / XLSX / PDF with field picker + filters), full backup import (merge / replace with custom Dialog), currency plumbing (useCurrency), wipe-all-data on Help page.

## v1.5.0.1 — Circular import + TDZ hotfix

Broke circular store import (records.store → wallets.store → auth.store); fixed walletId TDZ in RecordForm. Hotfix on main only, no feature scope.

## v1.6.0.0 — Supabase Feedback + Dev Mode

**Blocked on owner + Claude (Supabase specialist) completing the server side.**

Owner-side Supabase deliverables (before FinX code work resumes):

- finx schema created, finx.feedback + finx.admin_users tables, RLS, grants
- finx schema exposed via API
- Admin user created in auth.users
- Admin auth.uid() seeded in finx.admin_users
- Project URL + anon key handed to FinX repo
- Verification queries pass

FinX coding phases (after Supabase done):

- A: env template, src/lib/supabase.ts, feedback types + submit
- B: Feedback FAB + form, wired into AppShell
- C: Dev auth — /dev-login, session in sessionStorage, DevGuard
- D: Dev dashboard — feedback inbox, filters, mark handled, local stats
- E: Version bump, docs, Help/Privacy updates, merge, tag

Full proposal: docs/proposal-supabase-feedback.md.

## v1.7.0.0 — AI Assistant (deferred)

Was originally v1.6.0.0; deferred so v1.6.0.0 could prioritize real beta feedback before the beta testers lose interest. User-supplied API key, chat UI, presets (Groq / Gemini / OpenRouter), streaming responses, provider settings. May be reordered again based on feedback volume from v1.6.0.0.

## v1.8.0.0 — Settings & Help

Profile, security (PIN change, password change, re-onboard), appearance, data (export/import/wipe), about. Retroactive currency migration — convert existing wallets when settings currency changes. Full Help index + troubleshooting, replacing the temporary page. Feedback troubleshooting (Supabase paused, offline submission fallback).

## v2.0.0.0 — Polish & Release

Bug sweep, a11y audit, perf pass (lazy-load Data Tools + Dev Mode to keep main bundle lean), real PWA icon set (192 / 512 / maskable PNGs), live cross-tab sync, dashboard grid gap fix, anonymous device pings for real user count (opt-in, requires privacy terms update), docs freeze.

## Roadmap change log

- **2026-11-21** — v1.6.0.0 reordered: AI Assistant deferred to v1.7.0.0; Supabase Feedback + Dev Mode inserted as new v1.6.0.0. Reason: beta testers need a bug-report channel now, before they lose interest. AI Assistant requires each user to supply their own API key, which is a high-friction ask for beta users.
- **2026-11-21** — v1.5.0.1 hotfix inserted (circular import + TDZ). No roadmap impact beyond version numbering.
- **2026-11-22** — v1.6.0.0 blocked pending Supabase server-side deliverables by owner + Claude. FinX code work paused until Supabase verification queries pass. Proposal: docs/proposal-supabase-feedback.md.
