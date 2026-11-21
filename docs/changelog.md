# Changelog

## Index

- [v1.5.0.0](#v1500)
- [v1.4.0.0](#v1400)
- [v1.3.0.0](#v1300)
- [v1.2.0.0](#v1200)
- [v1.1.0.0](#v1100)
- [v1.0.3.0](#v1030)
- [v1.0.2.0](#v1020)
- [v1.0.0.1](#v1001)
- [v1.0.0.0](#v1000)

## v1.5.0.0

### Added

- Data Tools feature (`src/features/data-tools/`):
  - `lib/schema.ts` — `FinXBackup` shape (v1), `RECORD_FIELDS` catalog, `ExportOptions` types
  - `lib/export.ts` — `buildTabular`, `filterRecords`, `toCSV`, `toJSON`, `toXLSX`, `toPDF`, `downloadBlob`, `defaultFilename`
  - `lib/import.ts` — `parseBackupFile`, `validateBackup`, `writeBackup` (merge / replace modes), `exportFullBackup`, `updateBackupStamp`, base64 Blob serialization
  - `ExportPanel` — full-backup download card (separate from record export), 4-format record export, field picker (12 fields), wallet + date filters, include-archived toggle, live count, toast feedback
  - `ImportPanel` — JSON file picker, backup preview with counts, merge / replace mode picker, custom `<Dialog>` for replace confirmation
  - `FormatPicker`, `FieldPicker`, `BackupPreview`
  - `DataToolsPage` — Export / Import tabs
- `src/lib/hooks/useCurrency.ts` — cached settings-based currency reader with `invalidateCurrencyCache()`
- `Help` page: added **Wipe all data** action (destructive, custom Dialog); **Reset onboarding** clearly labeled "keep data"

### Changed

- Data Tools page mounted at `/data-tools` (was placeholder)
- Wizard `StepStartingMoney`, `StepGoal`, `StepReview` use active currency instead of hardcoded `'USD'`
- `RecordForm`, `RecordDetail`, `RecentActivity`, `DashboardPage` read currency from wallet / settings correctly
- `completePersonalization` invalidates currency cache after saving
- Native `confirm()` replaced with app `<Dialog>` in: import replace, reset onboarding, wipe data

### Fixed

- `StepGoal` / `StepReview` had `useCurrency()` at module scope → "Invalid hook call" runtime error; moved inside component body
- Full-backup export vs record export are now visually and textually distinct (record export is not importable)

### Known gaps

- Currency change is not retroactive — existing wallets keep their original currency (Settings migration arrives in v1.7.0.0)
- Bundle size warning (~1.5 MB main chunk, from xlsx + jspdf + html2canvas); lazy-loading `DataToolsPage` is a v2.0.0.0 polish item
- Import accepts only full-backup JSON, not record-array JSON (column-mapped CSV import is a later minor)

## v1.4.0.0

### Added

- Dashboard: stats layer, summary cards, rate cards (monthly/daily/yearly), net worth area chart, cashflow bar chart, investment donut, recent activity, time range selector

## v1.3.0.0

### Added

- Records: repo (CRUD + transfers + receipts), store, list with filters, create form (inline errors, sticky bar, toast, receipt upload), detail with inline edit + pair-aware delete + receipt viewer
- Wallet audit log wired to live records

### Fixed

- Wallets store hydration race on record pages after reload
- `Record` type collision with TS built-in
- Wizard Back preserved field edits

## v1.2.0.0

### Added

- Wallets: repo + store + 5-step progressive wizard, list, detail with goal bar, archive/delete
- Error code registry (11 codes), `ErrorPage`, Help reference tables

## v1.1.0.0

### Added

- Auth types, PBKDF2 user repo, Zustand auth store, AuthProvider, AuthGuard
- 5-step onboarding wizard, LockScreen + PinPad, Sidebar "Lock now"

## v1.0.3.0

### Added

- Domain types, IndexedDB schema, idb wrapper, PBKDF2 crypto, format helpers, common hooks
- Provider stack, bootstrap

## v1.0.2.0

### Added

- 15 design system primitives, barrel export

## v1.0.0.1

### Fixed

- Restored `package.json`, rewrote 26 truncated files, completed `.gitignore`

## v1.0.0.0

### Added

- Vite + React + TS + Tailwind scaffold, PWA, routing, AppShell, Sidebar, TopBar, design tokens
