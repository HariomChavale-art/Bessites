
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { initializeFirestore, getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

/**
 * Initializes Firebase services.
 * Using initializeFirestore with experimentalAutoDetectLongPolling to ensure connectivity
 * in proxy-restricted or cloud-based development environments.
 */
export function initializeFirebase(): {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
} {
  const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  
  let firestore: Firestore;
  try {
    // We attempt to initialize with long-polling to fix "Could not reach Firestore backend" errors
    firestore = initializeFirestore(firebaseApp, {
      experimentalAutoDetectLongPolling: true,
    });
  } catch (e) {
    // If already initialized, get the existing instance
    firestore = getFirestore(firebaseApp);
  }
  
  const auth = getAuth(firebaseApp);

  return { firebaseApp, firestore, auth };
}

export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
