/**
 * @fileOverview DEPRECATED. 
 * This system has migrated to a 100% Firebase-native architecture.
 * Use src/firebase/index.ts for all data and storage operations.
 */

export const supabase = null;

export const getSupabaseConfigStatus = () => {
  return {
    hasUrl: false,
    hasKey: false,
    isConfigured: false
  };
};
