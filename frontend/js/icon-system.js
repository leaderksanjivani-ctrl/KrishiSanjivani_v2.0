// Shared Lucide icon renderer. Authored emoji are converted at the DOM boundary so feature logic stays unchanged.
const KS_ICON_MAP = {
  '🌾': 'wheat', '🌱': 'sprout', '🌿': 'leaf', '🍃': 'leaf', '🍅': 'apple', '🧅': 'circle-dot', '🥔': 'circle-dot', '🍚': 'wheat', '🥭': 'apple',
  '🛒': 'shopping-cart', '🛍️': 'shopping-bag', '🔍': 'search', '🚜': 'tractor', '📦': 'package', '🚚': 'truck', '💰': 'wallet-cards', '💳': 'credit-card',
  '☁️': 'cloud-sun', '☀️': 'sun', '🌤️': 'cloud-sun', '⛅': 'cloud-sun', '🏛️': 'landmark', '📜': 'scroll-text', '❓': 'circle-help', '👤': 'user-round',
  '🔔': 'bell', '🤖': 'message-circle', '🌐': 'globe-2', '⚡': 'zap', '⭐': 'star', '📍': 'map-pin', '📞': 'phone', '📧': 'mail', '👨‍🌾': 'user-round',
  '👩': 'user-round', '🏪': 'store', '📱': 'smartphone', '📸': 'camera', '🏷️': 'tag', '🔊': 'volume-2', '🔒': 'lock-keyhole', '🏆': 'trophy',
  '✅': 'circle-check', '❌': 'circle-x', '⚠️': 'triangle-alert', 'ℹ️': 'info', '📈': 'chart-no-axes-combined', '📋': 'clipboard-list', '🏦': 'landmark',
  '⚖️': 'scale', '🤝': 'handshake', '👥': 'users-round', '📊': 'chart-column', '🛡️': 'shield-check', '🏠': 'house', '🔴': 'circle', '💡': 'lightbulb', '🇮🇳': 'flag', '📡': 'radio-tower', '🏢': 'building-2', '👁': 'eye', '⚙️': 'settings-2', '🚁': 'drone', '💦': 'droplets', '📅': 'calendar-days',
  '✕': 'x', '➤': 'send', '→': 'arrow-right', '←': 'arrow-left', '↓': 'arrow-down', '↑': 'arrow-up', '👉': 'hand', '1️⃣': '1', '2️⃣': '2', '3️⃣': '3', '4️⃣': '4'
};

function ksIconMarkup(name, label) {
  const suffix = label ? ` aria-label="${label.replace(/"/g, '&quot;')}"` : ' aria-hidden="true"';
  return `<i data-lucide="${name}" class="ks-icon"${suffix}></i>`;
}

const KS_FALLBACK_PATH = 'M12 3v18M3 12h18';
function renderLocalIconFallback() {
  document.querySelectorAll('i.ks-icon:not([data-lucide-rendered])').forEach(icon => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'ks-icon'); svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor'); svg.setAttribute('stroke-width', '1.8'); svg.setAttribute('aria-hidden', icon.getAttribute('aria-hidden') || 'true');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path'); path.setAttribute('d', KS_FALLBACK_PATH); svg.append(path);
    icon.replaceWith(svg);
  });
}

function ksReplaceEmojiText(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: node => node.parentElement?.closest('script,style,textarea,[data-emoji-ok]') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  const symbols = Object.keys(KS_ICON_MAP).sort((a, b) => b.length - a.length);
  const pattern = new RegExp(`(${symbols.map(symbol => symbol.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')).join('|')})`, 'gu');
  nodes.forEach(node => {
    if (!pattern.test(node.nodeValue)) { pattern.lastIndex = 0; return; }
    pattern.lastIndex = 0;
    const fragment = document.createDocumentFragment();
    let last = 0;
    node.nodeValue.replace(pattern, (match, _group, offset) => {
      fragment.append(document.createTextNode(node.nodeValue.slice(last, offset)));
      fragment.insertAdjacentHTML?.('beforeend', ksIconMarkup(KS_ICON_MAP[match], match));
      if (!fragment.lastChild || fragment.lastChild.nodeType !== Node.ELEMENT_NODE) {
        const holder = document.createElement('span'); holder.innerHTML = ksIconMarkup(KS_ICON_MAP[match], match); fragment.append(holder.firstElementChild);
      }
      last = offset + match.length;
      return match;
    });
    fragment.append(document.createTextNode(node.nodeValue.slice(last)));
    node.replaceWith(fragment);
  });
}

function initIconSystem() {
  let rendering = false;
  let renderTimer;
  const render = (allowFallback = false) => {
    if (rendering) return;
    rendering = true;
    ksReplaceEmojiText(document.body);
    if (window.lucide) window.lucide.createIcons({ attrs: { 'stroke-width': 1.8 } });
    else if (allowFallback) renderLocalIconFallback();
    rendering = false;
  };
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/lucide@0.468.0/dist/umd/lucide.js';
  script.onload = render;
  script.onerror = () => render(true);
  document.head.appendChild(script);
  ksReplaceEmojiText(document.body);
  new MutationObserver(() => {
    if (!window.lucide || rendering) return;
    clearTimeout(renderTimer);
    renderTimer = setTimeout(render, 40);
  }).observe(document.body, { childList: true, subtree: true });
}
