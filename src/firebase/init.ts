import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { initializeFirestore, getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

/**
 * Core Firebase initialization logic separated from React components/hooks.
 * This is safe to import in both client and server contexts (Server Actions/Flows).
 */
export function initializeFirebase(): {
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  storage: FirebaseStorage | null;
} {
  const apiKey = firebaseConfig.apiKey;
  const isValidConfig = apiKey && apiKey !== 'undefined' && apiKey !== '';

  if (!isValidConfig) {
    if (typeof window === 'undefined') {
      console.warn("[Bessites] Server-side Firebase config missing. Ensure NEXT_PUBLIC_FIREBASE_API_KEY is set.");
    }
    return { firebaseApp: null, firestore: null, auth: null, storage: null };
  }

  try {
    const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    
    let firestore: Firestore;
    
    // Check if firestore is already initialized to avoid errors.
    // Use long polling on client side for better compatibility, default on server.
    try {
      firestore = initializeFirestore(firebaseApp, {
        experimentalForceLongPolling: typeof window !== 'undefined',
      });
    } catch (e: any) {
      firestore = getFirestore(firebaseApp);
    }
    
    const auth = getAuth(firebaseApp);
    const storage = getStorage(firebaseApp);

    return { firebaseApp, firestore, auth, storage };
  } catch (error) {
    console.error("[Bessites] Firebase initialization failure:", error);
    return { firebaseApp: null, firestore: null, auth: null, storage: null };
  }
}
