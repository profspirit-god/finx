import type { Wallet } from '@/types/wallet';
import type { Record } from '@/types/record';

export type TimeRange = 'month' | '3months' | '6months' | 'year';

export type PeriodTotals = {
  income: number;
  expense: number;
  net: number;
};

export type RateStats = {
  incomePerMonth: number;
  incomePerDay: number;
  incomePerYear: number;
  expensePerMonth: number;
  expensePerDay: number;
  expensePerYear: number;
};

export type CashflowBucket = {
  label: string;
  start: number;
  end: number;
  income: number;
  expense: number;
};

export type NetWorthPoint = {
  label: string;
  ts: number;
  value: number;
};

export type DashboardStats = {
  totalMoney: number;
  walletsCount: number;
  investments: number;
  periodTotals: PeriodTotals;
  rates: RateStats;
  cashflow: CashflowBucket[];
  netWorth: NetWorthPoint[];
};

export function rangeMs(range: TimeRange): number {
  const day = 86_400_000;
  switch (range) {
    case 'month':
      return 30 * day;
    case '3months':
      return 90 * day;
    case '6months':
      return 180 * day;
    case 'year':
      return 365 * day;
  }
}

export function rangeStart(range: TimeRange, now = Date.now()): number {
  return now - rangeMs(range);
}

export function sumWalletBalances(wallets: Wallet[]): number {
  return wallets.filter((w) => !w.archived).reduce((s, w) => s + w.currentBalanceMinor, 0);
}

export function sumInvestments(wallets: Wallet[]): number {
  return wallets
    .filter((w) => !w.archived && w.type === 'investment')
    .reduce((s, w) => s + w.currentBalanceMinor, 0);
}

export function totalsInRange(records: Record[], fromTs: number, toTs: number): PeriodTotals {
  let income = 0;
  let expense = 0;
  for (const r of records) {
    if (r.deletedAt !== null) continue;
    if (r.occurredAt < fromTs || r.occurredAt > toTs) continue;
    if (r.class === 'income') income += r.amountMinor;
    else if (r.class === 'expense') expense += r.amountMinor;
    else if (r.class === 'adjustment' && r.amountMinor > 0) income += r.amountMinor;
  }
  return { income, expense, net: income - expense };
}

export function computeRates(totals: PeriodTotals, windowMs: number): RateStats {
  const days = windowMs / 86_400_000;
  const months = days / 30;
  const years = days / 365;
  const safe = (n: number) => (isFinite(n) && n > 0 ? n : 1);
  return {
    incomePerMonth: Math.round(totals.income / safe(months)),
    incomePerDay: Math.round(totals.income / safe(days)),
    incomePerYear: Math.round(totals.income / safe(years)),
    expensePerMonth: Math.round(totals.expense / safe(months)),
    expensePerDay: Math.round(totals.expense / safe(days)),
    expensePerYear: Math.round(totals.expense / safe(years)),
  };
}

/**
 * Buckets records into N equal-width windows ending at `now`.
 * Used for the cashflow bar chart.
 */
export function bucketCashflow(
  records: Record[],
  months: number,
  now = Date.now(),
): CashflowBucket[] {
  const buckets: CashflowBucket[] = [];
  const end = new Date(now);
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(end.getFullYear(), end.getMonth() - i, 1);
    const start = d.getTime();
    const next = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    const endTs = next.getTime() - 1;
    buckets.push({
      label: d.toLocaleString('en-US', { month: 'short' }),
      start,
      end: endTs,
      income: 0,
      expense: 0,
    });
  }
  for (const r of records) {
    if (r.deletedAt !== null) continue;
    const bucket = buckets.find((b) => r.occurredAt >= b.start && r.occurredAt <= b.end);
    if (!bucket) continue;
    if (r.class === 'income') bucket.income += r.amountMinor;
    else if (r.class === 'expense') bucket.expense += r.amountMinor;
    else if (r.class === 'adjustment' && r.amountMinor > 0) bucket.income += r.amountMinor;
  }
  return buckets;
}

/**
 * Reconstructs total net worth at the end of each of the last N months.
 * Walks each wallet's starting balance plus its records up to each bucket end.
 */
export function computeNetWorthTrend(
  wallets: Wallet[],
  records: Record[],
  months: number,
  now = Date.now(),
): NetWorthPoint[] {
  const active = wallets.filter((w) => !w.archived);
  const points: NetWorthPoint[] = [];
  const end = new Date(now);

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(end.getFullYear(), end.getMonth() - i, 1);
    const next = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    const bucketEnd = next.getTime() - 1;

    let total = 0;
    for (const w of active) {
      // starting balance was set at wallet.createdAt; reconstruct by reverse-applying records
      // after bucketEnd. Simpler: current balance minus records after bucketEnd.
      let balance = w.currentBalanceMinor;
      for (const r of records) {
        if (r.deletedAt !== null) continue;
        if (r.walletId !== w.id) continue;
        if (r.occurredAt <= bucketEnd) continue;
        // undo this record's effect
        if (r.class === 'income') balance -= r.amountMinor;
        else if (r.class === 'expense') balance += r.amountMinor;
        else if (r.class === 'adjustment') balance -= r.amountMinor;
      }
      total += balance;
    }
    points.push({
      label: d.toLocaleString('en-US', { month: 'short' }),
      ts: bucketEnd,
      value: total,
    });
  }
  return points;
}

export function computeDashboard(
  wallets: Wallet[],
  records: Record[],
  range: TimeRange,
  now = Date.now(),
): DashboardStats {
  const windowMs = rangeMs(range);
  const fromTs = rangeStart(range, now);
  const periodTotals = totalsInRange(records, fromTs, now);
  const monthsBack = range === 'month' ? 6 : range === '3months' ? 6 : range === '6months' ? 6 : 12;

  return {
    totalMoney: sumWalletBalances(wallets),
    walletsCount: wallets.filter((w) => !w.archived).length,
    investments: sumInvestments(wallets),
    periodTotals,
    rates: computeRates(periodTotals, windowMs),
    cashflow: bucketCashflow(records, monthsBack, now),
    netWorth: computeNetWorthTrend(wallets, records, monthsBack, now),
  };
}