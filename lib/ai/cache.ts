import { getAiSharedStore } from "./shared-store";

interface AiCacheState {
  inflight: Map<string, Promise<unknown>>;
}

const AI_CACHE_STATE = Symbol.for("glasspane.ai.cache");

type GlobalWithAiCache = typeof globalThis & {
  [AI_CACHE_STATE]?: AiCacheState;
};

function getCacheState(): AiCacheState {
  const globalObject = globalThis as GlobalWithAiCache;

  if (!globalObject[AI_CACHE_STATE]) {
    globalObject[AI_CACHE_STATE] = {
      inflight: new Map<string, Promise<unknown>>(),
    };
  }

  return globalObject[AI_CACHE_STATE];
}

function toStoreKey(namespace: string, key: string): string {
  return `${namespace}:${key}`;
}

async function getCachedValue<T>(namespace: string, key: string): Promise<T | undefined> {
  const value = await getAiSharedStore().get(`cache:${toStoreKey(namespace, key)}`);
  if (!value) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(value) as { value: T };
    return parsed.value;
  } catch {
    await getAiSharedStore().delete(`cache:${toStoreKey(namespace, key)}`);
    return undefined;
  }
}

async function setCachedValue<T>(namespace: string, key: string, value: T, ttlMs: number): Promise<T> {
  await getAiSharedStore().set(
    `cache:${toStoreKey(namespace, key)}`,
    JSON.stringify({ value }),
    ttlMs,
  );
  return value;
}

export function createAiCache<T>(namespace: string) {
  return {
    async get(key: string) {
      return getCachedValue<T>(namespace, key);
    },
    async set(key: string, value: T, ttlMs: number) {
      return setCachedValue(namespace, key, value, ttlMs);
    },
    async remember(key: string, ttlMs: number, loader: () => Promise<T>) {
      const cached = await getCachedValue<T>(namespace, key);
      if (cached !== undefined) {
        return cached;
      }

      const state = getCacheState();
      const entryKey = toStoreKey(namespace, key);
      const inflight = state.inflight.get(entryKey) as Promise<T> | undefined;

      if (inflight) {
        return inflight;
      }

      const pending = (async () => {
        const value = await loader();
        await setCachedValue(namespace, key, value, ttlMs);
        return value;
      })();

      state.inflight.set(entryKey, pending);

      try {
        return await pending;
      } finally {
        if (state.inflight.get(entryKey) === pending) {
          state.inflight.delete(entryKey);
        }
      }
    },
    async delete(key: string) {
      await getAiSharedStore().delete(`cache:${toStoreKey(namespace, key)}`);
    },
  };
}

export async function clearAiCache(namespace?: string) {
  const state = getCacheState();

  if (!namespace) {
    state.inflight.clear();
    await getAiSharedStore().clearPrefix("cache:");
    return;
  }

  const prefix = `${namespace}:`;
  for (const entryKey of state.inflight.keys()) {
    if (entryKey.startsWith(prefix)) {
      state.inflight.delete(entryKey);
    }
  }
  await getAiSharedStore().clearPrefix(`cache:${namespace}:`);
}
