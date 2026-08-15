'use server';
/**
 * @fileOverview A Genkit tool to search the Bessites registry.
 * Features a fallback to mock data to ensure the AI is never "empty handed".
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { initializeFirebase } from '@/firebase/init';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { MOCK_WEBSITES } from '@/lib/mock-data';

const SearchWebsitesInputSchema = z.object({
  query: z.string().describe('Keywords to search for.'),
  category: z.string().optional().describe('Filter by sector.'),
});

export const searchWebsitesTool = ai.defineTool(
  {
    name: 'searchWebsites',
    description: 'Searches the Bessites registry for real websites.',
    inputSchema: SearchWebsitesInputSchema,
    outputSchema: z.array(z.object({
      id: z.string(),
      websiteName: z.string(),
      title: z.string(),
      description: z.string(),
      categories: z.array(z.string()),
      url: z.string(),
    })),
  },
  async (input) => {
    const { firestore } = initializeFirebase();
    let results: any[] = [];

    // 1. Try to fetch from Firestore
    if (firestore) {
      try {
        console.log(`[Astra Tool] Querying Firestore for: "${input.query}"`);
        const q = query(collection(firestore, 'submissions'), where('status', '==', 'approved'), limit(100));
        const snapshot = await getDocs(q);
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          const content = `${data.websiteName} ${data.name} ${data.description} ${data.categories?.join(' ')}`.toLowerCase();
          const terms = input.query.toLowerCase().split(' ').filter(t => t.length > 1);
          
          if (terms.length === 0 || terms.some(t => content.includes(t))) {
            results.push({
              id: doc.id,
              websiteName: data.websiteName || 'Unknown',
              title: data.name || '',
              description: data.description || '',
              categories: data.categories || [],
              url: data.url || '',
            });
          }
        });
      } catch (err) {
        console.error("[Astra Tool] Firestore Error:", err);
      }
    }

    // 2. Fallback to Mock Data if no results found in Firestore
    if (results.length === 0) {
      console.log(`[Astra Tool] No Firestore results. Checking Mock Library...`);
      const terms = input.query.toLowerCase().split(' ').filter(t => t.length > 1);
      
      MOCK_WEBSITES.forEach(site => {
        const content = `${site.websiteName} ${site.name} ${site.description} ${site.categories.join(' ')}`.toLowerCase();
        if (terms.length === 0 || terms.some(t => content.includes(t))) {
          results.push({
            id: site.id,
            websiteName: site.websiteName || 'Mock Asset',
            title: site.name,
            description: site.description,
            categories: site.categories,
            url: site.url,
          });
        }
      });
    }

    return results.slice(0, 8);
  }
);
