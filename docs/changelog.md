# Changelog

## Index

- [v1.0.3.0](#v1030)
- [v1.0.2.0](#v1020)
- [v1.0.0.1](#v1001)
- [v1.0.0.0](#v1000)

## v1.0.3.0

### Added

- `src/types/` — User, Wallet, Record, Settings domain types
- `src/lib/db/` — IndexedDB schema (5 stores: users, settings, wallets, records, receipts), idb wrapper, migrations stub
- `src/lib/crypto/` — PBKDF2 hashing (210k iterations, SHA-256), salt generation, timing-safe compare, random ID/hex helpers
- `src/lib/format/` — currency (minor-unit aware), date, number formatters
- `src/lib/hooks/` — `useDebounce`, `useOnlineStatus`, `useReducedMotion`, `useMediaQuery`
- `src/app/providers/` — `ThemeProvider` (dark-only for now), `ToastProvider` (wraps `@/ui`), `DialogProvider` (imperative API + `useDialog` hook), `TooltipProvider`, `MotionProvider` (respects reduced motion), `ErrorBoundary` (renders `ErrorState` with retry + help link)
- `src/app/bootstrap/` — `initDB` (opens IndexedDB + runs migrations), `initSeed` (creates default `settings` record), `initPWA` (registers service worker via `virtual:pwa-register`)
- `@types/node` in devDependencies

### Changed

- `main.tsx` — async bootstrap: DB init → seed → render `<ErrorBoundary><ThemeProvider><MotionProvider><ToastProvider><DialogProvider><TooltipProvider><BrowserRouter><App/>` stack
- `src/ui/ProgressBar.tsx` — added `animateOnMount` prop (default `true`); percent label counts up alongside the fill

### Fixed

- `hash.ts` — `fromHex` returns `ArrayBuffer` (TS 5.6 narrowed `Uint8Array.buffer` type, broke `deriveBits` call)
- `idb.ts` — `stores` typed as `StoreName[]` literal union so `db.transaction()` type-checks

## v1.0.2.0

### Added

- Design system primitives in `src/ui/`: Button, Card, GlassPanel, Skeleton + SkeletonText, Input, Select, Switch, Tabs, Tooltip, Dialog, Notice, Toast + ToastProvider + useToast, ProgressBar, EmptyState, ErrorState, Icon
- Barrel export at `src/ui/index.ts`
- `.vscode/settings.json` to silence Tailwind CSS lint
- `@types/node` dev dependency

### Changed

- `tsconfig.json`: removed deprecated `baseUrl`; added `node` types; `vite.config.ts` included in compilation
- `.gitignore`: added `tsconfig.tsbuildinfo`

## v1.0.0.1

### Fixed

- `package.json` restored (was empty in `v1.0.0.0` commit).
- 26 scaffold files rewritten after the `v1.0.0.0` commit captured them as 0-byte truncations.
- `.gitignore` completed: `dist/`, `dist-ssr/`, `.vite/`, `.env*`, `.DS_Store`, `*.log`, `coverage/`.
- Added missing: `public/favicon.svg`, `public/manifest.webmanifest`, `src/ui/Icon.tsx`, `README.md`.

## v1.0.0.0

### Added

- Vite + React + TypeScript + Tailwind scaffold
- PWA manifest + Workbox service worker
- Routing skeleton with placeholder pages
- AppShell, Sidebar (icon-rail hover-expand, mobile drawer), TopBar
- Global styles: tokens, glass utilities, animations, skeleton shimmer
- `Icon` wrapper for Lucide
- Docs: README, ai-instructions, roadmap, changelog, buglog
