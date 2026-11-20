# FinX — Roadmap

## Index

- [v1.0.0.0 — Scaffold](#v1000)
- [v1.0.1.0 — Design System](#v1010)
- [v1.0.2.0 — Design System: Primitives](#v1020)
- [v1.0.3.0 — Storage & Providers](#v1030)
- [v1.1.0.0 — Onboarding & Lock](#v1100)
- [v1.2.0.0 — Wallets](#v1200)
- [v1.3.0.0 — Records](#v1300)
- [v1.4.0.0 — Dashboard](#v1400)
- [v1.5.0.0 — Data Tools](#v1500)
- [v1.6.0.0 — AI Assistant](#v1600)
- [v1.7.0.0 — Settings & Help](#v1700)
- [v2.0.0.0 — Polish & Release](#v2000)

## v1.0.0.0 — Scaffold

Vite + TS + Tailwind + PWA + routing + shell + sidebar + docs.

## v1.0.1.0 — Design System

Reserved for the initial design-system draft; folded into v1.0.2.0.

## v1.0.2.0 — Design System: Primitives

15 primitives in `src/ui/`: Button, Card, GlassPanel, Skeleton, Input, Select, Switch, Tabs, Tooltip, Dialog, Notice, Toast, ProgressBar, EmptyState, ErrorState. Plus Icon and barrel export.

## v1.0.3.0 — Storage & Providers

idb schema, Zustand stores, bootstrap, providers, ErrorBoundary. `npm audit fix` cleanup pass.

## v1.1.0.0 — Onboarding & Lock

First-run wizard, 4-digit PIN gate (PBKDF2).

## v1.2.0.0 — Wallets

List, wizard, detail, audit log, goal progress.

## v1.3.0.0 — Records

List, filters, form, receipts, transfer pair.

## v1.4.0.0 — Dashboard

Summary cards, rates, charts, empty state.

## v1.5.0.0 — Data Tools

Export (CSV/JSON/XLSX/PDF), import, field picker.

## v1.6.0.0 — AI Assistant

User-supplied API key, chat, presets.

## v1.7.0.0 — Settings & Help

Profile, security, appearance, data, about. Help index + troubleshooting.

## v2.0.0.0 — Polish & Release

Bug sweep, a11y pass, perf pass, PWA icons, docs freeze.
