import type { Wallet } from '@/types/wallet';
import type { Record } from '@/types/record';
import { RECORD_CLASS_LABELS } from '@/types/record';
import { formatMinor } from '@/lib/format/currency';
import { formatDate } from '@/lib/format/date';

export type CommandDefinition = {
  id: string;
  label: string;
  description: string;
  buildPrompt: (context: string | null) => string;
};

export const COMMANDS: CommandDefinition[] = [
  {
    id: '/report',
    label: '/report',
    description: 'Brief financial summary',
    buildPrompt: (ctx) =>
      `You are a personal finance assistant. Give a brief summary of my current financial status based on the data below. Keep it under 150 words. Include total money, income this month, and expenses this month.${ctx ? `\n\nContext:\n${ctx}` : ''}`,
  },
  {
    id: '/reportshort',
    label: '/reportshort',
    description: 'Executive summary — 3 bullets',
    buildPrompt: (ctx) =>
      `You are a personal finance assistant. Give me exactly 3 bullet points summarizing my finances right now: (1) total money, (2) biggest concern, (3) one actionable suggestion. No preamble.${ctx ? `\n\nContext:\n${ctx}` : ''}`,
  },
  {
    id: '/reportlong',
    label: '/reportlong',
    description: 'Full report with analysis',
    buildPrompt: (ctx) =>
      `You are a personal finance assistant. Write a full financial report based on the data below. Structure it with sections: Current position, Income and expenses, Trends, Recommendations. Be analytical and specific with numbers.${ctx ? `\n\nContext:\n${ctx}` : ''}`,
  },
  {
    id: '/rankincome',
    label: '/rankincome',
    description: 'Top income sources',
    buildPrompt: (ctx) =>
      `You are a personal finance assistant. Rank my top income sources by amount, with each source's total.${ctx ? `\n\nContext:\n${ctx}` : ''}`,
  },
  {
    id: '/rankexpense',
    label: '/rankexpense',
    description: 'Top expense categories',
    buildPrompt: (ctx) =>
      `You are a personal finance assistant. Rank my top expense categories by amount, with each category's total and percentage of total expenses.${ctx ? `\n\nContext:\n${ctx}` : ''}`,
  },
  {
    id: '/budget',
    label: '/budget',
    description: 'Suggest a budget',
    buildPrompt: (ctx) =>
      `You are a personal finance assistant. Suggest a monthly budget based on my last 3 months of spending patterns. Break it down by category. Be realistic with the numbers.${ctx ? `\n\nContext:\n${ctx}` : ''}`,
  },
  {
    id: '/trend',
    label: '/trend',
    description: 'Cashflow trend analysis',
    buildPrompt: (ctx) =>
      `You are a personal finance assistant. Analyze my cashflow trend over the last 6 months. Is my net position improving, declining, or stable? Give a one-line summary, then evidence, then a suggestion.${ctx ? `\n\nContext:\n${ctx}` : ''}`,
  },
  {
    id: '/goals',
    label: '/goals',
    description: 'Savings goals progress',
    buildPrompt: (ctx) =>
      `You are a personal finance assistant. Show my savings goals progress and suggest which goal I should prioritize next.${ctx ? `\n\nContext:\n${ctx}` : ''}`,
  },
  {
    id: '/wallets',
    label: '/wallets',
    description: 'Wallet balances and health',
    buildPrompt: (ctx) =>
      `You are a personal finance assistant. Summarize my wallets: balances, types, and any concerning patterns (empty wallets, over-concentration).${ctx ? `\n\nContext:\n${ctx}` : ''}`,
  },
  {
    id: '/help',
    label: '/help',
    description: 'Show available commands',
    buildPrompt: () => '',
  },
];

export function findCommand(input: string): CommandDefinition | null {
  const trimmed = input.trim();
  const firstWord = trimmed.split(/\s+/)[0];
  return COMMANDS.find((c) => c.id === firstWord) ?? null;
}

export function packContext(wallets: Wallet[], records: Record[], currency: string): string {
  const activeWallets = wallets.filter((w) => !w.archived);

  const walletLines = activeWallets.map(
    (w) => `- ${w.name} (${w.type}): ${formatMinor(w.currentBalanceMinor, currency)}`,
  );

  const cutoff = Date.now() - 60 * 86_400_000;
  const recent = records
    .filter((r) => r.deletedAt === null && r.occurredAt >= cutoff)
    .sort((a, b) => b.occurredAt - a.occurredAt)
    .slice(0, 100);

  const incomeByCategory = new Map<string, number>();
  const expenseByCategory = new Map<string, number>();
  for (const r of recent) {
    const cat = r.counterparty || RECORD_CLASS_LABELS[r.class];
    if (r.class === 'income') {
      incomeByCategory.set(cat, (incomeByCategory.get(cat) ?? 0) + r.amountMinor);
    } else if (r.class === 'expense') {
      expenseByCategory.set(cat, (expenseByCategory.get(cat) ?? 0) + r.amountMinor);
    }
  }

  const incomeLines = Array.from(incomeByCategory.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([k, v]) => `- ${k}: ${formatMinor(v, currency)}`);

  const expenseLines = Array.from(expenseByCategory.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([k, v]) => `- ${k}: ${formatMinor(v, currency)}`);

  const totalMoney = activeWallets.reduce((s, w) => s + w.currentBalanceMinor, 0);

  const recentLines = recent.slice(0, 20).map(
    (r) =>
      `- ${formatDate(r.occurredAt)} · ${RECORD_CLASS_LABELS[r.class]} · ${r.counterparty || '—'} · ${formatMinor(r.amountMinor, currency)}`,
  );

  return [
    `Total money across all wallets: ${formatMinor(totalMoney, currency)}`,
    ``,
    `Wallets:`,
    ...walletLines,
    ``,
    `Income by source (last 60 days):`,
    ...(incomeLines.length > 0 ? incomeLines : ['- none']),
    ``,
    `Expenses by category (last 60 days):`,
    ...(expenseLines.length > 0 ? expenseLines : ['- none']),
    ``,
    `Recent records (newest first, last 20):`,
    ...(recentLines.length > 0 ? recentLines : ['- none']),
  ].join('\n');
}