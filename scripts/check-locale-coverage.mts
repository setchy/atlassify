#!/usr/bin/env node
/**
 * Locale coverage guard: every non-primary locale must match the primary
 * locale's (en.json) key set, in both directions.
 *
 * - Missing keys: a key present in en.json but absent from a locale would
 *   silently fall back to English for that locale.
 * - Orphaned keys: a key present in a locale but not in en.json is invisible
 *   dead weight (and would be removed on the next extraction).
 *
 * Note: empty VALUES in non-primary locales are allowed on purpose — running
 * `pnpm i18n:extract` seeds new keys in every locale as "" placeholders, and
 * translators fill them in later (the app falls back to English meanwhile).
 *
 * Runs as part of `pnpm i18n:check` (Node >= 23.6 runs .mts natively via type
 * stripping).
 */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const LOCALES_DIR = join(ROOT, 'src', 'renderer', 'i18n', 'locales');
const PRIMARY = 'en.json';

type LocaleObject = Record<string, string | LocaleObject>;

function flatten(
  obj: LocaleObject,
  prefix = '',
  out = new Set<string>(),
): Set<string> {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'string' || Array.isArray(v)) {
      out.add(key);
    } else {
      flatten(v, key, out);
    }
  }
  return out;
}

async function readLocale(file: string): Promise<LocaleObject> {
  const data = await readFile(join(LOCALES_DIR, file), 'utf8');
  return JSON.parse(data) as LocaleObject;
}

const en = await readLocale(PRIMARY);
const enKeys = flatten(en);

const localeFiles = (await readdir(LOCALES_DIR))
  .filter((f) => f.endsWith('.json') && f !== PRIMARY)
  .sort();

const problems: string[] = [];
const totalKeys = enKeys.size;

for (const file of localeFiles) {
  const locale = file.slice(0, -'.json'.length);
  const keys = flatten(await readLocale(file));

  const missing = [...enKeys].filter((k) => !keys.has(k));
  const orphaned = [...keys].filter((k) => !enKeys.has(k));

  if (missing.length > 0) {
    problems.push(
      `${locale}: missing ${missing.length} key(s) vs en.json — ${missing.slice(0, 5).join(', ')}${missing.length > 5 ? ', …' : ''}`,
    );
  }
  if (orphaned.length > 0) {
    problems.push(
      `${locale}: ${orphaned.length} key(s) not in en.json — ${orphaned.slice(0, 5).join(', ')}${orphaned.length > 5 ? ', …' : ''}`,
    );
  }
}

if (problems.length > 0) {
  // biome-ignore lint/suspicious/noConsole: CLI guard reporting policy violations
  console.error(
    'Locale key sets drifted from en.json. Run `pnpm i18n:extract` to propagate new keys, or restore deleted keys.',
  );
  for (const problem of problems) {
    // biome-ignore lint/suspicious/noConsole: CLI guard reporting policy violations
    console.error(`  - ${problem}`);
  }
  process.exit(1);
}

// biome-ignore lint/suspicious/noConsole: CLI guard success message
console.log(
  `✅ locales: ${localeFiles.length} files match en.json key set (${totalKeys} keys each)`,
);
