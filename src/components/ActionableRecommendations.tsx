import React, { useState } from 'react';
import {
  ListChecks,
  CheckCircle,
  Circle,
  ArrowRight,
  Shield,
  Zap,
  TrendingUp,
  Percent,
  Sparkles,
  PieChart,
} from 'lucide-react';
import { UserProfile, LanguageCode, FinancialHealthScore } from '../types';
import { I18N_DICT } from '../data/i18n';
import { formatINR, TIER_BENCHMARKS } from '../utils/finance';

interface ActionableRecommendationsProps {
  profile: UserProfile;
  health: FinancialHealthScore;
  language: LanguageCode;
}

export const ActionableRecommendations: React.FC<ActionableRecommendationsProps> = ({
  profile,
  health,
  language,
}) => {
  const t = I18N_DICT[language] || I18N_DICT.en;

  // Track checked steps
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const toggleStep = (id: string) => {
    setCompletedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const income = profile.monthlyIncome > 0 ? profile.monthlyIncome : 1;
  const tierConfig = TIER_BENCHMARKS[profile.tier] || TIER_BENCHMARKS['Tier-2'];

  // Indian Tier-adapted budget envelope
  const budgetRatios =
    profile.tier === 'Tier-1'
      ? { needs: 55, wants: 25, savings: 20 }
      : profile.tier === 'Tier-2'
      ? { needs: 50, wants: 25, savings: 25 }
      : { needs: 45, wants: 25, savings: 30 };

  const needsAmount = Math.round(income * (budgetRatios.needs / 100));
  const wantsAmount = Math.round(income * (budgetRatios.wants / 100));
  const savingsAmount = Math.round(income * (budgetRatios.savings / 100));

  const actionSteps = [
    {
      id: 'step-1-insurance',
      title: 'Avail Fundamental Social Safety (PMSBY & PMJJBY)',
      category: 'Protection',
      description: `For just ₹456/year (₹20 for PMSBY + ₹436 for PMJJBY), secure ₹4 Lakh total combined cover (accidental + life) for your family.`,
      urgency: 'Immediate (This Week)',
      recommendedFor: 'All Indian citizens',
    },
    {
      id: 'step-2-emergency',
      title: `Build a ₹${Math.round(health.totalExpenses * 3).toLocaleString('en-IN')} Emergency Buffer`,
      category: 'Liquidity',
      description: `Park at least 3 months of basic living costs in a dedicated savings account or Post Office savings to avoid borrowing at high rates during medical crises.`,
      urgency: health.emergencyFundMonths < 2 ? 'Critical' : 'Moderate',
      recommendedFor: `${health.emergencyFundMonths} months currently covered`,
    },
    {
      id: 'step-3-debt',
      title: 'High-Interest Debt Extinction (Debt Avalanche)',
      category: 'Debt Relief',
      description:
        profile.debts.length > 0
          ? `Prioritize clearing "${profile.debts[0].name}" (at ${profile.debts[0].interestRate}% interest) before investing in low-yield assets.`
          : 'Zero high-interest loans active. Maintain this debt-free status.',
      urgency: profile.expenses.loansEmi > 0 ? 'High' : 'Done',
      recommendedFor: `Current EMI: ₹${profile.expenses.loansEmi.toLocaleString('en-IN')}/mo`,
    },
    {
      id: 'step-4-wealth',
      title: 'Automate Wealth Creation via SIP & PPF',
      category: 'Growth',
      description: `Commit ₹${savingsAmount.toLocaleString('en-IN')}/month: 50% into a diversified Nifty 50 Index Fund SIP, and 50% into Public Provident Fund (PPF, 7.1% tax-free).`,
      urgency: 'Ongoing',
      recommendedFor: `Aligned with your ${profile.tier} savings benchmark`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Indian Tier-Adapted Budget Envelope */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-100">
            <PieChart className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Indian Tier-Adapted Budgeting Framework ({profile.tier})
            </h2>
            <p className="text-xs text-slate-500">
              Calibrated for living costs and rent realities in {profile.city} ({budgetRatios.needs}% Needs / {budgetRatios.wants}% Wants / {budgetRatios.savings}% Savings)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Essential Needs ({budgetRatios.needs}%)</span>
              <span className="text-slate-400">Rent, groceries, bills</span>
            </div>
            <span className="text-xl font-black text-slate-900 mt-1 block">
              {formatINR(needsAmount)}
            </span>
            <span className="text-2xs text-slate-500 mt-1 block">
              Actual spend: {formatINR(health.totalExpenses - profile.expenses.entertainmentDiscretionary)}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
            <div className="flex items-center justify-between text-xs font-semibold text-amber-800">
              <span>Discretionary Wants ({budgetRatios.wants}%)</span>
              <span className="text-amber-600">Dining, shopping, OTT</span>
            </div>
            <span className="text-xl font-black text-amber-900 mt-1 block">
              {formatINR(wantsAmount)}
            </span>
            <span className="text-2xs text-amber-700 mt-1 block">
              Actual spend: {formatINR(profile.expenses.entertainmentDiscretionary)}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-800">
              <span>Target Savings ({budgetRatios.savings}%)</span>
              <span className="text-emerald-600">Surplus for future</span>
            </div>
            <span className="text-xl font-black text-emerald-900 mt-1 block">
              {formatINR(savingsAmount)}
            </span>
            <span className="text-2xs text-emerald-700 mt-1 block font-medium">
              Actual surplus: {formatINR(health.monthlySavings)}
            </span>
          </div>
        </div>
      </div>

      {/* 4-Step Action Checklist */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-800">
              Personalized Financial Action Checklist
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            {Object.values(completedSteps).filter(Boolean).length} of {actionSteps.length} completed
          </span>
        </div>

        <div className="space-y-3">
          {actionSteps.map((step) => {
            const isDone = Boolean(completedSteps[step.id]);
            return (
              <div
                key={step.id}
                onClick={() => toggleStep(step.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                  isDone
                    ? 'bg-emerald-50/60 border-emerald-200 opacity-80'
                    : 'bg-white hover:bg-slate-50 border-slate-200'
                }`}
              >
                <button
                  type="button"
                  className="mt-0.5 text-emerald-600 hover:text-emerald-700"
                  aria-label={isDone ? 'Mark as incomplete' : 'Mark as complete'}
                >
                  {isDone ? (
                    <CheckCircle className="w-5 h-5 fill-emerald-600 text-white" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400" />
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={`text-sm font-bold ${
                        isDone ? 'line-through text-slate-500' : 'text-slate-900'
                      }`}
                    >
                      {step.title}
                    </span>
                    <span className="text-2xs font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {step.urgency}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {step.description}
                  </p>

                  <div className="mt-2 text-2xs text-slate-400 flex items-center gap-2">
                    <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-semibold">
                      {step.category}
                    </span>
                    <span>• {step.recommendedFor}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
