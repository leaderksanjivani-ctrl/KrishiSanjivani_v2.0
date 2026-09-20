// ============================================================
// KrishiSanjivani — General API Routes
// ============================================================

const express = require('express');
const router = express.Router();

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const languageNames = {
  en: 'English', mr: 'Marathi', hi: 'Hindi', gu: 'Gujarati', bn: 'Bengali', ta: 'Tamil',
  te: 'Telugu', kn: 'Kannada', ml: 'Malayalam', pa: 'Punjabi', ur: 'Urdu', or: 'Odia'
};

router.post('/ai/translate', async (req, res, next) => {
  try {
    const { text, targetLanguage = 'en', mode = 'translate' } = req.body || {};
    const target = languageNames[targetLanguage] || languageNames.en;
    if (!text || typeof text !== 'string' || text.length > 8000) return res.status(400).json({ error: 'Text is required and must be under 8000 characters.' });
    if (!process.env.GEMINI_API_KEY) return res.status(503).json({ error: 'Gemini is not configured on the server.' });

    const instruction = mode === 'voice'
      ? `Normalize this speech transcript into one clear sentence in ${target}. Preserve crop names, quantities, units, locations, order IDs, and numbers. Return only the sentence.`
      : `Translate the following user-facing website text into natural ${target}. Preserve numbers, currency, names, URLs, HTML tags, and line breaks. Return only the translated text.`;
    const response = await fetch(`${GEMINI_URL}?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: `${instruction}\n\nTEXT:\n${text}` }] }], generationConfig: { temperature: 0.1, maxOutputTokens: 2048 } })
    });
    const payload = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: payload.error?.message || 'Gemini request failed.' });
    const output = payload.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('').trim();
    if (!output) return res.status(502).json({ error: 'Gemini returned no text.' });
    res.json({ text: output, language: targetLanguage, model: GEMINI_MODEL });
  } catch (error) {
    next(error);
  }
});

// Mandi Price API
router.get('/prices', (req, res) => {
  res.json({
    status: 'success',
    timestamp: new Date().toISOString(),
    prices: {
      tomato: { avg: 32, mandi: 28, unit: 'kg' },
      onion: { avg: 24, mandi: 18, unit: 'kg' },
      potato: { avg: 20, mandi: 15, unit: 'kg' },
      wheat: { avg: 22, mandi: 19, unit: 'kg' },
      rice: { avg: 42, mandi: 36, unit: 'kg' },
      sugarcane: { avg: 320, mandi: 280, unit: 'quintal' },
      cotton: { avg: 6200, mandi: 5800, unit: 'quintal' },
      soybean: { avg: 5100, mandi: 4700, unit: 'quintal' }
    }
  });
});

// App Config API
router.get('/config', (req, res) => {
  res.json({
    appName: 'KrishiSanjivani',
    version: '1.0.0',
    features: {
      directMarketplace: true,
      equipmentRental: true,
      virtualWhatsappAssistant: true,
      voiceAssistant: true,
      demandForecasting: true
    }
  });
});

module.exports = router;
