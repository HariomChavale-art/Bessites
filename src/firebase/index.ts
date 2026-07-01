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
  // If we have existing apps, we should get the existing firestore instance.
  // Otherwise, we initialize it with experimentalAutoDetectLongPolling for stable connections.
  if (getApps().length > 0) {
    firestore = getFirestore(firebaseApp);
  } else {
    firestore = initializeFirestore(firebaseApp, {
      experimentalAutoDetectLongPolling: true,
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
