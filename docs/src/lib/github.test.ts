import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getGitHubLatestRelease, getGitHubRepository } from './github.ts';

function jsonResponse(data: unknown, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', ...headers },
  });
}

test('shares concurrent release requests and caches successful responses', async (t) => {
  let requests = 0;
  t.mock.method(
    globalThis,
    'fetch',
    async (_input: string | URL | Request, init?: RequestInit) => {
      requests++;
      assert.ok(init?.signal instanceof AbortSignal);
      return jsonResponse({ name: 'v3.16.2', assets: [] });
    },
  );
  const params = { owner: 'test', repo: 'release-cache' };
  const [first, second] = await Promise.all([
    getGitHubLatestRelease(params),
    getGitHubLatestRelease(params),
  ]);
  assert.equal(first?.name, 'v3.16.2');
  assert.equal(first, second);
  assert.equal(await getGitHubLatestRelease(params), first);
  assert.equal(requests, 1);
});

test('does not retry rate limits and caches failures until the cooldown expires', async (t) => {
  let now = Date.now();
  let requests = 0;
  t.mock.method(Date, 'now', () => now);
  t.mock.method(console, 'warn', () => {});
  t.mock.method(globalThis, 'fetch', async () => {
    requests++;
    return jsonResponse({ message: 'API rate limit exceeded' }, 403, {
      'x-ratelimit-remaining': '0',
      'x-ratelimit-reset': String(Math.ceil(now / 1000) + 3600),
    });
  });
  const params = { owner: 'test', repo: 'rate-limited' };
  assert.equal(await getGitHubRepository(params), null);
  assert.equal(await getGitHubRepository(params), null);
  assert.equal(requests, 1);
  now += 5 * 60 * 1000 + 1;
  assert.equal(await getGitHubRepository(params), null);
  assert.equal(requests, 2);
});

test('keeps cached data when a refresh fails', async (t) => {
  let now = Date.now();
  let requests = 0;
  t.mock.method(Date, 'now', () => now);
  t.mock.method(console, 'warn', () => {});
  t.mock.method(globalThis, 'fetch', async () => {
    requests++;
    return requests === 1
      ? jsonResponse({ forks_count: 100, stargazers_count: 5000 })
      : jsonResponse({ message: 'Service unavailable' }, 503);
  });
  const params = { owner: 'test', repo: 'stale-cache' };
  const first = await getGitHubRepository(params);
  now += 5 * 60 * 1000 + 1;
  assert.equal(await getGitHubRepository(params), first);
  assert.equal(await getGitHubRepository(params), first);
  assert.equal(first?.stargazers_count, 5000);
  assert.equal(requests, 2);
});

test('uses a five-second timeout and falls back after an aborted request', async (t) => {
  let requests = 0;
  t.mock.method(console, 'warn', () => {});
  t.mock.method(AbortSignal, 'timeout', (duration: number) => {
    assert.equal(duration, 5000);
    return AbortSignal.abort(new DOMException('Timed out', 'TimeoutError'));
  });
  t.mock.method(
    globalThis,
    'fetch',
    async (_input: string | URL | Request, init?: RequestInit) => {
      requests++;
      init?.signal?.throwIfAborted();
      throw new Error('Expected the request signal to be aborted');
    },
  );
  const params = { owner: 'test', repo: 'timeout' };
  assert.equal(await getGitHubLatestRelease(params), null);
  assert.equal(await getGitHubLatestRelease(params), null);
  assert.equal(requests, 1);
});
