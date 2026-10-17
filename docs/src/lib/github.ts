import { Octokit } from 'octokit';

const CACHE_DURATION_MS = 5 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 5000;

const octokit = new Octokit({
  auth: import.meta.env?.GITHUB_TOKEN || process.env.GITHUB_TOKEN,
  throttle: { enabled: false },
  retry: { enabled: false },
  request: {
    fetch: (input: string | URL | Request, init?: RequestInit) => {
      const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
      return fetch(input, {
        ...init,
        signal: init?.signal
          ? AbortSignal.any([init.signal, timeout])
          : timeout,
      });
    },
  },
});

interface CacheEntry<T> {
  expiresAt: number;
  value: T | null;
  pending?: Promise<T | null>;
}

function cachedRequest<T>(load: (owner: string, repo: string) => Promise<T>) {
  const cache = new Map<string, CacheEntry<T>>();

  return ({
    owner,
    repo,
  }: {
    owner: string;
    repo: string;
  }): Promise<T | null> => {
    const key = `${owner}/${repo}`;
    let entry = cache.get(key);
    if (entry?.pending) {
      return entry.pending;
    }
    if (entry && entry.expiresAt > Date.now()) {
      return Promise.resolve(entry.value);
    }

    entry ??= { expiresAt: 0, value: null };
    cache.set(key, entry);
    const current = entry;
    current.pending = load(owner, repo)
      .then((value) => {
        current.value = value;
        return value;
      })
      .catch(() => {
        console.warn(
          `GitHub data unavailable for ${key}; using cached data or fallback links. Requests paused for five minutes.`,
        );
        return current.value;
      })
      .finally(() => {
        current.expiresAt = Date.now() + CACHE_DURATION_MS;
        current.pending = undefined;
      });
    return current.pending;
  };
}

export const getGitHubRepository = cachedRequest(async (owner, repo) => {
  const response = await octokit.rest.repos.get({ owner, repo });
  return response.data;
});

export const getGitHubLatestRelease = cachedRequest(async (owner, repo) => {
  const response = await octokit.rest.repos.getLatestRelease({ owner, repo });
  return response.data;
});
