import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { initializeFirestore, getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

/**
 * Initializes Firebase services.
 * Using experimentalAutoDetectLongPolling and experimentalForceLongPolling to ensure connectivity
 * in proxy-restricted or cloud-based development environments where standard WebSockets may fail.
 */
export function initializeFirebase(): {
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
} {
  // Guard against missing API key to prevent crashes during SSR or before env vars are synced
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'undefined') {
    console.warn("Firebase configuration is missing. Please ensure your environment variables are set.");
    return { firebaseApp: null, firestore: null, auth: null };
  }

  try {
    const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    
    let firestore: Firestore;
    
    // Initialize Firestore with robust polling settings to prevent connection timeouts
    if (getApps().length > 0) {
      firestore = getFirestore(firebaseApp);
    } else {
      firestore = initializeFirestore(firebaseApp, {
        experimentalAutoDetectLongPolling: true,
        // Force long polling if standard detection is insufficient in the current environment
        experimentalForceLongPolling: true, 
      });
    }
    
    const auth = getAuth(firebaseApp);

    return { firebaseApp, firestore, auth };
  } catch (error) {
    console.error("Firebase initialization failed:", error);
    return { firebaseApp: null, firestore: null, auth: null };
  }
}

export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
