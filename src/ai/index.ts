
import { ai } from './genkit';
import { z } from 'genkit';
import allSites from '@/data/allSites.json';

export const findSitesFlow = ai.defineFlow(
  { name: 'findSitesFlow', inputSchema: z.string(), outputSchema: z.string() },
  async (userQuery) => {
    const { text } = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt: `You are Bessites. You have 1000 real verified sites registry: ${JSON.stringify(allSites.slice(0, 1000))}. 
      User wants: "${userQuery}". Pick 3 perfect REAL sites from registry only. For each give name, url, whyPerfect for this specific user, cleanScore 1-10. Return only JSON array like [{"name":"...","url":"https://...","whyPerfect":"...","cleanScore":9}]. No fake sites, no hallucination. If not sure say no perfect match.`,
      config: { temperature: 0.2 }
    });
    return text;
  }
);
