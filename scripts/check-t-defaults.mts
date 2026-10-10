#!/usr/bin/env node
/**
 * Source-level guard: every t() / i18n.t() call in the app must carry a
 * defaultValue, so the extractor can always seed a non-empty primary locale.
 *
 * Runs as part of `pnpm i18n:check` (Node >= 23.6 runs .ts natively via type
 * stripping). Scans src/renderer, skipping tests, the i18n bootstrap files and
 * the locales directory.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SCAN_DIR = join(ROOT, 'src', 'renderer');
const SKIP_FILES = new Set(['loader.ts', 'types.ts', 'index.ts']);

async function collectFiles(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'locales') {
        continue;
      }
      await collectFiles(p, out);
    } else if (
      /\.(ts|tsx)$/.test(entry.name) &&
      !/\.test\./.test(entry.name) &&
      !SKIP_FILES.has(entry.name)
    ) {
      out.push(p);
    }
  }
  return out;
}

function findClosing(text, start) {
  // `start` points at an opening brace; returns the index of the matching close
  let depth = 0;
  let inStr = null;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (inStr) {
      if (c === '\\') {
        i++;
        continue;
      }
      if (c === inStr) {
        inStr = null;
      }
      continue;
    }
    if (c === "'" || c === '"' || c === '`') {
      inStr = c;
      continue;
    }
    if (c === '{') {
      depth++;
    } else if (c === '}') {
      depth--;
      if (depth === 0) {
        return i;
      }
    }
  }
  return -1;
}

function findIssues(code) {
  const issues = [];
  let i = 0;
  while (i < code.length) {
    const tIdx = code.indexOf('t(', i);
    const i18nIdx = code.indexOf('i18n.t(', i);
    let use = -1;
    let kind = null;
    if (i18nIdx !== -1 && (tIdx === -1 || i18nIdx < tIdx)) {
      use = i18nIdx;
      kind = 'i18n.t';
    } else if (tIdx !== -1) {
      use = tIdx;
      kind = 't';
    }
    if (use === -1) {
      break;
    }

    if (kind === 't') {
      const prev = use > 0 ? code[use - 1] : '';
      if (/[A-Za-z0-9_$]/.test(prev)) {
        // e.g. useEffect(, action( — not a t() call site
        i = use + 1;
        continue;
      }
    }

    const start = kind === 't' ? use + 2 : use + 7; // opening quote
    const q = code[start];
    if (q !== "'" && q !== '"') {
      i = use + (kind === 't' ? 2 : 7);
      continue;
    }
    const qEnd = code.indexOf(q, start + 1);
    if (qEnd === -1) {
      i = use + 1;
      continue;
    }
    const key = code.slice(start + 1, qEnd);

    let j = qEnd + 1;
    while (j < code.length && /\s/.test(code[j])) {
      j++;
    }

    if (code[j] === ')') {
      issues.push(`${key}: t() call without defaultValue`);
      i = j + 1;
      continue;
    }

    if (code[j] === ',') {
      let k = j + 1;
      while (k < code.length && /\s/.test(code[k])) {
        k++;
      }
      if (code[k] === '{') {
        const close = findClosing(code, k);
        if (close === -1) {
          issues.push(`${key}: could not parse t() options`);
          i = k + 1;
          continue;
        }
        const body = code.slice(k, close + 1);
        if (!/\bdefaultValue\s*:/.test(body)) {
          issues.push(`${key}: t() options object without defaultValue`);
        }
        // continue scanning inside the options so nested t() calls are checked
        i = k + 1;
        continue;
      }
      issues.push(`${key}: t() second argument is not an options object`);
      i = k + 1;
      continue;
    }

    issues.push(`${key}: unexpected t() call shape`);
    i = qEnd + 1;
  }
  return issues;
}

const files = await collectFiles(SCAN_DIR);
const problemsByFile = new Map();

for (const file of files) {
  const code = await readFile(file, 'utf8');
  const issues = findIssues(code);
  if (issues.length > 0) {
    problemsByFile.set(file, issues);
  }
}

if (problemsByFile.size > 0) {
  // biome-ignore lint/suspicious/noConsole: CLI guard reporting policy violations
  console.error(
    'Missing defaultValue on t() calls. Every t()/i18n.t() call must include defaultValue so extraction seeds a non-empty primary locale.',
  );
  for (const [file, issues] of problemsByFile) {
    for (const issue of issues) {
      // biome-ignore lint/suspicious/noConsole: CLI guard reporting policy violations
      console.error(`  - ${file}: ${issue}`);
    }
  }
  process.exit(1);
}

// biome-ignore lint/suspicious/noConsole: CLI guard success message
console.log('✅ src/renderer: every t()/i18n.t() call carries a defaultValue');
