import type { User } from '@/types/user';

export type AuthState =
  | { status: 'loading' }
  | { status: 'needs-onboarding' }
  | { status: 'locked'; user: User }
  | { status: 'unlocked'; user: User };

export type SignupInput = {
  displayName: string;
  password: string;
  pin: string;
};

export type PersonalizeInput = {
  primaryCurrency: string;
  trackMode: 'implicit' | 'explicit';
  monthlyIncomeEstimate: number | null;
  savingsGoalEstimate: number | null;
};