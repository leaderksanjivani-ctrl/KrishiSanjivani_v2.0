/* Live weather powered by Open-Meteo; no API key is required. */
(function () {
  const defaultCoords = (window.APP_CONFIG && APP_CONFIG.defaultLocation) || { lat: 19.076, lng: 72.8777 };
  const weatherLabels = { 0: ['Clear sky', '☀️'], 1: ['Mainly clear', '🌤️'], 2: ['Partly cloudy', '⛅'], 3: ['Overcast', '☁️'], 45: ['Foggy', '🌫️'], 51: ['Light drizzle', '🌦️'], 61: ['Rain', '🌧️'], 71: ['Snow', '🌨️'], 80: ['Rain showers', '🌧️'], 95: ['Thunderstorm', '⛈️'] };

  function coordsFromProfile(profile) {
    return profile?.location?.lat && profile.location.lng ? profile.location : defaultCoords;
  }

  async function loadLiveWeather() {
    let profile = null;
    try {
      if (window.auth?.currentUser && window.db) {
        const snap = await db.collection(COLLECTIONS.users).doc(auth.currentUser.uid).get();
        profile = snap.exists ? snap.data() : null;
      }
    } catch (error) { console.warn('Weather profile lookup failed', error); }
    const coords = coordsFromProfile(profile);
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=5&timezone=auto`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Weather request failed');
      const data = await response.json();
      renderWeather(data, profile?.location?.name || profile?.locationText || 'Your farm location');
    } catch (error) {
      document.getElementById('w-current-desc').textContent = 'Weather unavailable';
      document.getElementById('w-current-meta').textContent = 'Please try again when you have a connection.';
      console.warn('Live weather error:', error);
    }
  }

  function renderWeather(data, locationName) {
    const current = data.current || {};
    const [description, icon] = weatherLabels[current.weather_code] || ['Current conditions', '☀️'];
    document.getElementById('w-location-name').textContent = locationName;
    document.getElementById('w-current-icon').textContent = icon;
    document.getElementById('w-current-temp').textContent = `${Math.round(current.temperature_2m)}°C`;
    document.getElementById('w-current-desc').textContent = description;
    document.getElementById('w-current-meta').textContent = `Humidity: ${current.relative_humidity_2m ?? '--'}% · Wind: ${Math.round(current.wind_speed_10m ?? 0)} km/h`;
    document.getElementById('weather-alert').style.display = (current.weather_code >= 51) ? 'flex' : 'none';
    document.getElementById('read-weather-btn').onclick = () => readAloud(`${locationName}. ${description}. Temperature ${Math.round(current.temperature_2m)} degrees Celsius. Humidity ${current.relative_humidity_2m} percent.`);

    const dates = data.daily?.time || [];
    const grid = document.getElementById('weather-forecast-grid');
    grid.innerHTML = dates.map((date, index) => {
      const code = data.daily.weather_code[index];
      const [label, dayIcon] = weatherLabels[code] || ['Mixed conditions', '🌤️'];
      const day = index === 0 ? 'Today' : new Date(`${date}T12:00:00`).toLocaleDateString(currentLang || 'en-IN', { weekday: 'short' });
      return `<div class="weather-day-card ${index === 0 ? 'today' : ''}"><strong>${day}</strong><div style="font-size:2.5rem">${dayIcon}</div><strong style="font-size:18px">${Math.round(data.daily.temperature_2m_max[index])}°C</strong><span style="font-size:11px;color:var(--c-text-muted)">Low: ${Math.round(data.daily.temperature_2m_min[index])}°C</span><div style="font-size:11px;background:var(--c-bg);padding:2px 6px;border-radius:4px;margin-top:4px">${label} · ${data.daily.precipitation_probability_max[index] ?? 0}% rain</div></div>`;
    }).join('');
  }

  window.loadLiveWeather = loadLiveWeather;
  document.addEventListener('DOMContentLoaded', loadLiveWeather);
})();
