
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { initializeFirestore, getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

/**
 * Initializes Firebase services.
 * Checks for valid configuration and handles missing environment variables.
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
    console.error("Firebase configuration is missing! Check your .env file.");
    return { firebaseApp: null, firestore: null, auth: null, storage: null };
  }

  try {
    const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    
    let firestore: Firestore;
    
    // Check if firestore is already initialized to avoid errors
    // We force long polling to bypass potential WebSocket blocks in cloud environments
    try {
      firestore = initializeFirestore(firebaseApp, {
        experimentalForceLongPolling: true,
      });
      console.log("[Bessites] Firestore initialized with long polling.");
    } catch (e: any) {
      // If already initialized, we just retrieve the existing instance
      firestore = getFirestore(firebaseApp);
    }
    
    const auth = getAuth(firebaseApp);
    const storage = getStorage(firebaseApp);

    return { firebaseApp, firestore, auth, storage };
  } catch (error) {
    console.error("Firebase initialization failed:", error);
    return { firebaseApp: null, firestore: null, auth: null, storage: null };
  }
}

export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
