import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const source = await readFile(new URL('../../src/frontend/utils/session.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } });
const { isUuid, getCurrentAgencyUuid, syncLegacyIdsFromUser } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

test('accepts existing PostgreSQL demo IDs and generated UUIDs', () => {
  assert.equal(isUuid('e0000000-0000-0000-0000-000000000001'), true);
  assert.equal(isUuid('af5be1cd-61b5-47d9-8687-1e828a63fab9'), true);
  for (const value of ['', null, 42, 'not-a-uuid', 'e0000000-0000-0000-0000-000000000001/other']) assert.equal(isUuid(value), false);
});

test('restores seeded agency profile IDs for dashboard and tour requests', () => {
  const items = new Map();
  globalThis.localStorage = { getItem: key => items.get(key) ?? null, setItem: (key, value) => items.set(key, value) };
  const user = { id: 'b0000000-0000-0000-0000-000000000001', userType: 'agency', profileId: 'e0000000-0000-0000-0000-000000000001', agencyId: 'e0000000-0000-0000-0000-000000000001' };
  items.set('user', JSON.stringify(user));
  syncLegacyIdsFromUser(user);
  assert.equal(getCurrentAgencyUuid(), user.agencyId);
  assert.equal(items.get('profileId'), user.agencyId);
  delete globalThis.localStorage;
});
