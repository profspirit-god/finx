export type User = {
  id: string;
  displayName: string;
  passwordHash: string;
  passwordSalt: string;
  pinHash: string;
  pinSalt: string;
  createdAt: number;
  updatedAt: number;
};

export type PersonalizationAnswers = {
  primaryCurrency: string;
  trackMode: 'implicit' | 'explicit';
  monthlyIncomeEstimate: number | null;
  savingsGoalEstimate: number | null;
  onboardingComplete: boolean;
};