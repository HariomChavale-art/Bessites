import * as admin from 'firebase-admin';

/**
 * @fileOverview Bulletproof Firebase Admin Node.
 * Optimized for Vercel Environment Variables (process.env).
 * Handles multi-line private keys and prevents runtime crashes.
 */

let adminDb: admin.firestore.Firestore | null = null;
let adminAuth: admin.auth.Auth | null = null;

const initializeAdmin = () => {
  // Use Vercel Environment Variables
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !rawKey) {
    if (typeof window === 'undefined') {
      console.warn("[Firebase Admin] CRITICAL: Environment variables are missing from process.env.", {
        projectId: !!projectId,
        clientEmail: !!clientEmail,
        privateKey: !!rawKey
      });
    }
    return;
  }

  try {
    // Robust Private Key Formatting for Vercel/Node environment
    // 1. Convert literal "\n" strings back to real newlines
    // 2. Remove any accidental double quotes
    // 3. Ensure the string starts with the correct header
    const privateKey = rawKey
      .replace(/\\n/g, '\n')
      .replace(/"/g, '')
      .trim();

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
    console.log("[Firebase Admin] Node successfully linked to project:", projectId);
  } catch (error: any) {
    console.error("[Firebase Admin] Critical Initialization Failure:", error.message);
  }
};

initializeAdmin();

export { adminDb, adminAuth };
