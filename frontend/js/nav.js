// ============================================================
// KrishiSanjivani — Persistent Navbar + Auth State
// ============================================================

let currentUser = null;
let currentUserProfile = null;
const GUEST_USER = { uid: 'guest-demo', isGuest: true, displayName: 'Guest Visitor', email: '' };

const SITE_META = {
  'index.html': {
    title: 'KrishiSanjivani | Buy Fresh Produce Direct from Farmers',
    description: 'Transparent farm-to-fork marketplace with fair pricing, live weather, schemes, equipment rental, and secure digital payments.',
    image: 'assets/krishisanjivani-logo.svg',
    url: 'https://krishi-sanjivani-v2-0.vercel.app/'
  },
  'marketplace.html': {
    title: 'Marketplace | Buy Fresh Produce Direct from Farmers | KrishiSanjivani',
    description: 'Buy fresh produce direct from farmers at fair prices with secure checkout and transparent sourcing.',
    image: 'assets/krishisanjivani-logo.svg',
    url: 'https://krishi-sanjivani-v2-0.vercel.app/marketplace.html'
  },
  'equipment-rental.html': {
    title: 'Equipment Rental Near You | KrishiSanjivani',
    description: 'Rent farm equipment and machinery near your location for timely sowing, harvesting, and field operations.',
    image: 'assets/krishisanjivani-logo.svg',
    url: 'https://krishi-sanjivani-v2-0.vercel.app/equipment-rental.html'
  },
  'weather.html': {
    title: 'Weather Forecast for Farmers | KrishiSanjivani',
    description: 'Check local weather and crop-safe recommendations to plan your irrigation, spraying, and harvesting schedule.',
    image: 'assets/krishisanjivani-logo.svg',
    url: 'https://krishi-sanjivani-v2-0.vercel.app/weather.html'
  },
  'schemes.html': {
    title: 'Government Schemes & MahaDBT | KrishiSanjivani',
    description: 'Discover farmer support schemes, PM-KISAN updates, crop support, and MahaDBT assistance in one place.',
    image: 'assets/krishisanjivani-logo.svg',
    url: 'https://krishi-sanjivani-v2-0.vercel.app/schemes.html'
  },
  'rights-acts.html': {
    title: 'Farmer Rights & Acts | KrishiSanjivani',
    description: 'Learn about legal rights, MSP guidance, contract farming knowledge, and relevant agricultural acts in accessible language.',
    image: 'assets/krishisanjivani-logo.svg',
    url: 'https://krishi-sanjivani-v2-0.vercel.app/rights-acts.html'
  },
  'help.html': {
    title: 'Help Center | KrishiSanjivani',
    description: 'Get assistance for listings, orders, payments, grievance handling, and platform support.',
    image: 'assets/krishisanjivani-logo.svg',
    url: 'https://krishi-sanjivani-v2-0.vercel.app/help.html'
  },
  'auth.html': {
    title: 'Login or Sign Up | KrishiSanjivani',
    description: 'Create a farmer, buyer, or bulk buyer account and join the direct agriculture marketplace.',
    image: 'assets/krishisanjivani-logo.svg',
    url: 'https://krishi-sanjivani-v2-0.vercel.app/auth.html'
  }
};

function isGuestMode() { return localStorage.getItem('ks_guest_mode') === 'true'; }

function injectSiteMeta() {
  const page = location.pathname.split('/').pop() || 'index.html';
  const meta = SITE_META[page] || SITE_META['index.html'];
  if (!document.querySelector('meta[name="description"]')) {
    const descriptionTag = document.createElement('meta');
    descriptionTag.name = 'description';
    descriptionTag.content = meta.description;
    document.head.appendChild(descriptionTag);
  }
  document.title = meta.title;
  const ogTitle = document.querySelector('meta[property="og:title"]') || document.createElement('meta');
  ogTitle.setAttribute('property', 'og:title');
  ogTitle.setAttribute('content', meta.title);
  if (!ogTitle.parentNode) document.head.appendChild(ogTitle);
  const ogDesc = document.querySelector('meta[property="og:description"]') || document.createElement('meta');
  ogDesc.setAttribute('property', 'og:description');
  ogDesc.setAttribute('content', meta.description);
  if (!ogDesc.parentNode) document.head.appendChild(ogDesc);
  const ogImage = document.querySelector('meta[property="og:image"]') || document.createElement('meta');
  ogImage.setAttribute('property', 'og:image');
  ogImage.setAttribute('content', meta.image);
  if (!ogImage.parentNode) document.head.appendChild(ogImage);
  const ogUrl = document.querySelector('meta[property="og:url"]') || document.createElement('meta');
  ogUrl.setAttribute('property', 'og:url');
  ogUrl.setAttribute('content', meta.url);
  if (!ogUrl.parentNode) document.head.appendChild(ogUrl);
  const twitterCard = document.querySelector('meta[name="twitter:card"]') || document.createElement('meta');
  twitterCard.setAttribute('name', 'twitter:card');
  twitterCard.setAttribute('content', 'summary_large_image');
  if (!twitterCard.parentNode) document.head.appendChild(twitterCard);
  const twitterTitle = document.querySelector('meta[name="twitter:title"]') || document.createElement('meta');
  twitterTitle.setAttribute('name', 'twitter:title');
  twitterTitle.setAttribute('content', meta.title);
  if (!twitterTitle.parentNode) document.head.appendChild(twitterTitle);
  const twitterDesc = document.querySelector('meta[name="twitter:description"]') || document.createElement('meta');
  twitterDesc.setAttribute('name', 'twitter:description');
  twitterDesc.setAttribute('content', meta.description);
  if (!twitterDesc.parentNode) document.head.appendChild(twitterDesc);
  const twitterImage = document.querySelector('meta[name="twitter:image"]') || document.createElement('meta');
  twitterImage.setAttribute('name', 'twitter:image');
  twitterImage.setAttribute('content', meta.image);
  if (!twitterImage.parentNode) document.head.appendChild(twitterImage);
}

