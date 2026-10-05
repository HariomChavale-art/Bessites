/**
 * @fileOverview Enhanced high-speed local filtering for the Bessites registry.
 */

import { TOOLS_DATABASE, ToolEntry } from "@/data/toolsDatabase";

export function filterTools(userQuery: string): ToolEntry[] {
  const query = userQuery.toLowerCase().trim();
  if (!query || query.length < 2) return TOOLS_DATABASE.slice(0, 6);

  // Score-based matching for better relevance
  const results = TOOLS_DATABASE.map(tool => {
    let score = 0;
    
    // Name match (Highest priority)
    if (tool.name.toLowerCase().includes(query)) score += 10;
    
    // Exact Tag match
    if (tool.tags.some(tag => tag.toLowerCase() === query)) score += 8;
    
    // Partial Tag match
    if (tool.tags.some(tag => tag.toLowerCase().includes(query))) score += 5;
    
    // Keyword match
    if (tool.keywords.some(k => query.includes(k.toLowerCase()))) score += 4;
    
    // Description match
    if (tool.description.toLowerCase().includes(query)) score += 2;
    
    // Category match
    if (tool.category.toLowerCase().includes(query)) score += 3;

    return { ...tool, score };
  })
  .filter(t => t.score > 0)
  .sort((a, b) => b.score - a.score);

  // If no specific matches, return trending
  return results.length > 0 ? results.slice(0, 6) : TOOLS_DATABASE.slice(0, 6);
}
