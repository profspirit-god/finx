# Bug Log

## Index

- [How to log](#how-to-log)
- [Entries](#entries)

## How to log

BUG-YYYYMMDD-XX — <short title>
Status: open | fixed | wontfix

Version found: X.Y.Z.W

Version fixed: X.Y.Z.W

Files touched: path/one.ts, path/two.tsx

Symptoms: ...

Root cause

## Entries

### BUG-20261120-01 — JSX factory call broke scaffold build

- Status: fixed
- Version found: 1.0.0.0 (pre-release, uncommitted)
- Version fixed: 1.0.0.1 (folded into initial buildable commit)
- Files touched: `src/app/router/routes.tsx`
- Symptoms: 40 TypeScript parse errors (`TS1003`, `TS1109`, `TS1128`).
- Root cause: `<Placeholder('Dashboard') />` is not valid JSX. Factory call cannot appear in tag-name position.
- Fix: made `Placeholder` a proper component receiving `{ label: string }`.
- Regression test: no (build is the check)

### BUG-20261120-02 — Empty package.json + 26 truncated files in v1.0.0.0

- Status: fixed
- Version found: 1.0.0.0 (committed in `1b17bdf`, unshippable)
- Version fixed: 1.0.0.1
- Files touched: `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`, `index.html`, `vercel.json`, `.env.example`, `.editorconfig`, `src/main.tsx`, `src/App.tsx`, `src/vite-env.d.ts`, `src/app/router/routes.tsx`, all `src/layout/*`, all `src/styles/*`, all `docs/*.md`, plus 4 missing files created.
- Symptoms: `npm error EJSONPARSE — Unexpected end of JSON input`. Vercel "Deployment failed without error". Build impossible.
- Root cause: multiple files were captured as 0-byte in the `v1.0.0.0` commit. Suspected truncated paste or redirect into files during scaffold setup.
- Fix: rewrote every empty file with the canonical step-1 content; created the 4 missing files; renamed `initPWA.s` → deleted (unused stub), fixed `generate-icons-.mjs` typo.
- Regression test: no — but added Step 1 diagnostic script (in chat log) that will be run before any future release.
