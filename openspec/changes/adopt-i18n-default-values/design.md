# Design

## Context

See proposal.md — Why. Empirical facts established on this repo (i18next-cli 1.74.4, SWC extractor):

| Input style | New `en.json` value | Notes |
|---|---|---|
| `t('key')` — no default | `""` empty | English users see the raw dotted key (i18next returns the key for empty values) |
| `t('Natural English')` — natural key | `""` empty | Renders fine (key IS English), but the catalog and i18n Ally see empty English |
| `t('key', { defaultValue: '…' })` | the default | Only mechanism that non-empty-seeds new keys |
| `extract --sync-all --trust-derived` | key-derived dotted text | **Destructive**: overwrites existing hand-authored English for keys without explicit defaults (`"Loading"` → `"loading.heading"`) |
| existing key + conflicting `defaultValue` | **defaultValue wins** | Code is the source of truth for keys that have a default |

Consequences that shape the design: only `defaultValue` seeds non-empty primary-locale values; `--trust-derived` is a no-go; code wins over `en.json` once a default exists.

## Goals / Non-Goals

**Goals:**
- Every `t()` call carries its canonical English as `defaultValue`, so `i18n:extract` can always generate a non-empty primary locale from code alone.
- No rendered-output change: migrate using the exact current `en.json` strings.
- A CI/check guard that prevents empty primary-locale values from landing.

**Non-Goals:**
- Natural keys (English-as-key): rejected — this app has fragment strings (`mark_read_confirm.description1/2/3`, `landing.subheading`, `login.token_helper`) and pure templates (`sidebar.notifications.tooltip`) that are poor natural keys, and i18n Ally needs a populated English reference.
- `--trust-derived`: rejected — destructive to hand-authored English.
- Renaming keys or restructuring `en.json`: out of scope, keys stay stable so other locales and tests are untouched.

## Decisions

1. **`defaultValue` in every call, copied from current `en.json`.** The extractor seeds new keys and (per the empirical rule) takes over existing values from code. Copying existing strings makes the migration a rendered-output no-op and lets `i18n:check` verify zero drift after migration.
2. **en.json becomes a generated mirror.** After migration, `pnpm i18n:extract` regenerates it from code. Copy edits happen in `defaultValue`; contributors are told this in CONTRIBUTING.md. `en.json` remains the translation reference for i18n Ally and other locales.
3. **Guard: no empty or dotted-key values in `en.json`.** A script (checked into `package.json` as `i18n:check` companion) walks `en.json` and fails if any leaf value is `""` or equals its key path. This catches a forgotten `defaultValue` at CI time. Alternative considered: relying on `i18next-cli status` — insufficient because empty values are not reported as missing.
4. **Migration order matters for reviewability.** Components first (largest surface), then utils, then the `Errors` catalog (getters). Recommended: one PR for the whole migration (cohesive, single verification pass) with per-area commits.
5. **Keep `disablePlurals`, `sort`, `removeUnusedKeys`, `defaultNS: false` unchanged.** No config change is needed for `defaultValue` extraction.

## Risks / Trade-offs

- **Copy editing moves into components** (code wins on sync) → Mitigation: document in CONTRIBUTING.md; `en.json` remains the review/translation surface; editors can use i18n Ally "edit" which writes the default.
- **Migration diff is large** (~250 calls across ~20 files) → Mitigation: mechanical, verified by `i18n:check` no-op + full test suite; per-area commits for review.
- **Guard could false-positive on intentional key-path-like text** → Mitigation: guard checks leaf values only; existing English contains no values equal to their dotted key path (verified).
- **Other locales' interop** — `extract --sync-all` may rewrite `de/es/fr` formatting → Mitigation: run once, commit the normalized diff; values are untouched.

## Migration Plan

1. Add `defaultValue` to every `t()`/`i18n.t()` call, using the exact current `en.json` English (merge into existing options objects where present).
2. Run `pnpm i18n:extract` — expect `en.json` to be byte-identical (or a no-op) and add the CI guard.
3. Run `tsc --noEmit`, `pnpm lint:check`, full `pnpm test`, `pnpm i18n:check` — all green.
4. Update CONTRIBUTING.md locale section with the convention.
5. Rollback: revert the change's commits; `en.json` values are unchanged so no locale rollback needed.