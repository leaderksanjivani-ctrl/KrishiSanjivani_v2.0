/*
 * Shared SIH feature helpers.
 * Forecasting and routing deliberately run in the browser: this is the JS trend
 * model / greedy route approximation selected in the product stack decision.
 */
(function () {
  const DAY_MS = 24 * 60 * 60 * 1000;
  const SHELF_LIFE_DAYS = { tomato: 7, onion: 45, potato: 30, banana: 7, mango: 10, rice: 365, wheat: 365, maize: 180 };

  function numericSeries(values) {
    return (values || []).map(Number).filter(Number.isFinite);
  }

  function forecastRange(values, periods = 7) {
    const series = numericSeries(values);
    if (!series.length) return { low: 0, high: 0, midpoint: 0, confidence: 0, engine: 'JS trend model' };
    const window = series.slice(-Math.min(7, series.length));
    const mean = window.reduce((sum, value) => sum + value, 0) / window.length;
    const slope = window.length > 1 ? (window[window.length - 1] - window[0]) / (window.length - 1) : 0;
    const variance = window.reduce((sum, value) => sum + ((value - mean) ** 2), 0) / window.length;
    const spread = Math.max(mean * 0.06, Math.sqrt(variance), 1);
    const midpoint = Math.max(0, mean + slope * periods);
    return { low: Math.round(Math.max(0, midpoint - spread)), high: Math.round(midpoint + spread), midpoint: Math.round(midpoint), confidence: Math.max(45, Math.round(100 - (spread / Math.max(mean, 1)) * 100)), engine: 'JS trend model' };
  }

  function trustScore(profile) {
    const completed = Number(profile?.completedOrderCount || 0);
    const disputes = Number(profile?.disputeCount || 0);
    const rating = Number(profile?.rating || 0);
    const ratingScore = rating ? Math.min(20, Math.max(0, (rating - 3) * 10)) : 0;
    return Math.max(0, Math.min(100, Math.round(70 + Math.min(15, completed * 2) + ratingScore - Math.min(30, disputes * 8))));
  }

  function freshness(crop, harvestDate, now = Date.now()) {
    const shelfLife = SHELF_LIFE_DAYS[String(crop || '').toLowerCase()] || 14;
    const harvested = new Date(harvestDate).getTime();
    const ageHours = Number.isFinite(harvested) ? Math.max(0, (now - harvested) / (60 * 60 * 1000)) : shelfLife * 24;
    return { percent: Math.max(0, Math.min(100, Math.round(100 - (ageHours / (shelfLife * 24)) * 100))), ageHours: Math.round(ageHours), shelfLifeDays: shelfLife };
  }

  function escrowLabel(order) {
    const status = order?.escrowStatus || (order?.paymentStatus === 'paid' ? 'held' : 'pending');
    return status === 'released' ? 'Payment Released' : status === 'disputed' ? 'Dispute Under Review' : status === 'refunded' ? 'Payment Refunded' : 'Payment Held - releases on delivery confirmation';
  }

  async function writeAudit(action, details = {}) {
    const actor = typeof auth !== 'undefined' ? auth.currentUser : null;
    if (typeof db === 'undefined' || !db || !actor) return;
    await db.collection(COLLECTIONS.auditLog).add({ action, details, actorId: actor.uid, actorEmail: actor.email || null, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
  }

  async function releaseEscrow(orderId, reason = 'buyer_confirmed_delivery') {
    const ref = db.collection(COLLECTIONS.orders).doc(orderId);
    const snap = await ref.get();
    if (!snap.exists) throw new Error('Order not found');
    const order = snap.data();
    if (order.escrowStatus === 'disputed' || order.escrowStatus === 'refunded') throw new Error('This order is under dispute');
    await ref.update({ escrowStatus: 'released', releasedAt: firebase.firestore.FieldValue.serverTimestamp(), escrowReleaseReason: reason, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
    await writeAudit('escrow_released', { orderId, reason });
  }

  async function restoreListingStock(order) {
    const items = order?.items || [];
    for (const item of items) {
      if (!item.listingId) continue;
      const ref = db.collection(COLLECTIONS.listings).doc(item.listingId);
      await db.runTransaction(async transaction => {
        const snap = await transaction.get(ref);
        if (!snap.exists) return;
        const listing = snap.data();
        const quantity = Number(listing.qty ?? listing.quantity ?? 0) + Number(item.qty || 0);
        transaction.update(ref, { qty: quantity, quantity, status: quantity > 0 ? 'active' : listing.status, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
      });
    }
  }

  function createLedgerPayload(order, previousHash = '') {
    return JSON.stringify({ farmerId: order.farmerId || order.items?.[0]?.farmerId || '', buyerId: order.buyerId || '', amount: Number(order.amount || order.totalAmount || 0), timestamp: order.paidAt || order.createdAt || '', previousHash });
  }

  async function sha256(value) {
    const bytes = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest)).map(byte => byte.toString(16).padStart(2, '0')).join('');
  }

  window.KSFeatures = { DAY_MS, forecastRange, trustScore, freshness, escrowLabel, releaseEscrow, restoreListingStock, createLedgerPayload, sha256, writeAudit };
})();