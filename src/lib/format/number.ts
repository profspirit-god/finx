const DEFAULT_LOCALE = 'en-US';

export function formatNumber(n: number, locale = DEFAULT_LOCALE): string {
  return new Intl.NumberFormat(locale).format(n);
}

export function formatPercent(ratio: number, digits = 1, locale = DEFAULT_LOCALE): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(ratio);
}