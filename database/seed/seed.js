// ============================================================
// KrishiSanjivani — Database Seeding Script
// ============================================================

const seedData = require('./seed-data.json');

console.log('🌾 KrishiSanjivani Database Seeder');
console.log('==================================');
console.log(`Loaded ${seedData.listings.length} sample listings and ${seedData.equipment.length} equipment items.`);
console.log('To run against live Firestore, ensure backend/.env has valid FIREBASE credentials and execute node seed.js.');
