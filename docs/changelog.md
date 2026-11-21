# Changelog

## Index

- [v1.4.0.0](#v1400)
- [v1.3.0.0](#v1300)
- [v1.2.0.0](#v1200)
- [v1.1.0.0](#v1100)
- [v1.0.3.0](#v1030)
- [v1.0.2.0](#v1020)
- [v1.0.0.1](#v1001)
- [v1.0.0.0](#v1000)

## v1.4.0.0

### Added

- Dashboard feature (`src/features/dashboard/`):
  - `lib/stats.ts` — `computeDashboard`, `totalsInRange`, `computeRates`, `bucketCashflow`, `computeNetWorthTrend`, `rangeMs`, `sumWalletBalances`, `sumInvestments`. Time ranges: this month / last 3 / last 6 / this year.
  - `hooks/useDashboardStats.ts` — memoized hook over wallets + records with loading/error states.
  - `SummaryCards` — Total Money, Income, Expenses, Investments (color-coded icons).
  - `RateCards` — Income + Expense rates with Monthly / Daily / Yearly toggle + net line.
  - `TimeRangeSelector` — Tabs control that drives all dashboard data.
  - `NetWorthChart` — Recharts area chart with gold gradient.
  - `CashflowChart` — Recharts bar chart, income (green) vs expense (red).
  - `InvestmentDonut` — Pie chart of investment-type wallet balances; hidden if none.
  - `RecentActivity` — 5 most recent records with icon, relative time, wallet, signed amount, "View all" link.
  - `DashboardPage` — orchestrates all sections; skeleton loading; "No wallets yet" empty state.

### Changed

- `/` and `/dashboard` now render `DashboardPage` (was placeholder).

### Known gaps

- No live cross-tab sync (records / wallets refresh on next page mount).
- Investment donut hidden when empty leaves a gap in the bottom grid on desktop — polish target for v2.0.0.0.

## v1.3.0.0

### Added

- Records repo (CRUD + transfers + receipts), Zustand store, list with filters, create form (inline per-field errors, sticky action bar, toast, receipt upload), detail with inline edit + pair-aware delete + receipt viewer
- Wallet audit log wired to live records

### Fixed

- Wallets store hydration race on record pages after reload (hook-level load)
- `Record` type collision with TS built-in `Record<K,V>`
- Wizard Back preserved field edits (lifted state)

## v1.2.0.0

### Added

- Wallet repo + store + hooks, 5-step progressive wizard, list with empty/error/skeleton states, detail with goal bar, archive/delete
- Error code registry (11 codes: URL1–URL3, DATA1–DATA3, AUTH1–AUTH2, SYS1–SYS3), `ErrorPage`, Help reference tables

### Fixed

- Wizard Back discarded field edits

## v1.1.0.0

### Added

- Auth types, PBKDF2 user repo, Zustand auth store, AuthProvider
- AuthGuard (onboarding → lock → unlocked)
- 5-step onboarding wizard, LockScreen + PinPad, Sidebar "Lock now"
- Forced lock after onboarding

## v1.0.3.0

### Added

- Domain types, IndexedDB schema, idb wrapper, PBKDF2 crypto, format helpers, common hooks
- Provider stack, bootstrap (initDB, initSeed, initPWA)

### Fixed

- `hash.ts` fromHex type, `idb.ts` StoreName literal union

## v1.0.2.0

### Added

- 15 design system primitives in `src/ui/`, barrel export, `.vscode/settings.json`

### Changed

- `tsconfig.json` — removed `baseUrl`, added `node` types, included `vite.config.ts`

## v1.0.0.1

### Fixed

- Restored `package.json`, rewrote 26 truncated files, completed `.gitignore`, created missing files

## v1.0.0.0

### Added

- Vite + React + TS + Tailwind scaffold, PWA, routing, AppShell, Sidebar, TopBar, design tokens
