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
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
} {
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
}

export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
