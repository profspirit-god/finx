# Proposal: Supabase-Backed Feedback + Dev Mode (FinX v1.6.0.0)

**Status:** Proposed — awaiting Supabase implementation by owner + Claude (Supabase specialist)
**Author:** profspirit-god studio
**Date proposed:** 2026-11-22
**Targets version:** v1.6.0.0 (replaces AI Assistant in the roadmap; AI Assistant pushed to later)
**Approval required from:** owner only

---

## 1. Purpose

FinX is currently local-first with no server. This proposal introduces a narrowly scoped Supabase sidecar — one backend integration for one purpose: receiving feedback (bug reports + idea suggestions) from beta testers, and letting the owner read them from a hidden developer view of the app.

Nothing financial leaves the user's device. Wallets, records, receipts, PINs, passwords — all stay in IndexedDB. Only voluntary feedback submissions cross the network.

---

## 2. Hard constraints (from SUPABASE_SHARED_CONTEXT.md)

The Supabase project is shared with a live app called Class Funds (60 real students, real money data). The following are non-negotiable:

| Constraint                                                                            | Implication for FinX                                                                                                                    |
| ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Never touch cf*\* objects (tables, functions, policies, triggers, cf_bak5*\* backups) | FinX creates and owns only its own namespace                                                                                            |
| Never read/alter auth.users beyond what Supabase's own auth API does                  | FinX's admin user is a normal auth user, inserted via supabase.auth.signInWithPassword()                                                |
| Anonymous sign-in is ON project-wide (Class Funds depends on it)                      | auth.uid() is not null is NOT a valid "real account" check — must use is_anonymous claim where relevant                                 |
| Separate namespace required                                                           | FinX uses schema finx — not app2, not public, not prefixed in public                                                                    |
| RLS ON from first migration; no using (true) on private data                          | Feedback table: insert-only for anon/authenticated; select only for the FinX admin                                                      |
| Functions callable by every signed-in user by default                                 | No client-callable functions needed for FinX. If added later, must revoke execute from public, anon, authenticated for internal helpers |
| Owner runs all migrations manually via SQL Editor                                     | All SQL delivered as numbered .sql files in docs/supabase/                                                                              |
| Anon key is public; service_role never in browser                                     | Client only carries anon key + project URL                                                                                              |
| Free plan: ~500 MB DB, pauses after ~1 week idle                                      | Keep payload small; no blobs, no log tables without cleanup                                                                             |
| Realtime publication must not be extended to cf\_\*                                   | FinX does not use Realtime in v1.6.0.0                                                                                                  |

---

## 3. What we're building (scope)

### 3.1 Beta-user facing

"Report a Bug" and "Suggest an Idea" entry points (location chosen in §3.4). Each opens a form with:

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

| Section                                  | Shows                                                                                                                                                                                |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Session                                  | Admin email, "Sign out" button                                                                                                                                                       |
| Feedback inbox                           | List of all finx.feedback rows, newest first, paginated (50/page) with type pill, username, message, version, user agent, date/time, a "Mark as handled" toggle (stored server-side) |
| Filters                                  | Type (bug / idea / all), handled state                                                                                                                                               |
| Local app stats (read-only, device-only) | App version, wallets count, records count, receipts count, storage estimate (via navigator.storage.estimate())                                                                       |
| Warning banner                           | "This is a development view. Your local FinX data is visible here only."                                                                                                             |

Explicitly NOT in the dev dashboard:

- No "live user count" — impossible without anonymous device pings, which is a bigger privacy decision deferred to v2.0.0.0
- No access to any user's local wallets/records — those are device-local only
- No access to any cf\_\* data

### 3.3 Admin identification

