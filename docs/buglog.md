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

### BUG-20261121-03 — Wallets store not hydrated on record pages after reload

- Status: fixed
- Version found: 1.3.0.0 (Phase E)
- Version fixed: 1.3.0.0 (Phase E.1)
- Files touched: `src/features/records/components/RecordForm.tsx`, `RecordList.tsx`, `RecordRow.tsx`, `RecordDetail.tsx`, `src/features/wallets/components/WalletDetail.tsx`
- Symptoms: after `Ctrl+R` on `/records/new`, page showed "no wallets" even when wallets existed, until another page hydrated the store. Similar flash on `/wallets/:id` (wallet not found) before wallets loaded.
- Root cause: components read `useWalletsStore((s) => s.wallets)` directly without triggering a load. Only `WalletList` (via `useWallets()` hook) hydrated the store.
- Fix: every page / row that reads wallets now uses `useWallets()` which fires `refresh()` when store is `idle`. `RecordForm` and `WalletDetail` show skeletons while `loadState` is `idle` or `loading`.
- Regression test: yes — two-tab reload scenario, throttle-to-3G scenario

### BUG-20261121-02 — `Record` type shadows TS built-in `Record<K,V>`

- Status: fixed
- Version found: 1.3.0.0 (Phase A)
- Version fixed: 1.3.0.0 (Phase A)
- Files touched: `src/types/record.ts`
- Symptoms: `TS2315: Type 'Record' is not generic` on `RECORD_CLASS_LABELS` / `RECORD_CLASS_TONES`
- Root cause: our domain type `Record` shadows TypeScript's utility `Record<K, V>`
- Fix: replaced the generic map types with explicit literal-type aliases (`ClassLabels`, `ClassTones`)
- Regression test: no (build is the check)

### BUG-20261121-01 — Wizard Back discarded field edits

- Status: fixed
- Version found: 1.2.0.0 (Phase D)
- Version fixed: 1.2.0.0 (Phase D)
- Files touched: `src/features/wallets/components/CreateWizard/*`
- Symptoms: typing a value, clicking Back, then Next re-showed the older value
- Root cause: per-step `useState(initial)` initialized only on mount; Back only changed step, never captured the step's current state
- Fix: lifted state to `WizardShell.draft`; steps became controlled components
- Regression test: yes

### BUG-20261121-01 — Wizard Back discarded field edits

- Status: fixed
- Version found: 1.2.0.0 (Phase D)
- Version fixed: 1.2.0.0 (Phase D rewrite)
- Files touched: `src/features/wallets/components/CreateWizard/*`
- Symptoms: typing a value, clicking Back, then Next re-showed the older value
- Root cause: each step held its own `useState` initialized from `initial`; the shell's Back button only changed step, never captured the step's current state, so unsaved edits were lost on re-mount
- Fix: lifted all wizard state into a single `draft` object in `WizardShell`; each step is now controlled (`draft` + `onChange`), updates field state on every keystroke
- Regression test: yes — manual walk-through in Phase D smoke test

### BUG-20261120-08 — PersonalizeInput wrong import path

- Status: fixed
- Version found: 1.1.0.0 (Phase C)
- Version fixed: 1.1.0.0 (Phase C)
- Files touched: `src/features/auth/state/auth.store.ts`
- Symptoms: `TS2305` — `PersonalizeInput` not exported from `@/types/user`
- Root cause: type lives in `src/features/auth/types.ts`, not `src/types/user.ts`; import path was wrong
- Fix: changed to `from '../types'`
- Regression test: no (build is the check)

### BUG-20261120-07 — AuthProvider not mounted, app stuck on Loading

- Status: fixed
- Version found: 1.1.0.0 (Phase A)
- Version fixed: 1.1.0.0 (Phase D)
- Files touched: `src/main.tsx`
- Symptoms: app rendered "Loading…" indefinitely on every route
- Root cause: `AuthProvider` was created in Phase A but never added to `main.tsx`'s provider stack, so `useAuthStore.initialize()` never ran and store stayed at `status: 'loading'`
- Fix: wrapped `<BrowserRouter>` with `<AuthProvider>` in `main.tsx`
- Regression test: yes — smoke test A (first-run flow)

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
