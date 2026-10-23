import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  HeartPulse,
  TrendingUp,
  Compass,
  Landmark,
  ListChecks,
  Bot,
  Volume2,
  VolumeX,
  Sparkles,
  Info,
} from 'lucide-react';
import { UserProfile, LanguageCode, GovernmentScheme } from './types';
import { INDIAN_PERSONAS } from './data/personas';
import { I18N_DICT } from './data/i18n';
import { evaluateUserSchemes } from './data/schemes';
import {
  calculateFinancialHealthScore,
  calculateRiskAnalysis,
  calculateFinancialPrediction,
} from './utils/finance';

import { Header } from './components/Header';
import { HealthScoreCard } from './components/HealthScoreCard';
import { PredictionForecast } from './components/PredictionForecast';
import { RiskAnalysisCard } from './components/RiskAnalysisCard';
import { GovernmentSchemesView } from './components/GovernmentSchemesView';
import { ActionableRecommendations } from './components/ActionableRecommendations';
import { AIAdvisorDrawer } from './components/AIAdvisorDrawer';
import { ProfileEditorModal } from './components/ProfileEditorModal';

type ActiveTab = 'health' | 'prediction' | 'risk' | 'schemes' | 'action' | 'ai';

export default function App() {
  // Current active persona / profile
  const [currentProfile, setCurrentProfile] = useState<UserProfile>(INDIAN_PERSONAS[0]);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('en');
  const [activeTab, setActiveTab] = useState<ActiveTab>('health');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [monthlySavingsBoost, setMonthlySavingsBoost] = useState<number>(2000);

  // Audio voice guidance state
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [voiceSpeechText, setVoiceSpeechText] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Check URL query params for ?autostart=1 or tab switching
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') as ActiveTab;
    if (tabParam && ['health', 'prediction', 'risk', 'schemes', 'action', 'ai'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  // Update language when switching persona
  const handleSelectPersona = (p: UserProfile) => {
    setCurrentProfile(p);
    setSelectedLanguage(p.preferredLanguage || 'en');
    stopAudio();
  };

  // Recalculate financial engine models dynamically
  const healthScore = useMemo(() => {
    return calculateFinancialHealthScore(currentProfile);
  }, [currentProfile]);

  const riskAnalysis = useMemo(() => {
    return calculateRiskAnalysis(currentProfile);
  }, [currentProfile]);

  const prediction = useMemo(() => {
    return calculateFinancialPrediction(currentProfile, riskAnalysis, monthlySavingsBoost);
  }, [currentProfile, riskAnalysis, monthlySavingsBoost]);

  const evaluatedSchemes = useMemo(() => {
    return evaluateUserSchemes(currentProfile);
  }, [currentProfile]);

  const t = I18N_DICT[selectedLanguage] || I18N_DICT.en;

  // Text-to-Speech handler: attempts server Gemini TTS, falls back to Web Speech API
  const speakText = async (textToSpeak: string) => {
    stopAudio();
    setIsVoicePlaying(true);
    setVoiceSpeechText(textToSpeak.slice(0, 300) + '...');

    try {
      // 1. Attempt Gemini TTS from server route
      const response = await fetch('/api/ai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSpeak.slice(0, 450) }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.audioUrl) {
          const audio = new Audio(data.audioUrl);
          audioRef.current = audio;
          audio.onended = () => {
            setIsVoicePlaying(false);
            setVoiceSpeechText('');
          };
          audio.onerror = () => {
            fallbackWebSpeech(textToSpeak);
          };
          await audio.play();
          return;
        }
      }
      fallbackWebSpeech(textToSpeak);
    } catch {
      fallbackWebSpeech(textToSpeak);
    }
  };

  const fallbackWebSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      // Select matching regional voice if available
      const voices = window.speechSynthesis.getVoices();
      const langCode = selectedLanguage === 'hi' ? 'hi-IN' : 'en-IN';
      const matchedVoice = voices.find((v) => v.lang === langCode || v.lang.startsWith(langCode));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onend = () => {
        setIsVoicePlaying(false);
        setVoiceSpeechText('');
      };
      utterance.onerror = () => {
        setIsVoicePlaying(false);
        setVoiceSpeechText('');
      };

      window.speechSynthesis.speak(utterance);
    } else {
      setIsVoicePlaying(false);
      setVoiceSpeechText('');
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsVoicePlaying(false);
    setVoiceSpeechText('');
  };

  const handleToggleGeneralVoiceBriefing = () => {
    if (isVoicePlaying) {
      stopAudio();
      return;
    }

    const eligibleList = evaluatedSchemes
      .filter((s) => s.matchStatus === 'eligible')
      .slice(0, 3)
      .map((s) => s.name)
      .join(', ');

    const briefing =
      selectedLanguage === 'hi'
        ? `नमस्ते ${currentProfile.name} जी। आपका वित्तीय स्कोर 100 में से ${healthScore.totalScore} है। आपकी मासिक बचत ₹${healthScore.monthlySavings.toLocaleString('en-IN')} है। आपके लिए प्रधानमंत्री सुरक्षा बीमा योजना और अटल पेंशन योजना जैसी सरकारी योजनाएं तुरंत शुरू करने योग्य हैं। आपातकालीन बचत को प्राथमिकता दें।`
        : `Hello ${currentProfile.name}. Your financial health score is ${healthScore.totalScore} out of 100. Your monthly savings surplus is ₹${healthScore.monthlySavings.toLocaleString('en-IN')}. Eligible government schemes include ${eligibleList}. Check the action checklist for budget optimization.`;

    speakText(briefing);
  };

  const handlePlaySchemeAudio = (scheme: GovernmentScheme) => {
    const text =
      selectedLanguage === 'hi'
        ? `${scheme.name}। ${scheme.hindiName}। यह योजना ${scheme.targetAudience} के लिए है। मुख्य लाभ: ${scheme.keyBenefits[0]}। पात्रता स्थिति: ${scheme.matchReason}`
        : `${scheme.name}. ${scheme.description} Cost is ${scheme.costOrInterest}. Key benefit: ${scheme.keyBenefits[0]}. Your eligibility: ${scheme.matchReason}`;

    speakText(text);
  };

  const tabs: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'health', label: t.financialHealth, icon: HeartPulse },
    { id: 'prediction', label: t.predictions, icon: TrendingUp },
    { id: 'risk', label: t.riskAnalysis, icon: Compass },
    { id: 'schemes', label: t.govtSchemes, icon: Landmark },
    { id: 'action', label: t.recommendations, icon: ListChecks },
    { id: 'ai', label: t.aiAdvisor, icon: Bot },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Application Header */}
      <Header
        currentProfile={currentProfile}
        onSelectPersona={handleSelectPersona}
        onEditProfileClick={() => setIsEditorOpen(true)}
        onToggleVoiceGuidance={handleToggleGeneralVoiceBriefing}
        isVoicePlaying={isVoicePlaying}
        selectedLanguage={selectedLanguage}
        onChangeLanguage={setSelectedLanguage}
      />

      {/* Voice Playback Sticky Banner */}
      {isVoicePlaying && (
        <div className="bg-amber-600 text-white px-4 py-2.5 shadow-md flex items-center justify-between gap-3 text-xs z-30 sticky top-18 sm:top-20 animate-in fade-in-50">
          <div className="flex items-center gap-2 overflow-hidden">
            <Volume2 className="w-4 h-4 shrink-0 animate-pulse text-amber-200" />
            <span className="font-bold shrink-0">Voice Guide Playing:</span>
            <span className="truncate opacity-90">{voiceSpeechText}</span>
          </div>
          <button
            onClick={stopAudio}
            className="px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded-lg font-bold shrink-0 text-white flex items-center gap-1 transition-colors"
          >
            <VolumeX className="w-3.5 h-3.5" />
            <span>Stop</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 border-b border-slate-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-700/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.id === 'schemes' && (
                  <span
                    className={`ml-1 text-2xs px-1.5 py-0.2 rounded-full font-extrabold ${
                      isActive ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {evaluatedSchemes.filter((s) => s.matchStatus === 'eligible').length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        <div className="transition-all duration-200">
          {activeTab === 'health' && (
            <HealthScoreCard
              health={healthScore}
              profile={currentProfile}
              language={selectedLanguage}
            />
          )}

          {activeTab === 'prediction' && (
            <PredictionForecast
              prediction={prediction}
              profile={currentProfile}
              language={selectedLanguage}
              monthlySavingsBoost={monthlySavingsBoost}
              onSavingsBoostChange={setMonthlySavingsBoost}
            />
          )}

          {activeTab === 'risk' && (
            <RiskAnalysisCard
              risk={riskAnalysis}
              profile={currentProfile}
              language={selectedLanguage}
            />
          )}

          {activeTab === 'schemes' && (
            <GovernmentSchemesView
              schemes={evaluatedSchemes}
              profile={currentProfile}
              language={selectedLanguage}
              onPlaySchemeAudio={handlePlaySchemeAudio}
            />
          )}

          {activeTab === 'action' && (
            <ActionableRecommendations
              profile={currentProfile}
              health={healthScore}
              language={selectedLanguage}
            />
          )}

          {activeTab === 'ai' && (
            <AIAdvisorDrawer
              profile={currentProfile}
              language={selectedLanguage}
              schemes={evaluatedSchemes}
              onSpeakText={speakText}
            />
          )}
        </div>
      </main>

      {/* Profile Customization Modal */}
      <ProfileEditorModal
        profile={currentProfile}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={(updated) => {
          setCurrentProfile(updated);
          stopAudio();
        }}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 space-y-1">
          <p className="font-semibold text-slate-700">
            ArthSetu (अर्थसेतु) • AI-Driven Wealth Management & Financial Inclusion Platform
          </p>
          <p>
            Supporting Tier-1, Tier-2, and Tier-3 Indian ecosystems: Students, Salaried Workers, Kirana Stores, Self-Employed & Artisans.
          </p>
          <p className="text-2xs text-slate-400">
            Formulas adhere to RBI guidelines, PFRDA, Postal Life Insurance, and Ministry of Finance mandates.
          </p>
        </div>
      </footer>
    </div>
  );
}