function injectFavicon() {
  const favicon = document.querySelector('link[rel="icon"]');
  if (!favicon) {
    const icon = document.createElement('link');
    icon.rel = 'icon';
    icon.type = 'image/svg+xml';
    icon.href = 'assets/krishisanjivani-logo.svg';
    document.head.appendChild(icon);
  }
  const apple = document.querySelector('link[rel="apple-touch-icon"]');
  if (!apple) {
    const touch = document.createElement('link');
    touch.rel = 'apple-touch-icon';
    touch.href = 'assets/krishisanjivani-logo.svg';
    document.head.appendChild(touch);
  }
  const theme = document.querySelector('meta[name="theme-color"]');
  if (!theme) {
    const color = document.createElement('meta');
    color.name = 'theme-color';
    color.content = '#2f6b3c';
    document.head.appendChild(color);
  }
}

function initCookieConsent() {
  const key = 'ks_cookie_consent';
  const visitKey = 'ks_cookie_banner_seen';
  if (localStorage.getItem(key) || localStorage.getItem(visitKey) === 'shown' || sessionStorage.getItem(visitKey) === 'shown') return;
  const banner = document.createElement('div');
  banner.id = 'cookie-banner';
  banner.innerHTML = `
    <div class="cookie-banner-wrap">
      <div class="cookie-banner-header">
        <div class="cookie-banner-title-box">
          <span class="cookie-icon">🍪</span>
          <strong data-i18n="cookie_title">We Value Your Privacy & Data Security</strong>
        </div>
        <div class="cookie-badges">
          <span class="cookie-badge active"><span class="badge-dot"></span> Essential & Auth</span>
          <span class="cookie-badge active"><span class="badge-dot"></span> Preferences</span>
          <span class="cookie-badge disabled">🚫 No Ad Tracking</span>
        </div>
      </div>
      <div class="cookie-banner-copy">
        <p data-i18n="cookie_text">We use essential browser cookies and local storage to provide a secure, personalized agricultural experience—remembering your preferred language, accessibility settings, and Firebase authentication. We respect your data and never sell or track your personal information for ads.</p>
        <div class="cookie-banner-links">
          <a href="privacy-policy.html">Privacy Policy</a>
          <a href="terms.html">Terms of Service</a>
        </div>
      </div>
      
      <div class="cookie-settings-panel hidden" id="cookie-settings-panel">
        <div class="cookie-setting-row">
          <div class="cookie-setting-info">
            <strong>Necessary & Authentication</strong>
            <p>Required for logging in, storing security tokens, and saving core application state.</p>
          </div>
          <input type="checkbox" checked disabled />
        </div>
        <div class="cookie-setting-row">
          <div class="cookie-setting-info">
            <strong>Language & Preferences</strong>
            <p>Saves your selected language, contrast settings, and font size preferences.</p>
          </div>
          <input type="checkbox" id="pref-cookies-toggle" checked />
        </div>
        <div class="cookie-setting-row">
          <div class="cookie-setting-info">
            <strong>Anonymous Performance Analytics</strong>
            <p>Helps us understand platform usage without identifying individual farmers or buyers.</p>
          </div>
          <input type="checkbox" id="analytics-cookies-toggle" checked />
        </div>
      </div>

      <div class="cookie-banner-actions">
        <button class="cookie-btn cookie-btn-primary" id="cookie-accept-btn" data-i18n="cookie_accept">Accept All</button>
        <button class="cookie-btn cookie-btn-secondary" id="cookie-essential-btn" data-i18n="cookie_essential">Essential Only</button>
        <button class="cookie-btn cookie-btn-outline" id="cookie-settings-btn" type="button" data-i18n="cookie_preferences">Customize ⚙️</button>
      </div>
    </div>
  `;
  document.body.appendChild(banner);
  localStorage.setItem(visitKey, 'shown');
  sessionStorage.setItem(visitKey, 'shown');

  const saveConsent = (type) => {
    localStorage.setItem(key, type);
    banner.remove();
  };

  document.getElementById('cookie-accept-btn')?.addEventListener('click', () => saveConsent('all'));
  document.getElementById('cookie-essential-btn')?.addEventListener('click', () => saveConsent('essential'));
  
  const settingsBtn = document.getElementById('cookie-settings-btn');
  const settingsPanel = document.getElementById('cookie-settings-panel');
  settingsBtn?.addEventListener('click', () => {
    if (settingsPanel) {
      const isHidden = settingsPanel.classList.contains('hidden');
      settingsPanel.classList.toggle('hidden');
      settingsBtn.textContent = isHidden ? 'Save Preferences ✓' : 'Customize ⚙️';
      if (!isHidden) {
        saveConsent('custom');
      }
    }
  });
}

