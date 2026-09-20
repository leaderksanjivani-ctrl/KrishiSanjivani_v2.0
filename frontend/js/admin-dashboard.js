/* Firestore-backed administration view. Rules must enforce the same admin role server-side. */
(function () {
  let unsubscribers = [];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const valueOf = (data, ...keys) => keys.map(key => data[key]).find(value => value !== undefined && value !== null && value !== '');
  const money = value => `₹${Number(value || 0).toLocaleString('en-IN')}`;

  document.addEventListener('DOMContentLoaded', () => {
    auth.onAuthStateChanged(async user => {
      if (!user) return (location.href = 'admin-login.html');
      const profile = await db.collection(COLLECTIONS.users).doc(user.uid).get();
      if (!profile.exists || profile.data().role !== 'admin') {
        await auth.signOut();
        return (location.href = 'dashboard.html?error=admin-required');
      }
      document.getElementById('admin-user-tag').textContent = `Admin: ${user.email || user.uid}`;
      loadAdminData();
    });
  });

  async function readCollection(name, limit = 500) {
    try { return (await db.collection(name).limit(limit).get()).docs.map(doc => ({ id: doc.id, ...doc.data() })); }
    catch (error) { console.warn(`Admin ${name} read failed`, error); return []; }
  }

  async function loadAdminData() {
    const [users, listings, orders, complaints, bookings, audit] = await Promise.all([
      readCollection(COLLECTIONS.users), readCollection(COLLECTIONS.listings), readCollection(COLLECTIONS.orders), readCollection(COLLECTIONS.complaints), readCollection(COLLECTIONS.bookings), readCollection(COLLECTIONS.auditLog)
    ]);
    renderKpis(users, listings, orders);
    renderUsers(users);
    renderListings(listings);
    renderOrders(orders, bookings);
    renderComplaints(complaints);
    renderAudit(audit);
    renderAnalytics(orders, listings, users);
  }

  function renderKpis(users, listings, orders) {
    const gmv = orders.reduce((sum, item) => sum + Number(valueOf(item, 'amount', 'totalAmount') || 0), 0);
    const savings = orders.reduce((sum, item) => sum + Math.max(0, Number(item.mandiTotal || item.mandiRate || 0) - Number(item.amount || item.totalAmount || 0)), 0);
    const set = (id, value) => { const node = document.getElementById(id); if (node) node.textContent = value; };
    set('kpi-gmv', money(gmv)); set('kpi-savings', money(savings)); set('kpi-users', users.length); set('kpi-orders', orders.length);
    const active = document.getElementById('active-listings-count'); if (active) active.textContent = `${listings.filter(item => item.status === 'active').length} Active Listings`;
  }

  function renderUsers(users) {
    const tbody = document.getElementById('users-table-body');
    if (!tbody) return;
    tbody.innerHTML = users.length ? users.map(user => `<tr><td><strong>${esc(user.name || user.email || user.uid)}</strong></td><td><span class="badge badge-blue">${esc(user.role || 'unset')}</span></td><td>${esc(user.email || user.phone || '—')}</td><td>${user.isVerified ? '<span class="badge-verify">Verified</span>' : '<span class="badge-unverify">Pending</span>'}</td><td>${money(user.walletBalance || user.totalEarnings)}</td><td class="table-actions"><button class="btn-action btn-action-green" onclick="adminUpdateUser('${user.id}', ${!user.isVerified})">${user.isVerified ? 'Unverify' : 'Approve'}</button><button class="btn-action btn-action-red" onclick="adminSuspendUser('${user.id}')">Suspend</button></td></tr>`).join('') : '<tr><td colspan="6">No user records found.</td></tr>';
  }

  function renderListings(listings) {
    const tbody = document.getElementById('listings-table-body');
    if (!tbody) return;
    tbody.innerHTML = listings.length ? listings.map(item => `<tr><td>${esc(item.id)}</td><td><strong>${esc(item.crop || item.cropName || item.title || 'Produce')}</strong></td><td>${esc(item.farmerName || item.sellerName || item.farmerId || '—')}</td><td>${esc(item.locationText || item.location || '—')}</td><td>${money(item.price)} / ${esc(item.unit || 'kg')}</td><td><span class="badge ${item.status === 'active' ? 'badge-green' : 'badge-orange'}">${esc(item.status || 'unknown')}</span></td><td class="table-actions"><button class="btn-action btn-action-amber" onclick="adminFlagListing('${item.id}')">Flag</button><button class="btn-action btn-action-red" onclick="adminRemoveListing('${item.id}')">Remove</button></td></tr>`).join('') : '<tr><td colspan="7">No listings found.</td></tr>';
  }

  function renderOrders(orders, bookings) {
    const tbody = document.getElementById('orders-table-body');
    if (!tbody) return;
    const rows = orders.map(order => `<tr><td><strong>${esc(order.id)}</strong></td><td>${esc(order.buyerName || order.buyerId || '—')}</td><td>${esc(order.crop || 'Produce')}</td><td>${money(order.amount || order.totalAmount)}</td><td><span class="badge badge-gold">${esc(order.deliveryStatus || 'placed')}</span></td><td><select onchange="adminUpdateOrder('${order.id}', this.value)"><option>placed</option><option>confirmed</option><option>transit</option><option>delivered</option><option>cancelled</option></select></td></tr>`);
    const bookingRows = bookings.map(item => `<tr><td><strong>${esc(item.id)}</strong></td><td>${esc(item.userId || '—')}</td><td>Equipment booking</td><td>${money(item.total || item.amount)}</td><td><span class="badge badge-gold">${esc(item.status || 'booked')}</span></td><td>Oversight</td></tr>`);
    tbody.innerHTML = rows.concat(bookingRows).join('') || '<tr><td colspan="6">No orders or bookings found.</td></tr>';
  }

  function renderComplaints(complaints) {
    const tbody = document.getElementById('complaints-table-body');
    if (!tbody) return;
    tbody.innerHTML = complaints.length ? complaints.map(item => `<tr><td><strong>${esc(item.id)}</strong></td><td>${esc(item.userId || '—')}</td><td>${esc(item.subject || item.description || 'Support request').slice(0, 80)}</td><td><span class="badge badge-blue">${esc(item.category || 'General')}</span></td><td><span class="badge ${item.status === 'resolved' ? 'badge-green' : 'badge-orange'}">${esc(item.status || 'open')}</span></td><td><select onchange="adminUpdateComplaint('${item.id}', this.value)"><option ${item.status === 'open' ? 'selected' : ''}>open</option><option ${item.status === 'in_progress' ? 'selected' : ''}>in_progress</option><option ${item.status === 'resolved' ? 'selected' : ''}>resolved</option></select></td></tr>`).join('') : '<tr><td colspan="6">No complaints found.</td></tr>';
  }

  function renderAnalytics(orders, listings, users) {
    const labels = ['Transactions', 'GMV', 'Farmer / Buyer', 'Crop spread', 'Demand forecast'];
    const values = [orders.length, orders.reduce((sum, item) => sum + Number(item.amount || item.totalAmount || 0), 0), users.filter(item => item.role === 'farmer').length + users.filter(item => item.role === 'buyer').length, listings.reduce((sum, item) => sum + Math.max(0, Number(item.mandiPrice || 0) - Number(item.price || 0)), 0), listings.length];
    const createCanvas = (id, title) => { let canvas = document.getElementById(id); if (!canvas) { const box = document.createElement('div'); box.className = 'chart-box'; box.innerHTML = `<h3 class="mb-sm">${title}</h3><canvas id="${id}" height="180"></canvas>`; document.querySelector('.chart-grid')?.appendChild(box); canvas = box.querySelector('canvas'); } return canvas; };
    const canvas = createCanvas('admin-overview-chart', 'Live platform indicators');
    if (canvas && window.Chart) new Chart(canvas.getContext('2d'), { type: 'bar', data: { labels, datasets: [{ label: 'Current value', data: values, backgroundColor: ['#2f6b3c', '#d9a441', '#477a91', '#b77a1e', '#6b8f71'] }] }, options: { responsive: true, plugins: { legend: { display: false } } } });
    if (window.L && !document.getElementById('admin-map')) { const mapBox = document.createElement('div'); mapBox.className = 'chart-box'; mapBox.innerHTML = '<h3 class="mb-sm">Regional order density</h3><div id="admin-map" style="height:260px;border-radius:10px"></div>'; document.querySelector('.chart-grid')?.appendChild(mapBox); const map = L.map('admin-map').setView([19.076, 73.0], 6); L.tileLayer(APP_CONFIG.mapTileUrl, { attribution: APP_CONFIG.mapAttribution }).addTo(map); orders.forEach((order, index) => { const lat = Number(order.location?.latitude || order.lat || 19.076 + (index % 5) * .2); const lng = Number(order.location?.longitude || order.lng || 72.8777 + (index % 5) * .2); L.circleMarker([lat, lng], { radius: 5 + Math.min(10, Number(order.amount || 1) / 1000), color: '#2f6b3c', fillOpacity: .55 }).addTo(map); }); }
  }

  function renderAudit(events) {
    const tbody = document.getElementById('audit-table-body');
    if (!tbody) return;
    tbody.innerHTML = events.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || ''))).slice(0, 100).map(item => `<tr><td>${esc(item.createdAt || 'Pending timestamp')}</td><td><strong>${esc(item.action || 'admin_action')}</strong></td><td>${esc(item.actorEmail || item.actorId || '—')}</td><td>${esc(JSON.stringify(item.details || {}))}</td></tr>`).join('') || '<tr><td colspan="4">No audit events yet.</td></tr>';
  }

  window.adminUpdateUser = async (id, verified) => { await db.collection(COLLECTIONS.users).doc(id).update({ isVerified: verified, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }); await KSFeatures.writeAudit('user_verification_changed', { id, verified }); loadAdminData(); };
  window.adminSuspendUser = async id => { await db.collection(COLLECTIONS.users).doc(id).update({ suspended: true, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }); await KSFeatures.writeAudit('user_suspended', { id }); loadAdminData(); };
  window.adminFlagListing = async id => { await db.collection(COLLECTIONS.listings).doc(id).update({ flagged: true, status: 'flagged', updatedAt: firebase.firestore.FieldValue.serverTimestamp() }); await KSFeatures.writeAudit('listing_flagged', { id }); loadAdminData(); };
  window.adminRemoveListing = async id => { await db.collection(COLLECTIONS.listings).doc(id).update({ status: 'removed', updatedAt: firebase.firestore.FieldValue.serverTimestamp() }); await KSFeatures.writeAudit('listing_removed', { id }); loadAdminData(); };
  window.adminUpdateOrder = async (id, status) => { await db.collection(COLLECTIONS.orders).doc(id).update({ deliveryStatus: status, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }); await KSFeatures.writeAudit('order_status_changed', { id, status }); loadAdminData(); };
  window.adminUpdateComplaint = async (id, status) => { await db.collection(COLLECTIONS.complaints).doc(id).update({ status, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }); await KSFeatures.writeAudit('complaint_status_changed', { id, status }); loadAdminData(); };
  window.refreshAdminData = loadAdminData;
})();
