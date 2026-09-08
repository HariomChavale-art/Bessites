'use server';
/**
 * @fileOverview Hardened Search Tool for the Bessites registry.
 * Employs a fail-safe hybrid matching strategy (Firestore Submissions + Mock Library).
 * Index-free querying ensures 100% availability even with permission/index delays.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { initializeFirebase } from '@/firebase/init';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { MOCK_WEBSITES } from '@/lib/mock-data';

const SearchWebsitesInputSchema = z.object({
  query: z.string().describe('Search keywords or natural language request.'),
});

export const searchWebsitesTool = ai.defineTool(
  {
    name: 'searchWebsites',
    description: 'Searches the Bessites registry for real websites. ALWAYS use this if the user asks for tools, apps, or recommendations.',
    inputSchema: SearchWebsitesInputSchema,
    outputSchema: z.array(z.object({
      id: z.string(),
      websiteName: z.string(),
      name: z.string(),
      description: z.string(),
      categories: z.array(z.string()),
      url: z.string(),
    })),
  },
  async (input) => {
    console.log(`[Astra Tool] Initiating discovery for: "${input.query}"`);
    const { firestore } = initializeFirebase();
    let results: any[] = [];
    const normalizedQuery = input.query.toLowerCase().trim();

    // Heuristic: Handle generic greetings or empty requests
    const isGeneric = normalizedQuery.length < 3 || ['hi', 'hello', 'help', 'tools', 'websites'].includes(normalizedQuery);

    if (!firestore) {
      console.warn("Firestore not initialized in search tool. Falling back to internal library.");
    } else {
      try {
        // Index-free retrieval: fetch top records and filter in-memory to prevent "Missing Index" crashes
        const snapshot = await getDocs(query(collection(firestore, 'submissions'), limit(200)));
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.status !== 'approved') return;

          const content = `${data.websiteName} ${data.name} ${data.description} ${data.categories?.join(' ')}`.toLowerCase();
          
          if (isGeneric || content.includes(normalizedQuery) || normalizedQuery.split(' ').some(word => word.length > 3 && content.includes(word))) {
            results.push({
              id: doc.id,
              websiteName: data.websiteName || 'Unknown',
              name: data.name || '',
              description: data.description || '',
              categories: data.categories || [],
              url: data.url || '',
            });
          }
        });
      } catch (err: any) {
        console.error("[Astra Tool] Registry synchronization failed:", err.message);
      }
    }

    // Fallback/Augment with internal Project Library (200+ Tools)
    if (results.length < 5) {
      MOCK_WEBSITES.forEach(site => {
        const content = `${site.websiteName} ${site.name} ${site.description} ${site.categories.join(' ')}`.toLowerCase();
        if (isGeneric || content.includes(normalizedQuery) || normalizedQuery.split(' ').some(word => word.length > 3 && content.includes(word))) {
          if (!results.find(r => r.url === site.url)) {
            results.push({
              id: site.id,
              websiteName: site.websiteName || 'Discovery Asset',
              name: site.name,
              description: site.description,
              categories: site.categories,
              url: site.url,
            });
          }
        }
      });
    }

    // Sort: Exact name matches first
    results.sort((a, b) => {
      const aTitleMatch = a.websiteName.toLowerCase().includes(normalizedQuery) ? 1 : 0;
      const bTitleMatch = b.websiteName.toLowerCase().includes(normalizedQuery) ? 1 : 0;
      return bTitleMatch - aTitleMatch;
    });

    return results.slice(0, 10);
  }
);