function applyConsentStyles() {
  if (document.getElementById('cookie-banner-style')) return;
  const style = document.createElement('style');
  style.id = 'cookie-banner-style';
  style.textContent = `
    #cookie-banner {
      position: fixed;
      left: 20px;
      right: 20px;
      bottom: 20px;
      z-index: 99999;
      animation: cookie-banner-slide .3s ease-out;
    }
    @keyframes cookie-banner-slide {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .cookie-banner-wrap {
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: rgba(255, 255, 255, 0.96);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      color: #1a3322;
      border: 1px solid rgba(39, 125, 67, 0.25);
      border-radius: 20px;
      box-shadow: 0 20px 45px rgba(0, 0, 0, 0.18);
      padding: 18px 22px;
      max-width: 820px;
      margin: 0 auto;
    }
    .cookie-banner-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }
    .cookie-banner-title-box {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .cookie-icon {
      font-size: 1.4rem;
      line-height: 1;
    }
    .cookie-banner-title-box strong {
      font-size: 1.02rem;
      font-weight: 700;
      color: #133a1e;
    }
    .cookie-badges {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .cookie-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 0.78rem;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 20px;
      background: #eaf5ed;
      color: #1e6435;
      border: 1px solid rgba(30,100,53,0.15);
    }
    .cookie-badge.disabled {
      background: #f1f3f2;
      color: #64748b;
      border-color: rgba(100,116,139,0.2);
    }
    .badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #22c55e;
    }
    .cookie-banner-copy p {
      margin: 0;
      color: #3b5245;
      line-height: 1.55;
      font-size: 0.88rem;
    }
    .cookie-banner-links {
      display: flex;
      gap: 14px;
      margin-top: 6px;
    }
    .cookie-banner-links a {
      color: #267d43;
      font-size: 0.82rem;
      font-weight: 700;
      text-decoration: underline;
    }
    .cookie-banner-links a:hover {
      color: #144925;
    }
    .cookie-banner-actions {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 4px;
      flex-wrap: wrap;
    }
    .cookie-btn {
      border: none;
      padding: 8px 16px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.86rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .cookie-btn-primary {
      background: #267d43;
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(38, 125, 67, 0.25);
    }
    .cookie-btn-primary:hover {
      background: #1e6435;
    }
    .cookie-btn-secondary {
      background: #e2f0e7;
      color: #1e6435;
    }
    .cookie-btn-secondary:hover {
      background: #d1e7d9;
    }
    .cookie-btn-outline {
      background: transparent;
      border: 1px solid #cbd5e1;
      color: #475569;
    }
    .cookie-btn-outline:hover {
      background: #f8fafc;
      border-color: #94a3b8;
    }
    .cookie-settings-panel {
      display: flex;
      flex-direction: column;
      gap: 10px;
      background: #f8fbf9;
      border: 1px solid rgba(39, 125, 67, 0.15);
      border-radius: 12px;
      padding: 12px 16px;
      margin-top: 4px;
    }
    .cookie-settings-panel.hidden {
      display: none;
    }
    .cookie-setting-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .cookie-setting-info strong {
      display: block;
      font-size: 0.85rem;
      color: #1a3322;
    }
    .cookie-setting-info p {
      margin: 2px 0 0 0;
      font-size: 0.78rem;
      color: #64748b;
    }
    @media (max-width: 640px) {
      #cookie-banner { left: 12px; right: 12px; bottom: 12px; }
      .cookie-banner-wrap { padding: 14px; }
      .cookie-banner-actions { flex-direction: column; width: 100%; }
      .cookie-btn { width: 100%; text-align: center; }
    }
  `;
  document.head.appendChild(style);
}

function enterGuestMode(destination = 'dashboard.html') {
  localStorage.setItem('ks_guest_mode', 'true');
  location.href = destination;
}

function exitGuestMode() {
  localStorage.removeItem('ks_guest_mode');
  location.href = 'auth.html';
}

