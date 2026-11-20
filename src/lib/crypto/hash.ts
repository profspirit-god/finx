const PBKDF2_ITERATIONS = 210_000;
const HASH = 'SHA-256';
const KEY_BITS = 256;

function toHex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function fromHex(hex: string): ArrayBuffer {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out.buffer;
}

export function generateSalt(bytes = 16): string {
  const salt = new Uint8Array(bytes);
  crypto.getRandomValues(salt);
  return toHex(salt.buffer);
}

async function derive(secret: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: fromHex(salt), iterations: PBKDF2_ITERATIONS, hash: HASH },
    baseKey,
    KEY_BITS,
  );
  return toHex(bits);
}

export async function hashSecret(secret: string, salt: string): Promise<string> {
  return derive(secret, salt);
}

export async function verifySecret(secret: string, salt: string, expectedHash: string): Promise<boolean> {
  const actual = await derive(secret, salt);
  return timingSafeEqual(actual, expectedHash);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}