
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      // In production, we might show a user-friendly toast.
      // In development, the Next.js overlay will catch the thrown error.
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: `You don't have permission to perform this ${error.context.operation} operation.`,
      });

      // Throws error so it shows up in the dev overlay for easier debugging
      if (process.env.NODE_ENV === 'development') {
        throw error;
      }
    };

    errorEmitter.on('permission-error', handleError);
    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, [toast]);

  return null;
}
