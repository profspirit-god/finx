# Changelog

## Index

- [v1.0.2.0](#v1020)
- [v1.0.0.1](#v1001)
- [v1.0.0.0](#v1000)

## v1.0.2.0

### Added

- Design system primitives in `src/ui/`:
  - `Button` (variants: primary/secondary/ghost/danger; sizes sm/md/lg; loading state)
  - `Card` (title/subtitle/header-action/padded/interactive)
  - `GlassPanel` (glass/strong variants, forwardRef)
  - `Skeleton` + `SkeletonText`
  - `Input` (label/hint/error/leftIcon/rightSlot)
  - `Select` (options/placeholder, chevron)
  - `Switch` (accessible toggle)
  - `Tabs` (a11y roles)
  - `Tooltip` (4 sides, delayed show)
  - `Dialog` (portal, ESC close, scroll-lock, 3 sizes)
  - `Notice` (info/success/warning/error)
  - `Toast` + `ToastProvider` + `useToast`
  - `ProgressBar` (tones + percent label)
  - `EmptyState`
  - `ErrorState`
  - `Icon` (Lucide wrapper, gold/dim/white tones)
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
