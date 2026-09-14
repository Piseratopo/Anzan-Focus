require('dotenv').config();

const { initializeApp, getApps, getApp, cert, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');

/**
 * Initializes the Firebase Admin SDK (singleton — safe to require multiple times).
 *
 * Credential resolution order:
 *  1. Individual env vars: FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY
 *  2. GOOGLE_APPLICATION_CREDENTIALS / Application Default Credentials (ADC)
 */
function initFirebase() {
  // Already initialized — return existing app
  if (getApps().length > 0) {
    return getApp();
  }

  let credential;

  if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    credential = cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Replace escaped newlines (common when setting multi-line values in .env)
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });
  } else {
    // Falls back to GOOGLE_APPLICATION_CREDENTIALS or ADC
    credential = applicationDefault();
  }

  const app = initializeApp({
    credential,
    projectId: process.env.FIREBASE_PROJECT_ID,
  });

  console.log(
    `[Firebase] Admin SDK initialized (project: ${process.env.FIREBASE_PROJECT_ID ?? 'ADC'})`
  );

  return app;
}

const firebaseApp = initFirebase();

/** Firestore database instance */
const db = getFirestore(firebaseApp);

/** Firebase Auth instance */
const auth = getAuth(firebaseApp);

module.exports = { firebaseApp, db, auth };