async function initNav() {
  if (typeof initI18n === 'function' && !Object.keys(i18nStrings || {}).length) await initI18n();
  initGovernmentShell();
  await initI18n();
  
  // Auth state listener
  auth.onAuthStateChanged(async (user) => {
    if (!user && isGuestMode()) {
      currentUser = GUEST_USER;
      currentUserProfile = { uid: GUEST_USER.uid, name: 'Guest Visitor', role: 'buyer', language: localStorage.getItem('ks_lang') || 'en', isGuest: true };
      updateNavForGuest();
      return;
    }
    currentUser = user;
    if (user) {
      // Load profile
      try {
        const doc = await db.collection(COLLECTIONS.users).doc(user.uid).get();
        currentUserProfile = doc.exists ? doc.data() : null;
        if (currentUserProfile?.language) {
          await loadLanguage(currentUserProfile.language);
        }
      } catch (e) {
        console.warn('Profile load error:', e);
      }
      updateNavForUser(user);
      loadNotifications(user.uid);
    } else {
      updateNavForGuest();
      // Redirect if on protected page
      const protectedPages = [
        'dashboard.html','list-item.html','marketplace.html',
        'product-detail.html','cart.html','checkout.html',
        'payment.html','invoice.html','order-tracking.html',
        'equipment-rental.html','help.html','profile.html',
        'weather.html','schemes.html','rights-acts.html','auction.html','group-buy.html',
        'verify-inputs.html','ask-expert.html','rate-check.html','pre-sowing.html','onboarding.html','ledger-verify.html'
      ];
      const page = location.pathname.split('/').pop();
      if (protectedPages.includes(page) && !isGuestMode()) {
        location.href = 'auth.html?redirect=' + encodeURIComponent(page);
      }
    }
  });

  // Notification bell
  const notifBtn = document.getElementById('nav-notif-btn');
  const notifDropdown = document.getElementById('notif-dropdown');
  if (notifBtn && notifDropdown) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifDropdown.classList.toggle('hidden');
    });
    document.addEventListener('click', () => notifDropdown.classList.add('hidden'));
  }

}

function initGovernmentShell() {
  injectFavicon();
  injectSiteMeta();
  applyConsentStyles();
  initCookieConsent();
  if (document.querySelector('.ks-utility-bar')) return;
  const iconScript = document.createElement('script');
  iconScript.src = 'js/icon-system.js';
  iconScript.onload = () => initIconSystem();
  document.head.appendChild(iconScript);
  const utility = document.createElement('div');
  utility.className = 'ks-utility-bar';
  utility.innerHTML = `
    <a class="ks-skip-link" href="#main-content">Skip to Main Content</a>
    <div class="ks-utility-inner"><span class="ks-tricolor-mark" aria-hidden="true"></span><div class="ks-utility-tools">
      <label class="ks-language-picker"><span class="sr-only" data-i18n="nav_language">Language</span><span id="ks-language-slot"></span></label>
      <span class="ks-text-size" aria-label="Text size"><button data-text-size="decrease">A-</button><button data-text-size="reset">A</button><button data-text-size="increase">A+</button></span>
      <div class="ks-accessibility"><button class="ks-accessibility-toggle" aria-expanded="false" data-i18n="nav_accessibility">Accessibility</button><div class="ks-accessibility-panel" hidden>
        <label><input type="checkbox" data-accessibility="contrast"> High Contrast</label><label><input type="checkbox" data-accessibility="links"> Highlight Links</label><button data-accessibility="read" data-i18n="nav_screen_reader">Screen Reader Access</button>
      </div></div>
    </div></div>`;
  document.body.prepend(utility);
  showPrototypeNotice();
  const languageSelect = document.getElementById('lang-select');
  const languageSlot = document.getElementById('ks-language-slot');
  if (languageSelect && languageSlot) languageSlot.appendChild(languageSelect);
  else if (languageSlot) { const select = document.createElement('select'); select.id = 'lang-select'; select.setAttribute('aria-label', 'Language'); languageSlot.appendChild(select); }
  wireLanguageSelector();
  applyBrandLogos();
  const nav = document.getElementById('main-nav');
  if (nav) {
    nav.classList.add('ks-site-header');
    const primary = document.createElement('div');
    primary.className = 'ks-primary-nav';
    primary.innerHTML = `<div class="ks-primary-inner">
      <a href="index.html" data-nav-page="index.html" data-i18n="nav_home">Home</a><div class="ks-nav-menu"><a href="marketplace.html" data-nav-page="marketplace.html" data-i18n="nav_marketplace">Marketplace <span>⌄</span></a><div class="ks-nav-dropdown"><a href="marketplace.html" data-i18n="nav_buy_produce">Buy Produce</a><a href="list-item.html" data-i18n="nav_sell_produce">Sell Produce</a><a href="order-tracking.html" data-i18n="nav_my_orders">My Orders</a><a href="auction.html" data-i18n="nav_live_auction">Bol Bhaav Live</a><a href="group-buy.html" data-i18n="nav_group_buy">Group Buy</a></div></div>
      <a href="list-item.html" data-nav-page="list-item.html" data-i18n="nav_sell">Sell</a><a href="equipment-rental.html" data-nav-page="equipment-rental.html" data-i18n="nav_equipment">Equipment Rental</a><a href="weather.html" data-nav-page="weather.html" data-i18n="nav_weather">Weather</a>
      <div class="ks-nav-menu"><a href="schemes.html" data-nav-page="schemes.html" data-i18n="nav_schemes">Schemes <span>⌄</span></a><div class="ks-nav-dropdown"><a href="schemes.html" data-i18n="nav_govt_schemes">Govt. Schemes</a><a href="schemes.html#mahadbt">MahaDBT</a></div></div>
      <a href="rights-acts.html" data-nav-page="rights-acts.html" data-i18n="nav_rights">Rights &amp; Acts</a><div class="ks-nav-menu"><a href="dashboard.html" data-i18n="nav_tools">Tools <span>⌄</span></a><div class="ks-nav-dropdown"><a href="rate-check.html" data-i18n="nav_aaj_bhaav">Aaj ka Bhaav</a><a href="nearby-facilities.html" data-i18n="nav_nearby">Nearby Facilities</a><a href="verify-inputs.html" data-i18n="nav_verify_inputs">Verify Inputs</a><a href="ask-expert.html" data-i18n="nav_my_sakhi">My Sakhi</a><a href="pre-sowing.html" data-i18n="nav_grow">What Should I Grow?</a><a href="ledger-verify.html" data-i18n="nav_verify_ledger">Verify Ledger</a></div></div><a href="help.html" data-nav-page="help.html" data-i18n="nav_help">Help</a></div>`;
    nav.after(primary);
    applyI18n();
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    primary.querySelector(`[data-nav-page="${currentPage}"]`)?.classList.add('active');
  }
  const main = document.querySelector('main, .page-wrapper, .hero');
  if (main && !main.id)   initAccessibilityControls();
  initAnnouncementTicker();
  initPortalFooter();
  applyBrandLogos();
}

