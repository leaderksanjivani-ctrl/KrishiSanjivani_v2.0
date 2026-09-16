// ============================================================
// KrishiSanjivani — AI Chatbot Widget (Keyword Intent Engine)
// ============================================================

const CHATBOT_FAQ = [
  {
    keywords: ['hello', 'hi', 'namaste', 'hey', 'नमस्ते', 'नमस्कार'],
    intent: 'greeting',
    response: {
      en: 'Hello! 👋 I\'m KrishiBot. I can help you with:\n• 🌾 Crop prices\n• 📦 Order status\n• 🏛️ Government schemes\n• 💰 How to sell produce\n• 🚜 Equipment rental\n\nWhat would you like to know?',
      hi: 'नमस्ते! 👋 मैं KrishiBot हूं। मैं इनमें मदद कर सकता हूं:\n• 🌾 फसल के दाम\n• 📦 ऑर्डर की स्थिति\n• 🏛️ सरकारी योजनाएं\n• 💰 उपज बेचने का तरीका\n• 🚜 उपकरण किराया',
      mr: 'नमस्कार! 👋 मी KrishiBot आहे. मी मदत करू शकतो:\n• 🌾 पिकांच्या किंमती\n• 📦 ऑर्डर स्थिती\n• 🏛️ सरकारी योजना\n• 💰 उत्पादन विक्री\n• 🚜 उपकरण भाडे'
    }
  },
  {
    keywords: ['price', 'rate', 'cost', 'दाम', 'भाव', 'किंमत', 'मूल्य', 'tomato', 'onion', 'wheat', 'rice', 'potato', 'टमाटर', 'प्याज', 'गेहूं', 'टोमॅटो', 'कांदा', 'गहू'],
    intent: 'crop_prices',
    response: {
      en: '🌾 **Current Market Prices** (KrishiSanjivani platform):\n\n🍅 Tomato: ₹32/kg (Mandi: ₹28)\n🧅 Onion: ₹24/kg (Mandi: ₹18)\n🥔 Potato: ₹20/kg (Mandi: ₹15)\n🌾 Wheat: ₹22/kg (Mandi: ₹19)\n🍚 Rice: ₹42/kg (Mandi: ₹36)\n\n✅ Buy direct = Farmer earns more, you pay less!\n👉 <a href="marketplace.html">Browse Marketplace</a>',
      hi: '🌾 **वर्तमान बाज़ार दाम** (KrishiSanjivani):\n\n🍅 टमाटर: ₹32/किलो (मंडी: ₹28)\n🧅 प्याज: ₹24/किलो (मंडी: ₹18)\n🥔 आलू: ₹20/किलो (मंडी: ₹15)\n🌾 गेहूं: ₹22/किलो (मंडी: ₹19)\n\n👉 <a href="marketplace.html">बाज़ार देखें</a>',
      mr: '🌾 **सध्याचे बाजारभाव** (KrishiSanjivani):\n\n🍅 टोमॅटो: ₹32/किलो (मंडी: ₹28)\n🧅 कांदा: ₹24/किलो (मंडी: ₹18)\n🥔 बटाटा: ₹20/किलो (मंडी: ₹15)\n\n👉 <a href="marketplace.html">बाजार पहा</a>'
    }
  },
  {
    keywords: ['sell', 'list', 'upload', 'produce', 'बेचना', 'सूची', 'विकणे', 'नोंदवणे'],
    intent: 'how_to_sell',
    response: {
      en: '💰 **How to Sell Your Produce:**\n\n1️⃣ Go to Dashboard → Tap **Sell** 🌾\n2️⃣ Select your crop from the icon list\n3️⃣ Enter quantity & your price (AI will suggest market rate)\n4️⃣ Upload a photo of your produce\n5️⃣ Pin your farm location on the map\n6️⃣ Tap **Publish** — buyers can see it instantly!\n\n✅ No middlemen. No commission on first 3 listings!\n👉 <a href="list-item.html">Start Listing Now</a>',
      hi: '💰 **उपज कैसे बेचें:**\n\n1️⃣ डैशबोर्ड → **बेचें** पर टैप करें\n2️⃣ आइकन सूची से फसल चुनें\n3️⃣ मात्रा और मूल्य दर्ज करें\n4️⃣ उपज की फ़ोटो अपलोड करें\n5️⃣ मानचित्र पर खेत पिन करें\n6️⃣ **प्रकाशित** करें!\n\n👉 <a href="list-item.html">अभी सूचीबद्ध करें</a>',
      mr: '💰 **उत्पादन कसे विकावे:**\n\n1️⃣ डॅशबोर्ड → **विका** टॅप करा\n2️⃣ पिकाचे चिन्ह निवडा\n3️⃣ प्रमाण आणि किंमत टाका\n4️⃣ उत्पादनाचा फोटो अपलोड करा\n5️⃣ नकाशावर शेत पिन करा\n6️⃣ **प्रकाशित** करा!\n\n👉 <a href="list-item.html">आता नोंदवा</a>'
    }
  },
  {
    keywords: ['order', 'status', 'track', 'where', 'delivery', 'ऑर्डर', 'स्थिति', 'ट्रैक', 'डिलिव्हरी'],
    intent: 'order_status',
    response: {
      en: '📦 **Check Your Order Status:**\n\n• Go to Dashboard → **My Orders** 📦\n• Or tap **Track Delivery** 🚚\n• You can also track on the map in real-time!\n\nNeed help with a specific order? Tell me your order ID and I\'ll look it up.\n👉 <a href="order-tracking.html">Track Now</a>',
      hi: '📦 **ऑर्डर स्थिति जांचें:**\n\n• डैशबोर्ड → **मेरे ऑर्डर** पर जाएं\n• या **ट्रैक डिलीवरी** टैप करें\n• आप मानचित्र पर भी ट्रैक कर सकते हैं!\n\n👉 <a href="order-tracking.html">अभी ट्रैक करें</a>',
      mr: '📦 **ऑर्डर स्थिती तपासा:**\n\n• डॅशबोर्ड → **माझे ऑर्डर** वर जा\n• किंवा **ट्रॅक डिलिव्हरी** टॅप करा\n\n👉 <a href="order-tracking.html">आत्ता ट्रॅक करा</a>'
    }
  },
  {
    keywords: ['mahadbt', 'maha', 'dbt', 'subsidy', 'सब्सिडी', 'अनुदान', 'सबसिडी'],
    intent: 'mahadbt',
    response: {
      en: '🏛️ **MahaDBT — Maharashtra Direct Benefit Transfer:**\n\nMahaDBT is the official Maharashtra government portal for farmer subsidies and scheme benefits.\n\n✅ What you can do:\n• Check subsidy application status\n• Apply for agricultural equipment subsidy\n• Get crop insurance benefits\n• Link Aadhaar to bank account\n\n⚠️ This is an external government portal — KrishiSanjivani provides the link as a service.\n👉 <a href="schemes.html">Go to MahaDBT Section</a>',
      hi: '🏛️ **MahaDBT — महाराष्ट्र DBT पोर्टल:**\n\nMahaDBT किसान सब्सिडी का सरकारी पोर्टल है।\n\n✅ आप कर सकते हैं:\n• सब्सिडी आवेदन स्थिति जांचें\n• कृषि उपकरण सब्सिडी के लिए आवेदन करें\n\n👉 <a href="schemes.html">MahaDBT सेक्शन पर जाएं</a>',
      mr: '🏛️ **MahaDBT — महाराष्ट्र DBT पोर्टल:**\n\nMahaDBT शेतकरी सबसिडीचे अधिकृत पोर्टल आहे.\n\n👉 <a href="schemes.html">MahaDBT विभागात जा</a>'
    }
  },
  {
    keywords: ['scheme', 'pm-kisan', 'kisan', 'insurance', 'subsidy', 'government', 'योजना', 'पीएम किसान', 'बीमा', 'सरकार', 'योजना'],
    intent: 'schemes',
    response: {
      en: '🏛️ **Government Schemes for Farmers:**\n\n💰 **PM-KISAN** — ₹6,000/year direct to bank\n🌾 **PM Fasal Bima** — Crop insurance scheme\n💧 **PM Krishi Sinchai** — Irrigation support\n🌱 **Soil Health Card** — Free soil testing\n🏦 **Kisan Credit Card** — Easy farm loans\n📱 **e-NAM** — National digital market\n\n👉 <a href="schemes.html">View All Schemes</a>',
      hi: '🏛️ **किसानों के लिए सरकारी योजनाएं:**\n\n💰 पीएम-किसान — ₹6,000/साल\n🌾 प्रधानमंत्री फसल बीमा — फसल बीमा\n\n👉 <a href="schemes.html">सभी योजनाएं देखें</a>',
      mr: '🏛️ **शेतकऱ्यांसाठी सरकारी योजना:**\n\n💰 पीएम-किसान — ₹6,000/वर्ष\n🌾 पंतप्रधान फसल बीमा\n\n👉 <a href="schemes.html">सर्व योजना पहा</a>'
    }
  },
  {
    keywords: ['rent', 'tractor', 'equipment', 'machine', 'drone', 'किराया', 'ट्रैक्टर', 'मशीन', 'उपकरण', 'भाडे', 'ट्रॅक्टर'],
    intent: 'equipment_rental',
    response: {
      en: '🚜 **Farm Equipment Rental:**\n\nRent agricultural equipment by the day:\n🚜 Tractors — from ₹800/day\n⚙️ Tillers — from ₹400/day\n🚁 Drones — from ₹1,200/day\n🌾 Harvesters — from ₹1,500/day\n💦 Water Pumps — from ₹200/day\n\n✅ Pay only for days you use!\n👉 <a href="equipment-rental.html">Browse Equipment</a>',
      hi: '🚜 **कृषि उपकरण किराया:**\n\nदैनिक किराए पर उपकरण लें:\n🚜 ट्रैक्टर — ₹800/दिन से\n⚙️ टिलर — ₹400/दिन से\n\n👉 <a href="equipment-rental.html">उपकरण देखें</a>',
      mr: '🚜 **शेती उपकरण भाडे:**\n\nदिवसवार भाड्याने उपकरणे:\n🚜 ट्रॅक्टर — ₹800/दिवस\n\n👉 <a href="equipment-rental.html">उपकरणे पहा</a>'
    }
  },
  {
    keywords: ['weather', 'rain', 'forecast', 'temperature', 'मौसम', 'बारिश', 'पूर्वानुमान', 'हवामान', 'पाऊस'],
    intent: 'weather',
    response: {
      en: '☁️ **Weather Forecast:**\n\nCheck the 5-day weather forecast for your farm location, with daily farming tips!\n\nFeatures:\n🌡️ Temperature & humidity\n🌧️ Rainfall probability\n💨 Wind speed\n🌾 Daily farming tip (e.g., "Rain expected — delay pesticide spraying")\n\n👉 <a href="weather.html">View Weather Forecast</a>',
      hi: '☁️ **मौसम पूर्वानुमान:**\n\n5 दिन का मौसम और खेती टिप्स देखें!\n\n👉 <a href="weather.html">मौसम देखें</a>',
      mr: '☁️ **हवामान अंदाज:**\n\n5 दिवसांचा अंदाज आणि शेती टिप्स!\n\n👉 <a href="weather.html">हवामान पहा</a>'
    }
  },
  {
    keywords: ['rights', 'law', 'act', 'legal', 'msp', 'अधिकार', 'कानून', 'अधिनियम', 'हक्क', 'कायदा'],
    intent: 'rights',
    response: {
      en: '📜 **Farmer Rights & Acts:**\n\nKey protections for farmers:\n⚖️ **MSP Guarantee** — Minimum Support Price rights\n🤝 **Contract Farming Act** — Fair contract terms\n💰 **APMC Act** — Right to sell outside mandi\n🏦 **Loan Waiver Schemes** — Debt relief options\n📋 **Land Rights** — Tenant farming protections\n\n👉 <a href="rights-acts.html">Read Your Rights</a>',
      hi: '📜 **किसान अधिकार और कानून:**\n\n👉 <a href="rights-acts.html">अपने अधिकार पढ़ें</a>',
      mr: '📜 **शेतकरी हक्क आणि कायदे:**\n\n👉 <a href="rights-acts.html">तुमचे हक्क वाचा</a>'
    }
  },
  {
    keywords: ['help', 'support', 'contact', 'problem', 'issue', 'complaint', 'मदद', 'समस्या', 'शिकायत', 'मदत', 'तक्रार'],
    intent: 'help',
    response: {
      en: '❓ **Help & Support:**\n\n• 📖 <a href="help.html">Help Center</a> — Step-by-step guides\n• 📜 <a href="rights-acts.html">Farmer Rights</a>\n• 📞 Helpline: 1800-XXX-XXXX (Toll Free)\n• 📧 support@krishisanjivani.gov.in\n\n🎙️ Tip: Use the **"Read Aloud"** button on any page if reading is difficult!',
      hi: '❓ **सहायता:**\n\n• 📖 <a href="help.html">सहायता केंद्र</a>\n• 📞 हेल्पलाइन: 1800-XXX-XXXX\n\n👉 <a href="help.html">सहायता पर जाएं</a>',
      mr: '❓ **मदत:**\n\n• 📖 <a href="help.html">मदत केंद्र</a>\n• 📞 हेल्पलाइन: 1800-XXX-XXXX\n\n👉 <a href="help.html">मदतीसाठी जा</a>'
    }
  },
  {
    keywords: ['register', 'signup', 'join', 'account', 'login', 'नोंदणी', 'खाता', 'साइन अप'],
    intent: 'registration',
    response: {
      en: '📱 **How to Sign Up:**\n\n1️⃣ Go to the Login page\n2️⃣ Enter your phone number or email\n3️⃣ OR tap **"Continue with Google"**\n4️⃣ Select your role: Farmer / Buyer / Bulk Buyer\n5️⃣ Done! Start buying or selling.\n\n✅ No fees to join!\n👉 <a href="auth.html">Create Account</a>',
      hi: '📱 **साइन अप कैसे करें:**\n\n1️⃣ लॉगिन पेज पर जाएं\n2️⃣ फ़ोन नंबर या ईमेल दर्ज करें\n3️⃣ या **"Google से जारी रखें"**\n\n👉 <a href="auth.html">खाता बनाएं</a>',
      mr: '📱 **नोंदणी कशी करावी:**\n\n1️⃣ लॉगिन पेजवर जा\n2️⃣ फोन किंवा ईमेल टाका\n3️⃣ किंवा **"Google ने सुरू ठेवा"**\n\n👉 <a href="auth.html">खाते तयार करा</a>'
    }
  }
];

