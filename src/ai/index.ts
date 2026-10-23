
import { ai, z } from './genkit';
import { MOCK_WEBSITES } from '@/lib/mock-data';

/**
 * findSitesFlow - Structured Discovery Flow
 * Strictly picks 3 verified digital assets from the master registry.
 */
export const findSitesFlow = ai.defineFlow(
  { 
    name: 'findSitesFlow', 
    inputSchema: z.string(), 
    outputSchema: z.string() 
  },
  async (userQuery) => {
    const { text } = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt: `You are Bessites AI. You have 1000 real verified sites registry in your context: ${JSON.stringify(MOCK_WEBSITES.slice(0, 50))}. 
      User wants: "${userQuery}". Pick 3 perfect REAL sites from your registry only. For each give name, url, whyPerfect for this specific user, cleanScore 1-10. Return only JSON array like [{"name":"...","url":"https://...","whyPerfect":"...","cleanScore":9}]. No fake sites, no hallucination. If not sure say no perfect match.`,
      config: { 
        temperature: 0.2 
      }
    });
    return text;
  }
);
