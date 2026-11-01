import * as admin from 'firebase-admin';

/**
 * @fileOverview Bulletproof Firebase Admin Initialization.
 * Handles missing environment variables during build and malformed PEM keys.
 */

let adminDb: admin.firestore.Firestore | null = null;
let adminAuth: admin.auth.Auth | null = null;

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!projectId || !clientEmail || !privateKey) {
  if (process.env.NODE_ENV === 'production') {
    console.warn("FIREBASE_ADMIN: Missing essential environment variables. Admin SDK unavailable.");
  }
} else {
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    }
    adminDb = admin.firestore();
    adminAuth = admin.auth();
  } catch (error: any) {
    console.error("FIREBASE_ADMIN: Initialization failed:", error.message);
  }
}

/**
 * Helper to check if admin is initialized before performing operations.
 */
export const isReady = () => adminDb !== null && adminAuth !== null;

export { adminDb, adminAuth };
