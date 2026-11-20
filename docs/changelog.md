# Changelog

## Index

- [v1.0.0.1](#v1001)
- [v1.0.0.0](#v1000)

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
