'use server';
/**
 * @fileOverview High-Fidelity Stats Tool for Ouneo.
 * Queries the websiteStats ledger to find real-time traffic leaders.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { initializeFirebase } from '@/firebase/init';
import { collection, getDocs, query, orderBy, limit, doc, getDoc } from 'firebase/firestore';

export const getTopStatsTool = ai.defineTool(
  {
    name: 'getTopStats',
    description: 'Retrieves the most visited websites from the Bessites registry based on the interaction ledger. Use this when the user asks about popularity, most visited sites, or trending assets.',
    inputSchema: z.object({
      limitCount: z.number().optional().default(5).describe('Number of top sites to retrieve.'),
    }),
    outputSchema: z.array(z.object({
      name: z.string(),
      url: z.string(),
      visitCount: z.number(),
      rank: z.number(),
    })).or(z.array(z.any())),
  },
  async (input) => {
    const { firestore } = initializeFirebase();
    if (!firestore) return [];

    try {
      // 1. Fetch top stats
      const statsRef = collection(firestore, 'websiteStats');
      const q = query(statsRef, orderBy('visitCount', 'desc'), limit(input.limitCount));
      const snap = await getDocs(q);
      
      const results = [];
      let rank = 1;

      for (const statDoc of snap.docs) {
        const statData = statDoc.data();
        
        // 2. Resolve name from submissions
        const subRef = doc(firestore, 'submissions', statDoc.id);
        const subSnap = await getDoc(subRef);
        const subData = subSnap.data();

        results.push({
          name: subData?.websiteName || subData?.name || 'Registry Asset',
          url: subData?.url || 'https://bessites.store',
          visitCount: statData.visitCount || 0,
          rank: rank++
        });
      }

      return results;
    } catch (err) {
      console.error("[Stats Tool Error]:", err);
      return [];
    }
  }
);
