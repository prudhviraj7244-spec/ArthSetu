import {
  UserProfile,
  FinancialHealthScore,
  HealthPillar,
  OverspendingAlert,
  RiskAnalysis,
  FinancialPrediction,
  PredictionYearPoint,
  GoalFeasibilityResult,
  TierLevel,
} from '../types';

/**
 * Calculates sum of all user monthly expenses.
 */
export function calculateTotalMonthlyExpenses(expenses: UserProfile['expenses']): number {
  return (
    (expenses.housingRent || 0) +
    (expenses.groceriesFood || 0) +
    (expenses.utilities || 0) +
    (expenses.education || 0) +
    (expenses.healthcare || 0) +
    (expenses.transport || 0) +
    (expenses.loansEmi || 0) +
    (expenses.entertainmentDiscretionary || 0) +
    (expenses.other || 0)
  );
}

/**
 * Calculates total liquid savings readily available for emergencies.
 */
export function calculateTotalLiquidSavings(savings: UserProfile['savings']): number {
  return (savings.bankSavings || 0) + (savings.cashInHand || 0);
}

/**
 * Calculates total net worth (Savings + Investments - Debts).
 */
export function calculateTotalNetWorth(profile: UserProfile): number {
  const totalSavings =
    (profile.savings.bankSavings || 0) +
    (profile.savings.fixedDeposits || 0) +
    (profile.savings.cashInHand || 0);

  const totalInvestments =
    (profile.investments.mutualFundsSIP || 0) +
    (profile.investments.gold || 0) +
    (profile.investments.stocks || 0) +
    (profile.investments.epfPpf || 0) +
    (profile.investments.chitFunds || 0) +
    (profile.investments.postOffice || 0);

  const totalDebtPrincipal = profile.debts.reduce((sum, d) => sum + (d.principal || 0), 0);

  return totalSavings + totalInvestments - totalDebtPrincipal;
}

/**
 * Indian Tier Benchmarks for living expenses and savings rates.
 */
export const TIER_BENCHMARKS: Record<
  TierLevel,
  { avgSavingsRate: number; livingCostIndex: number; maxRecommendedRentPercent: number }
> = {
  'Tier-1': { avgSavingsRate: 20, livingCostIndex: 1.35, maxRecommendedRentPercent: 35 },
  'Tier-2': { avgSavingsRate: 25, livingCostIndex: 1.0, maxRecommendedRentPercent: 28 },
  'Tier-3': { avgSavingsRate: 30, livingCostIndex: 0.75, maxRecommendedRentPercent: 22 },
};

/**
 * Evaluates overspending alerts based on Indian household norms and tier dynamics.
 */
export function checkOverspendingAlerts(profile: UserProfile): OverspendingAlert[] {
  const alerts: OverspendingAlert[] = [];
  const income = profile.monthlyIncome > 0 ? profile.monthlyIncome : 1;
  const exp = profile.expenses;
  const tierConfig = TIER_BENCHMARKS[profile.tier] || TIER_BENCHMARKS['Tier-2'];

  // 1. Rent / Housing Alert
  const rentPercent = (exp.housingRent / income) * 100;
  if (rentPercent > tierConfig.maxRecommendedRentPercent) {
    alerts.push({
      id: 'alert-rent',
      category: 'Housing & Rent',
      severity: rentPercent > 45 ? 'danger' : 'warning',
      message: `Housing takes ${rentPercent.toFixed(1)}% of your income. In ${profile.tier} cities, recommended ceiling is ${tierConfig.maxRecommendedRentPercent}%.`,
      currentAmount: exp.housingRent,
      suggestedThreshold: Math.round(income * (tierConfig.maxRecommendedRentPercent / 100)),
      difference: Math.round(exp.housingRent - income * (tierConfig.maxRecommendedRentPercent / 100)),
      recommendation: 'Consider shared accommodation or renegotiating lease if feasible.',
    });
  }

  // 2. Discretionary / Lifestyle Alert
  const discPercent = (exp.entertainmentDiscretionary / income) * 100;
  if (discPercent > 18) {
    alerts.push({
      id: 'alert-lifestyle',
      category: 'Entertainment & Discretionary',
      severity: discPercent > 28 ? 'danger' : 'warning',
      message: `Discretionary spend is ${discPercent.toFixed(1)}% of income (healthy benchmark is under 12-15%).`,
      currentAmount: exp.entertainmentDiscretionary,
      suggestedThreshold: Math.round(income * 0.12),
      difference: Math.round(exp.entertainmentDiscretionary - income * 0.12),
      recommendation: 'Cap dining out, subscriptions, and impulse ecommerce purchases.',
    });
  }

  // 3. Debt EMI burden
  const totalEmi = exp.loansEmi;
  const dtiPercent = (totalEmi / income) * 100;
  if (dtiPercent > 40) {
    alerts.push({
      id: 'alert-emi',
      category: 'Loan EMI Burden',
      severity: dtiPercent > 55 ? 'danger' : 'warning',
      message: `Debt EMIs consume ${dtiPercent.toFixed(1)}% of your monthly cash flow. Safe ceiling is 30-35%.`,
      currentAmount: totalEmi,
      suggestedThreshold: Math.round(income * 0.35),
      difference: Math.round(totalEmi - income * 0.35),
      recommendation: 'Target high-interest personal loans or credit cards first with debt avalanche strategy.',
    });
  }

  // 4. Zero or negligible savings
  const totalExp = calculateTotalMonthlyExpenses(exp);
  const netSavings = income - totalExp;
  if (netSavings <= 0) {
    alerts.push({
      id: 'alert-deficit',
      category: 'Monthly Budget Deficit',
      severity: 'danger',
      message: `You are spending ₹${Math.abs(netSavings).toLocaleString('en-IN')} more than you earn each month.`,
      currentAmount: totalExp,
      suggestedThreshold: income,
      difference: Math.abs(netSavings),
      recommendation: 'Audit non-essential expenses immediately to stop debt spiral.',
    });
  }

  return alerts;
}

