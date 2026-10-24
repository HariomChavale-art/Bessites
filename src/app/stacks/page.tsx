
'use client';

import React, { useMemo, useEffect } from 'react';
import { Navigation } from '@/components/navigation';
import { StacksFeedView } from '@/components/stacks/StacksFeedView';
import { useFirestore, useCollection, useUser } from '@/firebase';
import { collection, query, where, orderBy, getDocs, doc, setDoc } from 'firebase/firestore';
import { StackDocument } from '@/types/stacks';
import { Loader2, Sparkles } from 'lucide-react';
import { Footer } from '@/components/footer';
import { DEFAULT_SEED_STACKS } from '@/data/seedStacks';

export default function StacksPage() {
  const db = useFirestore();
  const { user } = useUser();

  const stacksRef = useMemo(() => {
    if (!db) return null;
    return query(
      collection(db, 'stacks'),
      where('isPublic', '==', true),
      orderBy('createdAt', 'desc')
    );
  }, [db]);

  const { data: dbStacks, loading } = useCollection<StackDocument>(stacksRef);

  // Combine database stacks with seed stacks, deduplicating by ID
  const displayStacks = useMemo(() => {
    const firestoreItems = dbStacks || [];
    const seedItems = DEFAULT_SEED_STACKS;
    
    const combined = [...firestoreItems];
    const seenIds = new Set(combined.map(s => s.id));

    seedItems.forEach(seed => {
      if (!seenIds.has(seed.id)) {
        combined.push(seed);
      }
    });

    return combined;
  }, [dbStacks]);

  // Idempotent Seeder utility - can be triggered manually or on first load if admin
  useEffect(() => {
    if (user?.email === 'bessitesofficial@gmail.com' && !loading && (!dbStacks || dbStacks.length < 5)) {
      console.log("[Seeder] Populating founding stacks...");
      DEFAULT_SEED_STACKS.forEach(async (stack) => {
        const stackRef = doc(db!, 'stacks', stack.id);
        await setDoc(stackRef, stack, { merge: true });
      });
    }
  }, [user, dbStacks, loading, db]);

  return (
    <div className="min-h-screen bg-[#0B0A0F] text-white">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        {loading && (!dbStacks || dbStacks.length === 0) ? (
          <div className="py-32 flex flex-col items-center gap-6">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">Synchronizing Registry...</p>
          </div>
        ) : (
          <div className="animate-in fade-in duration-700">
            {displayStacks.length > 0 && displayStacks[0].id.startsWith('stack-') && (
              <div className="mb-8 flex items-center gap-3 bg-primary/10 border border-primary/20 p-4 rounded-2xl w-fit mx-auto sm:mx-0">
                 <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-primary italic">Founding Stacks Online</p>
              </div>
            )}
            <StacksFeedView initialStacks={displayStacks} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
