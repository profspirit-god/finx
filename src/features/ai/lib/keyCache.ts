const SESSION_KEY = 'finx_ai_key';

// CryptoKey is not serializable. We store the raw material as a base64 string
// and re-import it on demand. This is safe because sessionStorage is scoped
// to the tab and cleared on close.
//
// IMPORTANT: this exposes the derived key to anyone with DevTools access to the
// unlocked tab — same trust model as the wallet data, which is also readable
// from the unlocked tab. Not a regression.

let cachedKey: CryptoKey | null = null;

export async function cacheKey(key: CryptoKey): Promise<void> {
  cachedKey = key;
  try {
    const raw = await crypto.subtle.exportKey('raw', key);
    const b64 = btoa(String.fromCharCode(...new Uint8Array(raw)));
    sessionStorage.setItem(SESSION_KEY, b64);
  } catch (err) {
    console.warn('[AI] Could not cache key in sessionStorage:', err);
  }
}

export async function getCachedKey(): Promise<CryptoKey | null> {
  if (cachedKey) return cachedKey;
  try {
    const b64 = sessionStorage.getItem(SESSION_KEY);
    if (!b64) return null;
    const raw = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    cachedKey = await crypto.subtle.importKey(
      'raw',
      raw,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt'],
    );
    return cachedKey;
  } catch {
    return null;
  }
}

export function clearCachedKey(): void {
  cachedKey = null;
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}