/**
 * Calculates Comprehensive Financial Health Score (0 to 100)
 */
export function calculateFinancialHealthScore(profile: UserProfile): FinancialHealthScore {
  const income = profile.monthlyIncome > 0 ? profile.monthlyIncome : 1;
  const totalExpenses = calculateTotalMonthlyExpenses(profile.expenses);
  const monthlySavings = Math.max(0, income - totalExpenses);
  const savingsRatePercent = (monthlySavings / income) * 100;

  const totalEmi = profile.expenses.loansEmi;
  const debtToIncomePercent = (totalEmi / income) * 100;

  const totalLiquidSavings = calculateTotalLiquidSavings(profile.savings);
  const emergencyFundMonths =
    totalExpenses > 0 ? Number((totalLiquidSavings / totalExpenses).toFixed(1)) : 0;

  const totalNetWorth = calculateTotalNetWorth(profile);
  const tierConfig = TIER_BENCHMARKS[profile.tier] || TIER_BENCHMARKS['Tier-2'];

  // Pillar 1: Savings Rate (25% weight)
  // Target: >= 20% in T1, 25% in T2, 30% in T3
  const targetSavingsRate = tierConfig.avgSavingsRate;
  let savingsRateScore = Math.min(100, Math.round((savingsRatePercent / targetSavingsRate) * 100));
  if (monthlySavings <= 0) savingsRateScore = 0;

  // Pillar 2: Debt-to-Income (25% weight)
  // 0% DTI = 100 score, 30% DTI = 70 score, >50% = 0-30 score
  let dtiScore = 100;
  if (debtToIncomePercent > 50) {
    dtiScore = Math.max(10, Math.round(100 - (debtToIncomePercent - 30) * 3));
  } else if (debtToIncomePercent > 30) {
    dtiScore = Math.round(100 - (debtToIncomePercent - 20) * 2.5);
  } else {
    dtiScore = Math.round(100 - debtToIncomePercent * 0.8);
  }
  dtiScore = Math.max(0, Math.min(100, dtiScore));

  // Pillar 3: Emergency Fund Buffer (20% weight)
  // Target: 6 months = 100 score, 3 months = 65 score
  const emergencyBufferScore = Math.min(100, Math.round((emergencyFundMonths / 6) * 100));

  // Pillar 4: Expense-to-Income control (15% weight)
  const expenseRatioPercent = (totalExpenses / income) * 100;
  let expenseScore = 100;
  if (expenseRatioPercent >= 100) {
    expenseScore = Math.max(0, 100 - (expenseRatioPercent - 90) * 6);
  } else if (expenseRatioPercent > 80) {
    expenseScore = Math.max(40, 100 - (expenseRatioPercent - 70) * 2.5);
  } else {
    expenseScore = 95;
  }

  // Pillar 5: Asset Diversification (15% weight)
  let diversificationPoints = 20; // base for having profile
  if (profile.savings.fixedDeposits > 0 || profile.investments.postOffice > 0) diversificationPoints += 20;
  if (profile.investments.epfPpf > 0) diversificationPoints += 20;
  if (profile.investments.gold > 0) diversificationPoints += 20;
  if (profile.investments.mutualFundsSIP > 0 || profile.investments.stocks > 0) diversificationPoints += 20;
  const diversificationScore = Math.min(100, diversificationPoints);

  // Weighted total score
  const totalScore = Math.round(
    savingsRateScore * 0.25 +
      dtiScore * 0.25 +
      emergencyBufferScore * 0.2 +
      expenseScore * 0.15 +
      diversificationScore * 0.15
  );

  let grade: FinancialHealthScore['grade'] = 'Fair';
  if (totalScore >= 80) grade = 'Excellent';
  else if (totalScore >= 65) grade = 'Good';
  else if (totalScore >= 50) grade = 'Fair';
  else if (totalScore >= 35) grade = 'Needs Attention';
  else grade = 'Critical';

  const pillars: HealthPillar[] = [
    {
      name: 'Savings Discipline',
      score: savingsRateScore,
      metricLabel: 'Monthly Savings Rate',
      currentValue: `${savingsRatePercent.toFixed(1)}%`,
      targetValue: `≥ ${targetSavingsRate}%`,
      status: savingsRateScore >= 70 ? 'healthy' : savingsRateScore >= 45 ? 'moderate' : 'action_needed',
      advice:
        savingsRateScore >= 70
          ? 'Great savings consistency! Redirect surplus into growth assets.'
          : `Aim to save at least ₹${Math.round(income * (targetSavingsRate / 100)).toLocaleString('en-IN')}/mo for your ${profile.tier} location.`,
    },
    {
      name: 'Debt Management (DTI)',
      score: dtiScore,
      metricLabel: 'Debt-to-Income (EMI)',
      currentValue: `${debtToIncomePercent.toFixed(1)}%`,
      targetValue: '≤ 30%',
      status: dtiScore >= 70 ? 'healthy' : dtiScore >= 50 ? 'moderate' : 'action_needed',
      advice:
        debtToIncomePercent > 35
          ? 'EMI outflow is constraining flexibility. Prioritize prepaying high-rate debt.'
          : 'Healthy debt levels. Ensure you do not take unbacked personal loans.',
    },
    {
      name: 'Emergency Cushion',
      score: emergencyBufferScore,
      metricLabel: 'Expenses Covered',
      currentValue: `${emergencyFundMonths} months`,
      targetValue: '3 to 6 months',
      status: emergencyBufferScore >= 65 ? 'healthy' : emergencyBufferScore >= 35 ? 'moderate' : 'action_needed',
      advice:
        emergencyFundMonths < 3
          ? `Park ₹${Math.round(totalExpenses * 3 - totalLiquidSavings).toLocaleString('en-IN')} in a safe savings or liquid fund.`
          : 'Solid emergency safety net established.',
    },
    {
      name: 'Expense Control',
      score: expenseScore,
      metricLabel: 'Expense / Income',
      currentValue: `${expenseRatioPercent.toFixed(1)}%`,
      targetValue: '≤ 75%',
      status: expenseScore >= 75 ? 'healthy' : expenseScore >= 50 ? 'moderate' : 'action_needed',
      advice:
        expenseRatioPercent > 85
          ? 'Cash flow is tight. Use the 50/30/20 budget envelope.'
          : 'Living comfortably within your means.',
    },
    {
      name: 'Portfolio Diversification',
      score: diversificationScore,
      metricLabel: 'Asset Classes',
      currentValue: `${diversificationScore}/100`,
      targetValue: '≥ 80/100',
      status: diversificationScore >= 75 ? 'healthy' : diversificationScore >= 50 ? 'moderate' : 'action_needed',
      advice:
        diversificationScore < 60
          ? 'Do not hold all money in regular bank account; explore PPF, Gold & Mutual Funds.'
          : 'Balanced distribution across safety and wealth generators.',
    },
  ];

  const overspendingAlerts = checkOverspendingAlerts(profile);

  return {
    totalScore,
    grade,
    monthlySavings,
    savingsRatePercent,
    debtToIncomePercent,
    emergencyFundMonths,
    totalExpenses,
    totalLiquidSavings,
    totalNetWorth,
    pillars,
    overspendingAlerts,
    tierBenchmark: {
      tierAverageSavingsRate: tierConfig.avgSavingsRate,
      livingCostAdjustmentFactor: tierConfig.livingCostIndex,
      insight: `For ${profile.city} (${profile.tier}), local cost of living factor is ${tierConfig.livingCostIndex}x national baseline. Target savings rate is ${tierConfig.avgSavingsRate}%.`,
    },
  };
}

