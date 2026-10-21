import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { initializeFirestore, getFirestore, Firestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

/**
 * Core Firebase initialization logic.
 * Optimized with forced long polling on the client to prevent connection timeouts
 * in restricted network environments or during high-latency periods.
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
      console.warn("[Bessites] Server-side Firebase config missing.");
    }
    return { firebaseApp: null, firestore: null, auth: null, storage: null };
  }

  try {
    const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    
    let firestore: Firestore;
    
    // Robust Firestore initialization
    // Forcing long polling on client side is critical for reliability in many environments
    if (typeof window !== 'undefined') {
      try {
        firestore = initializeFirestore(firebaseApp, {
          experimentalForceLongPolling: true,
          experimentalAutoDetectLongPolling: true,
        });
      } catch (e) {
        // If already initialized, get the existing instance
        firestore = getFirestore(firebaseApp);
      }
    } else {
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
