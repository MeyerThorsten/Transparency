interface SharedStoreValue {
  value: string;
  expiresAt: number;
}

interface SharedStoreMemoryState {
  values: Map<string, SharedStoreValue>;
}

interface UpstashResult<T = unknown> {
  result?: T;
  error?: string;
}

type SharedStoreBackend = "memory" | "upstash";

interface SharedStoreConfig {
  backend: SharedStoreBackend;
  prefix: string;
  url: string;
  token: string;
}

interface SharedCounterResult {
  value: number;
  resetAt: number | null;
}

export interface AiSharedStore {
  backend: SharedStoreBackend;
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlMs: number): Promise<void>;
  incrementFixedWindow(key: string, ttlMs: number): Promise<SharedCounterResult>;
  delete(key: string): Promise<void>;
  clearPrefix(prefix: string): Promise<void>;
}

const SHARED_STORE_STATE = Symbol.for("glasspane.ai.shared-store");

type GlobalWithSharedStore = typeof globalThis & {
  [SHARED_STORE_STATE]?: SharedStoreMemoryState;
};

function getSharedStoreMemoryState(): SharedStoreMemoryState {
  const globalObject = globalThis as GlobalWithSharedStore;

  if (!globalObject[SHARED_STORE_STATE]) {
    globalObject[SHARED_STORE_STATE] = {
      values: new Map<string, SharedStoreValue>(),
    };
  }

  return globalObject[SHARED_STORE_STATE];
}

function getSharedStoreConfig(): SharedStoreConfig {
  const url = process.env.AI_SHARED_CACHE_URL || process.env.UPSTASH_REDIS_REST_URL || "";
  const token = process.env.AI_SHARED_CACHE_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";
  const configuredBackend = process.env.AI_SHARED_CACHE_BACKEND;
  const backend: SharedStoreBackend =
    configuredBackend === "upstash"
      ? "upstash"
      : configuredBackend === "memory"
        ? "memory"
        : url && token
          ? "upstash"
          : "memory";

  return {
    backend,
    prefix: process.env.AI_SHARED_CACHE_PREFIX || "glasspane:ai",
    url,
    token,
  };
}

function buildStoreKey(prefix: string, key: string): string {
  return `${prefix}:${key}`;
}

function pruneMemoryState(state: SharedStoreMemoryState, now = Date.now()) {
  for (const [key, entry] of state.values) {
    if (entry.expiresAt <= now) {
      state.values.delete(key);
    }
  }
}

function createMemoryStore(config: SharedStoreConfig): AiSharedStore {
  return {
    backend: "memory",
    async get(key) {
      const state = getSharedStoreMemoryState();
      const now = Date.now();
      pruneMemoryState(state, now);

      const entry = state.values.get(buildStoreKey(config.prefix, key));
      if (!entry) {
        return null;
      }

      if (entry.expiresAt <= now) {
        state.values.delete(buildStoreKey(config.prefix, key));
        return null;
      }

      return entry.value;
    },
    async set(key, value, ttlMs) {
      getSharedStoreMemoryState().values.set(buildStoreKey(config.prefix, key), {
        value,
        expiresAt: Date.now() + ttlMs,
      });
    },
    async incrementFixedWindow(key, ttlMs) {
      const state = getSharedStoreMemoryState();
      const fullKey = buildStoreKey(config.prefix, key);
      const now = Date.now();
      pruneMemoryState(state, now);

      const entry = state.values.get(fullKey);
      if (!entry || entry.expiresAt <= now) {
        const resetAt = now + ttlMs;
        state.values.set(fullKey, {
          value: "1",
          expiresAt: resetAt,
        });
        return { value: 1, resetAt };
      }

      const nextValue = Number.parseInt(entry.value, 10) + 1;
      state.values.set(fullKey, {
        value: String(nextValue),
        expiresAt: entry.expiresAt,
      });
      return { value: nextValue, resetAt: entry.expiresAt };
    },
    async delete(key) {
      getSharedStoreMemoryState().values.delete(buildStoreKey(config.prefix, key));
    },
    async clearPrefix(prefix) {
      const fullPrefix = buildStoreKey(config.prefix, prefix);
      for (const key of getSharedStoreMemoryState().values.keys()) {
        if (key.startsWith(fullPrefix)) {
          getSharedStoreMemoryState().values.delete(key);
        }
      }
    },
  };
}

async function runUpstashCommand<T>(config: SharedStoreConfig, command: unknown[]): Promise<T> {
  if (!config.url || !config.token) {
    throw new Error("AI shared cache is configured for Upstash without URL/token");
  }

  const response = await fetch(config.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`AI shared cache request failed (${response.status}): ${text}`);
  }

  const payload = await response.json() as UpstashResult<T>;
  if (payload.error) {
    throw new Error(`AI shared cache command failed: ${payload.error}`);
  }

  return payload.result as T;
}

async function runUpstashTransaction(
  config: SharedStoreConfig,
  commands: unknown[][],
): Promise<Array<UpstashResult>> {
  if (!config.url || !config.token) {
    throw new Error("AI shared cache is configured for Upstash without URL/token");
  }

  const response = await fetch(`${config.url.replace(/\/$/, "")}/multi-exec`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(commands),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`AI shared cache transaction failed (${response.status}): ${text}`);
  }

  const payload = await response.json() as Array<UpstashResult>;
  for (const item of payload) {
    if (item.error) {
      throw new Error(`AI shared cache transaction command failed: ${item.error}`);
    }
  }

  return payload;
}

function createUpstashStore(config: SharedStoreConfig): AiSharedStore {
  return {
    backend: "upstash",
    async get(key) {
      return runUpstashCommand<string | null>(config, [
        "GET",
        buildStoreKey(config.prefix, key),
      ]);
    },
    async set(key, value, ttlMs) {
      await runUpstashCommand(config, [
        "SET",
        buildStoreKey(config.prefix, key),
        value,
        "PX",
        ttlMs,
      ]);
    },
    async incrementFixedWindow(key, ttlMs) {
      const results = await runUpstashTransaction(config, [
        ["SET", buildStoreKey(config.prefix, key), "0", "PX", ttlMs, "NX"],
        ["INCR", buildStoreKey(config.prefix, key)],
        ["PTTL", buildStoreKey(config.prefix, key)],
      ]);

      const value = Number(results[1]?.result ?? 0);
      const remainingTtl = Number(results[2]?.result ?? 0);
      return {
        value,
        resetAt: remainingTtl > 0 ? Date.now() + remainingTtl : null,
      };
    },
    async delete(key) {
      await runUpstashCommand(config, ["DEL", buildStoreKey(config.prefix, key)]);
    },
    async clearPrefix() {
      // No safe external prefix delete in production without a scan strategy.
    },
  };
}

export function getAiSharedStore(): AiSharedStore {
  const config = getSharedStoreConfig();

  if (config.backend === "upstash") {
    return createUpstashStore(config);
  }

  return createMemoryStore(config);
}

export async function clearAiSharedStore(prefix?: string) {
  await getAiSharedStore().clearPrefix(prefix || "");
}
