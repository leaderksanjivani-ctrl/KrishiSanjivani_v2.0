// ============================================================
// KrishiSanjivani — Route Optimizer (Haversine + Nearest-Neighbor TSP)
// ============================================================

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function nearestNeighborTSP(points) {
  // points: [{lat, lng, id, label, isNow}]
  // "Delivery Now" orders get priority (sorted to front first)
  const now = points.filter(p => p.isNow);
  const scheduled = points.filter(p => !p.isNow);
  const combined = [...now, ...scheduled];
  
  if (combined.length <= 1) return combined;

  const visited = new Set();
  const route = [combined[0]];
  visited.add(0);

  while (visited.size < combined.length) {
    const last = route[route.length - 1];
    let minDist = Infinity, nextIdx = -1;

    combined.forEach((pt, i) => {
      if (!visited.has(i)) {
        const d = haversineKm(last.lat, last.lng, pt.lat, pt.lng);
        if (d < minDist) { minDist = d; nextIdx = i; }
      }
    });

    if (nextIdx >= 0) { route.push(combined[nextIdx]); visited.add(nextIdx); }
    else break;
  }

  return route;
}

function totalRouteKm(route) {
  let total = 0;
  for (let i = 0; i < route.length - 1; i++) {
    total += haversineKm(route[i].lat, route[i].lng, route[i+1].lat, route[i+1].lng);
  }
  return total.toFixed(1);
}

function drawRouteOnMap(map, route, options = {}) {
  const coords = route.map(p => [p.lat, p.lng]);
  
  // Draw polyline
  const polyline = L.polyline(coords, {
    color: options.color || '#138808',
    weight: 4,
    opacity: 0.8,
    dashArray: options.dashed ? '8, 6' : null
  }).addTo(map);

  // Add markers
  route.forEach((pt, i) => {
    const isFirst = i === 0;
    const isLast = i === route.length - 1;
    const isNow = pt.isNow;

    const icon = L.divIcon({
      className: '',
      html: `<div style="
        width:${isFirst || isLast ? 36 : 28}px;
        height:${isFirst || isLast ? 36 : 28}px;
        background:${isFirst ? '#FF6B00' : isLast ? '#138808' : isNow ? '#0070C0' : '#fff'};
        border:3px solid ${isFirst ? '#CC5200' : isLast ? '#0D6506' : '#138808'};
        border-radius:50%;
        display:flex;align-items:center;justify-content:center;
        font-size:${isFirst || isLast ? 16 : 12}px;
        font-weight:bold;color:${isFirst || isLast || isNow ? '#fff' : '#138808'};
        box-shadow:0 2px 8px rgba(0,0,0,0.2);
      ">${isFirst ? '🚜' : isLast ? '🏠' : (i)}</div>`,
      iconSize: [isFirst || isLast ? 36 : 28, isFirst || isLast ? 36 : 28],
      iconAnchor: [isFirst || isLast ? 18 : 14, isFirst || isLast ? 18 : 14]
    });

    const popup = `<strong>${isFirst ? '📦 Pickup' : isLast ? '🏠 Final Stop' : `Stop ${i}`}</strong><br>
      ${pt.label || ''}<br>
      ${isNow ? '<span style="color:#0070C0;font-weight:bold">⚡ Delivery Now</span>' : ''}`;

    L.marker([pt.lat, pt.lng], { icon }).addTo(map).bindPopup(popup);
  });

  // Fit map to route
  if (coords.length > 0) map.fitBounds(polyline.getBounds(), { padding: [40, 40] });

  return polyline;
}
