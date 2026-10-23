/**
 * Comprehensive domain types for AI-Driven Personalized Wealth Management
 * and Financial Inclusion Platform in India's Multi-Tier Ecosystem.
 */

export type TierLevel = 'Tier-1' | 'Tier-2' | 'Tier-3';

export type Occupation =
  | 'student'
  | 'salaried'
  | 'self_employed'
  | 'business_owner'
  | 'daily_wage'
  | 'homemaker'
  | 'retired';

export type LanguageCode = 'en' | 'hi' | 'ta' | 'te' | 'mr' | 'bn';

export interface UserExpenses {
  housingRent: number;
  groceriesFood: number;
  utilities: number;
  education: number;
  healthcare: number;
  transport: number;
  loansEmi: number;
  entertainmentDiscretionary: number;
  other: number;
}

export interface ExistingSavings {
  bankSavings: number;
  fixedDeposits: number;
  cashInHand: number;
}

export interface ExistingInvestments {
  mutualFundsSIP: number;
  gold: number;
  stocks: number;
  epfPpf: number;
  chitFunds: number;
  postOffice: number;
}

export interface DebtItem {
  id: string;
  name: string;
  principal: number;
  monthlyEmi: number;
  interestRate: number; // e.g., 12.5%
  tenureMonthsRemaining: number;
  type: 'personal' | 'home' | 'education' | 'gold' | 'informal' | 'credit_card';
}

export interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  targetYears: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: 'emergency' | 'education' | 'wedding' | 'business' | 'home' | 'retirement' | 'asset';
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  occupation: Occupation;
  city: string;
  tier: TierLevel;
  monthlyIncome: number;
  familyDependents: number;
  expenses: UserExpenses;
  savings: ExistingSavings;
  investments: ExistingInvestments;
  debts: DebtItem[];
  goals: FinancialGoal[];
  preferredLanguage: LanguageCode;
}

export interface OverspendingAlert {
  id: string;
  category: string;
  severity: 'danger' | 'warning' | 'info';
  message: string;
  currentAmount: number;
  suggestedThreshold: number;
  difference: number;
  recommendation: string;
}

export interface HealthPillar {
  name: string;
  score: number; // 0-100
  metricLabel: string;
  currentValue: string;
  targetValue: string;
  status: 'healthy' | 'moderate' | 'action_needed';
  advice: string;
}

export interface FinancialHealthScore {
  totalScore: number; // 0-100
  grade: 'Excellent' | 'Good' | 'Fair' | 'Needs Attention' | 'Critical';
  monthlySavings: number;
  savingsRatePercent: number;
  debtToIncomePercent: number;
  emergencyFundMonths: number;
  totalExpenses: number;
  totalLiquidSavings: number;
  totalNetWorth: number;
  pillars: HealthPillar[];
  overspendingAlerts: OverspendingAlert[];
  tierBenchmark: {
    tierAverageSavingsRate: number;
    livingCostAdjustmentFactor: number;
    insight: string;
  };
}

export interface RiskAnalysis {
  riskScore: number; // 0-100
  riskCategory:
    | 'Conservative (Suraksha)'
    | 'Moderately Conservative'
    | 'Moderate (Santulan)'
    | 'Moderately Aggressive'
    | 'Aggressive (Vridhi)';
  description: string;
  multiFactorBreakdown: {
    incomeStabilityScore: number; // 0-100
    expenseVolatilityScore: number; // 0-100
    debtBurdenScore: number; // 0-100
    timeHorizonScore: number; // 0-100
    emergencyBufferScore: number; // 0-100
  };
  randomForestFeatures: Array<{
    feature: string;
    importanceWeight: number;
    userScore: number;
    impact: 'Positive' | 'Neutral' | 'Negative';
  }>;
  recommendedAssetAllocation: {
    equityMutualFunds: number; // %
    debtAndGovtSchemes: number; // %
    digitalGoldOrPhysical: number; // %
    liquidEmergencyCash: number; // %
  };
}

export interface PredictionYearPoint {
  year: number;
  currentTrajectory: number;
  optimizedTrajectory: number;
  cumulativeSavings: number;
  interestEarnedCurrent: number;
  interestEarnedOptimized: number;
  inflationAdjustedRealWorth: number;
}

export interface GoalFeasibilityResult {
  goalId: string;
  title: string;
  targetAmount: number;
  targetYears: number;
  currentProjected: number;
  optimizedProjected: number;
  isAchievableCurrent: boolean;
  isAchievableOptimized: boolean;
  monthlyShortfall: number;
  recommendation: string;
}

export interface FinancialPrediction {
  timeline: PredictionYearPoint[];
  regressionStats: {
    slopePerYear: number;
    expected10YearWealth: number;
    optimized10YearWealth: number;
    gainFromOptimization: number;
  };
  goalFeasibility: GoalFeasibilityResult[];
}

export interface GovernmentScheme {
  id: string;
  name: string;
  hindiName: string;
  shortCode: string;
  category: 'insurance' | 'pension' | 'savings' | 'loan' | 'scholarship' | 'social_security';
  targetAudience: string;
  description: string;
  eligibilityRules: {
    minAge?: number;
    maxAge?: number;
    maxAnnualIncome?: number;
    allowedOccupations?: Occupation[];
    gender?: 'all' | 'female';
    requiresBankAccount?: boolean;
    tierPreference?: TierLevel[];
    specialConditions?: string;
  };
  keyBenefits: string[];
  costOrInterest: string;
  applicationSteps: string[];
  documentsRequired: string[];
  officialPortal: string;
  matchStatus: 'eligible' | 'likely_eligible' | 'not_eligible';
  matchReason: string;
}
