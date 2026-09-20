// ============================================================
// KrishiSanjivani — Persistent Navbar + Auth State
// ============================================================

let currentUser = null;
let currentUserProfile = null;

async function initNav() {
  if (typeof initI18n === 'function' && !Object.keys(i18nStrings || {}).length) await initI18n();
  initGovernmentShell();
  await initI18n();
  
  // Auth state listener
  auth.onAuthStateChanged(async (user) => {
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
      if (protectedPages.includes(page)) {
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
  if (main && !main.id) main.id = 'main-content';
  initAccessibilityControls();
  initAnnouncementTicker();
  initPortalFooter();
  applyBrandLogos();
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
    <div class="footer-links"><h4 data-i18n="footer_support">Support</h4><a href="help.html" data-i18n="footer_help">Help Center</a><a href="rights-acts.html" data-i18n="nav_rights">Farmer Rights</a><a href="auth.html" data-i18n="footer_login">Login / Sign Up</a><a href="admin-login.html" data-i18n="footer_admin">Admin</a></div>
    <div class="footer-links"><h4 data-i18n="footer_contact">Contact</h4><a href="tel:18001234567">1800-123-4567</a><a href="mailto:support@krishisanjivani.gov.in">support@krishisanjivani.gov.in</a><p class="ks-footer-note" data-i18n="footer_available">Available 9am-6pm, Mon-Sat</p></div>
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
    avatar.href = 'auth.html';
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
  await auth.signOut();
  localStorage.removeItem('ks_cart');
  location.href = 'index.html';
}

function requireAuth(callback) {
  auth.onAuthStateChanged(user => {
    if (user) callback(user);
    else location.href = 'auth.html';
  });
}

function getUserRole() {
  return currentUserProfile?.role || 'buyer';
}
