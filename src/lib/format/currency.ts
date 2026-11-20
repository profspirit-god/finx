const DEFAULT_LOCALE = 'en-US';

export function formatMinor(
  amountMinor: number,
  currency = 'USD',
  locale = DEFAULT_LOCALE,
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amountMinor / 100);
}

export function parseToMinor(input: string): number | null {
  const cleaned = input.replace(/[^0-9.-]/g, '');
  const n = Number.parseFloat(cleaned);
  if (!Number.isFinite(n)) return null;
  return Math.round(n * 100);
}

export function formatMinorCompact(amountMinor: number, currency = 'USD', locale = DEFAULT_LOCALE): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amountMinor / 100);
}