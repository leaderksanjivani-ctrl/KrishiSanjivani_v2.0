# 🌾 KrishiSanjivani — Smart India Hackathon 2026

**From Farm to Fork — Direct Price, No Middlemen.**

KrishiSanjivani is an end-to-end direct agritech platform connecting Indian farmers with consumers, bulk buyers, FPOs, and rental equipment providers. It features direct marketplace trading, automated price trend forecasting, voice assistance, and direct **WhatsApp Business integration** for real-time market updates, order tracking receipts, and farmer assistance.

---

## 📁 Repository Architecture

```
SIH'26/
├── frontend/                     # Web Application (HTML, CSS, JS, i18n)
│   ├── *.html                    # All 18 application pages (index, marketplace, dashboard, etc.)
│   ├── css/                      # Modular CSS design system & page styles
│   ├── js/                       # Client JS (Firebase config, i18n, voice, chatbot, WhatsApp helpers)
│   │   └── whatsapp-link.js      # WhatsApp floating button & instant message share triggers
│   ├── i18n/                     # Multilingual support (English, Hindi, Marathi)
│   └── assets/                   # Images and branding assets
│
├── backend/                      # Node.js + Express API & WhatsApp Cloud API Server
│   ├── server.js                 # Server entrypoint
│   ├── .env.example              # Environment variables template for WhatsApp & Firebase
│   ├── package.json              # Backend dependencies
│   ├── config/                   # Firebase Admin & WhatsApp configurations
│   ├── routes/                   # API & Webhook endpoints
│   ├── controllers/              # Business logic & incoming WhatsApp message parsers
│   ├── services/                 # Outbound WhatsApp message dispatchers
│   └── utils/                    # Logger and helper functions
│
├── database/                     # Database Schemas & Seeding
│   ├── firestore.rules           # Firestore security rules
│   ├── schema/collections.md     # Full collection specifications
│   └── seed/                     # Seed data & Firestore seeder script
│
├── storage/                      # File Storage & Uploads
│   ├── uploads/                  # Local media uploads directory
│   ├── storage.rules             # Firebase Storage security policies
│   └── README.md
│
└── README.md                     # Project documentation & setup instructions
```

---

## 📲 WhatsApp Integration Setup

KrishiSanjivani integrates directly with the **Meta WhatsApp Cloud API** (and Twilio) to provide:
1. **Instant Order Receipts**: Automatically sends formatted receipts and pickup locations directly to farmers and buyers via WhatsApp.
2. **Mandi Price Queries**: Farmers can text `PRICE TOMATO` or `PRICE ONION` to the KrishiSanjivani WhatsApp Bot number to receive real-time market rate alerts.
3. **Daily Subscriptions**: Farmers texting `SUBSCRIBE` automatically receive daily price updates in Hindi, Marathi, or English.
4. **Quick Support**: Floating WhatsApp connect button embedded across all frontend web pages.

### WhatsApp Webhook & API Endpoints
- `GET /api/whatsapp/webhook` — Meta Webhook verification endpoint.
- `POST /api/whatsapp/webhook` — Incoming WhatsApp message listener & bot parser.
- `POST /api/whatsapp/send` — Send custom outbound message.
- `POST /api/whatsapp/send-order-alert` — Dispatch order confirmation receipt to farmer/buyer.

---

## 🚀 Quick Start Guide

### 1. Launch Backend API Server
```bash
cd backend
npm install
# Copy .env.example to .env and configure your keys
npm start
```
The server will start at `http://localhost:5000` and serve both the API endpoints and static frontend pages.

### 2. Launch Frontend Directly
You can also open `frontend/index.html` directly in any web browser or serve it using live server.

---

## 🔒 Environment Setup (`backend/.env`)

Copy `backend/.env.example` to `backend/.env`:
```env
PORT=5000
WHATSAPP_TOKEN=YOUR_META_WHATSAPP_CLOUD_API_TOKEN
WHATSAPP_PHONE_NUMBER_ID=YOUR_WHATSAPP_PHONE_ID
WHATSAPP_VERIFY_TOKEN=krishisanjivani_webhook_secret_token_2026
FIREBASE_PROJECT_ID=sih-26-e957a
```
