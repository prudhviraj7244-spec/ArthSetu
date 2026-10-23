import React from 'react';
import {
  Wallet,
  Sparkles,
  Volume2,
  VolumeX,
  UserCheck,
  Edit3,
  MapPin,
  Globe2,
  ChevronDown,
} from 'lucide-react';
import { UserProfile, LanguageCode, TierLevel } from '../types';
import { I18N_DICT } from '../data/i18n';
import { INDIAN_PERSONAS } from '../data/personas';

interface HeaderProps {
  currentProfile: UserProfile;
  onSelectPersona: (persona: UserProfile) => void;
  onEditProfileClick: () => void;
  onToggleVoiceGuidance: () => void;
  isVoicePlaying: boolean;
  selectedLanguage: LanguageCode;
  onChangeLanguage: (lang: LanguageCode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentProfile,
  onSelectPersona,
  onEditProfileClick,
  onToggleVoiceGuidance,
  isVoicePlaying,
  selectedLanguage,
  onChangeLanguage,
}) => {
  const t = I18N_DICT[selectedLanguage] || I18N_DICT.en;

  const languages: { code: LanguageCode; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी (Hindi)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'mr', label: 'मराठी (Marathi)' },
    { code: 'bn', label: 'বাংলা (Bengali)' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-3">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight">अ</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  Arth<span className="text-emerald-600">Setu</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                  अर्थसेतु AI
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block">
                Personalized Wealth & Financial Inclusion in India’s Multi-Tier Ecosystem
              </p>
            </div>
          </div>

          {/* Quick Actions, Persona & Language Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Persona Switcher */}
            <div className="relative group">
              <div className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 transition-colors px-2 sm:px-3 py-1.5 rounded-lg border border-slate-200 cursor-pointer text-slate-800 text-xs sm:text-sm font-medium">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="hidden sm:inline font-semibold">{currentProfile.name}</span>
                <span className="sm:hidden font-semibold">{currentProfile.name.split(' ')[0]}</span>
                <span className="text-slate-400 text-2xs sm:text-xs">({currentProfile.tier.replace('Tier-', 'T')})</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>

              {/* Dropdown menu */}
              <div className="absolute right-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1 hidden group-hover:block hover:block z-50 animate-in fade-in-50 duration-150">
                <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  {t.selectPersona}
                </div>
                {INDIAN_PERSONAS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onSelectPersona(p)}
                    className={`w-full text-left px-3 py-2 text-xs sm:text-sm hover:bg-emerald-50/60 transition-colors flex items-center justify-between ${
                      p.id === currentProfile.id ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-xs text-slate-500 capitalize">
                        {p.occupation.replace('_', ' ')} • {p.city} ({p.tier})
                      </div>
                    </div>
                    <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      ₹{(p.monthlyIncome / 1000).toFixed(0)}k/m
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Edit Profile Button */}
            <button
              onClick={onEditProfileClick}
              aria-label="Edit user profile data"
              className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm font-medium px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">{t.editProfile}</span>
            </button>

            {/* Voice Guidance Audio Trigger */}
            <button
              onClick={onToggleVoiceGuidance}
              aria-label={isVoicePlaying ? t.stopAudio : t.listenExplanation}
              className={`flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-2.5 sm:px-3.5 py-1.5 rounded-lg transition-all shadow-xs ${
                isVoicePlaying
                  ? 'bg-amber-600 hover:bg-amber-700 text-white animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-700/20'
              }`}
            >
              {isVoicePlaying ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span className="hidden sm:inline">{t.stopAudio}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span className="hidden md:inline">{t.listenExplanation}</span>
                  <span className="md:hidden">Audio</span>
                </>
              )}
            </button>

            {/* Language Switcher */}
            <div className="relative group">
              <button
                aria-label="Change language"
                className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs sm:text-sm font-medium px-2 sm:px-2.5 py-1.5 rounded-lg transition-colors"
              >
                <Globe2 className="w-3.5 h-3.5 text-slate-600" />
                <span className="uppercase text-xs font-bold">{selectedLanguage}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1 hidden group-hover:block hover:block z-50">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => onChangeLanguage(l.code)}
                    className={`w-full text-left px-3 py-1.5 text-xs sm:text-sm hover:bg-slate-100 transition-colors flex items-center justify-between ${
                      l.code === selectedLanguage ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-slate-700'
                    }`}
                  >
                    <span>{l.label}</span>
                    {l.code === selectedLanguage && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
