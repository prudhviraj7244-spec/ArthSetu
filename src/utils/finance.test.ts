import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTotalMonthlyExpenses,
  calculateTotalLiquidSavings,
  calculateTotalNetWorth,
  calculateFinancialHealthScore,
  calculateRiskAnalysis,
  calculateFinancialPrediction,
  checkOverspendingAlerts,
  formatINR,
} from './finance';
import { UserProfile } from '../types';

const mockProfile: UserProfile = {
  id: 'test-user',
  name: 'Test Indian User',
  age: 30,
  gender: 'male',
  occupation: 'salaried',
  city: 'Jaipur',
  tier: 'Tier-2',
  monthlyIncome: 50000,
  familyDependents: 2,
  preferredLanguage: 'en',
  expenses: {
    housingRent: 12000,
    groceriesFood: 9000,
    utilities: 2000,
    education: 3000,
    healthcare: 1500,
    transport: 2500,
    loansEmi: 5000,
    entertainmentDiscretionary: 3000,
    other: 1000,
  },
  savings: {
    bankSavings: 50000,
    fixedDeposits: 30000,
    cashInHand: 10000,
  },
  investments: {
    mutualFundsSIP: 40000,
    gold: 25000,
    stocks: 15000,
    epfPpf: 30000,
    chitFunds: 0,
    postOffice: 0,
  },
  debts: [
    {
      id: 'd1',
      name: 'Personal Loan',
      principal: 60000,
      monthlyEmi: 5000,
      interestRate: 13.5,
      tenureMonthsRemaining: 14,
      type: 'personal',
    },
  ],
  goals: [
    {
      id: 'g1',
      title: 'Emergency Reserve',
      targetAmount: 200000,
      targetYears: 2,
      priority: 'critical',
      category: 'emergency',
    },
    {
      id: 'g2',
      title: 'Family Vacation & Car',
      targetAmount: 500000,
      targetYears: 5,
      priority: 'medium',
      category: 'asset',
    },
  ],
};

test('calculateTotalMonthlyExpenses sums all categories correctly', () => {
  const total = calculateTotalMonthlyExpenses(mockProfile.expenses);
  assert.equal(total, 39000);
});

test('calculateTotalLiquidSavings sums bank savings and cash', () => {
  const liquid = calculateTotalLiquidSavings(mockProfile.savings);
  assert.equal(liquid, 60000);
});

test('calculateTotalNetWorth accurately accounts for savings, investments and debts', () => {
  const netWorth = calculateTotalNetWorth(mockProfile);
  // Savings: 50k + 30k + 10k = 90k
  // Investments: 40k + 25k + 15k + 30k = 110k
  // Debts: 60k
  // Total = 90k + 110k - 60k = 140k
  assert.equal(netWorth, 140000);
});

test('calculateFinancialHealthScore calculates score within 0-100 and yields valid grade', () => {
  const health = calculateFinancialHealthScore(mockProfile);
  assert.ok(health.totalScore >= 0 && health.totalScore <= 100);
  assert.ok(['Excellent', 'Good', 'Fair', 'Needs Attention', 'Critical'].includes(health.grade));
  assert.equal(health.monthlySavings, 11000);
  assert.equal(health.savingsRatePercent, 22);
  assert.equal(health.debtToIncomePercent, 10);
  assert.equal(health.pillars.length, 5);
});

test('checkOverspendingAlerts detects severe debt-to-income and rent breaches', () => {
  const overspentProfile: UserProfile = {
    ...mockProfile,
    monthlyIncome: 40000,
    expenses: {
      ...mockProfile.expenses,
      housingRent: 20000, // 50% rent breach
      loansEmi: 22000, // 55% EMI breach
    },
  };
  const alerts = checkOverspendingAlerts(overspentProfile);
  assert.ok(alerts.length >= 2);
  const rentAlert = alerts.find((a) => a.id === 'alert-rent');
  const emiAlert = alerts.find((a) => a.id === 'alert-emi');
  assert.ok(rentAlert !== undefined);
  assert.ok(emiAlert !== undefined);
  assert.equal(rentAlert?.severity, 'danger');
  assert.equal(emiAlert?.severity, 'danger');
});

test('calculateRiskAnalysis produces valid score, category and 100% asset allocation', () => {
  const risk = calculateRiskAnalysis(mockProfile);
  assert.ok(risk.riskScore >= 0 && risk.riskScore <= 100);
  const alloc = risk.recommendedAssetAllocation;
  const totalAllocation =
    alloc.equityMutualFunds +
    alloc.debtAndGovtSchemes +
    alloc.digitalGoldOrPhysical +
    alloc.liquidEmergencyCash;
  assert.equal(totalAllocation, 100);
  assert.ok(risk.randomForestFeatures.length === 5);
});

test('calculateFinancialPrediction generates positive growth and linear regression slope', () => {
  const risk = calculateRiskAnalysis(mockProfile);
  const pred = calculateFinancialPrediction(mockProfile, risk, 2000);
  assert.ok(pred.timeline.length > 0);
  assert.ok(pred.regressionStats.slopePerYear > 0);
  assert.ok(pred.regressionStats.optimized10YearWealth > pred.regressionStats.expected10YearWealth);
  assert.equal(pred.goalFeasibility.length, mockProfile.goals.length);
});

test('formatINR formats numbers into readable Lakhs, Crores and Thousands', () => {
  assert.equal(formatINR(500), '₹500');
  assert.equal(formatINR(45000), '₹45,000');
  assert.equal(formatINR(250000), '₹2.50 Lakh');
  assert.equal(formatINR(15000000), '₹1.50 Cr');
});
