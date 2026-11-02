import * as admin from 'firebase-admin';

let adminDb: admin.firestore.Firestore | null = null;
let adminAuth: admin.auth.Auth | null = null;

const initializeAdmin = () => {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // Handle PEM key formatting: convert literal \n strings to real newlines
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    if (typeof window === 'undefined') {
      console.warn("[Firebase Admin] Env variables missing - skipping init during build to prevent crash.");
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
    console.log("[Firebase Admin] Node Initialized Successfully");
  } catch (error: any) {
    console.error("[Firebase Admin] Initialization failure:", error.message);
  }
};

initializeAdmin();

export { adminDb, adminAuth };