function showPrototypeNotice() {
  const visitKey = 'ks_prototype_notice_seen';
  if (document.getElementById('sih-prototype-notice') || localStorage.getItem(visitKey) === 'shown' || sessionStorage.getItem(visitKey) === 'shown') return;
  const copy = {
    en: ['SIH prototype preview', 'This website is an SIH 2026 prototype. Some data and actions are simulated for demonstration.', 'Close'],
    mr: ['SIH प्रोटोटाइप पूर्वदृश्य', 'ही वेबसाइट SIH 2026 प्रोटोटाइप आहे. काही माहिती आणि कृती प्रात्यक्षिकासाठी सिम्युलेटेड आहेत.', 'बंद करा'],
    hi: ['SIH प्रोटोटाइप पूर्वावलोकन', 'यह वेबसाइट SIH 2026 प्रोटोटाइप है। कुछ डेटा और कार्य प्रदर्शन के लिए सिम्युलेटेड हैं।', 'बंद करें'],
    gu: ['SIH પ્રોટોટાઇપ પૂર્વાવલોકન', 'આ વેબસાઇટ SIH 2026 પ્રોટોટાઇપ છે. કેટલાક ડેટા અને ક્રિયાઓ પ્રદર્શન માટે સિમ્યુલેટેડ છે.', 'બંધ કરો'],
    bn: ['SIH প্রোটোটাইপ প্রিভিউ', 'এই ওয়েবসাইটটি SIH 2026 প্রোটোটাইপ। কিছু তথ্য ও কাজ প্রদর্শনের জন্য সিমুলেটেড।', 'বন্ধ করুন'],
    ta: ['SIH முன்மாதிரி முன்னோட்டம்', 'இந்த இணையதளம் SIH 2026 முன்மாதிரி. சில தரவுகளும் செயல்களும் விளக்கத்திற்காக உருவகப்படுத்தப்பட்டவை.', 'மூடுக'],
    te: ['SIH ప్రోటోటైప్ ప్రివ్యూ', 'ఈ వెబ్‌సైట్ SIH 2026 ప్రోటోటైప్. కొన్ని డేటా మరియు చర్యలు ప్రదర్శన కోసం అనుకరించబడ్డాయి.', 'మూసివేయండి'],
    kn: ['SIH ಮಾದರಿ ಪೂರ್ವವೀಕ್ಷಣೆ', 'ಈ ವೆಬ್‌ಸೈಟ್ SIH 2026 ಮಾದರಿ. ಕೆಲವು ಡೇಟಾ ಮತ್ತು ಕ್ರಿಯೆಗಳು ಪ್ರದರ್ಶನಕ್ಕಾಗಿ ಅನುಕರಿಸಲಾಗಿದೆ.', 'ಮುಚ್ಚಿ'],
    ml: ['SIH പ്രോട്ടോടൈപ്പ് പ്രിവ്യൂ', 'ഈ വെബ്സൈറ്റ് SIH 2026 പ്രോട്ടോടൈപ്പാണ്. ചില ഡാറ്റയും പ്രവർത്തനങ്ങളും പ്രദർശനത്തിനായി അനുകരിച്ചവയാണ്.', 'അടയ്ക്കുക'],
    pa: ['SIH ਪ੍ਰੋਟੋਟਾਈਪ ਝਲਕ', 'ਇਹ ਵੈੱਬਸਾਈਟ SIH 2026 ਪ੍ਰੋਟੋਟਾਈਪ ਹੈ। ਕੁਝ ਡਾਟਾ ਅਤੇ ਕਾਰਵਾਈਆਂ ਪ੍ਰਦਰਸ਼ਨ ਲਈ ਸਿਮੂਲੇਟ ਕੀਤੀਆਂ ਗਈਆਂ ਹਨ।', 'ਬੰਦ ਕਰੋ'],
    ur: ['SIH پروٹوٹائپ پیش نظارہ', 'یہ ویب سائٹ SIH 2026 پروٹوٹائپ ہے۔ کچھ ڈیٹا اور اقدامات مظاہرے کے لیے فرضی ہیں۔', 'بند کریں'],
    or: ['SIH ପ୍ରୋଟୋଟାଇପ୍ ପୂର୍ବଦର୍ଶନ', 'ଏହି ୱେବସାଇଟ୍ SIH 2026 ପ୍ରୋଟୋଟାଇପ୍। କିଛି ତଥ୍ୟ ଏବଂ କାର୍ଯ୍ୟ ପ୍ରଦର୍ଶନ ପାଇଁ ସିମୁଲେଟେଡ୍।', 'ବନ୍ଦ କରନ୍ତୁ']
  };
  const selected = copy[typeof currentLang !== 'undefined' ? currentLang : 'en'] || copy.en;
  const notice = document.createElement('aside');
  notice.id = 'sih-prototype-notice';
  notice.className = 'sih-notice';
  notice.innerHTML = `<button class="sih-notice-close" aria-label="${selected[2]}">&times;</button><strong>${selected[0]}</strong><p>${selected[1]}</p>`;
  document.body.appendChild(notice);
  localStorage.setItem(visitKey, 'shown');
  sessionStorage.setItem(visitKey, 'shown');
  notice.querySelector('.sih-notice-close').onclick = () => {
    localStorage.setItem(visitKey, 'shown');
    sessionStorage.setItem(visitKey, 'shown');
    notice.remove();
  };
  setTimeout(() => notice.remove(), 4000);
}�ିମୁଲେଟେଡ୍।', 'ବନ୍ଦ କରନ୍ତୁ']
  };
  const selected = copy[typeof currentLang !== 'undefined' ? currentLang : 'en'] || copy.en;
  const notice = document.createElement('aside');
  notice.id = 'sih-prototype-notice';
  notice.className = 'sih-notice';
  notice.innerHTML = `<button class="sih-notice-close" aria-label="${selected[2]}">&times;</button><strong>${selected[0]}</strong><p>${selected[1]}</p>`;
  document.body.appendChild(notice);
  localStorage.setItem(visitKey, 'shown');
  sessionStorage.setItem(visitKey, 'shown');
  notice.querySelector('.sih-notice-close').onclick = () => {
    localStorage.setItem(visitKey, 'shown');
    sessionStorage.setItem(visitKey, 'shown');
    notice.remove();
  };
  setTimeout(() => notice.remove(), 4000);
}ರಿ. ಕೆಲವು ಡೇಟಾ ಮತ್ತು ಕ್ರಿಯೆಗಳು ಪ್ರದರ್ಶನಕ್ಕಾಗಿ ಅನುಕರಿಸಲಾಗಿದೆ.', 'ಮುಚ್ಚಿ'],
    ml: ['SIH പ്രോട്ടോടൈപ്പ് പ്രിവ്യൂ', 'ഈ വെബ്സൈറ്റ് SIH 2026 പ്രോട്ടോടൈപ്പാണ്. ചില ഡാറ്റയും പ്രവർത്തനങ്ങളും പ്രദർശനത്തിനായി അനുകരിച്ചവയാണ്.', 'അടയ്ക്കുക'],
    pa: ['SIH ਪ੍ਰੋਟੋਟਾਈਪ ਝਲਕ', 'ਇਹ ਵੈੱਬਸਾਈਟ SIH 2026 ਪ੍ਰੋਟੋਟਾਈਪ ਹੈ। ਕੁਝ ਡਾਟਾ ਅਤੇ ਕਾਰਵਾਈਆਂ ਪ੍ਰਦਰਸ਼ਨ ਲਈ ਸਿਮੂਲੇਟ ਕੀਤੀਆਂ ਗਈਆਂ ਹਨ।', 'ਬੰਦ ਕਰੋ'],
    ur: ['SIH پروٹوٹائپ پیش نظارہ', 'یہ ویب سائٹ SIH 2026 پروٹوٹائپ ہے۔ کچھ ڈیٹا اور اقدامات مظاہرے کے لیے فرضی ہیں۔', 'بند کریں'],
    or: ['SIH ପ୍ରୋଟୋଟାଇପ୍ ପୂର୍ବଦର୍ଶନ', 'ଏହି ୱେବସାଇଟ୍ SIH 2026 ପ୍ରୋଟୋଟାଇପ୍। କିଛି ତଥ୍ୟ ଏବଂ କାର୍ଯ୍ୟ ପ୍ରଦର୍ଶନ ପାଇଁ ସିମୁଲେଟେଡ୍।', 'ବନ୍ଦ କରନ୍ତୁ']
  };
  const selected = copy[typeof currentLang !== 'undefined' ? currentLang : 'en'] || copy.en;
  const notice = document.createElement('aside');
  notice.id = 'sih-prototype-notice';
  notice.className = 'sih-notice';
  notice.innerHTML = `<button class="sih-notice-close" aria-label="${selected[2]}">&times;</button><strong>${selected[0]}</strong><p>${selected[1]}</p>`;
  document.body.appendChild(notice);
  sessionStorage.setItem(visitKey, 'shown');
  notice.querySelector('.sih-notice-close').onclick = () => notice.remove();
  setTimeout(() => notice.remove(), 3500);
}

