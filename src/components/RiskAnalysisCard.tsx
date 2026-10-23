import React from 'react';
import {
  Compass,
  PieChart,
  GitBranch,
  ShieldAlert,
  ShieldCheck,
  Check,
  Sparkles,
  Info,
} from 'lucide-react';
import { RiskAnalysis, UserProfile, LanguageCode } from '../types';
import { I18N_DICT } from '../data/i18n';

interface RiskAnalysisCardProps {
  risk: RiskAnalysis;
  profile: UserProfile;
  language: LanguageCode;
}

export const RiskAnalysisCard: React.FC<RiskAnalysisCardProps> = ({
  risk,
  profile,
  language,
}) => {
  const t = I18N_DICT[language] || I18N_DICT.en;
  const alloc = risk.recommendedAssetAllocation;

  return (
    <div className="space-y-6">
      {/* Risk Profile Classification Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100">
              <Compass className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                  Random Forest Risk Classification
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-black bg-indigo-100 text-indigo-900">
                  Score: {risk.riskScore}/100
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mt-0.5">
                {risk.riskCategory}
              </h2>
            </div>
          </div>

          <div className="text-xs text-slate-500 max-w-sm bg-slate-50 p-3 rounded-xl border border-slate-200">
            {risk.description}
          </div>
        </div>

        {/* Recommended Indian Asset Allocation (Stacked Bar) */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">{t.recommendedAllocation}</span>
            <span className="text-slate-400">Total: 100% portfolio balance</span>
          </div>

          {/* Stacked Bar */}
          <div className="w-full h-5 rounded-xl overflow-hidden flex bg-slate-100 shadow-inner">
            <div
              style={{ width: `${alloc.equityMutualFunds}%` }}
              className="bg-emerald-600 h-full transition-all duration-700"
              title={`Equity SIP: ${alloc.equityMutualFunds}%`}
            />
            <div
              style={{ width: `${alloc.debtAndGovtSchemes}%` }}
              className="bg-indigo-600 h-full transition-all duration-700"
              title={`Govt & Debt (PPF): ${alloc.debtAndGovtSchemes}%`}
            />
            <div
              style={{ width: `${alloc.digitalGoldOrPhysical}%` }}
              className="bg-amber-500 h-full transition-all duration-700"
              title={`Gold: ${alloc.digitalGoldOrPhysical}%`}
            />
            <div
              style={{ width: `${alloc.liquidEmergencyCash}%` }}
              className="bg-teal-400 h-full transition-all duration-700"
              title={`Liquid Cash: ${alloc.liquidEmergencyCash}%`}
            />
          </div>

          {/* Legend Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                {t.equitySIP}
              </div>
              <span className="text-xl font-black text-emerald-950 mt-1 block">
                {alloc.equityMutualFunds}%
              </span>
              <span className="text-2xs text-slate-500">Long-term index compounding</span>
            </div>

            <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200">
              <div className="flex items-center gap-1.5 text-xs text-indigo-800 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                {t.debtGovt}
              </div>
              <span className="text-xl font-black text-indigo-950 mt-1 block">
                {alloc.debtAndGovtSchemes}%
              </span>
              <span className="text-2xs text-slate-500">PPF (7.1%), Post Office, FD</span>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
              <div className="flex items-center gap-1.5 text-xs text-amber-800 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                {t.gold}
              </div>
              <span className="text-xl font-black text-amber-950 mt-1 block">
                {alloc.digitalGoldOrPhysical}%
              </span>
              <span className="text-2xs text-slate-500">Inflation & crisis hedge</span>
            </div>

            <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200">
              <div className="flex items-center gap-1.5 text-xs text-teal-800 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                {t.liquidCash}
              </div>
              <span className="text-xl font-black text-teal-950 mt-1 block">
                {alloc.liquidEmergencyCash}%
              </span>
              <span className="text-2xs text-slate-500">High-yield savings & liquid fund</span>
            </div>
          </div>
        </div>
      </div>

      {/* Random Forest Feature Importance & User Scoring */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-800">
              Random Forest Multi-Factor Decision Breakdown
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Simulated ensemble decision trees
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {risk.randomForestFeatures.map((feat) => (
            <div
              key={feat.feature}
              className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">{feat.feature}</span>
                  <span
                    className={`text-2xs font-extrabold px-1.5 py-0.5 rounded ${
                      feat.impact === 'Positive'
                        ? 'bg-emerald-100 text-emerald-800'
                        : feat.impact === 'Negative'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {feat.impact} Impact
                  </span>
                </div>
                <div className="text-2xs text-slate-400 mt-1">
                  Model Weight: {(feat.importanceWeight * 100).toFixed(0)}%
                </div>
              </div>

              <div className="text-right">
                <span className="text-base font-extrabold text-slate-900 block">
                  {feat.userScore}/100
                </span>
                <span className="text-2xs text-slate-500">Factor Score</span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-xl bg-slate-100/70 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
          <Info className="w-4 h-4 text-slate-500 shrink-0" />
          <span>
            In India’s multi-tier ecosystem, risk tolerance depends heavily on cash flow predictability (e.g. daily/weekly shop sales vs monthly salary) and family dependency.
          </span>
        </div>
      </div>
    </div>
  );
};
