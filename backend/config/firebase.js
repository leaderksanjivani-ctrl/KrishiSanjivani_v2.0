// ============================================================
// KrishiSanjivani — Firebase Admin SDK Config
// ============================================================

const admin = require('firebase-admin');
const logger = require('../utils/logger');

let db = null;
let auth = null;

try {
  if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID || 'sih-26-e957a';
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined;

    if (clientEmail && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey
        })
      });
      logger.info('Firebase Admin initialized with credentials');
    } else {
      admin.initializeApp({ projectId });
      logger.info('Firebase Admin initialized with default project ID');
    }
  }

  db = admin.firestore();
  auth = admin.auth();
} catch (error) {
  logger.warn('Firebase Admin init warning (runs offline mode if uncredentialed):', error.message);
}

module.exports = { admin, db, auth };
