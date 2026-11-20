# Changelog

## Index

- [v1.1.0.0](#v1100)
- [v1.0.3.0](#v1030)
- [v1.0.2.0](#v1020)
- [v1.0.0.1](#v1001)
- [v1.0.0.0](#v1000)

## v1.1.0.0

### Added

- `src/features/auth/` — domain types (AuthState, SignupInput, PersonalizeInput), user repo (PBKDF2 hash/verify, create/get/updatePin/deleteUser), Zustand auth store (initialize, signup, unlock, lock, loginWithPassword, completePersonalization, changePin, reset)
- `src/features/lock/` — PinPad (4-digit, dots, keys, auto-submit), LockScreen (full-screen, error state, attempts), usePin hook
- `src/features/onboarding/` — 5-step wizard: Signup, Terms (with two-switch consent), PIN (create + confirm), Personalize (currency, track mode, income, savings), Finish
- `src/app/providers/AuthProvider.tsx` — runs `useAuthStore.initialize()` on mount
- `src/app/router/guards.tsx` — `AuthGuard` enforcing onboarding → lock → unlocked flow
- Sidebar "Lock now" button
- `/help` temporary reset-onboarding control for testing

### Changed

- `src/App.tsx` — full-screen routes (`/lock`, `/onboarding`) rendered outside `AppShell`; all routes wrapped in `AuthGuard`
- `src/main.tsx` — `AuthProvider` added to provider stack inside `BrowserRouter`'s parent
- Post-onboarding behavior: forced lock (alternative flow — user must enter just-set PIN before dashboard)

## v1.0.3.0

### Added

- Domain types (User, Wallet, Record, Settings)
- IndexedDB schema, idb wrapper, migrations stub
- PBKDF2 crypto, format helpers, common hooks
- Provider stack: Theme, Toast, Dialog, Tooltip, Motion, ErrorBoundary
- Bootstrap: initDB, initSeed, initPWA
- `@types/node` dev dependency

### Changed

- `main.tsx` async bootstrap chain
- `ProgressBar` — `animateOnMount` prop, count-up label

### Fixed

- `hash.ts` — `fromHex` returns `ArrayBuffer` (TS 5.6 type narrowing)
- `idb.ts` — `StoreName` literal union for `db.transaction()`

## v1.0.2.0

### Added

- 15 design system primitives in `src/ui/`
- Barrel export at `src/ui/index.ts`
- `.vscode/settings.json` to silence Tailwind lint

### Changed

- `tsconfig.json` — removed deprecated `baseUrl`, added `node` types, included `vite.config.ts`
- `.gitignore` — added `tsconfig.tsbuildinfo`

## v1.0.0.1

### Fixed

- Restored `package.json` (was empty in v1.0.0.0)
- 26 truncated scaffold files rewritten
- `.gitignore` completed
- Missing files created: `public/favicon.svg`, `public/manifest.webmanifest`, `src/ui/Icon.tsx`, `README.md`

## v1.0.0.0

### Added

- Vite + React + TypeScript + Tailwind scaffold
- PWA manifest + Workbox service worker
- Routing skeleton with placeholder pages
- AppShell, Sidebar, TopBar
- Design tokens, glass utilities, animations
