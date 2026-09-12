// ============================================================
// KrishiSanjivani — Persistent Navbar + Auth State
// ============================================================

let currentUser = null;
let currentUserProfile = null;

async function initNav() {
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
        'weather.html','schemes.html','rights-acts.html'
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

  // Low data toggle
  const ldBtn = document.getElementById('low-data-btn');
  if (ldBtn) {
    const isLowData = localStorage.getItem('ks_low_data') === '1';
    if (isLowData) { document.body.classList.add('low-data'); ldBtn.classList.add('active'); }
    ldBtn.addEventListener('click', () => {
      document.body.classList.toggle('low-data');
      const active = document.body.classList.contains('low-data');
      localStorage.setItem('ks_low_data', active ? '1' : '0');
      ldBtn.classList.toggle('active', active);
      showToast(active ? '📡 Low Data Mode ON' : '📶 Normal Mode', 'info');
    });
  }
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
