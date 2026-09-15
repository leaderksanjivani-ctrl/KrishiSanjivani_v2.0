// ============================================================
// KrishiSanjivani — Interactive Virtual WhatsApp Chat Widget
// (100% Client-Side Simulation for SIH Hackathon Visual Demo)
// ============================================================

(function () {
  // Mandi Commodity Rates Database
  const MANDI_DATA = {
    TOMATO: { avg: 32, mandi: 28, unit: 'kg', trend: '▲ +2%' },
    ONION: { avg: 24, mandi: 18, unit: 'kg', trend: '▼ -1%' },
    POTATO: { avg: 20, mandi: 15, unit: 'kg', trend: '▲ +0%' },
    WHEAT: { avg: 22, mandi: 19, unit: 'kg', trend: '▲ +1%' },
    RICE: { avg: 42, mandi: 36, unit: 'kg', trend: '▲ +3%' },
    SUGARCANES: { avg: 320, mandi: 280, unit: 'quintal', trend: '▲ +1%' },
    COTTON: { avg: 6200, mandi: 5800, unit: 'quintal', trend: '▲ +4%' }
  };

  // Inject CSS stylesheet dynamically
  function injectStylesheet() {
    if (document.getElementById('ks-wa-stylesheet')) return;
    const link = document.createElement('link');
    link.id = 'ks-wa-stylesheet';
    link.rel = 'stylesheet';
    link.href = 'css/whatsapp-widget.css';
    document.head.appendChild(link);
  }

  // Render Widget DOM elements
  function renderWidget() {
    if (document.getElementById('ks-wa-modal')) return;

    // Floating Button (FAB)
    const fab = document.createElement('button');
    fab.id = 'ks-wa-fab';
    fab.title = 'Open KrishiSanjivani WhatsApp Assistant';
    fab.innerHTML = `
      <span class="wa-badge">1</span>
      <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
      </svg>
    `;

    // Modal Window
    const modal = document.createElement('div');
    modal.id = 'ks-wa-modal';
    modal.innerHTML = `
      <div class="ks-wa-header">
        <div class="ks-wa-avatar">🌾</div>
        <div class="ks-wa-user-info">
          <div class="ks-wa-name">
            KrishiSanjivani Bot
            <span class="ks-wa-badge-icon">✔</span>
          </div>
          <div class="ks-wa-status">Online</div>
        </div>
        <button class="ks-wa-close-btn" id="ks-wa-close">✕</button>
      </div>

      <div class="ks-wa-body" id="ks-wa-chat-body"></div>

      <div class="ks-wa-chips">
        <button class="ks-wa-chip" data-cmd="PRICE TOMATO">🍅 Tomato Rates</button>
        <button class="ks-wa-chip" data-cmd="PRICE ONION">🧅 Onion Rates</button>
        <button class="ks-wa-chip" data-cmd="SCHEMES">📜 Govt Schemes</button>
        <button class="ks-wa-chip" data-cmd="RENTAL">🚜 Tractor Booking</button>
      </div>

      <div class="ks-wa-footer">
        <input type="text" class="ks-wa-input" id="ks-wa-input" placeholder="Type a message or command...">
        <button class="ks-wa-send-btn" id="ks-wa-send">➤</button>
      </div>
    `;

    document.body.appendChild(fab);
    document.body.appendChild(modal);

    // Event Listeners
    fab.addEventListener('click', () => {
      const isOpen = modal.classList.toggle('open');
      const badge = fab.querySelector('.wa-badge');
      if (badge) badge.style.display = 'none';

      // Auto-close AI chatbot panel if open to prevent screen clutter
      if (isOpen) {
        const aiPanel = document.getElementById('chatbot-panel');
        if (aiPanel && !aiPanel.classList.contains('hidden')) {
          aiPanel.classList.add('hidden');
        }
      }
    });


    document.getElementById('ks-wa-close').addEventListener('click', () => {
      modal.classList.remove('open');
    });

    document.getElementById('ks-wa-send').addEventListener('click', handleUserSend);
    document.getElementById('ks-wa-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleUserSend();
    });

    // Action Chips Click Listener
    modal.querySelectorAll('.ks-wa-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const cmd = chip.getAttribute('data-cmd');
        sendUserMsg(cmd);
        processBotResponse(cmd);
      });
    });

    // Initial Bot Greeting
    setTimeout(() => {
      sendBotMsg(`🌾 *Welcome to KrishiSanjivani Assistant!*\n\nI am your virtual WhatsApp agricultural helper. Ask me about Mandi prices, schemes, or equipment rentals!`);
    }, 400);
  }

  function getCurrentTimeStr() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function sendUserMsg(text) {
    const chatBody = document.getElementById('ks-wa-chat-body');
    const msgEl = document.createElement('div');
    msgEl.className = 'ks-wa-msg user';
    msgEl.innerHTML = `
      ${escapeHtml(text)}
      <div class="ks-wa-time">${getCurrentTimeStr()} <span class="ks-wa-ticks">✓✓</span></div>
    `;
    chatBody.appendChild(msgEl);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function sendBotMsg(text) {
    const chatBody = document.getElementById('ks-wa-chat-body');
    const msgEl = document.createElement('div');
    msgEl.className = 'ks-wa-msg bot';
    msgEl.innerHTML = `
      ${formatMarkdown(text)}
      <div class="ks-wa-time">${getCurrentTimeStr()}</div>
    `;
    chatBody.appendChild(msgEl);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function showTyping() {
    const chatBody = document.getElementById('ks-wa-chat-body');
    const typing = document.createElement('div');
    typing.id = 'ks-wa-typing-indicator';
    typing.className = 'ks-wa-typing';
    typing.innerHTML = `
      <div class="ks-wa-dot"></div>
      <div class="ks-wa-dot"></div>
      <div class="ks-wa-dot"></div>
    `;
    chatBody.appendChild(typing);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function removeTyping() {
    const typing = document.getElementById('ks-wa-typing-indicator');
    if (typing) typing.remove();
  }

  function handleUserSend() {
    const input = document.getElementById('ks-wa-input');
    const text = input.value.trim();
    if (!text) return;

    sendUserMsg(text);
    input.value = '';
    processBotResponse(text);
  }

  function processBotResponse(rawText) {
    const text = rawText.toUpperCase();
    showTyping();

    setTimeout(() => {
      removeTyping();

      if (text.startsWith('PRICE')) {
        const crop = text.split(' ')[1] || 'TOMATO';
        const price = MANDI_DATA[crop] || { avg: 30, mandi: 25, unit: 'kg', trend: 'STABLE' };

        sendBotMsg(`🌾 *KrishiSanjivani Mandi Price Alert*\n\n` +
                   `📦 *Crop:* ${crop}\n` +
                   `📈 *Average Rate:* ₹${price.avg}/${price.unit} (${price.trend})\n` +
                   `🏛️ *Mandi Direct Price:* ₹${price.mandi}/${price.unit}\n` +
                   `📅 *Date:* ${new Date().toLocaleDateString('en-IN')}\n\n` +
                   `Reply *SUBSCRIBE* for daily price alerts!`);
      }
      else if (text.startsWith('SCHEME') || text === 'SUBSIDY') {
        sendBotMsg(`📜 *Government Agritech Schemes & Subsidies*\n\n` +
                   `1. *PM-KISAN*: ₹6,000 yearly direct income transfer.\n` +
                   `2. *PM Fasal Bima Yojana*: Crop loss insurance.\n` +
                   `3. *MahaDBT Tractor Subsidy*: Up to 50% subsidy on farm machinery.\n` +
                   `4. *Kisan Credit Card (KCC)*: Concessional loans @ 4% interest.`);
      }
      else if (text.startsWith('RENT') || text.startsWith('EQUIPMENT') || text.startsWith('TRACTOR')) {
        sendBotMsg(`🚜 *Equipment Rental Services*\n\n` +
                   `Available nearby:\n` +
                   `• *Mahindra 575 DI Tractor*: ₹1,200/day\n` +
                   `• *Solar Crop Dryer*: ₹400/day\n` +
                   `• *Combine Harvester*: ₹2,200/day`);
      }
      else if (text.startsWith('SUBSCRIBE')) {
        sendBotMsg(`✅ *Subscribed Successfully!*\n\nYou will now receive daily Mandi price alerts and scheme updates on WhatsApp.`);
      }
      else {
        sendBotMsg(`🌾 *KrishiSanjivani Assistant*\n\nTry commands like:\n• *PRICE TOMATO*\n• *PRICE ONION*\n• *SCHEMES*\n• *RENTAL*`);
      }
    }, 650);
  }

  function formatMarkdown(str) {
    return escapeHtml(str)
      .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.innerText = str;
    return div.innerHTML;
  }

  // Initialize widget on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    injectStylesheet();
    renderWidget();
  });
})();
