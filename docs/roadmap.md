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

First-run wizard (signup → terms → PIN → personalize → finish). 4-digit PIN gate on every launch. Forced lock after onboarding. `AuthProvider` + `AuthGuard`. Sidebar "Lock now". Temporary `/help` reset for testing.

## v1.2.0.0 — Wallets

List, progressive create wizard, detail, audit log, goal progress.

## v1.3.0.0 — Records

List, filters, form, receipts, transfer pair.

## v1.4.0.0 — Dashboard

Summary cards, rates, net-worth & cashflow charts, empty state.

## v1.5.0.0 — Data Tools

Export (CSV/JSON/XLSX/PDF), import, field picker.

## v1.6.0.0 — AI Assistant

User-supplied API key, chat, presets (Groq / Gemini / OpenRouter).

## v1.7.0.0 — Settings & Help

Profile, security, appearance, data, about. Help index + troubleshooting.

## v2.0.0.0 — Polish & Release

Bug sweep, a11y pass, perf pass, real PWA icon set, docs freeze.
