# FinX — Versioning

## Format

`MAJOR.MINOR.PATCH.CLEANUP-SUFFIX`

- **MAJOR** — breaking / architecture rewrite
- **MINOR** — new feature
- **PATCH** — bug fix
- **CLEANUP** — refactor, docs, typos
- **SUFFIX** — lifecycle stage (see below)

## Lifecycle suffixes

| Suffix   | Stage             | Meaning                                   |
| -------- | ----------------- | ----------------------------------------- |
| `-alpha` | Prototype         | Internal only. Not shared.                |
| `-beta`  | Beta              | Shared with testers. Active feedback.     |
| `-rc`    | Release candidate | Feature complete. Polishing.              |
| _(none)_ | Stable            | Public release. No more breaking changes. |

## Current stage

**`-beta`** as of v1.7.0.0.

Historical (do not re-tag):

- v1.0.0.0 through v1.6.0.0 — were effectively `-alpha` but not labeled.

## When to advance stages

- **alpha → beta** — when the app has real users actively providing feedback (happened at v1.7.0.0)
- **beta → rc** — when all roadmap features through v1.9.0.0 are done and no known blocking bugs
- **rc → stable** — when v2.0.0.0 ships and the app is ready for general release

## Tagging

`git tag -a v1.7.2.0-beta -m "FinX v1.7.2.0-beta - AI history & multi-conversation"`

The `package.json` `version` field must match the tag (with suffix).

## Not covered by this scheme

- Pre-releases of pre-releases (e.g., `-beta.2`). If we need a hotfix during beta, bump the PATCH or CLEANUP digit instead: `v1.7.2.1-beta`.
