# Tasks

## 1. Routes

- [x] 1.1 Add `defaultValue` to every `t()` call in `routes/Accounts.tsx`, `routes/Login.tsx`, `routes/Landing.tsx`, `routes/Filters.tsx` — verify `pnpm exec biome check` and `pnpm exec tsc --noEmit` pass and every `t('…')` call in these files carries a `defaultValue`
- [x] 1.2 Add `defaultValue` to every `t()` call in `routes/Notifications.tsx`, `routes/Settings.tsx`, `routes/ManageAccount.tsx` — verify as in 1.1

## 2. Components

- [x] 2.1 Add `defaultValue` to every `t()` call in `components/Sidebar.tsx`, `components/Oops.tsx`, `components/Loading.tsx`, `components/AllRead.tsx` — verify biome + tsc pass and every call carries a `defaultValue`
- [x] 2.2 Add `defaultValue` to every `t()` call in `components/settings/*.tsx` (Appearance, KeyboardShortcuts, Notification, System, Tray, SettingsFooter, SettingsReset) — verify as in 2.1
- [x] 2.3 Add `defaultValue` to every `t()` call in notification/account components (`components/notifications/*.tsx`, `components/accounts/*.tsx`) — verify as in 2.1

## 3. Utils and the Errors Catalog

- [x] 3.1 Add `defaultValue` to every `i18n.t()` call in `utils/notifications/filters/*.ts`, `utils/ui/display.ts`, `utils/system/native.ts`, `utils/api/errors.ts`, `utils/api/pagination.ts` — verify biome + tsc pass and every call carries a `defaultValue`
- [x] 3.2 Add `defaultValue` to the `i18n.t()` calls inside the `Errors` getters in `utils/core/errors.ts` — verify biome + tsc pass, and `errors.test.ts` (including the translation-reactivity tests) still passes

## 4. Locale Regeneration and Guard

- [x] 4.1 Run `pnpm i18n:extract` and verify `en.json` is byte-identical (no diff) while `de/es/fr` are unchanged in meaning — verify with `git diff src/renderer/i18n/locales/`
- [x] 4.2 Add an `i18n:check` companion script/guard that fails when any leaf value in `en.json` is empty or equal to its own dotted key path — verify it fails on a synthetic empty value and passes on the clean tree

## 5. Documentation and Integration

- [x] 5.1 Update the Locales section in `CONTRIBUTING.md` to require a `defaultValue` on every new `t()` call and note the `--trust-derived` no-go — verify the guidance reads correctly and matches the new convention
- [x] 5.2 Full verification: `pnpm exec tsc --noEmit`, `pnpm lint:check`, full `pnpm test`, `pnpm i18n:check`, and the new guard all pass — verify CI-parity by running each command to completion