Approach: finx.admin_users table seeded once via SQL by the owner (with their admin's auth.uid()). Not derived from email claim (avoids misconfiguration if email changes).

- Table has RLS on and no policies → nobody can read/write it via API, only SQL owner
- finx.feedback select policy checks exists (select 1 from finx.admin_users where user_id = auth.uid())
- Only the seeded admin can read feedback

### 3.4 Entry point for feedback (D4)

D4 was answered "d" but no option d was offered. Interpretation: a floating action button is the closest fit ("floating", "always visible", "one click"). This is a guess and needs owner confirmation before implementation. If the owner meant something else (e.g., footer link, menu item, header icon), adjust before coding.

Default (assumed): floating action button (FAB) in the bottom-right corner on all pages except /dev\*, /lock, and /onboarding. Tap opens a small menu with two buttons: "Report a bug" / "Suggest an idea". Menu closes on selection or outside-click.

---

## 4. Schema (FinX-owned, finx schema)

All names are finx._. Zero cf\__ references. Zero public objects.

### 4.1 finx.feedback

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

Notes:

- handled is stored server-side so the owner's state persists across devices
- id uuid (not bigserial) — avoids sequence grant hassle for the anon role
- No auth.uid() — feedback is submitted by anonymous visitors too. No foreign key to auth.users

### 4.2 finx.admin_users

create table if not exists finx.admin_users (
user_id uuid primary key references auth.users(id) on delete cascade,
label text,
created_at timestamptz not null default now()
);

Notes:

- on delete cascade ensures cleanup if the auth user is ever removed (by Supabase admin, not by FinX)
- label — free-form note for the owner (e.g., "primary admin")

### 4.3 RLS

alter table finx.feedback enable row level security;
alter table finx.admin_users enable row level security;

-- feedback: anon + authenticated can INSERT only
create policy feedback_insert_any on finx.feedback
for insert
to anon, authenticated
with check (true);

-- feedback: only listed admins can SELECT
create policy feedback_admin_select on finx.feedback
for select
to authenticated
using (
exists (select 1 from finx.admin_users
where user_id = (select auth.uid()))
);

-- feedback: only listed admins can UPDATE handled
create policy feedback_admin_update on finx.feedback
for update
to authenticated
using (
exists (select 1 from finx.admin_users
where user_id = (select auth.uid()))
)
with check (
exists (select 1 from finx.admin_users
where user_id = (select auth.uid()))
);

-- admin_users: no policies (RLS locked; only SQL owner can manage)

Note: with check (true) on the insert policy is not a privacy leak — the row is not readable by anyone except listed admins. The using (true) rule the shared context warns about applies to readable private data.

### 4.4 Grants

grant usage on schema finx to anon, authenticated;
grant insert on finx.feedback to anon, authenticated;
grant select, update on finx.feedback to authenticated;
-- admin_users: no grants — only SQL owner

### 4.5 Dashboard action required (one-time, by owner)

Settings → API → Exposed schemas → add finx alongside public, app2 (or whatever Class Funds uses). Without this, supabase.schema('finx') returns 404.

---

## 5. Client integration

### 5.1 Environment

.env.local (gitignored):
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key>

.env.example (committed, placeholders only):
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

### 5.2 Client wrapper

src/lib/supabase.ts:

- Creates supabase client with URL + anon key
- Exports finxSupabase = supabase.schema('finx') for schema-scoped queries
- Throws a clear SYS2 (offline) error if either env var is missing
- Does not auto-refresh session (dev session only — no long-lived tokens)

### 5.3 Feature modules

src/features/feedback/ (beta user facing)
submit.ts — insert into finx.feedback
types.ts
components/
FeedbackFab.tsx — floating action button + menu
FeedbackForm.tsx — the modal form
FeedbackSuccess.tsx

src/features/dev-mode/ (owner facing)
auth.ts — signIn / signOut / getSession / subscribe
api.ts — list feedback (paginated), mark handled
guard.tsx — <DevGuard> redirects if not admin
components/
DevLogin.tsx — email + password form
DevDashboard.tsx — inbox + stats
FeedbackRow.tsx
LocalStatsCard.tsx

### 5.4 Route additions

/dev-login → DevLogin (sibling of /lock, /onboarding — outside AppShell)
/dev → DevGuard → DevDashboard (inside AppShell, but with a dev banner)

Feedback FAB appears inside AppShell on all pages except /dev, /dev-login, /lock, /onboarding.

### 5.5 Session storage (D1 = c)

- Owner's Supabase session persisted to sessionStorage under key finx_dev_session
- On app bootstrap, restore session from sessionStorage
- Sign out clears it
- Closing the tab clears it automatically (sessionStorage behavior)

---

## 6. Data flow diagrams

### 6.1 Beta user submits a bug

User taps FAB → "Report a bug" → FeedbackForm opens
→ fills message → taps Submit
→ finxSupabase.from('feedback').insert({ type:'bug', message, username, app_version, user_agent })
→ success: toast "Thanks — report sent" + close form
→ failure: toast "Couldn't send" + "Copy to clipboard" fallback

### 6.2 Owner reads inbox

Owner visits /dev → DevGuard checks sessionStorage + Supabase session
→ if no session → redirect /dev-login
→ DevLogin: email + password → supabase.auth.signInWithPassword
→ success: session in sessionStorage → redirect /dev
→ DevDashboard loads finx.feedback (RLS allows because auth.uid() in admin_users)
→ shows list with filters; owner can mark handled (update finx.feedback.handled)

### 6.3 What never crosses the network

- Wallet data
- Record data
- Receipt files
- PIN or password
- User's name (unless they type it in the feedback message)
- Anything from IndexedDB
- Any cf\_\* data from the shared project

---

## 7. Failure modes and mitigations

| Failure                                           | User sees                                                                    | Mitigation                                                            |
| ------------------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Supabase project paused (free tier, ~1 week idle) | "Couldn't send. Try again later." + Copy-to-clipboard fallback               | Owner must visit the project dashboard to unpause; documented in Help |
| User offline when submitting                      | "You're offline. Copy your message to clipboard and send it later."          | Fallback path always available                                        |
| Env vars missing (misconfigured deploy)           | Feedback FAB hidden; toast on /dev-login "Supabase not configured"           | Prevents silent failure                                               |
| Admin not seeded in finx.admin_users              | /dev shows "You're signed in but not recognized as admin." with instructions | Owner seeds via SQL once                                              |
| Feedback table RLS misconfigured                  | Inserts rejected — user sees generic error                                   | Verification queries in docs/supabase/verify.sql                      |
| Auth rate limit hit on /dev-login                 | "Too many attempts. Wait a minute."                                          | Standard Supabase auth rate limiting applies                          |
| Anon key leaked via DevTools                      | Nothing — it's already public. RLS protects.                                 | Documented in ai-instructions.md                                      |
| Owner accidentally submits feedback to self       | Feedback appears in own inbox                                                | Cosmetic only                                                         |

---

## 8. Implementation phases (once Supabase is done)

Deliverable by owner + Claude (Supabase specialist) before FinX code work resumes:

1. SQL files executed in Supabase SQL Editor
2. finx schema exposed via API
3. Admin user created in auth.users
4. Admin auth.uid() seeded in finx.admin_users
5. Project URL + anon key handed to FinX repo (via .env.local, not committed)
6. Verification queries pass (feedback insert as anon; feedback select denied as anon; select allowed as admin)

FinX coding phases (after Supabase complete):

| Phase | Scope                                                                                                                                                 |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| A     | .env.local template, src/lib/supabase.ts, feedback types + submit function                                                                            |
| B     | FeedbackFab, FeedbackForm, wire into AppShell                                                                                                         |
| C     | dev-mode/auth.ts, DevLogin, DevGuard, /dev-login route                                                                                                |
| D     | dev-mode/api.ts, DevDashboard, FeedbackRow, LocalStatsCard, /dev route                                                                                |
| E     | Version bump to v1.6.0.0, docs (changelog, roadmap, ai-instructions update, Help page feedback section, privacy note in onboarding terms), merge, tag |

---

## 9. Documentation updates required

When FinX code work resumes (Phase E), the following files must be updated:

| File                         | Change                                                                                                                                                                                                |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| docs/ai-instructions.md      | New "Supabase sidecar" section: what it is, what data flows where, env vars, RLS model, "no cf\_\* touches ever", admin seeding process                                                               |
| docs/changelog.md            | v1.6.0.0 entry                                                                                                                                                                                        |
| docs/buglog.md               | Track the D4 entry-point ambiguity as a known unknown                                                                                                                                                 |
| docs/roadmap.md              | AI Assistant pushed past v1.6.0.0 (see revised roadmap)                                                                                                                                               |
| Onboarding Terms (StepTerms) | Add sentence: "If you submit a bug report or idea, your message, username, app version, and browser info are stored on a secure server so the developer can read them. Financial data is never sent." |
| Help page                    | New "How feedback works" and "Data & privacy" sections                                                                                                                                                |
| README.md (root)             | Note the sidecar exists                                                                                                                                                                               |

---

## 10. Open questions for owner before implementation

1. D4 entry point — my interpretation of "d" was "floating action button". Confirm or specify the real intent.
2. Privacy terms wording — does the one-sentence addition to onboarding StepTerms meet your needs, or do you want a longer privacy paragraph?
3. handled field — persist server-side (my proposal) or track locally only? Server-side lets you filter unhandled across devices. Local is simpler but per-browser.
4. Feedback retention — leave rows forever, or add a "delete older than 90 days" routine? Free tier is small; forgetting to clean up is a known risk.
5. Abuse prevention — the insert policy is open. Options: (a) accept spam risk (small beta), (b) add a simple rate limit via a Postgres function (adds complexity), (c) rely on Supabase's built-in per-IP rate limits. Recommend (a) for v1.6.0.0.

---

## 11. Rollback plan

If Supabase integration fails or proves unworkable:

1. Revert to v1.5.0.1 via git checkout v1.5.0.1 on main
2. Remove .env.local from owner's machine
3. Do not delete the Supabase finx schema — harmless if unused; delete later if certain
4. Feedback submission reverts to mailto: fallback (documented, never built)

---

## 12. References

- SUPABASE_SHARED_CONTEXT.md — the constraints document supplied by the owner
- docs/roadmap.md — revised roadmap reflecting this proposal
- docs/ai-instructions.md — will receive a Supabase section when implementation resumes
