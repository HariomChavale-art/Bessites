import * as admin from 'firebase-admin';

/**
 * @fileOverview Bulletproof Firebase Admin Node.
 * Handles escaped newlines in PEM keys and prevents build-time crashes.
 */

let adminDb: admin.firestore.Firestore | null = null;
let adminAuth: admin.auth.Auth | null = null;

const initializeAdmin = () => {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  
  // Robust Private Key Parsing: 
  // 1. Remove quotes if any.
  // 2. Convert literal "\n" strings to actual newlines.
  const rawKey = process.env.FIREBASE_PRIVATE_KEY;
  const privateKey = rawKey?.replace(/"/g, '').replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    if (typeof window === 'undefined') {
      console.warn("[Firebase Admin] Missing essential ENV nodes:", {
        projectId: !!projectId,
        clientEmail: !!clientEmail,
        privateKey: !!privateKey
      });
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
    console.log("[Firebase Admin] Secure Node Online:", projectId);
  } catch (error: any) {
    console.error("[Firebase Admin] Critical Initialization Failure:", error.message);
  }
};

initializeAdmin();

export { adminDb, adminAuth };
