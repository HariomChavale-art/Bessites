'use server';
/**
 * Falmido, Bessites' conversational website-finding assistant.
 * Website matches come from the site's own registry, so recommendations remain
 * available even when Gemini is not configured or temporarily unavailable.
 */

import { ai, z } from '@/ai/genkit';
import { FalmidoOutputSchema, type FalmidoOutput } from '@/ai/schemas';
import { MOCK_WEBSITES } from '@/lib/mock-data';

const FalmidoInputSchema = z.object({
  message: z.string().trim().min(1).max(2000),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().max(2000),
  })).max(20).optional(),
});

type FalmidoInput = z.infer<typeof FalmidoInputSchema>;

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'best', 'can', 'find', 'for', 'give', 'good', 'help',
  'i', 'in', 'is', 'it', 'me', 'my', 'of', 'on', 'or', 'please', 'show', 'some',
  'suggest', 'that', 'the', 'to', 'with', 'website', 'websites', 'site', 'sites',
  'tool', 'tools', 'want', 'what', 'where', 'which', 'you', 'your',
]);

function findRegistryMatches(message: string): FalmidoOutput['matches'] {
  const terms = [...new Set(message.toLowerCase().match(/[a-z0-9]{2,}/g) ?? [])]
    .filter((term) => !STOP_WORDS.has(term));
  if (terms.length === 0) return [];

  return MOCK_WEBSITES
    .map((site) => {
      const name = (site.websiteName || site.name).toLowerCase();
      const categories = site.categories.join(' ').toLowerCase();
      const description = `${site.description} ${site.longDescription} ${site.bestFor ?? ''}`.toLowerCase();
      const score = terms.reduce((total, term) => {
        if (name.includes(term)) return total + 5;
        if (categories.includes(term)) return total + 3;
        if (description.includes(term)) return total + 1;
        return total;
      }, 0);
      return { site, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ site }) => ({
      id: site.id,
      name: site.websiteName || site.name,
      reason: site.description,
      url: site.url,
      category: site.categories[0] || 'Website',
    }));
}

function localReply(message: string, matches: FalmidoOutput['matches']): FalmidoOutput {
  if (matches.length > 0) {
    return {
      response: 'Here are a few websites from the Bessites directory that may fit what you are looking for:',
      matches,
    };
  }

  const isGreeting = /^(hi|hello|hey|good morning|good afternoon|good evening)\b/i.test(message.trim());
  return {
    response: isGreeting
      ? 'Hi! I’m Falmido. Tell me what you want to do or make, and I’ll find relevant websites from Bessites.'
      : 'I can help you discover websites in the Bessites directory. Tell me what you want to do—for example, design a logo, edit a video, or learn to code.',
    matches: [],
  };
}

export async function askFalmido(input: FalmidoInput): Promise<FalmidoOutput> {
  const parsed = FalmidoInputSchema.parse(input);
  const matches = findRegistryMatches(parsed.message);
  const fallback = localReply(parsed.message, matches);

  // Search works without an AI key. When configured, Gemini adds a conversational
  // answer, while the actual recommendation cards always come from our registry.
  if (!process.env.GOOGLE_GENAI_API_KEY && !process.env.GEMINI_API_KEY) return fallback;

  try {
    const response = await ai.generate({
      system: `You are Falmido, the friendly website-discovery assistant for Bessites. Answer the user's actual question briefly and naturally. If they ask for websites, explain that the verified directory matches are shown separately; never invent or claim a website that is not in the supplied matches. If there are no matches, ask a short follow-up about what kind of website they need.`,
      prompt: `User message: ${parsed.message}\n\nVerified directory matches (the interface will display these): ${JSON.stringify(matches)}`,
      history: parsed.history?.map((item) => ({
        role: item.role,
        content: [{ text: item.content }],
      })),
    });

    return {
      response: response.text?.trim() || fallback.response,
      matches,
    };
  } catch (error) {
    console.error('[Falmido] Gemini request failed; returning local registry results.', error);
    return fallback;
  }
}
