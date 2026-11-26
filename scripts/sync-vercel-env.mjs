#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseEnv } from 'node:util';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT = join(ROOT, '.env.local');
// Ordered lowest to highest precedence: later environments override earlier ones.
const ENVIRONMENTS = ['preview', 'development'];
const KEY_LINE = /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=/;

// Vercel writes "[SENSITIVE]" for secrets it will not export (e.g. Preview secrets).
const UNEXPORTABLE = '[SENSITIVE]';

function pullEnvironment(environment, file) {
  const result = spawnSync(
    `vercel env pull "${file}" --environment ${environment} --yes`,
    { cwd: ROOT, shell: true, stdio: 'inherit' },
  );
  if (result.status !== 0) {
    throw new Error(`vercel env pull failed for "${environment}" (exit ${result.status})`);
  }
  const values = parseEnv(readFileSync(file, 'utf8'));
  const skipped = Object.keys(values).filter((key) => values[key] === UNEXPORTABLE);
  if (skipped.length) {
    console.warn(`Skipped ${skipped.length} secret(s) not exportable from "${environment}": ${skipped.join(', ')}`);
  }
  return Object.fromEntries(Object.entries(values).filter(([, value]) => value !== UNEXPORTABLE));
}

function mergeIntoOutput(values) {
  const existing = existsSync(OUTPUT) ? readFileSync(OUTPUT, 'utf8') : '';
  const written = new Set();
  const lines = existing.split(/\r?\n/).map((line) => {
    const key = line.match(KEY_LINE)?.[1];
    if (key && key in values) {
      written.add(key);
      return `${key}=${JSON.stringify(values[key])}`;
    }
    return line;
  });

  const missing = Object.keys(values).filter((key) => !written.has(key));
  while (lines.length && lines.at(-1) === '') lines.pop();
  if (missing.length) {
    if (lines.length) lines.push('');
    lines.push(`# Synced from Vercel (${ENVIRONMENTS.join(', ')})`);
    for (const key of missing) lines.push(`${key}=${JSON.stringify(values[key])}`);
  }

  writeFileSync(OUTPUT, `${lines.join('\n')}\n`);
  return { updated: written.size, added: missing.length };
}

const tempDir = mkdtempSync(join(tmpdir(), 'vercel-env-'));
try {
  const values = {};
  for (const environment of ENVIRONMENTS) {
    const file = join(tempDir, `${environment}.env`);
    Object.assign(values, pullEnvironment(environment, file));
  }

  const { updated, added } = mergeIntoOutput(values);
  console.log(
    `Wrote ${OUTPUT}: ${Object.keys(values).length} Vercel variables (${updated} updated, ${added} added).`,
  );
} finally {
  rmSync(tempDir, { recursive: true, force: true });
}
