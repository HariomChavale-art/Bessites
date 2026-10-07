/**
 * @fileOverview Enhanced high-speed local filtering for the Bessites registry.
 * Optimized for Ouneo's 110+ tool database.
 */

import { TOOLS_DATABASE, ToolEntry } from "@/data/toolsDatabase";

export function filterTools(userQuery: string): ToolEntry[] {
  const query = userQuery.toLowerCase().trim();
  if (!query || query.length < 2) return TOOLS_DATABASE.slice(0, 6);

  // Score-based matching for better relevance
  const results = TOOLS_DATABASE.map(tool => {
    let score = 0;
    
    // Name match (Highest priority)
    if (tool.name.toLowerCase().includes(query)) score += 15;
    
    // Exact Category match
    if (tool.category.toLowerCase() === query) score += 10;

    // Keyword match (High fidelity)
    if (tool.keywords.some(k => query.includes(k.toLowerCase()) || k.toLowerCase().includes(query))) score += 8;
    
    // Tag match
    if (tool.tags.some(tag => query.includes(tag.toLowerCase()) || tag.toLowerCase().includes(query))) score += 5;
    
    // Description match
    if (tool.description.toLowerCase().includes(query)) score += 3;
    
    // Long Description match
    if (tool.longDescription.toLowerCase().includes(query)) score += 1;

    return { ...tool, score };
  })
  .filter(t => t.score > 0)
  .sort((a, b) => b.score - a.score);

  // If no specific matches, return trending
  return results.length > 0 ? results.slice(0, 10) : TOOLS_DATABASE.slice(0, 6);
}
