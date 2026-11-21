# Changelog

## Index

- [v1.3.0.0](#v1300)
- [v1.2.0.0](#v1200)
- [v1.1.0.0](#v1100)
- [v1.0.3.0](#v1030)
- [v1.0.2.0](#v1020)
- [v1.0.0.1](#v1001)
- [v1.0.0.0](#v1000)

## v1.3.0.0

### Added

- Records feature (`src/features/records/`):
  - `records.repo.ts` — CRUD, soft delete, transfer pairs (atomic), wallet balance sync via `adjustBalance`
  - `receipts.repo.ts` — Blob storage for receipt attachments
  - `records.store.ts` — Zustand, auto-refreshes wallets store after mutations
  - `useRecords` hook
  - `RecordRow` — class icon, signed amount, wallet + counterparty + date + note, receipt indicator
  - `RecordList` — filters (class / wallet / date range / search), loading skeleton, empty, filtered-empty, error states
  - `RecordForm` — mode toggle (standard / transfer), per-field inline errors, auto-scroll to first error with pulse animation, sticky action bar, toast feedback (success + error), receipt upload
  - `RecordDetail` — full view, inline edit mode, delete (pair-aware with dialog), receipt viewer (image / PDF) with download
  - `ReceiptUploader`, `ReceiptViewer`
- Wallet audit log wired to live records (`WalletAuditLog` now reads `listRecordsByWallet`)
- Toast feedback on record save, edit, and delete

### Changed

- `RecordForm` accepts save feedback via toasts; per-field errors replace the single form-level notice
- Wallet detail, record list, record form, record row all use `useWallets()` hook (triggers store hydration on mount) instead of reading `useWalletsStore` directly
- WalletDetail shows skeleton during wallet store load instead of flashing "wallet not found"

### Fixed

- `records.repo.createTransfer` — paired records written atomically in a single transaction; both wallets updated in the same transaction
- `Record` type collided with TS's built-in `Record<K,V>` — label/tone maps now use inline literal types
- Two-tab reload race: after `Ctrl+R`, opening `/records/new` showed "no wallets" even when wallets existed, until another page hydrated the store. Fixed by hook-level hydration + loading skeleton guard.

### Known gaps

- Transfers are delete + recreate to edit (editing disabled for transfer records)
- No live cross-tab sync yet (records auto-refresh only via the store's mutation methods; external tab changes need F5)

## v1.2.0.0

### Added

- Wallet repo + store + hooks, 5-step progressive create wizard (back preserves edits via lifted state), list with empty/error/skeleton states, detail with meta grid + goal bar + archive/delete
- Error code system: 11 codes across URL / Data / Auth / System buckets; `ErrorPage`; Help reference tables

### Fixed

- Wizard Back discarded field edits (state now lifted to `WizardShell.draft`)

## v1.1.0.0

### Added

- Auth types, user repo (PBKDF2), Zustand auth store, AuthProvider
- AuthGuard (onboarding → lock → unlocked)
- 5-step onboarding wizard, LockScreen + PinPad, Sidebar "Lock now"

## v1.0.3.0

### Added

- Domain types, IndexedDB schema, idb wrapper, PBKDF2 crypto, format helpers, common hooks
- Provider stack, bootstrap (initDB, initSeed, initPWA)

### Fixed

- `hash.ts` fromHex type, `idb.ts` StoreName literal union

## v1.0.2.0

### Added

- 15 design system primitives, barrel export, `.vscode/settings.json`

### Changed

- `tsconfig.json` — removed `baseUrl`, added `node` types

## v1.0.0.1

### Fixed

- Restored `package.json` (empty in v1.0.0.0), rewrote 26 truncated files, completed `.gitignore`, created missing files

## v1.0.0.0

### Added

- Vite + React + TS + Tailwind scaffold, PWA, routing, AppShell, Sidebar, TopBar, design tokens
