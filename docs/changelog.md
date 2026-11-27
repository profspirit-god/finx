# Changelog

## Index

- [v1.5.0.1](#v1501)
- [v1.5.0.0](#v1500)
- [v1.4.0.0](#v1400)
- [v1.3.0.0](#v1300)
- [v1.2.0.0](#v1200)
- [v1.1.0.0](#v1100)
- [v1.0.3.0](#v1030)
- [v1.0.2.0](#v1020)
- [v1.0.0.1](#v1001)
- [v1.0.0.0](#v1000)

## v1.7.2.0-beta

### Added

- **Multi-conversation AI history** (`src/features/ai/`):
  - `lib/conversations.ts` — CRUD for conversations and messages, title derivation, clear-all.
  - **Opt-in persistence:** The "Save chat history" toggle in Settings now actually saves conversations to IndexedDB (v3 schema). Off by default (ephemeral, matches key security).
  - **Conversation sidebar:** When history is on, a left panel shows past chats. Click to switch, "New chat" to start fresh, auto-titles from the first message.
  - **Settings dialog:** Scrollable, uses the app's custom `<Dialog>` for "Clear all saved conversations" (no more native browser confirm).
- **IndexedDB schema v3:** Added `ai_conversations` store, linked `ai_messages` to conversations via `conversationId`, added `by-conversation` index. Migration wipes any existing ephemeral test messages (acceptable for beta).
- **New docs:** `docs/versioning.md` — defines the alpha/beta/rc/stable lifecycle suffixes.

### Changed

- `AIPage` passes `saveHistory` to `ChatView` and uses a `refreshKey` to force remount when history is cleared.
- Version format changed to include lifecycle suffixes (e.g., `-beta`). Historical tags remain as-is.
- Sidebar footer version label updated to `v1.7.2.0-beta`.

### Design decisions

- **No retroactive migration of old messages:** v2 `ai_messages` were ephemeral test data. Wiped cleanly rather than migrated.
- **Chat titles** are derived from the first user message (truncated at 40 chars), or `/help` → "Help". They can't be renamed yet (future).
- **Clear history** only deletes conversations and messages — AI settings (API key, toggles) are preserved.

## v1.7.1.0

### Added

- AI Assistant (`src/features/ai/`):
  - `lib/crypto.ts` — PBKDF2-derived AES-GCM encryption for API keys (100k iterations, SHA-256). Uses the user's PIN salt.
  - `lib/keyCache.ts` — in-memory only cache for the derived encryption key. Cleared on page refresh for max security.
  - `lib/providers.ts` — presets for Groq, Google Gemini, OpenRouter, and custom OpenAI-compatible endpoints.
  - `lib/client.ts` — streaming SSE client for OpenAI-compatible chat completions.
  - `lib/commands.ts` — slash command definitions, prompt builders, and context packer.
  - `lib/settings.ts` — IndexedDB persistence for AI settings (provider, model, encrypted key, consent).
  - `components/AISettingsForm.tsx` — setup/config UI. Validates and encrypts API keys before storing.
  - `components/ChatView.tsx` — streaming chat UI. Supports slash commands via dropdown menu. Ephemeral history (cleared on tab close).
  - `components/MessageBubble.tsx` — markdown-like bubble for user/assistant/error messages.
  - `components/CommandMenu.tsx` — autocomplete menu when typing `/`.
  - `components/ProviderSelector.tsx` — provider cards.
  - `AIPage.tsx` — orchestrates first-time setup vs chat view.
- IndexedDB schema bumped to v2 (`ai_settings`, `ai_messages`).
- Auth store now derives and caches the AI encryption key on successful PIN unlock.
- Slash commands: `/report`, `/reportshort`, `/reportlong`, `/rankincome`, `/rankexpense`, `/budget`, `/trend`, `/goals`, `/wallets`, `/help`.

### Changed

- `src/app/router/routes.tsx` — `/ai` now points to `AIPage`.

### Design decisions

- **In-memory only chat history:** Refreshing the page or closing the tab clears the chat log. This matches the in-memory encryption key policy. (Persistence will be added as an opt-in in v1.7.2.0).
- **Context Consent:** Users must explicitly toggle "Allow AI to read my financial summary" to enable commands like `/report`. Context is packed locally and sent only to the provider. No raw receipt files or IDs are sent.

## v1.7.0.0

### Added

- In-app Notice / Inbox (`src/features/notices/`):
  - `content.ts` — bundled notice list (newest first). Current notices: v1.6.0.0, v1.4.0.0, v1.3.0.0, v1.5.0.0 features + beta thank-you.
  - `types.ts` — `Notice`, `NoticeCategory`, `NoticeState`
  - `state/notices.store.ts` — Zustand store, read/dismiss state persisted to IndexedDB (`settings` store, id: `notices`)
  - `hooks/useNotices.ts` — returns visible list, unread list, unread count
  - `components/NoticesPage.tsx` — `/notices` list, category pills, read/unread state, "Mark all as read"
  - `components/NoticeDetailDialog.tsx` — modal with category banner, action link, dismiss button (if dismissable)
  - `components/DashboardNoticeBanner.tsx` — dashboard top banner showing the latest unread notice; dismissible for the session
- Sidebar "Notices" item with unread badge (gold pill when expanded, dot when collapsed)
- `/notices` route

### Changed

- `Sidebar.tsx` — added Notices nav item with `badgeKey`; `SidebarItem` accepts optional `badge` number
- `DashboardPage.tsx` — mounts `<DashboardNoticeBanner />` at the top
- Notice content is bundled with the app (not fetched from Supabase). To add a notice, edit `src/features/notices/content.ts` and deploy.

### Known gaps

- Notices are not pushable without a deploy (Supabase-backed notices deferred to later if needed)
- The beta thank-you notice is permanently unreadable-dismissible (`dismissable: false`); it stays in the list forever

## v1.6.0.0

### Added

- Supabase feedback sidecar (`src/lib/supabase.ts`, `src/features/feedback/`, `src/features/dev-mode/`):
  - `src/lib/supabase.ts` — client singleton scoped to `finx` schema, sessionStorage persistence (`finx_dev_session`), graceful null when env vars missing
  - `src/features/feedback/` — types, submit (with friendly error mapping), `FeedbackFab` (gold circular button + menu), `FeedbackForm` (modal with validation, counter, copy-to-clipboard fallback)
  - `src/features/dev-mode/` — `signInDev` / `signOutDev` / `getDevSession` / `isAdminSession` (calls `finx.is_admin()` RPC), `DevGuard`, `DevLogin`, `DevDashboard` (feedback inbox with type/handled filters, pagination, mark-handled toggle, `LocalStatsCard`, warning banner), `listFeedback`, `setHandled`
- `/dev-login` route (fullscreen, no sidebar, no FAB)
- `/dev` route (inside AppShell, guarded by `DevGuard`, no FAB)
- `.env.example` now includes `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` placeholders
- `@supabase/supabase-js` dependency

### Changed

- `src/layout/AppShell.tsx` — mounts `<FeedbackFab pathname={pathname} />` at shell level
- `src/App.tsx` — `/dev-login` added to `FULLSCREEN_ROUTES`
- `src/app/router/routes.tsx` — `/dev-login` and `/dev` wired to `DevLogin` and `DevGuard`+`DevDashboard`

### Architecture note

- **FinX now has a Supabase sidecar** for feedback only. All financial data remains device-local in IndexedDB. Only voluntary feedback submissions cross the network. See `docs/proposal-supabase-feedback.md` and `docs/ai-instructions.md §13` for the full model, constraints, and RLS design.

### Security

- `finx` schema isolated from Class Funds' `cf_*` namespace (shared Supabase project)
- `finx.is_admin()` is a `security definer` function with `execute` revoked from `anon` — required because `admin_users` RLS blocks direct `exists` subqueries
- Admin seeded once via SQL (`finx.admin_users`), not derived from email claim
- Session stored in `sessionStorage` (survives refresh, cleared on tab close)
- Password rotated after accidental chat exposure during setup

### Known gaps

- No in-app delete for feedback rows — admin uses SQL Editor (documented in dev dashboard)
- No rate limiting on feedback inserts — beta-scale acceptable, revisit if spam appears
- `handled` field only toggles; no "notes" field for triage
- D4 entry-point confirmed as floating action button (was ambiguous in initial proposal)

## v1.5.0.1

### Fixed

- `Cannot access 'h' before initialization` on first record creation — circular static import between `records.store`, `wallets.store`, and `auth.store`. Replaced with lazy `await import()` inside actions.
- `Cannot access 'walletId' before initialization` in `RecordForm` — `selectedWallet`/`currency` were declared before `walletId` state. Moved below the state declarations.
- Components `RecordDetail`, `RecordForm`, `RecordList` — removed unused `useWalletsStore` static imports; use `useWallets()` hook.

## v1.5.0.0

### Added

- Data Tools feature (`src/features/data-tools/`):
  - `lib/schema.ts` — `FinXBackup` shape (v1), `RECORD_FIELDS` catalog, `ExportOptions` types
  - `lib/export.ts` — `buildTabular`, `filterRecords`, `toCSV`, `toJSON`, `toXLSX`, `toPDF`, `downloadBlob`, `defaultFilename`
  - `lib/import.ts` — `parseBackupFile`, `validateBackup`, `writeBackup` (merge / replace modes), `exportFullBackup`, `updateBackupStamp`, base64 Blob serialization
  - `ExportPanel` — full-backup download card (separate from record export), 4-format record export, field picker (12 fields), wallet + date filters, include-archived toggle, live count, toast feedback
  - `ImportPanel` — JSON file picker, backup preview with counts, merge / replace mode picker, custom `<Dialog>` for replace confirmation
  - `FormatPicker`, `FieldPicker`, `BackupPreview`
  - `DataToolsPage` — Export / Import tabs
- `src/lib/hooks/useCurrency.ts` — cached settings-based currency reader with `invalidateCurrencyCache()`
- `Help` page: added **Wipe all data** action (destructive, custom Dialog); **Reset onboarding** clearly labeled "keep data"

### Changed

- Data Tools page mounted at `/data-tools` (was placeholder)
- Wizard `StepStartingMoney`, `StepGoal`, `StepReview` use active currency instead of hardcoded `'USD'`
- `RecordForm`, `RecordDetail`, `RecentActivity`, `DashboardPage` read currency from wallet / settings correctly
- `completePersonalization` invalidates currency cache after saving
- Native `confirm()` replaced with app `<Dialog>` in: import replace, reset onboarding, wipe data

### Fixed

- `StepGoal` / `StepReview` had `useCurrency()` at module scope → "Invalid hook call" runtime error; moved inside component body
- Full-backup export vs record export are now visually and textually distinct (record export is not importable)

### Known gaps

- Currency change is not retroactive — existing wallets keep their original currency (Settings migration arrives in v1.7.0.0)
- Bundle size warning (~1.5 MB main chunk, from xlsx + jspdf + html2canvas); lazy-loading `DataToolsPage` is a v2.0.0.0 polish item
- Import accepts only full-backup JSON, not record-array JSON (column-mapped CSV import is a later minor)

## v1.4.0.0

### Added

- Dashboard: stats layer, summary cards, rate cards (monthly/daily/yearly), net worth area chart, cashflow bar chart, investment donut, recent activity, time range selector

## v1.3.0.0

### Added

- Records: repo (CRUD + transfers + receipts), store, list with filters, create form (inline errors, sticky bar, toast, receipt upload), detail with inline edit + pair-aware delete + receipt viewer
- Wallet audit log wired to live records

### Fixed

- Wallets store hydration race on record pages after reload
- `Record` type collision with TS built-in
- Wizard Back preserved field edits

## v1.2.0.0

### Added

- Wallets: repo + store + 5-step progressive wizard, list, detail with goal bar, archive/delete
- Error code registry (11 codes), `ErrorPage`, Help reference tables

## v1.1.0.0

### Added

- Auth types, PBKDF2 user repo, Zustand auth store, AuthProvider, AuthGuard
- 5-step onboarding wizard, LockScreen + PinPad, Sidebar "Lock now"

## v1.0.3.0

### Added

- Domain types, IndexedDB schema, idb wrapper, PBKDF2 crypto, format helpers, common hooks
- Provider stack, bootstrap

## v1.0.2.0

### Added

- 15 design system primitives, barrel export

## v1.0.0.1

### Fixed

- Restored `package.json`, rewrote 26 truncated files, completed `.gitignore`

## v1.0.0.0

### Added

- Vite + React + TS + Tailwind scaffold, PWA, routing, AppShell, Sidebar, TopBar, design tokens
