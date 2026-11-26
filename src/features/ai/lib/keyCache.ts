/**
 * In-memory cache for the PIN-derived encryption key.
 *
 * The key lives ONLY in a module-level variable. It is never written to
 * sessionStorage, localStorage, or IndexedDB. Refreshing the page clears it.
 * Visiting /ai after a refresh requires re-entering the PIN to re-derive.
 *
 * This is option (ii) — strictest available while still allowing the AI
 * feature to work without re-prompting during a single session.
 */

let cachedKey: CryptoKey | null = null;

export function cacheKey(key: CryptoKey): void {
  cachedKey = key;
}

export function getCachedKey(): CryptoKey | null {
  return cachedKey;
}

export function clearCachedKey(): void {
  cachedKey = null;
}

export function hasKey(): boolean {
  return cachedKey !== null;
}