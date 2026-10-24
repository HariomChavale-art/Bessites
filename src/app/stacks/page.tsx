'use client';

import React, { useMemo } from 'react';
import { Navigation } from '@/components/navigation';
import { StacksFeedView } from '@/components/stacks/StacksFeedView';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { StackDocument } from '@/types/stacks';
import { Footer } from '@/components/footer';
import { DEFAULT_SEED_STACKS } from '@/data/seedStacks';

export default function StacksPage() {
  const db = useFirestore();

  const stacksRef = useMemo(() => {
    if (!db) return null;
    return query(
      collection(db, 'stacks'),
      where('isPublic', '==', true),
      orderBy('createdAt', 'desc')
    );
  }, [db]);

  const { data: dbStacks } = useCollection<StackDocument>(stacksRef);

  const displayStacks = useMemo(() => {
    return dbStacks && dbStacks.length > 0 ? dbStacks : DEFAULT_SEED_STACKS;
  }, [dbStacks]);

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        <header className="mb-16 space-y-1">
          <h1 className="text-4xl font-semibold italic text-white uppercase tracking-tighter leading-none">Curated stacks.</h1>
          <p className="text-[13px] font-medium text-zinc-500 italic">Hand-picked bundles of ad-free, instant-utility websites.</p>
        </header>

        <StacksFeedView initialStacks={displayStacks} />
      </main>

      <Footer />
    </div>
  );
}