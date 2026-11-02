'use client';

import { useState, useEffect } from 'react';
import { 
  DocumentReference, 
  onSnapshot, 
  DocumentSnapshot, 
  DocumentData,
  FirestoreError 
} from 'firebase/firestore';

/**
 * useDoc hook optimized for performance and loop prevention.
 * Uses ref.path as a stable dependency to prevent re-subscribing on every render.
 */
export function useDoc<T = DocumentData>(ref: DocumentReference<T> | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  // Stable path dependency
  const path = ref?.path;

  useEffect(() => {
    if (!ref) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(
      ref,
      (snapshot: DocumentSnapshot<T>) => {
        setData(snapshot.exists() ? { ...snapshot.data()!, id: snapshot.id } : null);
        setLoading(false);
      },
      (err) => {
        console.error("useDoc Sync Error:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [path]); // Only re-run if the document path changes

  return { data, loading, error };
}