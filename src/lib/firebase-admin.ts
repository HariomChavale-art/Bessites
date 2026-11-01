import * as admin from 'firebase-admin';

/**
 * @fileOverview Bulletproof Firebase Admin Initialization.
 * Ensures the build process doesn't crash if environment variables are missing.
 * Correctly parses PEM keys from string environment variables.
 */

let adminDb: admin.firestore.Firestore | null = null;
let adminAuth: admin.auth.Auth | null = null;

const initializeAdmin = () => {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // Handle both literal and escaped newline formats
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    if (typeof window === 'undefined') {
      console.warn("[Firebase Admin] Skipping initialization: Missing essential environment variables.");
    }
    return;
  }

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
    console.error("[Firebase Admin] Critical failure during initialization:", error.message);
  }
};

// Execute initialization
initializeAdmin();

export { adminDb, adminAuth };

/**
 * Helper function to safely access Firestore in a server context.
 */
export async function getAdminDb() {
  if (!adminDb) initializeAdmin();
  return adminDb;
}