/**
 * Random Forest Multi-Factor Simulation for Risk Profiling
 */
export function calculateRiskAnalysis(profile: UserProfile): RiskAnalysis {
  // 1. Occupation Income Stability (Weight 25%)
  const occupationStabilityMap: Record<UserProfile['occupation'], number> = {
    salaried: 85,
    business_owner: 60,
    self_employed: 50,
    retired: 75,
    student: 35,
    daily_wage: 30,
    homemaker: 40,
  };
  const incomeStabilityScore = occupationStabilityMap[profile.occupation] || 50;

  // 2. Age & Time Horizon (Weight 20%)
  // Younger age allows higher volatility capacity
  let timeHorizonScore = 80;
  if (profile.age < 30) timeHorizonScore = 90;
  else if (profile.age < 45) timeHorizonScore = 75;
  else if (profile.age < 55) timeHorizonScore = 55;
  else timeHorizonScore = 35;

  // 3. Debt Burden (Weight 20%)
  const income = profile.monthlyIncome > 0 ? profile.monthlyIncome : 1;
  const dti = (profile.expenses.loansEmi / income) * 100;
  const debtBurdenScore = Math.max(10, Math.round(100 - dti * 1.5));

  // 4. Emergency Cushion (Weight 20%)
  const totalExp = calculateTotalMonthlyExpenses(profile.expenses);
  const liquid = calculateTotalLiquidSavings(profile.savings);
  const emergencyMonths = totalExp > 0 ? liquid / totalExp : 0;
  const emergencyBufferScore = Math.min(100, Math.round((emergencyMonths / 6) * 100));

  // 5. Dependents Burden (Weight 15%)
  const dependents = profile.familyDependents || 0;
  const dependentsScore = Math.max(20, 100 - dependents * 18);

  // Multi-factor ensemble calculation
  const compositeScore = Math.round(
    incomeStabilityScore * 0.25 +
      timeHorizonScore * 0.2 +
      debtBurdenScore * 0.2 +
      emergencyBufferScore * 0.2 +
      dependentsScore * 0.15
  );

  let riskCategory: RiskAnalysis['riskCategory'] = 'Moderate (Santulan)';
  let equity = 45;
  let debtGovt = 35;
  let gold = 10;
  let liquidCash = 10;
  let description = '';

  if (compositeScore < 35) {
    riskCategory = 'Conservative (Suraksha)';
    equity = 15;
    debtGovt = 55;
    gold = 15;
    liquidCash = 15;
    description =
      'Capital preservation is paramount. Priority is guaranteed sovereign returns (PPF, POMIS, Post Office, Bank FDs) and minimal equity exposure.';
  } else if (compositeScore < 50) {
    riskCategory = 'Moderately Conservative';
    equity = 30;
    debtGovt = 45;
    gold = 15;
    liquidCash = 10;
    description =
      'Balanced with strong safety inclination. Focus on fixed income and government security schemes with modest index fund exposure.';
  } else if (compositeScore < 70) {
    riskCategory = 'Moderate (Santulan)';
    equity = 50;
    debtGovt = 30;
    gold = 10;
    liquidCash = 10;
    description =
      'Balanced wealth creation: combination of diversified equity mutual funds (SIP) with stable anchors like PPF, EPF, and Gold.';
  } else if (compositeScore < 85) {
    riskCategory = 'Moderately Aggressive';
    equity = 65;
    debtGovt = 20;
    gold = 10;
    liquidCash = 5;
    description =
      'High growth capacity with ample emergency backup. Substantial allocation to equity SIPs to outpace Indian retail inflation.';
  } else {
    riskCategory = 'Aggressive (Vridhi)';
    equity = 75;
    debtGovt = 15;
    gold = 5;
    liquidCash = 5;
    description =
      'Long-term aggressive compounding with maximum exposure to broad-market index and thematic funds alongside sovereign tax savers.';
  }

  const randomForestFeatures: RiskAnalysis['randomForestFeatures'] = [
    {
      feature: 'Income Stability',
      importanceWeight: 0.25,
      userScore: incomeStabilityScore,
      impact: incomeStabilityScore >= 70 ? 'Positive' : 'Neutral',
    },
    {
      feature: 'Investment Time Horizon (Age)',
      importanceWeight: 0.2,
      userScore: timeHorizonScore,
      impact: timeHorizonScore >= 70 ? 'Positive' : 'Neutral',
    },
    {
      feature: 'Debt-to-Income Health',
      importanceWeight: 0.2,
      userScore: debtBurdenScore,
      impact: debtBurdenScore >= 70 ? 'Positive' : 'Negative',
    },
    {
      feature: 'Emergency Fund Protection',
      importanceWeight: 0.2,
      userScore: emergencyBufferScore,
      impact: emergencyBufferScore >= 60 ? 'Positive' : 'Negative',
    },
    {
      feature: 'Family Dependents Ratio',
      importanceWeight: 0.15,
      userScore: dependentsScore,
      impact: dependentsScore >= 65 ? 'Positive' : 'Neutral',
    },
  ];

  return {
    riskScore: compositeScore,
    riskCategory,
    description,
    multiFactorBreakdown: {
      incomeStabilityScore,
      expenseVolatilityScore: 100 - dependentsScore,
      debtBurdenScore,
      timeHorizonScore,
      emergencyBufferScore,
    },
    randomForestFeatures,
    recommendedAssetAllocation: {
      equityMutualFunds: equity,
      debtAndGovtSchemes: debtGovt,
      digitalGoldOrPhysical: gold,
      liquidEmergencyCash: liquidCash,
    },
  };
}

