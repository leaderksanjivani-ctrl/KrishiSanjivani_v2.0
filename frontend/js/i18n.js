// ============================================================
// KrishiSanjivani — i18n Language Engine
// ============================================================

let currentLang = 'en';
let i18nStrings = {};
let baseI18nStrings = {};
let phraseStrings = {};
const autoOriginalText = new WeakMap();

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
  guest_explore: 'Explore as Guest',
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
    if (!Object.keys(phraseStrings).length) {
      const phraseRes = await fetch('i18n/phrases.json');
      phraseStrings = phraseRes.ok ? await phraseRes.json() : {};
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
  applyPhraseTranslations();
  // Update html lang attribute
  document.documentElement.lang = SUPPORTED_LANGUAGES.find(item => item.code === currentLang)?.html || 'en';
  document.querySelectorAll('[data-language-name]').forEach(el => { el.textContent = SUPPORTED_LANGUAGES.find(item => item.code === currentLang)?.native || 'English'; });
}

function phraseKey(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function applyPhraseTranslations() {
  const phrases = { ...(phraseStrings.en || {}), ...(phraseStrings[currentLang] || {}) };
  Object.keys(baseI18nStrings).forEach(key => {
    const source = baseI18nStrings[key];
    const translated = i18nStrings[key];
    if (typeof source === 'string' && typeof translated === 'string' && source !== translated) phrases[source] = translated;
  });
  const phraseLookup = Object.keys(phrases).reduce((lookup, key) => { lookup[key.toLowerCase()] = phrases[key]; return lookup; }, {});
  const translate = value => phrases[phraseKey(value)] || phraseLookup[phraseKey(value).toLowerCase()] || value;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: node => {
      const parent = node.parentElement;
      if (!parent || parent.closest('script,style,textarea,[data-i18n],[data-translation-skip],select,option')) return NodeFilter.FILTER_REJECT;
      return phraseKey(node.nodeValue) && phraseKey(node.nodeValue).length > 1 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    const original = autoOriginalText.get(node) || phraseKey(node.nodeValue);
    autoOriginalText.set(node, original);
    const translated = translate(original);
    if (translated !== original) node.nodeValue = node.nodeValue.replace(phraseKey(node.nodeValue), translated);
  });
  const title = document.title;
  const translatedTitle = translate(title);
  if (translatedTitle !== title) document.title = translatedTitle;
  document.querySelectorAll('input[placeholder],textarea[placeholder]').forEach(input => {
    if (!input.hasAttribute('data-i18n-placeholder')) {
      const translated = translate(input.placeholder);
      if (translated !== input.placeholder) input.placeholder = translated;
    }
  });
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
