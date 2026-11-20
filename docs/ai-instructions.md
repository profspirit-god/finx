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

## 1. Purpose

Source of truth for any AI working on FinX. Read only the section you need.

## 2. Golden Rules

- **No emoji.** Lucide SVG icons only.
- **No default browser UI** for toasts/dialogs/alerts — use `src/ui/*`.
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

src/
app/ # bootstrap, providers, router
features/ # one folder per domain
ui/ # dumb primitives
layout/ # shell/sidebar/topbar
lib/ # pure helpers (db, crypto, format)
styles/ # tokens, glass, animations
types/ # shared TS types

## 5. File Ownership Map

| Concern            | Files                                           |
| ------------------ | ----------------------------------------------- |
| Sidebar behavior   | `src/layout/Sidebar/*`                          |
| Theme colors       | `src/styles/tokens.css`                         |
| Route registration | `src/app/router/routes.tsx`                     |
| Global providers   | `src/app/providers/*`                           |
| DB schema          | `src/lib/db/schema.ts`                          |
| PWA                | `public/manifest.webmanifest`, `vite.config.ts` |

## 6. Design System Rules

- Glass: use `.glass` or `.glass-strong`. Don't reinvent blur.
- Gold = accent only. Never for errors.
- System colors: red=error, orange=warning, yellow=attention, green=success, blue=info.
- Radius: `--radius` panels, `--radius-lg` large cards.
- Spacing = Tailwind default (4px base).

## 7. Data Model

Stores (step 3): `users`, `settings`, `wallets`, `records`, `receipts`. Money = integer minor units (cents).

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
