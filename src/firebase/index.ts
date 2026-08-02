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
  // Guard against missing or placeholder API keys to prevent crashes
  const apiKey = firebaseConfig.apiKey;
  const isValidConfig = apiKey && 
                        apiKey !== 'undefined' && 
                        apiKey !== '' && 
                        !apiKey.includes('YOUR_') && 
                        !apiKey.includes('REPLACE_');

  if (!isValidConfig) {
    console.warn("Firebase configuration is invalid or missing. Please ensure your .env variables are set correctly.");
    return { firebaseApp: null, firestore: null, auth: null, storage: null };
  }

  try {
    const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    
    let firestore: Firestore;
    
    if (getApps().length > 0) {
      firestore = getFirestore(firebaseApp);
    } else {
      firestore = initializeFirestore(firebaseApp, {
        experimentalAutoDetectLongPolling: true,
        experimentalForceLongPolling: true, 
      });
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
