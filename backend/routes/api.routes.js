// ============================================================
// KrishiSanjivani — General API Routes
// ============================================================

const express = require('express');
const router = express.Router();

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
