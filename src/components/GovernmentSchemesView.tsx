import React, { useState } from 'react';
import {
  Landmark,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileText,
  Volume2,
  X,
  BadgeIndianRupee,
  ShieldCheck,
  Award,
  Filter,
} from 'lucide-react';
import { GovernmentScheme, UserProfile, LanguageCode } from '../types';
import { I18N_DICT } from '../data/i18n';

interface GovernmentSchemesViewProps {
  schemes: GovernmentScheme[];
  profile: UserProfile;
  language: LanguageCode;
  onPlaySchemeAudio: (scheme: GovernmentScheme) => void;
}

export const GovernmentSchemesView: React.FC<GovernmentSchemesViewProps> = ({
  schemes,
  profile,
  language,
  onPlaySchemeAudio,
}) => {
  const t = I18N_DICT[language] || I18N_DICT.en;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSchemeForModal, setSelectedSchemeForModal] = useState<GovernmentScheme | null>(null);

  // Filter schemes by search and category
  const filteredSchemes = schemes.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.hindiName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.shortCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.targetAudience.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || s.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', label: 'All Schemes' },
    { id: 'insurance', label: 'Insurance & Healthcare' },
    { id: 'pension', label: 'Pension (APY)' },
    { id: 'savings', label: 'Savings & Deposits (PPF/POMIS)' },
    { id: 'loan', label: 'Business Loans (MUDRA)' },
    { id: 'scholarship', label: 'Scholarships (NSP)' },
  ];

  return (
    <div className="space-y-6">
      {/* Search & Category Filter Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-100">
              <Landmark className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {t.govtSchemes} (Sarkari Welfare & Financial Inclusion)
              </h2>
              <p className="text-xs text-slate-500">
                Personalized eligibility for PMJDY, PMJJBY, PMSBY, APY, PPF, POMIS, MUDRA, and Scholarships.
              </p>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search scheme name or benefit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSchemes.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Header Badges */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md text-2xs font-extrabold uppercase bg-slate-100 text-slate-700">
                    {scheme.shortCode}
                  </span>
                  <span className="text-2xs text-slate-400 uppercase font-semibold">
                    {scheme.category.replace('_', ' ')}
                  </span>
                </div>

                {/* Match Status Badge */}
                <span
                  className={`inline-flex items-center gap-1 text-2xs font-extrabold px-2.5 py-0.5 rounded-full ${
                    scheme.matchStatus === 'eligible'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : scheme.matchStatus === 'likely_eligible'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {scheme.matchStatus === 'eligible' ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {t.eligible}
                    </>
                  ) : scheme.matchStatus === 'likely_eligible' ? (
                    <>
                      <AlertCircle className="w-3 h-3 text-amber-600" />
                      {t.likelyEligible}
                    </>
                  ) : (
                    <>
                      <HelpCircle className="w-3 h-3 text-slate-400" />
                      {t.notEligible}
                    </>
                  )}
                </span>
              </div>

              {/* Title & Indian script Name */}
              <h3 className="text-base font-bold text-slate-900 mt-2">
                {scheme.name}
              </h3>
              <p className="text-xs text-amber-700 font-medium">
                {scheme.hindiName}
              </p>

              {/* Cost / Interest highlight */}
              <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-700 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                <BadgeIndianRupee className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{scheme.costOrInterest}</span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                {scheme.description}
              </p>

              {/* Eligibility Match Verdict */}
              <div className="mt-3 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 text-slate-700">
                <span className="font-bold text-slate-900 mr-1">Eligibility Verdict:</span>
                {scheme.matchReason}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedSchemeForModal(scheme)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Full Guide & Documents</span>
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onPlaySchemeAudio(scheme)}
                  aria-label={`Listen to audio explanation of ${scheme.name}`}
                  className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors border border-slate-200"
                  title="Listen to audio explanation"
                >
                  <Volume2 className="w-4 h-4" />
                </button>

                <a
                  href={scheme.officialPortal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  <span>Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSchemes.length === 0 && (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
          No government schemes found matching &quot;{searchTerm}&quot;. Try resetting your filters.
        </div>
      )}

      {/* Scheme Detail & Application Guide Modal */}
      {selectedSchemeForModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="px-2 py-0.5 rounded text-2xs font-extrabold uppercase bg-emerald-100 text-emerald-800">
                  {selectedSchemeForModal.shortCode}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedSchemeForModal.name}
                </h3>
                <p className="text-xs text-amber-700 font-semibold">
                  {selectedSchemeForModal.hindiName}
                </p>
              </div>
              <button
                onClick={() => setSelectedSchemeForModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Key Benefits */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t.keyBenefits}
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {selectedSchemeForModal.keyBenefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Application Walkthrough */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Step-by-Step Application Procedure
              </h4>
              <ol className="space-y-2 text-xs text-slate-700">
                {selectedSchemeForModal.applicationSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-2xs font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <span className="mt-0.5 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Required Documents */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t.documentsNeeded}
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedSchemeForModal.documentsRequired.map((doc, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-lg"
                  >
                    📄 {doc}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => onPlaySchemeAudio(selectedSchemeForModal)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                <Volume2 className="w-4 h-4 text-emerald-600" />
                <span>Listen Audio Guide</span>
              </button>

              <a
                href={selectedSchemeForModal.officialPortal}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs"
              >
                <span>Visit Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
