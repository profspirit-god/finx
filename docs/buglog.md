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

### BUG-20261120-06 — `Uint8Array` not assignable to `BufferSource` (PBKDF2)

- Status: fixed
- Version found: 1.0.3.0 (Phase A)
- Version fixed: 1.0.3.0 (same session)
- Files touched: `src/lib/crypto/hash.ts`
- Symptoms: `TS2322` on `deriveBits({ salt })` — `Uint8Array<ArrayBufferLike>` incompatible with `BufferSource`
- Root cause: TS 5.6 narrowed `Uint8Array.buffer` to `ArrayBufferLike` (allows `SharedArrayBuffer`), which `crypto.subtle` rejects
- Fix: `fromHex` now returns `ArrayBuffer` (via `.buffer`)
- Regression test: no

### BUG-20261120-05 — `db.transaction()` typed store names

- Status: fixed
- Version found: 1.0.3.0 (Phase A)
- Version fixed: 1.0.3.0 (same session)
- Files touched: `src/lib/db/idb.ts`
- Symptoms: `TS2769` — `(keyof FinXDB)[]` not assignable to literal store-name union
- Root cause: `keyof FinXDB` widened to `string`; `idb`'s `transaction()` requires the literal union
- Fix: introduced `type StoreName = 'users' | 'settings' | 'wallets' | 'records' | 'receipts'`
- Regression test: no

### BUG-20261120-04 — tsconfig.tsbuildinfo tracked

- Status: fixed
- Version found: 1.0.2.0 (during 2A)
- Version fixed: 1.0.2.0
- Files touched: `.gitignore`, removed `tsconfig.tsbuildinfo` from tracking
- Symptoms: build cache file appeared in `git status` as modified
- Root cause: TS incremental build cache not ignored from day one
- Fix: appended `tsconfig.tsbuildinfo` to `.gitignore`; `git rm --cached`
- Regression test: no

### BUG-20261120-03 — motion.button style type conflict

- Status: fixed
- Version found: 1.0.2.0 (during 2A)
- Version fixed: 1.0.2.0
- Files touched: `src/ui/Button.tsx`
- Symptoms: `TS2322` on `motion.button` — `CSSProperties` not assignable to `MotionStyle`
- Root cause: Framer Motion's `MotionStyle` narrows some CSS props
- Fix: replaced `motion.button` with plain `<button>`; tap animation via Tailwind `active:scale-[0.97]`
- Regression test: no

### BUG-20261120-01 — JSX factory call broke scaffold build

- Status: fixed
- Version found: 1.0.0.0 (pre-release, uncommitted)
- Version fixed: 1.0.0.1
- Files touched: `src/app/router/routes.tsx`
- Symptoms: 40 TypeScript parse errors (`TS1003`, `TS1109`, `TS1128`)
- Root cause: `<Placeholder('Dashboard') />` not valid JSX
- Fix: made `Placeholder` a proper component receiving `{ label: string }`
- Regression test: no

### BUG-20261120-02 — Empty package.json + 26 truncated files in v1.0.0.0

- Status: fixed
- Version found: 1.0.0.0
- Version fixed: 1.0.0.1
- Files touched: `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`, `index.html`, `vercel.json`, `.env.example`, `.editorconfig`, `src/main.tsx`, `src/App.tsx`, `src/vite-env.d.ts`, `src/app/router/routes.tsx`, all `src/layout/*`, all `src/styles/*`, all `docs/*.md`
- Symptoms: `EJSONPARSE` build error; Vercel silent deploy failure
- Root cause: multiple files captured as 0-byte in the `v1.0.0.0` commit
- Fix: rewrote every empty file with canonical content
- Regression test: yes — empty-file scan before commit
