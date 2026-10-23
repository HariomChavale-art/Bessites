
"use client"

import React, { useMemo } from 'react';
import { Navigation } from '@/components/navigation';
import { StacksFeedView } from '@/components/stacks/StacksFeedView';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { StackDocument } from '@/types/stacks';
import { Loader2 } from 'lucide-react';
import { Footer } from '@/components/footer';

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

  const { data: stacks, loading } = useCollection<StackDocument>(stacksRef);

  return (
    <div className="min-h-screen bg-[#0B0A0F] text-white">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="py-32 flex flex-col items-center gap-6">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">Synchronizing Community Registry...</p>
          </div>
        ) : (
          <StacksFeedView initialStacks={stacks || []} />
        )}
      </main>

      <Footer />
    </div>
  );
}
