'use server';
/**
 * @fileOverview A Genkit tool to search the Bessites Firestore database.
 * This tool allows the AI to retrieve real, approved websites for recommendations.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { initializeFirebase } from '@/firebase';
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
    if (!firestore) return [];

    try {
      // Fetch approved submissions
      const submissionsRef = collection(firestore, 'submissions');
      const q = query(
        submissionsRef, 
        where('status', '==', 'approved'),
        limit(50) // Reasonable limit for the LLM to process
      );
      
      const querySnapshot = await getDocs(q);
      const results: any[] = [];
      
      const searchTerms = input.query.toLowerCase().split(' ');

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const content = `${data.websiteName} ${data.name} ${data.description} ${data.categories?.join(' ')}`.toLowerCase();
        
        // Simple keyword matching for prototype efficiency
        const matchesQuery = searchTerms.every(term => content.includes(term));
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

      return results.slice(0, 10); // Return top 10 matches
    } catch (error) {
      console.error('Error searching websites:', error);
      return [];
    }
  }
);
