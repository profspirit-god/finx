# FinX — AI Instructions

## Index

1. [Purpose](#1-purpose)
2. [Golden Rules](#2-golden-rules)
3. [Branching & Versioning](#3-branching--versioning)
4. [Folder Tree](#4-folder-tree)
5. [File Ownership Map](#5-file-ownership-map)
6. [Design System Rules](#6-design-system-rules)
7. [Data Model](#7-data-model)
8. [Error Escalation Policy](#8-error-escalation-policy)
9. [Session-End Protocol](#9-session-end-protocol)
10. [Supabase Sidecar](#10-supabase-sidecar)

## 1. Purpose

Source of truth for any AI working on FinX. Read only the section you need.

## 2. Golden Rules

- **No emoji.** Lucide SVG icons only.
- **No default browser UI** for toasts/dialogs/alerts — use `src/ui/*` and the app's `<Dialog>`.
- **Instant feel:** optimistic UI + silent backend work.
- **Modular:** never cross-import between features. Only `ui/`, `lib/`, `types/`, `layout/` are shared.
- **Local-first:** all persistence via `src/lib/db/idb.ts`. Never call network for storage.
- **Accessibility:** keyboard focus visible (`:focus-visible` already styled).
- **Motion:** respect `prefers-reduced-motion`.
- **Colors:** only CSS vars in `src/styles/tokens.css`. Never hardcode hex.
- **Fonts:** Work Sans only.

## 3. Branching & Versioning

- Long-lived: `main` (protected), `develop` (integration).
- Short-lived: `feat/*`, `fix/*`, `chore/*`, `release/vX.Y.Z.W`.
- Version: `MAJOR.MINOR.PATCH.CLEANUP`.
- Tag releases on `main`.

## 4. Folder Tree

`src/
app/ # bootstrap, providers, router
features/ # one folder per domain
ui/ # dumb primitives
layout/ # shell/sidebar/topbar
lib/ # pure helpers (db, crypto, format)
styles/ # tokens, glass, animations
types/ # shared TS types`

## 5. File Ownership Map

| Concern             | Files                                           |
| ------------------- | ----------------------------------------------- |
| Sidebar behavior    | `src/layout/Sidebar/*`                          |
| Theme colors        | `src/styles/tokens.css`                         |
| Route registration  | `src/app/router/routes.tsx`                     |
| Global providers    | `src/app/providers/*`                           |
| DB schema           | `src/lib/db/schema.ts`                          |
| PWA                 | `public/manifest.webmanifest`, `vite.config.ts` |
| Supabase client     | `src/lib/supabase.ts`                           |
| Feedback submission | `src/features/feedback/*`                       |
| Dev dashboard       | `src/features/dev-mode/*`                       |

## 6. Design System Rules

- Glass: use `.glass` or `.glass-strong`. Don't reinvent blur.
- Gold = accent only. Never for errors.
- System colors: red=error, orange=warning, yellow=attention, green=success, blue=info.
- Radius: `--radius` panels, `--radius-lg` large cards.
- Spacing = Tailwind default (4px base).

## 7. Data Model

Stores (IndexedDB via `src/lib/db/schema.ts`): `users`, `settings`, `wallets`, `records`, `receipts`. Money = integer minor units (cents).

Supabase (remote, `finx` schema): `feedback`, `admin_users`. See §10.

## 8. Error Escalation Policy

1. Toast (transient)
2. Same error twice within 30s → persistent `Notice`
3. Unsolved after 2 min → `Dialog` with "Go to Help → Troubleshooting"

## 9. Session-End Protocol

Every session ends with:

- Update `docs/changelog.md` (version bump)
- Update `docs/buglog.md` if a bug found/fixed
- Bump `package.json` `version`
- Print copy-paste git commands

## 10. Supabase Sidecar

### 10.1 What it is

FinX has a **single, narrow backend integration**: a Supabase project (shared with another app called Class Funds) that stores beta feedback submissions. Nothing else crosses the network. Wallets, records, receipts, PINs, passwords — all stay in IndexedDB on the user's device.

### 10.2 Project constraints (from SUPABASE_SHARED_CONTEXT.md)

The Supabase project is **shared** with a live app (Class Funds) that has real student and money data. Non-negotiable rules:

- **Never touch `cf_*` objects** (tables, functions, policies, triggers, `cf_bak5_*` backups). Ever.
- **Never touch `public` schema objects.** FinX uses `finx` schema exclusively.
- **Never delete users from `auth.users`** without explicit written OK from the owner. Class Funds' admin lives there.
- **Anonymous sign-in is ON project-wide** — Class Funds depends on it. Do not disable.
- **Migrations are run by the owner in SQL Editor**, never auto-applied.

### 10.3 Schema

Two tables in `finx` schema:

**`finx.feedback`** — user submissions

- `id uuid` (not bigserial — avoids sequence grants for anon)
- `type text` — 'bug' or 'idea'
- `message text` (10–2000 chars)
- `username text` (nullable)
- `app_version text`, `user_agent text` — auto-captured
- `handled boolean default false`
- `created_at timestamptz default now()`

**`finx.admin_users`** — who can read feedback

- `user_id uuid` PK, FK to `auth.users(id)`
- `label text`
- `created_at timestamptz`
- **RLS enabled, no policies** — only SQL owner can read/write

### 10.4 Admin check — mandatory pattern

Any cross-table admin check in `finx` schema **must** use a `security definer` function. Direct `exists (select ... from finx.admin_users ...)` inside a policy will **silently return false** because `admin_users` has RLS with no policies.

The canonical function:

```sql
create or replace function finx.is_admin()
returns boolean
language sql
security definer
set search_path = finx, public
as $$
  select exists (
    select 1 from finx.admin_users where user_id = auth.uid()
  );
$$;

revoke execute on function finx.is_admin() from public, anon;
grant execute on function finx.is_admin() to authenticated;

Policies on finx.feedback:

feedback_insert_any — for insert to anon, authenticated with check (true) (anyone can submit)

feedback_admin_select — for select to authenticated using (finx.is_admin())

feedback_admin_update — for update to authenticated using (finx.is_admin()) with check (finx.is_admin())

No DELETE policy. Admin deletes via SQL Editor only.

10.5 Client integration
src/lib/supabase.ts:

getSupabase() — returns client or null if env vars missing

getFinxClient() — returns client.schema('finx') or throws

isSupabaseConfigured() — boolean

Session storage:

Storage key: finx_dev_session

Storage: window.sessionStorage (survives refresh, cleared on tab close)

Purpose: keep owner signed in during a dev session

Env vars (.env.local, never committed):

VITE_SUPABASE_URL

VITE_SUPABASE_ANON_KEY (publishable key — safe to expose in client)

10.6 Feature modules
src/features/feedback/ — beta-user facing

submitFeedback({ type, message, username }) — insert-only, no .select() (anon lacks SELECT grant)

FeedbackFab — floating action button, hidden on /dev, /dev-login, /lock, /onboarding

FeedbackForm — modal with validation + copy-to-clipboard fallback

src/features/dev-mode/ — owner facing

signInDev(email, password), signOutDev(), getDevSession(), isAdminSession() (calls finx.is_admin() RPC)

DevGuard — redirects to /dev-login if not admin

DevLogin, DevDashboard, FeedbackRow, LocalStatsCard

listFeedback(filter, offset) — paginated, 50 per page

setHandled(id, handled) — toggle handled

10.7 Adding a new Supabase feature
Before writing any SQL:

Read SUPABASE_SHARED_CONTEXT.md in full if not already done

Use finx schema only — never public, never cf_*

RLS ON from creation — no exceptions

Use security definer for cross-table checks (see §10.4)

Ask owner before any DROP, TRUNCATE, DELETE without WHERE, or ALTER

Verify grants match policies — RLS says which rows, grants say whether you can query at all

Update this file and docs/proposal-supabase-feedback.md

10.8 Known gaps
No in-app delete for feedback (SQL Editor only)

No rate limiting on inserts (beta scale acceptable)

No triage notes field (only handled boolean)

No real-time push (dev dashboard refreshes on demand)

No user count metric — impossible without anonymous device pings (deferred to v2.0.0.0)
```