function applyBrandLogos() {
  document.querySelectorAll('.nav-logo-icon').forEach(mark => {
    mark.innerHTML = '<img src="assets/krishisanjivani-logo.svg" alt="KrishiSanjivani logo">';
  });
  document.querySelectorAll('.auth-brand-icon').forEach(mark => {
    mark.innerHTML = '<img src="assets/krishisanjivani-logo.svg" alt="KrishiSanjivani logo">';
  });
}

function initPortalFooter() {
  if (document.querySelector('.footer')) return;
  const footer = document.createElement('footer');
  footer.className = 'footer ks-shared-footer';
  footer.innerHTML = `<div class="container"><div class="footer-grid">
    <div class="footer-brand"><div class="nav-logo"><div class="nav-logo-icon">🌾</div><span class="nav-logo-text">KrishiSanjivani</span></div><p>Empowering farmers and connecting communities with fair, trusted agriculture.</p><p class="ks-footer-note">Smart India Hackathon 2026</p></div>
    <div class="footer-links"><h4 data-i18n="footer_platform">Platform</h4><a href="marketplace.html" data-i18n="nav_marketplace">Marketplace</a><a href="equipment-rental.html" data-i18n="nav_equipment">Equipment Rental</a><a href="weather.html" data-i18n="nav_weather">Weather</a><a href="schemes.html" data-i18n="nav_govt_schemes">Govt. Schemes</a></div>
    <div class="footer-links"><h4 data-i18n="footer_support">Support</h4><a href="help.html" data-i18n="footer_help">Help Center</a><a href="rights-acts.html" data-i18n="nav_rights">Farmer Rights</a><a href="privacy-policy.html">Privacy Policy</a><a href="terms.html">Terms &amp; Conditions</a></div>
    <div class="footer-links"><h4 data-i18n="footer_contact">Contact</h4><a href="tel:18001234567">1800-123-4567</a><a href="mailto:support@krishisanjivani.gov.in">support@krishisanjivani.gov.in</a><a href="auth.html" data-i18n="footer_login">Login / Sign Up</a><a href="admin-login.html" data-i18n="footer_admin">Admin</a><p class="ks-footer-note" data-i18n="footer_available">Available 9am-6pm, Mon-Sat</p></div>
  </div><div class="footer-bottom"><p>© 2026 KrishiSanjivani | Last Updated: 16 September 2026</p><div class="footer-badges"><span class="badge badge-green">Accessible Website</span><span class="badge badge-green">Secure Payments</span><span class="badge badge-gold">Made in India</span></div></div></div>`;
  document.body.appendChild(footer);
  applyI18n();
}