let chatbotOpen = false;

function initChatbot() {
  const btn = document.getElementById('chatbot-btn');
  const panel = document.getElementById('chatbot-panel');
  const closeBtn = document.getElementById('chatbot-close');
  const input = document.getElementById('chatbot-input');
  const sendBtn = document.getElementById('chatbot-send');
  const messages = document.getElementById('chatbot-messages');

  if (!btn || !panel) return;
  loadFirestoreFaqs();

  // Toggle panel
  btn.addEventListener('click', () => {
    chatbotOpen = !chatbotOpen;
    panel.classList.toggle('hidden', !chatbotOpen);
    btn.querySelector('.chatbot-badge').style.display = 'none';
    if (chatbotOpen && messages.children.length === 0) {
      addBotMessage(t('chatbot_greeting'));
      // Show suggestions
      showSuggestions(['💰 Crop prices', '📦 My order', '🏛️ Schemes', '🚜 Rent equipment', '☁️ Weather']);
    }
    if (chatbotOpen) input.focus();
  });

  closeBtn.addEventListener('click', () => {
    chatbotOpen = false;
    panel.classList.add('hidden');
  });

  // Send message
  sendBtn.addEventListener('click', sendChatMessage);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') sendChatMessage();
  });

  // Suggestion chips
  document.getElementById('chatbot-suggestions').addEventListener('click', e => {
    const btn = e.target.closest('.chat-suggest-btn');
    if (btn) {
      input.value = btn.textContent.replace(/[💰📦🏛️🚜☁️🌾⚖️📜❓]/g, '').trim();
      sendChatMessage();
    }
  });

  // Initial badge pulse
  setTimeout(() => {
    const badge = btn.querySelector('.chatbot-badge');
    if (badge) badge.style.display = 'flex';
  }, 3000);
}

