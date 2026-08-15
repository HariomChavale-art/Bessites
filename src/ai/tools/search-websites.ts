'use server';
/**
 * @fileOverview A Genkit tool to search the Bessites Firestore database.
 * This tool allows the AI to retrieve real, approved websites for recommendations.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { initializeFirebase } from '@/firebase/init';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

const SearchWebsitesInputSchema = z.object({
  query: z.string().describe('Keywords to search for (e.g., "video editing", "productivity").'),
  category: z.string().optional().describe('Specific category to filter by.'),
  pricing: z.enum(['Free', 'Paid', 'Freemium']).optional().describe('Filter by pricing model.'),
});

export const searchWebsitesTool = ai.defineTool(
  {
    name: 'searchWebsites',
    description: 'Searches the Bessites directory for real websites and digital tools.',
    inputSchema: SearchWebsitesInputSchema,
    outputSchema: z.array(z.object({
      id: z.string(),
      websiteName: z.string(),
      title: z.string(),
      description: z.string(),
      categories: z.array(z.string()),
      pricing: z.string(),
      url: z.string(),
    })),
  },
  async (input) => {
    const { firestore } = initializeFirebase();
    if (!firestore) {
      console.error("[searchWebsitesTool] Firestore not available on the server.");
      return [];
    }

    try {
      console.log(`[searchWebsitesTool] Searching for: "${input.query}"`);
      
      const submissionsRef = collection(firestore, 'submissions');
      // We pull the latest approved items
      const q = query(
        submissionsRef, 
        where('status', '==', 'approved'),
        limit(150)
      );
      
      const querySnapshot = await getDocs(q);
      const results: any[] = [];
      
      // Allow terms as short as 2 characters (e.g. "AI", "UI", "OS")
      const searchTerms = input.query.toLowerCase().split(' ').filter(t => t.length >= 2);

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const content = `${data.websiteName} ${data.name} ${data.description} ${data.categories?.join(' ')}`.toLowerCase();
        
        // Match if any search term is found in content
        const matchesQuery = searchTerms.length === 0 || searchTerms.some(term => content.includes(term));
        const matchesCategory = !input.category || data.categories?.includes(input.category);
        const matchesPricing = !input.pricing || data.pricing === input.pricing;

        if (matchesQuery && matchesCategory && matchesPricing) {
          results.push({
            id: doc.id,
            websiteName: data.websiteName || 'Unknown',
            title: data.name || '',
            description: data.description || '',
            categories: data.categories || [],
            pricing: data.pricing || 'Free',
            url: data.url || '',
          });
        }
      });

      console.log(`[searchWebsitesTool] Found ${results.length} results.`);
      return results.slice(0, 8); // Return top 8 most relevant to stay within context limits
    } catch (error) {
      console.error('[searchWebsitesTool] Firestore query error:', error);
      return [];
    }
  }
);
