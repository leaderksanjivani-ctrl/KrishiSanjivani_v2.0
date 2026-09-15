// ============================================================
// KrishiSanjivani — i18n Language Engine
// ============================================================

let currentLang = 'en';
let i18nStrings = {};

async function loadLanguage(lang) {
  try {
    const res = await fetch(`/i18n/${lang}.json`);
    if (!res.ok) throw new Error('Language file not found');
    i18nStrings = await res.json();
    currentLang = lang;
    localStorage.setItem('ks_lang', lang);
    applyI18n();
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
  const langMap = { en: 'en', hi: 'hi', mr: 'mr' };
  document.documentElement.lang = langMap[currentLang] || 'en';
}

async function initI18n() {
  const saved = localStorage.getItem('ks_lang') || 'en';
  await loadLanguage(saved);
  
  // Language selector
  const sel = document.getElementById('lang-select');
  if (sel) {
    sel.value = saved;
    sel.addEventListener('change', e => loadLanguage(e.target.value));
  }
}
