/**
 * Registers the service worker (vite-plugin-pwa injects `virtual:pwa-register`).
 * Runs once at app start. Safe in dev (returns no-op when SW disabled).
 */
export async function initPWA(): Promise<void> {
  if (!('serviceWorker' in navigator)) return;
  try {
    const { registerSW } = await import('virtual:pwa-register');
    registerSW({ immediate: true });
  } catch (err) {
    console.warn('[FinX] PWA registration skipped:', err);
  }
}