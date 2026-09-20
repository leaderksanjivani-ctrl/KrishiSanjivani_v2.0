// ============================================================
// KrishiSanjivani — Firebase Configuration
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyAClRCT0dgJXogYkqDByR7EwaXMtqLA50k",
  authDomain: "sih-26-e957a.firebaseapp.com",
  projectId: "sih-26-e957a",
  storageBucket: "sih-26-e957a.firebasestorage.app",
  messagingSenderId: "888353769211",
  appId: "1:888353769211:web:b68d25da7c048d59f0125e",
  measurementId: "G-3SLXT81Y7S"
};

// Initialize Firebase (loaded via CDN in each HTML)
let app, auth, db, storage, analytics;

function initFirebase() {
  try {
    app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
    storage = firebase.storage();
    
    // Enable offline persistence
    db.enablePersistence({ synchronizeTabs: true }).catch(err => {
      if (err.code === 'failed-precondition') {
        console.warn('Firestore persistence: multiple tabs open');
      } else if (err.code === 'unimplemented') {
        console.warn('Firestore persistence: browser not supported');
      }
    });

    console.log('✅ Firebase initialized');
    return true;
  } catch (e) {
    console.error('Firebase init error:', e);
    return false;
  }
}

// Razorpay Config (Test Mode)
const RAZORPAY_KEY_ID = 'rzp_test_PLACEHOLDER_KEY'; // Replace with your Razorpay test key
const PLATFORM_FEE_PERCENT = 2; // 2% platform fee
const DELIVERY_BASE_CHARGE = 30; // ₹30 base delivery

// App Config
const APP_CONFIG = {
  name: 'KrishiSanjivani',
  version: '1.0.0',
  defaultLocation: { lat: 19.0760, lng: 72.8777 }, // Mumbai default
  weatherApiKey: 'OPENWEATHER_API_KEY_PLACEHOLDER', // Replace or use mock
  mapTileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  mapAttribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  supportedLanguages: ['en', 'mr', 'hi', 'gu', 'bn', 'ta', 'te', 'kn', 'ml', 'pa', 'ur', 'or'],
  defaultLanguage: 'en',
  mahaDBTUrl: 'https://mahadbt.maharashtra.gov.in',
  adminEmail: 'admin@krishisanjivani.gov.in',
  adminEmails: ['admin@gmail.com', 'admin@krishisanjivani.gov.in']
};

function isAdminEmail(email) {
  if (!email) return false;
  const e = email.toLowerCase().trim();
  return APP_CONFIG.adminEmails.includes(e);
}

// Firestore Collection Names
const COLLECTIONS = {
  users: 'users',
  listings: 'listings',
  orders: 'orders',
  equipment: 'equipment',
  bookings: 'bookings',
  complaints: 'complaints',
  priceHistory: 'priceHistory',
  schemes: 'schemes',
  rightsActs: 'rightsActs',
  chatbotFaq: 'chatbotFaq',
  notifications: 'notifications',
  fpos: 'fpos',
  auctions: 'auctions',
  groupBuys: 'groupBuys',
  expertQueries: 'expertQueries',
  auditLog: 'auditLog',
  verifiedInputs: 'verifiedInputs',
  ledgerChain: 'ledgerChain',
  facilities: 'facilities'
};

// Mock price data for seeding
const MOCK_PRICES = {
  tomato: { avg: 32, mandi: 28, unit: 'kg' },
  onion: { avg: 24, mandi: 18, unit: 'kg' },
  potato: { avg: 20, mandi: 15, unit: 'kg' },
  wheat: { avg: 22, mandi: 19, unit: 'kg' },
  rice: { avg: 42, mandi: 36, unit: 'kg' },
  sugarcane: { avg: 320, mandi: 280, unit: 'quintal' },
  cotton: { avg: 6200, mandi: 5800, unit: 'quintal' },
  soybean: { avg: 5100, mandi: 4700, unit: 'quintal' },
  maize: { avg: 1900, mandi: 1700, unit: 'quintal' },
  groundnut: { avg: 5800, mandi: 5200, unit: 'quintal' },
  banana: { avg: 28, mandi: 22, unit: 'kg' },
  mango: { avg: 80, mandi: 65, unit: 'kg' }
};
