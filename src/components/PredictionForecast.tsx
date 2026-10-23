import React, { useState } from 'react';
import {
  TrendingUp,
  Target,
  Sparkles,
  ArrowUpRight,
  Clock,
  Layers,
  Sliders,
  CheckCircle,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { FinancialPrediction, UserProfile, LanguageCode } from '../types';
import { I18N_DICT } from '../data/i18n';
import { formatINR } from '../utils/finance';

interface PredictionForecastProps {
  prediction: FinancialPrediction;
  profile: UserProfile;
  language: LanguageCode;
  monthlySavingsBoost: number;
  onSavingsBoostChange: (amount: number) => void;
}

export const PredictionForecast: React.FC<PredictionForecastProps> = ({
  prediction,
  profile,
  language,
  monthlySavingsBoost,
  onSavingsBoostChange,
}) => {
  const t = I18N_DICT[language] || I18N_DICT.en;
  const [selectedYear, setSelectedYear] = useState<number>(10);

  const timeline = prediction.timeline;
  const currentPoint = timeline.find((p) => p.year === selectedYear) || timeline[timeline.length - 1];

  // SVG Chart Dimensions & Coordinates
  const chartWidth = 740;
  const chartHeight = 260;
  const padding = { top: 20, right: 30, bottom: 40, left: 88 };

  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Maximum value for scale
  const maxVal = Math.max(...timeline.map((p) => p.optimizedTrajectory), 10000);
  const minYear = timeline[0]?.year || 1;
  const maxYear = timeline[timeline.length - 1]?.year || 20;

  const getX = (year: number) => {
    return padding.left + ((year - minYear) / (maxYear - minYear)) * innerWidth;
  };

  const getY = (val: number) => {
    return padding.top + innerHeight - (val / maxVal) * innerHeight;
  };

  // Generate SVG path strings
  const currentPath = timeline.reduce(
    (acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${getX(p.year)} ${getY(p.currentTrajectory)}`,
    ''
  );

  const optimizedPath = timeline.reduce(
    (acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${getX(p.year)} ${getY(p.optimizedTrajectory)}`,
    ''
  );

  // Area between curves for visual wealth creation gap
  const areaPath = `${optimizedPath} ${[...timeline]
    .reverse()
    .map((p) => `L ${getX(p.year)} ${getY(p.currentTrajectory)}`)
    .join(' ')} Z`;

  return (
    <div className="space-y-6">
      {/* Overview & Interactive Controls */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                <TrendingUp className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {t.predictions} (Linear Regression & Compounding)
                </h2>
                <p className="text-xs text-slate-500">
                  Forecasts your Indian wealth trajectory under current habits vs. optimized multi-asset allocation.
                </p>
              </div>
            </div>
          </div>

          {/* Timeline Horizon Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start">
            {[1, 3, 5, 10, 20].map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  selectedYear === yr
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {yr} {yr === 1 ? 'Year' : 'Years'}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Interactive Savings Boost Slider */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>Simulate Extra Savings:</span>
              <span className="text-emerald-700 font-extrabold text-sm">
                +₹{monthlySavingsBoost.toLocaleString('en-IN')}/month
              </span>
            </div>
            <span className="text-xs text-slate-500">
              Deploying via SIP & Sovereign schemes
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="25000"
            step="500"
            value={monthlySavingsBoost}
            onChange={(e) => onSavingsBoostChange(Number(e.target.value))}
            className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
          />

          <div className="flex justify-between text-2xs text-slate-400 font-medium">
            <span>₹0 (Current)</span>
            <span>+₹5,000</span>
            <span>+₹10,000</span>
            <span>+₹15,000</span>
            <span>+₹25,000</span>
          </div>
        </div>

        {/* Visual Dual-Curve SVG Chart */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-400" />
                <span className="text-slate-600 font-medium">{t.currentTrajectory}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-600" />
                <span className="text-emerald-900 font-bold">{t.optimizedTrajectory}</span>
              </div>
            </div>
            <div className="text-slate-500 font-medium text-2xs">
              Regression slope: +{formatINR(prediction.regressionStats.slopePerYear)}/yr
            </div>
          </div>

          <div className="relative w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-auto min-w-[550px] overflow-visible"
            >
              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                const y = padding.top + innerHeight * (1 - ratio);
                const val = maxVal * ratio;
                return (
                  <g key={ratio}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={chartWidth - padding.right}
                      y2={y}
                      stroke="#f1f5f9"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={padding.left - 8}
                      y={y + 4}
                      textAnchor="end"
                      className="text-2xs fill-slate-400 font-medium"
                    >
                      {formatINR(val)}
                    </text>
                  </g>
                );
              })}

              {/* X Axis Labels */}
              {timeline
                .filter((p) => [1, 3, 5, 10, 15, 20].includes(p.year))
                .map((p) => {
                  const x = getX(p.year);
                  return (
                    <g key={p.year}>
                      <line
                        x1={x}
                        y1={padding.top + innerHeight}
                        x2={x}
                        y2={padding.top + innerHeight + 6}
                        stroke="#cbd5e1"
                      />
                      <text
                        x={x}
                        y={padding.top + innerHeight + 20}
                        textAnchor="middle"
                        className="text-2xs fill-slate-500 font-semibold"
                      >
                        Yr {p.year}
                      </text>
                    </g>
                  );
                })}

              {/* Wealth Difference Shaded Gradient Area */}
              <defs>
                <linearGradient id="wealthGapGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#wealthGapGrad)" />

              {/* Line 1: Current Path */}
              <path
                d={currentPath}
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2.5"
                strokeDasharray="4 4"
              />

              {/* Line 2: Optimized Path */}
              <path
                d={optimizedPath}
                fill="none"
                stroke="#059669"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Highlight Circle on Selected Year */}
              {currentPoint && (
                <g>
                  <circle
                    cx={getX(currentPoint.year)}
                    cy={getY(currentPoint.optimizedTrajectory)}
                    r="6"
                    fill="#059669"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    className="shadow-md"
                  />
                  <circle
                    cx={getX(currentPoint.year)}
                    cy={getY(currentPoint.currentTrajectory)}
                    r="5"
                    fill="#94a3b8"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Selected Horizon Deep Dive Metrics */}
        {currentPoint && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 block">
                At Year {currentPoint.year} (Current Habit)
              </span>
              <span className="text-xl font-bold text-slate-700 mt-1 block">
                {formatINR(currentPoint.currentTrajectory)}
              </span>
              <span className="text-2xs text-slate-400 mt-1 block">
                Interest earned: {formatINR(currentPoint.interestEarnedCurrent)}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-xs font-semibold text-emerald-800 block">
                At Year {currentPoint.year} (ArthSetu Optimized)
              </span>
              <span className="text-xl font-black text-emerald-900 mt-1 block">
                {formatINR(currentPoint.optimizedTrajectory)}
              </span>
              <span className="text-2xs text-emerald-700 mt-1 block font-medium">
                Surplus generated: +
                {formatINR(
                  currentPoint.optimizedTrajectory - currentPoint.currentTrajectory
                )}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
              <span className="text-xs font-semibold text-amber-800 block">
                Real Purchasing Power (Inflation ~5.5%)
              </span>
              <span className="text-xl font-bold text-amber-900 mt-1 block">
                {formatINR(currentPoint.inflationAdjustedRealWorth)}
              </span>
              <span className="text-2xs text-amber-700 mt-1 block">
                Adjusted for Indian retail inflation
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Goal Feasibility & Shortfall Analysis */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-800">
              Financial Goals Feasibility Tracker
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Calculated against your timelines
          </span>
        </div>

        {prediction.goalFeasibility.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prediction.goalFeasibility.map((goal) => (
              <div
                key={goal.goalId}
                className={`p-4 rounded-xl border transition-all ${
                  goal.isAchievableOptimized
                    ? 'bg-emerald-50/70 border-emerald-200'
                    : 'bg-amber-50/70 border-amber-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-slate-900 text-sm">{goal.title}</div>
                  <span
                    className={`inline-flex items-center gap-1 text-2xs font-extrabold px-2 py-0.5 rounded-full uppercase ${
                      goal.isAchievableOptimized
                        ? 'bg-emerald-200 text-emerald-900'
                        : 'bg-amber-200 text-amber-900'
                    }`}
                  >
                    {goal.isAchievableOptimized ? (
                      <>
                        <CheckCircle className="w-3 h-3" /> Achievable
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3" /> Shortfall
                      </>
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Target:</span>
                    <span className="font-extrabold text-slate-900">
                      {formatINR(goal.targetAmount)} in {goal.targetYears} yrs
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Projected (Optimized):</span>
                    <span className="font-extrabold text-emerald-800">
                      {formatINR(goal.optimizedProjected)}
                    </span>
                  </div>
                </div>

                <div className="mt-3 text-xs bg-white/90 p-2.5 rounded-lg border border-slate-200/60 text-slate-700">
                  <span className="font-bold text-slate-900 mr-1">Roadmap:</span>
                  {goal.recommendation}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 text-center">
            No active financial goals added. Click &quot;Edit Profile&quot; to set targets like child education, home purchase, or store expansion!
          </div>
        )}
      </div>
    </div>
  );
};
