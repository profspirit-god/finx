# FinX — Roadmap

## Index

- [v1.7.1.0 — AI Assistant](#v1710)
- [v1.7.2.0 — AI History & Multi-conversation](#v1720)
- [v1.8.0.0 — Settings & Help](#v1800)
- [v1.9.0.0 — Onboarding beginner/expert layer](#v1900)
- [v2.0.0.0 — Polish & Release](#v2000)

## v1.7.1.0 — AI Assistant

User-supplied API key (local IndexedDB, encrypted), provider presets (Groq / Gemini / OpenRouter) + custom endpoint. Streaming chat UI, slash commands (`/report`, `/reportshort`, `/reportlong`, `/rankincome`, `/rankexpense`, `/budget`, `/trend`, `/goals`, `/wallets`, `/help`), context-aware consent (send wallet/record summary only with explicit opt-in). AI pre-fills forms for confirm-before-commit actions (deferred to v1.7.1.1). Ephemeral chat history (cleared on refresh).

## v1.7.2.0 — AI History & Multi-conversation

Opt-in persistence of chat history to IndexedDB, add sidebar of past conversations. Deferred from v1.7.1.0 to keep the initial AI release focused.

## v1.8.0.0 — Settings & Help

Profile, security (PIN change, password change, re-onboard), appearance, data (export/import/wipe), **local storage gauge** (navigator.storage.estimate), **check for updates** (manual PWA update check), about. **Retroactive currency migration**. Deep Help guide (indexed per feature, replaces the temporary page).

## v1.9.0.0 — Onboarding beginner/expert layer

First-run wizard asks beginner vs expert. Beginner → guided tutorial flow after lock. Expert → dialog listing where to find help.

## v2.0.0.0 — Polish & Release

Bug sweep, a11y audit, perf pass (lazy-load Data Tools + Dev Mode + Notices + AI to keep main bundle lean), real PWA icon set, live cross-tab sync, dashboard grid gap fix, opt-in anonymous device pings for real user count (requires privacy terms update), docs freeze.
