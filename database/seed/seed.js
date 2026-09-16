// ============================================================
// KrishiSanjivani — Database Seeding Script
// ============================================================

const admin = require('../../backend/node_modules/firebase-admin');
const seedData = require('./seed-data.json');

if (!admin.apps.length) admin.initializeApp({ credential: admin.credential.applicationDefault() });
const db = admin.firestore();
const images = [
	'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=640&q=75',
	'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=640&q=75',
	'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=640&q=75',
	'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=640&q=75',
	'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=640&q=75'
];
const cropRows = [
	['Tomato', 'Vegetables', 30, 38, 250, 'Nashik'], ['Onion', 'Vegetables', 22, 28, 1200, 'Satara'], ['Potato', 'Vegetables', 18, 24, 500, 'Pune'], ['Wheat', 'Grains', 21, 26, 2000, 'Ahmednagar'], ['Rice', 'Grains', 40, 48, 1500, 'Raigad'], ['Banana', 'Fruits', 25, 32, 600, 'Jalgaon'], ['Mango', 'Fruits', 75, 95, 400, 'Ratnagiri'], ['Soybean', 'Pulses', 52, 60, 900, 'Akola'], ['Maize', 'Grains', 19, 24, 1800, 'Nanded'], ['Groundnut', 'Pulses', 68, 78, 700, 'Solapur'], ['Cotton', 'Cash Crops', 6200, 7000, 120, 'Latur'], ['Sugarcane', 'Cash Crops', 320, 380, 80, 'Kolhapur'], ['Tomato', 'Vegetables', 28, 38, 350, 'Baramati'], ['Onion', 'Vegetables', 24, 31, 2500, 'Nashik'], ['Rice', 'Grains', 42, 50, 950, 'Bhandara'], ['Mango', 'Fruits', 82, 100, 300, 'Sindhudurg'], ['Wheat', 'Grains', 23, 29, 1400, 'Aurangabad'], ['Potato', 'Vegetables', 20, 26, 450, 'Nashik']
];
const faqRows = [
	['sell', 'how to sell produce', 'Go to Sell, choose your crop, add quantity, price and a photo, then publish the listing.'], ['buy', 'how to buy produce', 'Open Marketplace, compare listings, add produce to cart and complete checkout.'], ['order', 'order status', 'Open My Orders or enter your order ID on Track Delivery to see the latest status.'], ['mahadbt', 'what is MahaDBT', 'MahaDBT is the Maharashtra government portal for farmer subsidies and direct benefit transfers.'], ['rental', 'equipment rental', 'Choose equipment, select dates and submit a booking request. Pay only for the days you use.'], ['payment', 'payments', 'Payments use the configured Razorpay test checkout. Never share your OTP or card PIN.'], ['refund', 'refund', 'For a cancelled or failed order, submit a Help ticket with the order ID.'], ['complaint', 'file a complaint', 'Open Help, describe the issue, choose a category and submit the ticket.'],
	['sell-price', 'suggest a selling price', 'Use the price suggestion shown while creating a listing, then compare it with nearby listings.'], ['sell-photo', 'upload crop photo', 'Tap the photo area on the Sell page and choose a clear image of your produce.'], ['sell-edit', 'edit listing', 'Open your listing from Profile and update its quantity or price while it is active.'], ['fpo-pool', 'FPO pool listing', 'An approved FPO can combine contributor quantities into one pool and display the contributor count.'], ['bulk-bid', 'bulk order or bid', 'Bulk buyers can open an FPO pool listing and submit a quantity request through checkout.'], ['delivery-now', 'delivery now', 'Delivery Now requests the earliest available delivery slot for the selected address.'], ['scheduled-delivery', 'scheduled delivery', 'Choose a future date and time slot during checkout before placing the order.'], ['address', 'change delivery address', 'Update your address during checkout before continuing to payment.'], ['failed-payment', 'payment failed', 'Retry from the payment page and check your bank or UPI app before trying again.'], ['cancel-order', 'cancel order', 'Submit a cancellation request from Help with the order ID and reason.'], ['invoice', 'download invoice', 'Open Invoice from My Orders and use Print / Save PDF in your browser.'], ['track-map', 'track delivery map', 'Open Track Delivery from an order to see its current delivery status and route.'], ['profile-bank', 'bank account security', 'Bank and Aadhaar details are used only for payouts and DBT and are not shown publicly.'], ['profile-language', 'change language', 'Use the language selector in the navbar to switch English, Hindi or Marathi.'], ['weather', 'weather forecast', 'Open Weather for a five-day forecast based on your saved location or the default farm region.'], ['voice', 'read page aloud', 'Tap Read Aloud on supported pages. The browser Web Speech API will use the selected language when available.'], ['help-ticket', 'support ticket', 'Open Help, choose a category, describe the issue and submit a ticket for admin review.']
];

async function seedCollection(collection, rows) {
	const batch = db.batch();
	rows.forEach(row => batch.set(db.collection(collection).doc(row.id), { ...row, seeded: true, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true }));
	await batch.commit();
	console.log(`Seeded ${rows.length} ${collection} documents`);
}

async function main() {
	const listings = cropRows.map((row, index) => ({ id: `demo-${index + 1}`, crop: row[0], cropName: row[0], category: row[1], price: row[2], mandiPrice: row[3], unit: 'kg', qty: row[4], quantity: row[4], farmerName: `Demo Farmer ${index + 1}`, locationText: `${row[5]}, Maharashtra`, location: `${row[5]}, Maharashtra`, isFPO: index % 4 === 1, fpoFarmerCount: index % 4 === 1 ? 12 + index % 8 : 0, deliveryNow: index % 3 !== 1, photos: [images[index % images.length]], imageUrl: images[index % images.length], status: 'active', createdAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - index * 86400000)) }));
	await seedCollection('listings', listings);
	await seedCollection('equipment', seedData.equipment.map(item => ({ id: item.id, ...item, status: 'available' })));
	await seedCollection('chatbotFaq', faqRows.map(row => ({ id: row[0], keywords: [row[1], row[0]], intent: row[0], response: { en: row[2], hi: row[2], mr: row[2] } })));
	console.log('Demo data seeding complete.');
}

main().catch(error => { console.error(error); process.exitCode = 1; });
