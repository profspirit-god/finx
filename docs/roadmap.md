# FinX — Roadmap

## Index

- [v1.0.x — Scaffold + Foundation](#v1000)
- [v1.1.0.0 — Onboarding & Lock](#v1100)
- [v1.2.0.0 — Wallets](#v1200)
- [v1.3.0.0 — Records](#v1300)
- [v1.4.0.0 — Dashboard](#v1400)
- [v1.5.0.0 — Data Tools](#v1500)
- [v1.5.0.1 — Hotfix](#v1501)
- [v1.6.0.0 — Supabase Feedback + Dev Mode](#v1600)
- [v1.7.0.0 — Notices / Inbox](#v1700)
- [v1.7.1.0 — AI Assistant](#v1710)
- [v1.7.2.0 — AI History & Multi-conversation](#v1720)
- [v1.8.0.0 — Settings & Help](#v1800)
- [v1.9.0.0 — Onboarding beginner/expert layer](#v1900)
- [v2.0.0.0 — Polish & Release](#v2000)
- [Roadmap change log](#changelog)

## v1.0.x — Scaffold + Foundation

## v1.1.0.0 — Onboarding & Lock

## v1.2.0.0 — Wallets

## v1.3.0.0 — Records

## v1.4.0.0 — Dashboard

## v1.5.0.0 — Data Tools

## v1.5.0.1 — Hotfix

## v1.6.0.0 — Supabase Feedback + Dev Mode

## v1.7.0.0 — Notices / Inbox

Bundled in-app announcements. Sidebar badge with unread count, `/notices` page with category filters and read/dismiss state (IndexedDB-backed), dashboard top banner. Content lives in `src/features/notices/content.ts` — edit and deploy to publish a notice.

## v1.7.1.0 — AI Assistant

User-supplied API key (local IndexedDB), provider presets (Groq / Gemini / OpenRouter) + custom OpenAI-compatible endpoint, streaming chat UI, slash commands (`/report`, `/reportshort`, `/reportlong`, `/rankincome`, `/rankexpense`, `/budget`, `/trend`, `/goals`, `/wallets`, `/help`), context-aware consent (send wallet/record summary only with explicit opt-in). AI pre-fills forms for confirm-before-commit actions.

## v1.7.2.0 — AI History & Multi-conversation

Persist chat history to IndexedDB, add sidebar of past conversations. Deferred from v1.7.1.0 to keep the initial AI release focused.

## v1.8.0.0 — Settings & Help

Profile, security (PIN change, password change, re-onboard), appearance, data (export/import/wipe), **local storage gauge** (navigator.storage.estimate), **check for updates** (manual PWA update check), about. **Retroactive currency migration**. Deep Help guide (indexed per feature, replaces the temporary page).

## v1.9.0.0 — Onboarding beginner/expert layer

First-run wizard asks beginner vs expert. Beginner → guided tutorial flow after lock. Expert → dialog listing where to find help.

## v2.0.0.0 — Polish & Release

Bug sweep, a11y audit, perf pass (lazy-load Data Tools + Dev Mode + Notices to keep main bundle lean), real PWA icon set, live cross-tab sync, dashboard grid gap fix, opt-in anonymous device pings for real user count (requires privacy terms update), docs freeze.

## Roadmap change log

- **2026-11-21** — v1.6.0.0 reordered: AI Assistant deferred; Supabase Feedback + Dev Mode inserted.
- **2026-11-21** — v1.5.0.1 hotfix inserted.
- **2026-11-22** — v1.6.0.0 Supabase side complete. FinX app code complete after Phases A–D. Merged and tagged.
- **2026-11-23** — Post-beta-feedback scope additions: Notice/Inbox (v1.7.0.0), Settings storage gauge + check-for-updates + deep Help (v1.8.0.0), onboarding beginner/expert layer (v1.9.0.0). AI Assistant (v1.7.1.0) gets slash commands + context-aware consent; pre-fills forms (not "clicks buttons") deferred to v1.7.1.1. Chat history + multi-conversation split to v1.7.2.0. Notices bundled, not Supabase-backed.
