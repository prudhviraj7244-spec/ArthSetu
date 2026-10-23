import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Info,
  CheckCircle2,
  Building,
  PiggyBank,
  CreditCard,
  HeartPulse,
  Coins,
} from 'lucide-react';
import { FinancialHealthScore, UserProfile, LanguageCode } from '../types';
import { I18N_DICT } from '../data/i18n';
import { formatINR } from '../utils/finance';

interface HealthScoreCardProps {
  health: FinancialHealthScore;
  profile: UserProfile;
  language: LanguageCode;
}

export const HealthScoreCard: React.FC<HealthScoreCardProps> = ({
  health,
  profile,
  language,
}) => {
  const t = I18N_DICT[language] || I18N_DICT.en;

  // Gauge colors based on score
  const getScoreColor = (score: number) => {
    if (score >= 75) return { stroke: '#059669', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    if (score >= 60) return { stroke: '#0d9488', bg: 'bg-teal-50 text-teal-800 border-teal-200' };
    if (score >= 45) return { stroke: '#d97706', bg: 'bg-amber-50 text-amber-800 border-amber-200' };
    return { stroke: '#dc2626', bg: 'bg-red-50 text-red-800 border-red-200' };
  };

  const scoreTheme = getScoreColor(health.totalScore);

  // SVG Circular Gauge calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (health.totalScore / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Top Banner: Score + Key Vital Metrics */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Circular Score Gauge */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  stroke="#e2e8f0"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  stroke={scoreTheme.stroke}
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-slate-900 tracking-tight">
                  {health.totalScore}
                </span>
                <span className="text-xs font-semibold uppercase text-slate-400">/ 100</span>
              </div>
            </div>

            <div className="mt-3">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${scoreTheme.bg}`}
              >
                {health.totalScore >= 65 ? (
                  <ShieldCheck className="w-3.5 h-3.5" />
                ) : (
                  <ShieldAlert className="w-3.5 h-3.5" />
                )}
                {health.grade}
              </span>
              <p className="text-xs text-slate-500 mt-2 max-w-xs font-medium">
                Assessed for {profile.city} ({profile.tier}) living standards
              </p>
            </div>
          </div>

          {/* Core Numbers Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-2xs hover:border-slate-300 transition-colors">
              <span className="text-xs font-medium text-slate-500 block">{t.monthlyIncome}</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 mt-1 block">
                {formatINR(profile.monthlyIncome)}
              </span>
              <span className="text-2xs text-slate-400 mt-1 block capitalize">
                {profile.occupation.replace('_', ' ')}
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-2xs hover:border-slate-300 transition-colors">
              <span className="text-xs font-medium text-slate-500 block">{t.totalExpenses}</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 mt-1 block">
                {formatINR(health.totalExpenses)}
              </span>
              <span className="text-2xs text-slate-400 mt-1 block">
                {((health.totalExpenses / (profile.monthlyIncome || 1)) * 100).toFixed(0)}% of income
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-2xs hover:border-slate-300 transition-colors">
              <span className="text-xs font-medium text-slate-500 block">{t.monthlySavings}</span>
              <span
                className={`text-xl sm:text-2xl font-black mt-1 block ${
                  health.monthlySavings > 0 ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {formatINR(health.monthlySavings)}
              </span>
              <span className="text-2xs text-slate-400 mt-1 block">
                {health.savingsRatePercent.toFixed(1)}% {t.savingsRate}
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-2xs hover:border-slate-300 transition-colors">
              <span className="text-xs font-medium text-slate-500 block">{t.emergencyFund}</span>
              <span
                className={`text-xl sm:text-2xl font-black mt-1 block ${
                  health.emergencyFundMonths >= 3 ? 'text-emerald-600' : 'text-amber-600'
                }`}
              >
                {health.emergencyFundMonths} mo
              </span>
              <span className="text-2xs text-slate-400 mt-1 block">
                {formatINR(health.totalLiquidSavings)} liquid
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-2xs hover:border-slate-300 transition-colors">
              <span className="text-xs font-medium text-slate-500 block">{t.debtToIncome}</span>
              <span
                className={`text-xl sm:text-2xl font-black mt-1 block ${
                  health.debtToIncomePercent > 40
                    ? 'text-red-600'
                    : health.debtToIncomePercent > 25
                    ? 'text-amber-600'
                    : 'text-emerald-600'
                }`}
              >
                {health.debtToIncomePercent.toFixed(1)}%
              </span>
              <span className="text-2xs text-slate-400 mt-1 block">
                {formatINR(profile.expenses.loansEmi)} EMI
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-2xs hover:border-slate-300 transition-colors">
              <span className="text-xs font-medium text-slate-500 block">{t.netWorth}</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 mt-1 block">
                {formatINR(health.totalNetWorth)}
              </span>
              <span className="text-2xs text-slate-400 mt-1 block">Assets minus loans</span>
            </div>
          </div>
        </div>

        {/* Tier Cost-of-Living Benchmark Note */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600 bg-emerald-50/50 p-3 rounded-xl border-emerald-100">
          <Building className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{health.tierBenchmark.insight}</span>
        </div>
      </div>

      {/* Overspending & Risk Alerts */}
      {health.overspendingAlerts.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              {t.overspendingAlerts} ({health.overspendingAlerts.length})
            </h3>
            <span className="text-xs text-slate-500">Instant AI Detection</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {health.overspendingAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border transition-all ${
                  alert.severity === 'danger'
                    ? 'bg-red-50/80 border-red-200 text-red-900'
                    : alert.severity === 'warning'
                    ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                    : 'bg-blue-50/80 border-blue-200 text-blue-900'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-xs uppercase tracking-wider px-2 py-0.5 rounded bg-white/70 shadow-2xs">
                    {alert.category}
                  </span>
                  <span className="text-xs font-extrabold">
                    +₹{alert.difference.toLocaleString('en-IN')} over
                  </span>
                </div>
                <p className="text-xs font-medium mt-2 leading-relaxed">{alert.message}</p>
                <div className="mt-2 text-xs font-semibold text-slate-700 bg-white/90 p-2 rounded-lg border border-slate-200/60">
                  <span className="text-emerald-700 mr-1">Action:</span>
                  {alert.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-xs text-emerald-900 font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{t.noAlerts}</span>
        </div>
      )}

      {/* 5 Health Pillars Assessment */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-emerald-600" />
          Financial Health Breakdown (5 Pillars)
        </h3>

        <div className="space-y-4">
          {health.pillars.map((pillar) => (
            <div key={pillar.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800">{pillar.name}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500 font-medium">{pillar.metricLabel}:</span>
                  <span className="font-bold text-slate-900">{pillar.currentValue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium">Goal: {pillar.targetValue}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-2xs font-extrabold uppercase ${
                      pillar.status === 'healthy'
                        ? 'bg-emerald-100 text-emerald-800'
                        : pillar.status === 'moderate'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {pillar.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    pillar.score >= 70
                      ? 'bg-emerald-500'
                      : pillar.score >= 45
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.max(5, pillar.score)}%` }}
                />
              </div>

              <p className="text-2xs text-slate-500 font-medium">{pillar.advice}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