/**
 * Linear Regression and Compound Financial Prediction over 1 to 20 years
 */
export function calculateFinancialPrediction(
  profile: UserProfile,
  risk: RiskAnalysis,
  additionalMonthlySavingsBoost: number = 0
): FinancialPrediction {
  const currentLiquidAndInvestments =
    calculateTotalLiquidSavings(profile.savings) +
    (profile.savings.fixedDeposits || 0) +
    (profile.investments.mutualFundsSIP || 0) +
    (profile.investments.gold || 0) +
    (profile.investments.stocks || 0) +
    (profile.investments.epfPpf || 0) +
    (profile.investments.postOffice || 0);

  const income = profile.monthlyIncome > 0 ? profile.monthlyIncome : 1;
  const totalExp = calculateTotalMonthlyExpenses(profile.expenses);
  const currentMonthlySavings = Math.max(0, income - totalExp);
  const optimizedMonthlySavings = currentMonthlySavings + additionalMonthlySavingsBoost;

  // Blended annual rates:
  // Current: mostly in bank savings / low-yield cash ~ 4.5% - 5.5%
  const currentReturnRate = 0.055;

  // Optimized: weighted average based on risk allocation
  // Equity: 11.5%, Debt/Govt (PPF): 7.1%, Gold: 8.0%, Liquid: 5.0%
  const alloc = risk.recommendedAssetAllocation;
  const optimizedReturnRate =
    (alloc.equityMutualFunds / 100) * 0.115 +
    (alloc.debtAndGovtSchemes / 100) * 0.071 +
    (alloc.digitalGoldOrPhysical / 100) * 0.08 +
    (alloc.liquidEmergencyCash / 100) * 0.05;

  // Indian Long-term Inflation expectation ~ 5.5%
  const inflationRate = 0.055;

  const yearsToCheck = [1, 2, 3, 5, 7, 10, 15, 20];
  const timeline: PredictionYearPoint[] = [];

  for (const yr of yearsToCheck) {
    const months = yr * 12;

    // Current trajectory: Future Value of starting principal + monthly savings at current rate
    const rCurrentMonthly = currentReturnRate / 12;
    const fvPrincipalCurrent = currentLiquidAndInvestments * Math.pow(1 + rCurrentMonthly, months);
    const fvSavingsCurrent =
      currentMonthlySavings > 0
        ? currentMonthlySavings * ((Math.pow(1 + rCurrentMonthly, months) - 1) / rCurrentMonthly)
        : 0;
    const currentTrajectory = Math.round(fvPrincipalCurrent + fvSavingsCurrent);

    // Optimized trajectory: Future Value at optimized return rate
    const rOptMonthly = optimizedReturnRate / 12;
    const fvPrincipalOpt = currentLiquidAndInvestments * Math.pow(1 + rOptMonthly, months);
    const fvSavingsOpt =
      optimizedMonthlySavings > 0
        ? optimizedMonthlySavings * ((Math.pow(1 + rOptMonthly, months) - 1) / rOptMonthly)
        : 0;
    const optimizedTrajectory = Math.round(fvPrincipalOpt + fvSavingsOpt);

    const cumulativeSavings = Math.round(
      currentLiquidAndInvestments + optimizedMonthlySavings * months
    );
    const interestEarnedCurrent = Math.max(
      0,
      currentTrajectory - (currentLiquidAndInvestments + currentMonthlySavings * months)
    );
    const interestEarnedOptimized = Math.max(0, optimizedTrajectory - cumulativeSavings);

    // Inflation adjusted real worth of optimized trajectory
    const inflationDiscount = Math.pow(1 + inflationRate, yr);
    const inflationAdjustedRealWorth = Math.round(optimizedTrajectory / inflationDiscount);

    timeline.push({
      year: yr,
      currentTrajectory,
      optimizedTrajectory,
      cumulativeSavings,
      interestEarnedCurrent,
      interestEarnedOptimized,
      inflationAdjustedRealWorth,
    });
  }

  // Linear Regression on Optimized Trajectory:
  // y = slope * x + intercept
  const n = timeline.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  for (const p of timeline) {
    sumX += p.year;
    sumY += p.optimizedTrajectory;
    sumXY += p.year * p.optimizedTrajectory;
    sumXX += p.year * p.year;
  }
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const expected10Year = timeline.find((p) => p.year === 10)?.currentTrajectory || 0;
  const opt10Year = timeline.find((p) => p.year === 10)?.optimizedTrajectory || 0;

  // Goal Feasibility Evaluation
  const goalFeasibility: GoalFeasibilityResult[] = profile.goals.map((goal) => {
    const yr = Math.max(1, Math.min(20, goal.targetYears));
    const months = yr * 12;
    // Projection at goal year
    const rOptMonthly = optimizedReturnRate / 12;
    const rCurrMonthly = currentReturnRate / 12;

    const optWealth =
      currentLiquidAndInvestments * Math.pow(1 + rOptMonthly, months) +
      (optimizedMonthlySavings > 0
        ? optimizedMonthlySavings * ((Math.pow(1 + rOptMonthly, months) - 1) / rOptMonthly)
        : 0);

    const currWealth =
      currentLiquidAndInvestments * Math.pow(1 + rCurrMonthly, months) +
      (currentMonthlySavings > 0
        ? currentMonthlySavings * ((Math.pow(1 + rCurrMonthly, months) - 1) / rCurrMonthly)
        : 0);

    const isAchievableCurrent = currWealth >= goal.targetAmount;
    const isAchievableOptimized = optWealth >= goal.targetAmount;

    // Monthly shortfall to reach goal if not achievable
    let monthlyShortfall = 0;
    if (!isAchievableOptimized) {
      const remainingDeficit = goal.targetAmount - optWealth;
      monthlyShortfall = Math.round(remainingDeficit / months);
    }

    let recommendation = 'On track with current plan!';
    if (!isAchievableCurrent && isAchievableOptimized) {
      recommendation = 'Achievable through the recommended portfolio allocation and disciplined SIP.';
    } else if (!isAchievableOptimized) {
      recommendation = `Need an extra ₹${monthlyShortfall.toLocaleString('en-IN')}/month savings or extend target by ${Math.ceil(monthlyShortfall / 1000)} months.`;
    }

    return {
      goalId: goal.id,
      title: goal.title,
      targetAmount: goal.targetAmount,
      targetYears: goal.targetYears,
      currentProjected: Math.round(currWealth),
      optimizedProjected: Math.round(optWealth),
      isAchievableCurrent,
      isAchievableOptimized,
      monthlyShortfall,
      recommendation,
    };
  });

  return {
    timeline,
    regressionStats: {
      slopePerYear: Math.round(slope),
      expected10YearWealth: expected10Year,
      optimized10YearWealth: opt10Year,
      gainFromOptimization: opt10Year - expected10Year,
    },
    goalFeasibility,
  };
}

/**
 * Format currency into Indian Rupees (Lakhs and Crores)
 */
export function formatINR(val: number): string {
  if (Math.abs(val) >= 10000000) {
    return `₹${(val / 10000000).toFixed(2)} Cr`;
  }
  if (Math.abs(val) >= 100000) {
    return `₹${(val / 100000).toFixed(2)} Lakh`;
  }
  return `₹${Math.round(val).toLocaleString('en-IN')}`;
}
