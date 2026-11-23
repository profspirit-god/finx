import type { Notice } from './types';

/**
 * All in-app notices, newest first. Add a new notice by prepending an entry.
 *
 * Rules:
 *  - `id` must be unique and stable forever (once users have read/dismissed it,
 *    the id is what's stored in IndexedDB).
 *  - `date` is a Unix millisecond timestamp. Use Date.now() at the time you
 *    write the notice, not the deploy date.
 *  - `version` is the app version the notice is about (e.g., '1.6.0.0').
 *  - Notices are bundled in the app — they ship with each deploy. There is no
 *    backend. To push a notice without a code change, that capability is not
 *    available in v1.7.0.0 and is not planned.
 */
export const NOTICES: Notice[] = [
  {
    id: 'n-2026-11-23-feedback-live',
    version: '1.6.0.0',
    date: new Date('2026-11-23T00:00:00Z').getTime(),
    category: 'feature',
    title: 'Bug reports and ideas are live',
    body:
      'You can now send bug reports and feature suggestions straight from the app. Tap the gold button at the bottom right of any screen. Everything else about FinX stays local — your wallets, records, and receipts never leave your device.',
    dismissable: true,
  },
  {
    id: 'n-2026-11-23-dashboard',
    version: '1.4.0.0',
    date: new Date('2026-11-22T00:00:00Z').getTime(),
    category: 'feature',
    title: 'Dashboard is here',
    body:
      'See everything at a glance — total money, income and expense rates, net worth over time, cashflow trends, investment breakdown, and your 5 most recent records. Use the range selector at the top right to switch between this month, 3 months, 6 months, and this year.',
    actionLabel: 'Open Dashboard',
    actionHref: '/dashboard',
    dismissable: true,
  },
  {
    id: 'n-2026-11-22-records',
    version: '1.3.0.0',
    date: new Date('2026-11-22T00:00:00Z').getTime(),
    category: 'feature',
    title: 'Record money movements',
    body:
      'Add income, expenses, transfers, and adjustments with optional receipts. Wallet balances update automatically. Every wallet now shows a live audit log of every record linked to it.',
    actionLabel: 'Open Records',
    actionHref: '/records',
    dismissable: true,
  },
  {
    id: 'n-2026-11-21-data-tools',
    version: '1.5.0.0',
    date: new Date('2026-11-21T00:00:00Z').getTime(),
    category: 'feature',
    title: 'Full backups and exports',
    body:
      'Data Tools can now create a full FinX backup (all wallets, records, receipts, and settings) as a single JSON file you can restore anywhere. You can also export records to CSV, Excel, or PDF for analysis.',
    actionLabel: 'Open Data Tools',
    actionHref: '/data-tools',
    dismissable: true,
  },
  {
    id: 'n-2026-11-20-beta',
    version: '1.6.0.0',
    date: new Date('2026-11-20T00:00:00Z').getTime(),
    category: 'announcement',
    title: 'FinX beta — thank you',
    body:
      'You are using an early build of FinX. Please report anything that looks wrong using the feedback button. Your bug reports and ideas directly shape what gets built next.',
    dismissable: false,
  },
];