// ============================================================
// KrishiSanjivani — Voice (Web Speech API)
// ============================================================

let speechSynth = window.speechSynthesis;
let SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
let currentUtterance = null;
let isReading = false;
let availableVoices = [];

const LANG_SPEECH_CODES = { en: 'en-IN', mr: 'mr-IN', hi: 'hi-IN', gu: 'gu-IN', bn: 'bn-IN', ta: 'ta-IN', te: 'te-IN', kn: 'kn-IN', ml: 'ml-IN', pa: 'pa-IN', ur: 'ur-IN', or: 'or-IN' };

function refreshSpeechVoices() {
  availableVoices = speechSynth?.getVoices?.() || [];
  return availableVoices;
}

function speechVoiceFor(langCode) {
  const voices = refreshSpeechVoices();
  const prefix = langCode.toLowerCase().split('-')[0];
  return voices.find(voice => voice.lang.toLowerCase() === langCode.toLowerCase()) || voices.find(voice => voice.lang.toLowerCase().startsWith(`${prefix}-`)) || null;
}

if (speechSynth?.addEventListener) speechSynth.addEventListener('voiceschanged', refreshSpeechVoices);
refreshSpeechVoices();

const AI_API_BASE = window.KS_AI_API_BASE || (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.aiApiBase) || `${location.protocol}//${location.host}/api`;

async function geminiTranslate(text, mode = 'translate') {
  try {
    const response = await fetch(`${AI_API_BASE}/ai/translate`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, targetLanguage: currentLang || 'en', mode })
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.text || null;
  } catch (error) {
    console.warn('Gemini voice service unavailable; using browser speech fallback.', error);
    return null;
  }
}

async function readAloud(text, lang) {
  if (!speechSynth) { showToast('Voice not supported in this browser', 'warning'); return; }
  
  if (isReading) {
    speechSynth.cancel();
    isReading = false;
    updateReadBtn(false);
    return;
  }

  const selectedLang = lang || currentLang || 'en';
  const langCode = LANG_SPEECH_CODES[selectedLang] || 'en-IN';
  const translatedText = selectedLang === 'en' ? text : (await geminiTranslate(text) || translateSpeechTextLocally(text));
  currentUtterance = new SpeechSynthesisUtterance(translatedText);
  currentUtterance.lang = langCode;
  const voice = speechVoiceFor(langCode);
  if (voice) currentUtterance.voice = voice;
  currentUtterance.rate = 0.9;
  currentUtterance.pitch = 1;

  currentUtterance.onstart = () => { isReading = true; updateReadBtn(true); };
  currentUtterance.onend = () => { isReading = false; updateReadBtn(false); };
  currentUtterance.onerror = () => { isReading = false; updateReadBtn(false); };

  speechSynth.speak(currentUtterance);
}

function translateSpeechTextLocally(text) {
  if (typeof phraseStrings === 'undefined') return text;
  const dictionaries = [{ ...(phraseStrings.en || {}), ...(phraseStrings[currentLang] || {}) }];
  const source = String(text).replace(/\s+/g, ' ').trim();
  for (const dictionary of dictionaries) {
    const match = Object.keys(dictionary).find(key => key.toLowerCase() === source.toLowerCase());
    if (match && dictionary[match] !== match) return dictionary[match];
  }
  return text;
}

function updateReadBtn(active) {
  document.querySelectorAll('.voice-read-btn').forEach(btn => {
    btn.classList.toggle('active', active);
    btn.innerHTML = active ? '🔊 Stop Reading' : '🔊 <span data-i18n="btn_read_aloud">Read Aloud</span>';
  });
}

function initVoiceRead(text) {
  document.querySelectorAll('.voice-read-btn').forEach(btn => {
    btn.addEventListener('click', () => readAloud(text));
  });
}

function startVoiceSearch(inputEl, callback) {
  if (!SpeechRec) { showToast('Voice search not supported', 'warning'); return; }
  
  const rec = new SpeechRec();
  rec.lang = LANG_SPEECH_CODES[currentLang] || 'en-IN';
  rec.interimResults = false;
  rec.maxAlternatives = 1;

  const voiceBtn = document.getElementById('voice-search-btn');
  if (voiceBtn) { voiceBtn.classList.add('active'); voiceBtn.innerHTML = '🎙️ Listening...'; }

  rec.onresult = (event) => {
    const rawTranscript = event.results[0][0].transcript;
    normalizeVoiceText(rawTranscript, transcript => {
      if (inputEl) inputEl.value = transcript;
      if (callback) callback(transcript);
      if (voiceBtn) { voiceBtn.classList.remove('active'); voiceBtn.innerHTML = '🎤'; }
    });
  };

  rec.onerror = () => {
    if (voiceBtn) { voiceBtn.classList.remove('active'); voiceBtn.innerHTML = '🎤'; }
    showToast('Voice recognition error. Try again.', 'error');
  };

  rec.onend = () => {
    if (voiceBtn) { voiceBtn.classList.remove('active'); voiceBtn.innerHTML = '🎤'; }
  };

  rec.start();
}

async function normalizeVoiceText(text, callback) {
  const normalized = await geminiTranslate(text, 'voice');
  if (callback) callback(normalized || text);
  return normalized || text;
}