function sendChatMessage() {
  const input = document.getElementById('chatbot-input');
  const text = input.value.trim();
  if (!text) return;

  addUserMessage(text);
  input.value = '';

  // Find matching intent
  setTimeout(() => {
    const response = matchIntent(text);
    addBotMessage(response);
  }, 400);
}

function matchIntent(text) {
  const lower = text.toLowerCase();
  
  // Check for order ID pattern
  const orderMatch = lower.match(/order\s*#?([a-z0-9]+)/i);
  if (orderMatch) {
    return `🔍 Looking up order **#${orderMatch[1]}**...\n\nFor real-time status, please visit:\n👉 <a href="order-tracking.html?id=${orderMatch[1]}">Track Your Order</a>`;
  }

  // Match keywords
  for (const faq of CHATBOT_FAQ) {
    if (faq.keywords.some(kw => lower.includes(kw.toLowerCase()))) {
      const resp = faq.response[currentLang] || faq.response.en;
      return resp;
    }
  }

  // Fallback
  return t('chatbot_fallback') + '\n👉 <a href="help.html">Go to Help Center</a>';
}

async function loadFirestoreFaqs() {
  if (!window.db || !window.COLLECTIONS) return;
  try {
    const snap = await db.collection(COLLECTIONS.chatbotFaq).get();
    snap.docs.forEach(doc => {
      const faq = doc.data();
      const keywords = Array.isArray(faq.keywords) ? faq.keywords : String(faq.keyword || '').split(',').map(item => item.trim()).filter(Boolean);
      const response = faq.response || { en: faq.answer || '' };
      if (keywords.length && response.en) CHATBOT_FAQ.unshift({ keywords, intent: faq.intent || doc.id, response });
    });
  } catch (error) {
    console.warn('Firestore FAQ load failed; using local FAQ set', error);
  }
}

function addBotMessage(text) {
  const messages = document.getElementById('chatbot-messages');
  const div = document.createElement('div');
  div.className = 'chat-msg bot';
  div.innerHTML = text.replace(/\n/g, '<br>').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function addUserMessage(text) {
  const messages = document.getElementById('chatbot-messages');
  const div = document.createElement('div');
  div.className = 'chat-msg user';
  div.textContent = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function showSuggestions(suggestions) {
  const container = document.getElementById('chatbot-suggestions');
  if (!container) return;
  container.innerHTML = suggestions.map(s =>
    `<button class="chat-suggest-btn">${s}</button>`
  ).join('');
}
