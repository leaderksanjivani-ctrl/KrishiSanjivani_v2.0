# KrishiSanjivani — Firestore Database Schema Documentation

This document describes all Firestore collections, field definitions, and indexes used by the **KrishiSanjivani** platform.

---

## Collections Overview

### 1. `users`
Stores farmer, buyer, consumer, and admin profile data.
- `uid` (string): Firebase Auth User ID
- `name` (string): Full name of the user
- `phone` (string): E.164 phone number (e.g. `+919876543210`)
- `role` (string): `'farmer'`, `'buyer'`, `'consumer'`, or `'admin'`
- `location` (geopoint/object): `{ lat, lng, address, state, district }`
- `language` (string): Preferred language (`'en'`, `'hi'`, `'mr'`)
- `whatsappEnabled` (boolean): Whether user accepts notifications on WhatsApp
- `createdAt` (timestamp)

---

### 2. `listings`
Direct crop listings posted by farmers.
- `id` (string): Unique listing ID
- `farmerId` (string): Foreign key referencing `users.uid`
- `cropName` (string): E.g., `"Tomato"`, `"Wheat"`
- `category` (string): `"Vegetables"`, `"Grains"`, `"Fruits"`, `"Pulses"`
- `price` (number): Selling price per unit (₹)
- `unit` (string): `"kg"`, `"quintal"`, `"ton"`
- `quantity` (number): Available quantity
- `harvestDate` (string/timestamp): Date of harvest
- `organicCertified` (boolean)
- `imageUrl` (string): URL to uploaded photo
- `location` (object): Listing location
- `status` (string): `'active'`, `'sold'`, `'cancelled'`

---

### 3. `orders`
Transactions between buyers and farmers.
- `id` (string): Order ID
- `buyerId` (string): FK `users.uid`
- `farmerId` (string): FK `users.uid`
- `listingId` (string): FK `listings.id`
- `totalAmount` (number)
- `paymentStatus` (string): `'pending'`, `'paid'`, `'failed'`
- `deliveryStatus` (string): `'ordered'`, `'in_transit'`, `'delivered'`
- `whatsappReceiptSent` (boolean): `true` if WhatsApp receipt dispatched
- `createdAt` (timestamp)

---

### 4. `whatsapp_subscribers`
Tracks farmers/buyers subscribed to WhatsApp alerts.
- `phone` (string): E.164 formatted phone number
- `subscriptions` (array of strings): `['mandi_prices', 'schemes', 'weather_alerts']`
- `cropInterests` (array of strings): `['tomato', 'wheat']`
- `language` (string): `'hi'`, `'mr'`, `'en'`
- `active` (boolean): `true`
- `subscribedAt` (timestamp)

---

### 5. `whatsapp_logs`
Audit log of all incoming and outgoing WhatsApp messages.
- `messageId` (string)
- `direction` (string): `'inbound'` or `'outbound'`
- `phone` (string)
- `content` (string)
- `status` (string): `'sent'`, `'delivered'`, `'failed'`, `'received'`
- `timestamp` (timestamp)

---

### 6. `schemes` & `rightsActs`
Government schemes, subsidies, and agricultural rights.
- `title` (string): Name of scheme/act
- `description` (string)
- `eligibility` (string)
- `link` (string)
