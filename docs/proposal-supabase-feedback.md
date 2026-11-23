# Proposal: Supabase-Backed Feedback + Dev Mode (FinX v1.6.0.0)

**Status:** Implemented — Supabase side verified 2026-11-22  
**Author:** profspirit-god studio  
**Date proposed:** 2026-11-22  
**Date verified:** 2026-11-22  
**Targets version:** v1.6.0.0 (replaces AI Assistant in the roadmap; AI Assistant pushed to v1.7.0.0)  
**Approval required from:** owner only

---

## 1. Purpose

FinX is currently local-first with no server. This proposal introduces a narrowly scoped Supabase sidecar — one backend integration for one purpose: receiving feedback (bug reports + idea suggestions) from beta testers, and letting the owner read them from a hidden developer view of the app.

Nothing financial leaves the user's device. Wallets, records, receipts, PINs, passwords — all stay in IndexedDB. Only voluntary feedback submissions cross the network.

**Status update (2026-11-22):** Supabase server side is fully implemented and verified. The FinX app-side code (Phases A–E) is in progress. See §13 for the verified state.

---

## 2. Hard constraints (from SUPABASE_SHARED_CONTEXT.md)

The Supabase project is shared with a live app called Class Funds (60 real students, real money data). The following are non-negotiable:

| Constraint                                                                            | Implication for FinX                                                                                                                         |
| ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Never touch cf*\* objects (tables, functions, policies, triggers, cf_bak5*\* backups) | FinX creates and owns only its own namespace                                                                                                 |
| Never read/alter auth.users beyond what Supabase's own auth API does                  | FinX's admin user is a normal auth user, inserted via supabase.auth.signInWithPassword()                                                     |
| Anonymous sign-in is ON project-wide (Class Funds depends on it)                      | auth.uid() is not null is NOT a valid "real account" check — must use is_anonymous claim where relevant                                      |
| Separate namespace required                                                           | FinX uses schema finx — not app2, not public, not prefixed in public                                                                         |
| RLS ON from first migration; no using (true) on private data                          | Feedback table: insert-only for anon/authenticated; select only for the FinX admin                                                           |
| Functions callable by every signed-in user by default                                 | Client-callable functions require explicit revoke/grant. finx.is_admin() has execute revoked from public/anon, granted only to authenticated |
| Owner runs all migrations manually via SQL Editor                                     | All SQL delivered as numbered .sql files in docs/supabase/                                                                                   |
| Anon key is public; service_role never in browser                                     | Client only carries anon key + project URL                                                                                                   |
| Free plan: ~500 MB DB, pauses after ~1 week idle                                      | Keep payload small; no blobs, no log tables without cleanup                                                                                  |
| Realtime publication must not be extended to cf\_\*                                   | FinX does not use Realtime in v1.6.0.0                                                                                                       |

---

## 3. What we're building (scope)

### 3.1 Beta-user facing

"Report a Bug" and "Suggest an Idea" entry points. Each opens a form with:

- Type (bug / idea) — locked by which entry point opened the form
- Message (required, 10–2000 chars)
- Username (pre-filled from local user's displayName, editable)
- Auto-captured: app version, user agent, timestamp

Submission goes to Supabase finx.feedback table via the anon key. Success → toast. Failure → toast with retry + a "Copy to clipboard" fallback so users can send manually if offline/backend-down.

### 3.2 Owner / developer facing

Hidden dev login at /dev-login (route added but not linked from anywhere).

Owner signs in with email + password (regular Supabase auth). On success:

- Session stored in sessionStorage (cleared on tab close; survives refresh)
- Redirects to /dev
- If not authenticated → /dev redirects to /dev-login

Dev dashboard at /dev:

| Section                                  | Shows                                                                                                                                                           |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Session                                  | Admin email, "Sign out" button                                                                                                                                  |
| Feedback inbox                           | List of all finx.feedback rows, newest first, paginated (50/page) with type pill, username, message, version, user agent, date/time, a "Mark as handled" toggle |
| Filters                                  | Type (bug / idea / all), handled state                                                                                                                          |
| Local app stats (read-only, device-only) | App version, wallets count, records count, receipts count, storage estimate (via navigator.storage.estimate())                                                  |
| Warning banner                           | "This is a development view. Your local FinX data is visible here only."                                                                                        |

Explicitly NOT in the dev dashboard:

- No "live user count" — impossible without anonymous device pings, which is a bigger privacy decision deferred to v2.0.0.0
- No access to any user's local wallets/records — those are device-local only
- No access to any cf\_\* data

### 3.3 Admin identification

Approach: finx.admin_users table seeded once via SQL by the owner (with their admin's auth.uid()). Not derived from email claim (avoids misconfiguration if email changes).

- Table has RLS on and no policies → nobody can read/write it via API, only SQL owner
- finx.feedback select policy checks finx.is_admin() — a security-definer function that bypasses admin_users' RLS
- Only the seeded admin can read feedback

### 3.4 Entry point for feedback (D4)

D4 was answered "d" but no option d was offered. Interpretation: a floating action button is the closest fit ("floating", "always visible", "one click"). **This is a guess and needs owner confirmation before implementation.** If the owner meant something else (e.g., footer link, menu item, header icon), adjust before coding.

Default (assumed): floating action button (FAB) in the bottom-right corner on all pages except /dev\*, /lock, and /onboarding. Tap opens a small menu with two buttons: "Report a bug" / "Suggest an idea". Menu closes on selection or outside-click.

---

## 4. Schema (FinX-owned, finx schema)

All names are finx._. Zero cf\__ references. Zero public objects.

### 4.1 finx.feedback

```sql
create table if not exists finx.feedback (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('bug', 'idea')),
  message text not null check (length(message) between 10 and 2000),
  username text,
  app_version text,
  user_agent text,
  handled boolean not null default false,
  created_at timestamptz not null default now()
);
```
