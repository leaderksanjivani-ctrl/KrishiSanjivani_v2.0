// ============================================================
// KrishiSanjivani — Demand Forecasting (Moving Average + Linear Trend)
// ============================================================

function movingAverage(values, window = 3) {
  const result = [];
  for (let i = 0; i < values.length; i++) {
    const start = Math.max(0, i - window + 1);
    const slice = values.slice(start, i + 1);
    result.push(slice.reduce((a, b) => a + b, 0) / slice.length);
  }
  return result;
}

function linearRegression(y) {
  const n = y.length;
  const x = Array.from({ length: n }, (_, i) => i);
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
  const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);
  const denom = n * sumX2 - sumX * sumX;
  if (denom === 0) return { slope: 0, intercept: sumY / n };
  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
}

function forecastNext(values, periods = 7) {
  if (values.length < 2) return Array(periods).fill(values[0] || 0);
  const { slope, intercept } = linearRegression(values);
  const n = values.length;
  return Array.from({ length: periods }, (_, i) => {
    const raw = intercept + slope * (n + i);
    return Math.max(0, Math.round(raw));
  });
}

function percentChange(oldVal, newVal) {
  if (oldVal === 0) return 0;
  return ((newVal - oldVal) / oldVal * 100).toFixed(1);
}

async function getDemandForecast(crop, region = 'all') {
  // Try to get real data from Firestore
  try {
    const snap = await db.collection(COLLECTIONS.priceHistory)
      .doc(crop.toLowerCase())
      .collection('daily')
      .orderBy('date', 'desc')
      .limit(30)
      .get();

    if (!snap.empty) {
      const historical = snap.docs.reverse().map(d => d.data().quantity || d.data().avgPrice || 0);
      const smoothed = movingAverage(historical, 5);
      const forecast = forecastNext(smoothed, 7);
      const currentAvg = smoothed[smoothed.length - 1];
      const forecastAvg = forecast.reduce((a, b) => a + b, 0) / forecast.length;
      const change = percentChange(currentAvg, forecastAvg);
      return { historical: smoothed.slice(-14), forecast, change, crop };
    }
  } catch (e) {
    console.warn('Forecast DB error:', e);
  }

  // Fallback: generate realistic mock data
  return generateMockForecast(crop);
}

function generateMockForecast(crop) {
  const base = MOCK_PRICES[crop.toLowerCase()]?.avg || 30;
  const historical = Array.from({ length: 14 }, (_, i) => {
    const noise = (Math.random() - 0.5) * base * 0.15;
    const trend = i * 0.3;
    return Math.max(1, Math.round(base + noise + trend));
  });
  const smoothed = movingAverage(historical, 3);
  const forecast = forecastNext(smoothed, 7);
  const currentAvg = smoothed[smoothed.length - 1];
  const forecastAvg = forecast.reduce((a, b) => a + b, 0) / forecast.length;
  const change = percentChange(currentAvg, forecastAvg);
  return { historical: smoothed, forecast, change: parseFloat(change), crop };
}

function renderForecastChart(canvasId, data, cropName) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  const histLabels = Array.from({ length: data.historical.length }, (_, i) => `-${data.historical.length - i}d`);
  const foreLabels = Array.from({ length: data.forecast.length }, (_, i) => `+${i + 1}d`);

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: [...histLabels, ...foreLabels],
      datasets: [
        {
          label: `${cropName} - Historical (₹)`,
          data: [...data.historical, ...Array(data.forecast.length).fill(null)],
          borderColor: '#138808',
          backgroundColor: 'rgba(19,136,8,0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 3
        },
        {
          label: `${cropName} - Forecast (₹)`,
          data: [...Array(data.historical.length).fill(null), ...data.forecast],
          borderColor: '#FF6B00',
          backgroundColor: 'rgba(255,107,0,0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          borderDash: [6, 3],
          pointRadius: 3,
          pointStyle: 'triangle'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            label: ctx => `₹${ctx.raw?.toFixed(1) || 'N/A'}`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          ticks: { callback: v => `₹${v}` }
        }
      }
    }
  });
}
