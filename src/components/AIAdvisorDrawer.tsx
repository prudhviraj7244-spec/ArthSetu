import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Volume2,
  RefreshCw,
  MessageSquare,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { UserProfile, LanguageCode, GovernmentScheme } from '../types';
import { I18N_DICT } from '../data/i18n';

interface AIAdvisorDrawerProps {
  profile: UserProfile;
  language: LanguageCode;
  schemes: GovernmentScheme[];
  onSpeakText: (text: string) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  source?: string;
  timestamp: string;
}

export const AIAdvisorDrawer: React.FC<AIAdvisorDrawerProps> = ({
  profile,
  language,
  schemes,
  onSpeakText,
}) => {
  const t = I18N_DICT[language] || I18N_DICT.en;

  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text:
        language === 'hi'
          ? `नमस्ते ${profile.name} जी! मैं आपका अर्थसेतु एआई वित्तीय सलाहकार हूँ। आपकी ₹${profile.monthlyIncome.toLocaleString('en-IN')} मासिक आय और ${profile.city} (${profile.tier}) के आधार पर मैं बजट, लोन से मुक्ति और सरकारी योजनाओं (PMJDY, PMJJBY, Mudra आदि) में आपकी मदद कर सकता हूँ। आप मुझसे क्या पूछना चाहते हैं?`
          : `Hello ${profile.name}! I am your ArthSetu AI Financial Copilot. Based on your monthly cash flow of ₹${profile.monthlyIncome.toLocaleString('en-IN')} and living costs in ${profile.city} (${profile.tier}), I can help you optimize savings, clear debt, and navigate government schemes like PMJDY, PMJJBY, APY, PPF, and MUDRA. How can I help you today?`,
      timestamp: 'Just now',
    },
  ]);

  const quickPrompts = [
    'Which government scheme is most urgent for my family right now?',
    'How can I clear my loan EMI faster without starving my savings?',
    'What is the ideal 50/30/20 budget for my city tier?',
    'How should I invest for my family goals with sovereign safety?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const q = textToSend || inputQuestion.trim();
    if (!q || isLoading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuestion('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/advise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          question: q,
          language,
          schemes: schemes.filter((s) => s.matchStatus === 'eligible').slice(0, 5),
        }),
      });

      const data = await res.json();
      const botMsg: Message = {
        id: `b-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Thank you for your question. Please review the dashboard recommendations.',
        source: data.source,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Advisor request failed:', err);
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'Sorry, I encountered a temporary connection issue. Please refer to the rule-based Action Checklist above.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-xs">
            <Sparkles className="w-4 h-4 text-emerald-200" />
          </div>
          <div>
            <h3 className="font-bold text-sm">ArthSetu AI Copilot</h3>
            <p className="text-2xs text-emerald-200">
              Grounded in Indian RBI, Postal, SEBI & Government Welfare Rules
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: 'reset',
                sender: 'assistant',
                text: 'Conversation reset. How can I assist with your finances?',
                timestamp: 'Just now',
              },
            ])
          }
          className="p-1.5 text-emerald-200 hover:text-white rounded-lg transition-colors"
          title="Reset chat"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/60">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 ${
              m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                m.sender === 'user'
                  ? 'bg-slate-800 text-white'
                  : 'bg-emerald-600 text-white shadow-2xs'
              }`}
            >
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed space-y-1.5 ${
                m.sender === 'user'
                  ? 'bg-slate-900 text-white rounded-tr-none'
                  : 'bg-white text-slate-800 border border-slate-200 shadow-2xs rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-line">{m.text}</div>
              <div
                className={`flex items-center justify-between gap-2 text-2xs pt-1 ${
                  m.sender === 'user' ? 'text-slate-400' : 'text-slate-400'
                }`}
              >
                <span>{m.timestamp}</span>
                {m.sender === 'assistant' && (
                  <button
                    onClick={() => onSpeakText(m.text)}
                    className="flex items-center gap-1 text-emerald-700 hover:underline font-semibold"
                    title="Read aloud"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Listen</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200 max-w-xs animate-pulse">
            <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
            <span>Analyzing financial variables & schemes...</span>
          </div>
        )}
      </div>

      {/* Quick Prompt Pills */}
      <div className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 ml-1" />
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(qp)}
            className="text-2xs whitespace-nowrap bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 px-2.5 py-1 rounded-full text-slate-600 transition-colors font-medium shrink-0"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder={
              language === 'hi'
                ? 'अपना प्रश्न यहां लिखें (उदा. मुद्रा लोन कैसे लें)...'
                : 'Ask a financial question (e.g. How to clear debt faster?)...'
            }
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            disabled={isLoading}
            className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputQuestion.trim() || isLoading}
            className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
