// ============================================================
// KrishiSanjivani — Voice (Web Speech API)
// ============================================================

let speechSynth = window.speechSynthesis;
let SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
let currentUtterance = null;
let isReading = false;

const LANG_SPEECH_CODES = { en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN' };

function readAloud(text, lang) {
  if (!speechSynth) { showToast('Voice not supported in this browser', 'warning'); return; }
  
  if (isReading) {
    speechSynth.cancel();
    isReading = false;
    updateReadBtn(false);
    return;
  }

  const langCode = lang || LANG_SPEECH_CODES[currentLang] || 'en-IN';
  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.lang = langCode;
  currentUtterance.rate = 0.9;
  currentUtterance.pitch = 1;

  currentUtterance.onstart = () => { isReading = true; updateReadBtn(true); };
  currentUtterance.onend = () => { isReading = false; updateReadBtn(false); };
  currentUtterance.onerror = () => { isReading = false; updateReadBtn(false); };

  speechSynth.speak(currentUtterance);
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
    const transcript = event.results[0][0].transcript;
    if (inputEl) inputEl.value = transcript;
    if (callback) callback(transcript);
    if (voiceBtn) { voiceBtn.classList.remove('active'); voiceBtn.innerHTML = '🎤'; }
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