function initAccessibilityControls() {
  const root = document.documentElement;
  const storedSize = Number(localStorage.getItem('ks_text_size') || 16);
  applyTextSize(storedSize);
  document.querySelectorAll('[data-text-size]').forEach(button => button.addEventListener('click', () => {
    const current = Number(getComputedStyle(root).getPropertyValue('--base-font-size').replace('px', '')) || 16;
    const action = button.dataset.textSize;
    const next = action === 'reset' ? 16 : Math.min(22, Math.max(12, current + (action === 'increase' ? 2 : -2)));
    applyTextSize(next);
  }));
  const toggle = document.querySelector('.ks-accessibility-toggle'); const panel = document.querySelector('.ks-accessibility-panel');
  toggle?.addEventListener('click', () => { const open = panel.hidden; panel.hidden = !open; toggle.setAttribute('aria-expanded', String(open)); });
  document.addEventListener('click', event => {
    if (panel && toggle && !event.target.closest('.ks-accessibility')) {
      panel.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && panel && toggle) { panel.hidden = true; toggle.setAttribute('aria-expanded', 'false'); }
  });
  document.querySelector('[data-accessibility="contrast"]')?.addEventListener('change', e => document.body.classList.toggle('high-contrast', e.target.checked));
  document.querySelector('[data-accessibility="links"]')?.addEventListener('change', e => document.body.classList.toggle('highlight-links', e.target.checked));
  document.querySelector('[data-accessibility="read"]')?.addEventListener('click', () => { const text = document.querySelector('main, .page-wrapper, .hero')?.innerText || document.body.innerText; if (typeof readAloud === 'function') readAloud(text); });
}

