import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    aiEnabled: Boolean(ai),
    timestamp: new Date().toISOString(),
  });
});

// Endpoint: AI Financial Advisor Chat & Recommendations
app.post('/api/ai/advise', async (req, res) => {
  try {
    const { profile, question, language, schemes } = req.body;

    if (!profile) {
      return res.status(400).json({ error: 'User profile is required.' });
    }

    const langName =
      language === 'hi'
        ? 'Hindi (हिंदी)'
        : language === 'ta'
        ? 'Tamil (தமிழ்)'
        : language === 'te'
        ? 'Telugu (తెలుగు)'
        : language === 'mr'
        ? 'Marathi (मराठी)'
        : language === 'bn'
        ? 'Bengali (বাংলা)'
        : 'English';

    const systemInstruction = `You are "ArthSetu AI" (अर्थसेतु), a dedicated senior Indian Financial Inclusion & Wealth Advisor.
You specialize in empowering users across India's Tier-1, Tier-2, and Tier-3 ecosystems—especially students, salaried workers, shopkeepers/kirana owners, artisans, and women self-help entrepreneurs.
Your guidance is empathetic, realistic, actionable, and grounded in Indian reality (INR ₹, Lakhs, Crores, RBI rules, SEBI safety, EPFO, Postal schemes, and Government welfare).
Always provide:
1. Direct, clear assessment of their current budget and savings health.
2. 3 concrete action steps they can take this week.
3. Relevant Government Schemes (such as PMJDY, PMJJBY, PMSBY, APY, PPF, POMIS, Mudra, SSY, NSP) with specific reasons why they qualify.
4. Keep the language simple, encouraging, respectful, avoiding complex financial jargon.
Reply in the requested language: ${langName}. If the requested language is Hindi, use clear Devnagari script or Hinglish where natural.`;

    const userPrompt = `User Profile Overview:
- Name: ${profile.name || 'User'}
- Age: ${profile.age} years
- Occupation: ${profile.occupation}
- Location: ${profile.city} (${profile.tier} Indian city)
- Monthly Income: ₹${profile.monthlyIncome?.toLocaleString('en-IN')}
- Family Dependents: ${profile.familyDependents || 0}
- Current Expenses: ₹${JSON.stringify(profile.expenses)}
- Liquid Savings: ₹${JSON.stringify(profile.savings)}
- Current Investments: ₹${JSON.stringify(profile.investments)}
- Active Debts/EMIs: ${JSON.stringify(profile.debts || [])}
- Key Goals: ${JSON.stringify(profile.goals || [])}
- Filtered Schemes: ${(schemes || []).map((s: any) => s.shortCode || s.name).join(', ')}

User's Specific Query:
"${question || 'Provide a comprehensive financial diagnosis, overspending check, and government scheme roadmap for my family.'}"`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userPrompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return res.json({
        reply: response.text || 'Unable to generate response at this moment.',
        source: 'gemini-3.8-flash',
      });
    }

    // High quality local fallback if API key is not yet set
    const fallbackMessage = generateLocalRuleBasedAdvisory(profile, language);
    return res.json({
      reply: fallbackMessage,
      source: 'rule-engine-fallback',
    });
  } catch (error: any) {
    console.error('Error generating AI advice:', error);
    // Provide graceful fallback
    const fallback = generateLocalRuleBasedAdvisory(req.body.profile, req.body.language);
    res.json({
      reply: fallback,
      source: 'rule-engine-fallback',
      notice: 'Fallback triggered due to API connectivity',
    });
  }
});

// Endpoint: AI Audio TTS for financial briefings
app.post('/api/ai/tts', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required for TTS.' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API is not configured on the server. Use client Web Speech API fallback.',
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.slice(0, 500), // Keep concise for audio clip
              speechMetadata: {
                style: 'Empathetic, clear, and reassuring Indian financial advisor',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return res.json({
        audioUrl: `data:audio/wav;base64,${base64Audio}`,
      });
    }

    return res.status(500).json({ error: 'No audio generated by model' });
  } catch (err: any) {
    console.warn('TTS API error:', err.message);
    res.status(500).json({ error: err.message, useWebSpeech: true });
  }
});

// Rule-based fallback generator for offline or key-less scenarios
function generateLocalRuleBasedAdvisory(profile: any, lang: string): string {
  if (!profile) return 'Please set up your profile to receive financial guidance.';

  const isHindi = lang === 'hi';
  const name = profile.name || 'Friend';
  const income = profile.monthlyIncome || 0;
  const isBusiness = profile.occupation === 'business_owner' || profile.occupation === 'self_employed';
  const isStudent = profile.occupation === 'student';

  if (isHindi) {
    return `नमस्ते ${name} जी! अर्थसेतु (ArthSetu) में आपका स्वागत है।

📍 आपके शहर (${profile.city || 'भारत'}, ${profile.tier}) के अनुसार वित्तीय विश्लेषण:
1. **बचत व बजट**: आपकी मासिक आमदनी ₹${income.toLocaleString('en-IN')} है। टियर-2/3 में कम से कम 25% बचत (₹${Math.round(income * 0.25).toLocaleString('en-IN')}) का लक्ष्य रखें।
2. **सुरक्षा कवच**:
   - **PMSBY (₹20/वर्ष)**: ₹2 लाख का दुर्घटना बीमा तुरंत बैंक से शुरू कराएं।
   - **PMJJBY (₹436/वर्ष)**: परिवार के लिए ₹2 लाख जीवन बीमा जरूर लें।
3. **अगले कदम**:
   ${isStudent ? '- राष्ट्रीय छात्रवृत्ति पोर्टल (NSP) पर अपनी पढ़ाई के लिए वित्तीय अनुदान जांचें।' : ''}
   ${isBusiness ? '- दुकान या व्यवसाय विस्तार के लिए बिना गारंटी वाला **PM Mudra ऋण (किशोर/तरुण)** बैंक से पता करें।' : ''}
   - आपातकाल के लिए 3 महीने के खर्च के बराबर राशि अलग बैंक खाते या डाकघर बचत खाते में रखें।

अर्थसेतु आपकी हर वित्तीय यात्रा में आपके साथ है!`;
  }

  return `Hello ${name}! Welcome to ArthSetu Financial Copilot.

📍 Personalized Analysis for ${profile.city || 'your city'} (${profile.tier}):
1. **Budget & Surplus**: With your monthly income of ₹${income.toLocaleString('en-IN')}, aim for a minimum ${profile.tier === 'Tier-1' ? '20%' : '25%'} disciplined savings habit.
2. **Sarkari Safety Net**:
   - **PMSBY (₹20/year)**: Avail ₹2 Lakh accidental security from your savings bank.
   - **PMJJBY (₹436/year)**: Ensure ₹2 Lakh life coverage for your family.
3. **Action Steps**:
   ${isStudent ? '• Check National Scholarship Portal (NSP) for educational assistance.' : ''}
   ${isBusiness ? '• Look into collateral-free PM MUDRA Loans (Shishu/Kishore) for working capital.' : ''}
   • Build a 3-month emergency reserve before taking risky market exposures.
   • Allocate surplus into Public Provident Fund (PPF) for guaranteed 7.1% tax-free compound returns.`;
}

// Dev & Production serving
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ArthSetu server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
