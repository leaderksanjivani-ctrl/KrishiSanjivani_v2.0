// ============================================================
// KrishiSanjivani — i18n Language Engine
// ============================================================

let currentLang = 'en';
let i18nStrings = {};
let baseI18nStrings = {};

const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', html: 'en' },
  { code: 'mr', label: 'Marathi', native: 'मराठी', html: 'mr' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', html: 'hi' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી', html: 'gu' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা', html: 'bn' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', html: 'ta' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు', html: 'te' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', html: 'kn' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം', html: 'ml' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ', html: 'pa' },
  { code: 'ur', label: 'Urdu', native: 'اردو', html: 'ur' },
  { code: 'or', label: 'Odia', native: 'ଓଡ଼ିଆ', html: 'or' }
];

const BUILTIN_EN = {
  nav_home: 'Home', nav_marketplace: 'Marketplace', nav_sell: 'Sell', nav_equipment: 'Equipment Rental',
  nav_weather: 'Weather', nav_schemes: 'Schemes', nav_rights: 'Rights & Acts', nav_tools: 'Tools', nav_help: 'Help',
  nav_buy_produce: 'Buy Produce', nav_sell_produce: 'Sell Produce', nav_my_orders: 'My Orders', nav_live_auction: 'Bol Bhaav Live',
  nav_group_buy: 'Group Buy', nav_govt_schemes: 'Govt. Schemes', nav_aaj_bhaav: 'Aaj ka Bhaav', nav_nearby: 'Nearby Facilities',
  nav_verify_inputs: 'Verify Inputs', nav_my_sakhi: 'My Sakhi', nav_grow: 'What Should I Grow?', nav_verify_ledger: 'Verify Ledger',
  nav_language: 'Language', nav_accessibility: 'Accessibility', nav_screen_reader: 'Screen Reader Access',
  footer_platform: 'Platform', footer_support: 'Support', footer_contact: 'Contact', footer_help: 'Help Center',
  footer_login: 'Login / Sign Up', footer_admin: 'Admin', footer_available: 'Available 9am-6pm, Mon-Sat'
};

function languageOptions(selected) {
  return SUPPORTED_LANGUAGES.map(lang => `<option value="${lang.code}"${lang.code === selected ? ' selected' : ''}>${lang.native}</option>`).join('');
}

async function loadLanguage(lang) {
  try {
    const selected = SUPPORTED_LANGUAGES.some(item => item.code === lang) ? lang : 'en';
    if (!Object.keys(baseI18nStrings).length) {
      const baseRes = await fetch('i18n/en.json');
      baseI18nStrings = baseRes.ok ? await baseRes.json() : {};
    }
    const res = await fetch(`i18n/${selected}.json`);
    if (!res.ok) throw new Error('Language file not found');
    i18nStrings = { ...baseI18nStrings, ...BUILTIN_EN, ...(selected === 'en' ? {} : await res.json()) };
    currentLang = selected;
    localStorage.setItem('ks_lang', selected);
    applyI18n();
    wireLanguageSelector();
    // Update Firestore if user is logged in
    if (auth && auth.currentUser) {
      db.collection(COLLECTIONS.users).doc(auth.currentUser.uid)
        .update({ language: lang }).catch(() => {});
    }
  } catch (e) {
    console.error('i18n load error:', e);
  }
}

function t(key, replacements = {}) {
  let str = i18nStrings[key] || key;
  Object.entries(replacements).forEach(([k, v]) => {
    str = str.replace(`{${k}}`, v);
  });
  return str;
}

function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.title = t(el.getAttribute('data-i18n-title'));
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
  });
  // Update html lang attribute
  document.documentElement.lang = SUPPORTED_LANGUAGES.find(item => item.code === currentLang)?.html || 'en';
  document.querySelectorAll('[data-language-name]').forEach(el => { el.textContent = SUPPORTED_LANGUAGES.find(item => item.code === currentLang)?.native || 'English'; });
}

function wireLanguageSelector() {
  const sel = document.getElementById('lang-select');
  if (!sel) return;
  sel.innerHTML = languageOptions(currentLang);
  sel.value = currentLang;
  if (sel.dataset.i18nBound) return;
  sel.dataset.i18nBound = 'true';
  sel.addEventListener('change', e => loadLanguage(e.target.value));
}

function ensureLanguageSelector() {
  if (document.getElementById('lang-select')) return;
  const select = document.createElement('select');
  select.id = 'lang-select';
  select.setAttribute('aria-label', 'Language');
  const host = document.querySelector('.nav-actions') || document.body;
  host.appendChild(select);
  wireLanguageSelector();
}

async function initI18n() {
  const saved = localStorage.getItem('ks_lang') || 'en';
  await loadLanguage(saved);
  ensureLanguageSelector();
  wireLanguageSelector();
}