function applyTextSize(size) {
  const root = document.documentElement;
  const scale = size / 16;
  root.style.setProperty('--base-font-size', `${size}px`);
  root.style.setProperty('--fs-xs', `${Math.round(12 * scale)}px`);
  root.style.setProperty('--fs-sm', `${Math.round(13 * scale)}px`);
  root.style.setProperty('--fs-base', `${size}px`);
  root.style.setProperty('--fs-md', `${Math.round(16 * scale)}px`);
  root.style.setProperty('--fs-lg', `${Math.round(18 * scale)}px`);
  root.style.setProperty('--fs-xl', `${Math.round(20 * scale)}px`);
  root.style.setProperty('--fs-2xl', `${Math.round(24 * scale)}px`);
  root.style.setProperty('--fs-3xl', `${Math.round(30 * scale)}px`);
  localStorage.setItem('ks_text_size', size);
}

async function initAnnouncementTicker() {
  if (document.querySelector('.ks-announcement-ticker')) return;
  const updates = ['New: Wheat demand up 18% this week', 'PM-KISAN 23rd installment update', 'Equipment rental now available in 3 new districts'];
  try { if (typeof db !== 'undefined') { const snap = await db.collection('announcements').orderBy('createdAt', 'desc').limit(5).get(); if (!snap.empty) updates.splice(0, updates.length, ...snap.docs.map(doc => doc.data().title || doc.data().text).filter(Boolean)); } } catch (error) { console.warn('Announcements unavailable:', error); }
  const ticker = document.createElement('div'); ticker.className = 'ks-announcement-ticker';
  ticker.innerHTML = `<div class="ks-ticker-label">What's New</div><div class="ks-ticker-track"><span>${updates.join(' &nbsp; • &nbsp; ')}</span></div>`;
  document.querySelector('.ks-primary-nav')?.after(ticker);
}

function updateNavForUser(user) {
  const avatar = document.getElementById('nav-avatar');
  if (avatar) {
    if (user.photoURL) {
      avatar.innerHTML = `<img src="${user.photoURL}" alt="Profile">`;
    } else {
      const name = user.displayName || user.email || 'U';
      avatar.textContent = name[0].toUpperCase();
    }
    avatar.href = 'profile.html';
  }

  // If user is admin, insert Admin Panel link into nav actions
  const isAdmin = currentUserProfile?.role === 'admin' || (typeof isAdminEmail === 'function' && isAdminEmail(user.email));
  if (isAdmin) {
    const navActions = document.querySelector('.nav-actions');
    if (navActions && !document.getElementById('nav-admin-link')) {
      const adminBtn = document.createElement('a');
      adminBtn.id = 'nav-admin-link';
      adminBtn.href = 'admin-dashboard.html';
      adminBtn.className = 'btn btn-primary btn-sm';
      adminBtn.style.marginRight = '8px';
      adminBtn.innerHTML = '🛡️ Admin Panel';
      navActions.insertBefore(adminBtn, navActions.firstChild);
    }
  }
}

function updateNavForGuest() {
  const avatar = document.getElementById('nav-avatar');
  if (avatar) {
    avatar.textContent = '👤';
    avatar.href = isGuestMode() ? 'javascript:exitGuestMode()' : 'auth.html';
    avatar.title = isGuestMode() ? 'Exit guest preview' : 'Login';
  }
  const navActions = document.querySelector('.nav-actions');
  if (navActions && isGuestMode() && !document.getElementById('guest-mode-badge')) {
    const badge = document.createElement('span');
    badge.id = 'guest-mode-badge';
    badge.className = 'badge badge-gold';
    badge.textContent = 'Guest Preview';
    navActions.insertBefore(badge, navActions.firstChild);
  }
}

async function loadNotifications(uid) {
  try {
    const snap = await db.collection(COLLECTIONS.notifications)
      .where('userId', '==', uid)
      .where('read', '==', false)
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get();
    
    const badge = document.querySelector('#nav-notif-btn .nav-badge');
    if (badge) {
      badge.textContent = snap.size;
      badge.style.display = snap.size > 0 ? 'flex' : 'none';
    }

    const list = document.getElementById('notif-list');
    if (list) {
      if (snap.empty) {
        list.innerHTML = '<div class="notif-item"><span class="notif-icon">🔔</span><div class="notif-text"><strong>No new notifications</strong></div></div>';
      } else {
        list.innerHTML = snap.docs.map(doc => {
          const n = doc.data();
          return `<div class="notif-item">
            <span class="notif-icon">${n.icon || '🔔'}</span>
            <div class="notif-text">
              <strong>${n.title}</strong>
              <span>${n.body}</span>
            </div>
          </div>`;
        }).join('');
      }
    }
  } catch (e) {
    console.warn('Notifications error:', e);
  }
}

function showToast(message, type = 'success', duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  toast.innerHTML = `<span>${icons[type] || '🔔'}</span><span>${message}</span>`;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('exit');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

async function signOut() {
  if (isGuestMode()) { exitGuestMode(); return; }
  await auth.signOut();
  localStorage.removeItem('ks_cart');
  location.href = 'index.html';
}

function requireAuth(callback) {
  auth.onAuthStateChanged(user => {
    if (user) callback(user);
    else if (isGuestMode()) callback(GUEST_USER);
    else location.href = 'auth.html';
  });
}

function getUserRole() {
  return currentUserProfile?.role || 'buyer';
}
