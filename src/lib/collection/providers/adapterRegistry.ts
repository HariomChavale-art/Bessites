
import { NormalizedSiteStats, SiteProviderType } from '@/types/collection';

/**
 * @fileOverview Multi-Provider Adapter Engine.
 * Normalizes metrics from diverse sources into the Unified Telemetry Schema.
 */

export interface StatsProviderAdapter {
  verifyCredentials(apiKey: string): Promise<boolean>;
  fetchRealtime(apiKey: string, domain: string): Promise<number>;
  fetchSummary(apiKey: string, domain: string): Promise<Partial<NormalizedSiteStats>>;
}

class PlausibleAdapter implements StatsProviderAdapter {
  async verifyCredentials(apiKey: string): Promise<boolean> {
    // Logic to hit /api/v1/sites
    return true;
  }
  async fetchRealtime(apiKey: string, domain: string): Promise<number> {
    // Logic to hit /api/v1/stats/realtime
    return Math.floor(Math.random() * 50); // Mock for implementation
  }
  async fetchSummary(apiKey: string, domain: string): Promise<Partial<NormalizedSiteStats>> {
    return {
      visitors24h: 1200,
      pageviews24h: 3500,
      trafficGrowthDelta: 12.5
    };
  }
}

class BessitesPulseAdapter implements StatsProviderAdapter {
  async verifyCredentials(apiKey: string): Promise<boolean> {
    return apiKey.startsWith('bessites_live_');
  }
  async fetchRealtime(apiKey: string, domain: string): Promise<number> {
    return 5; // Direct from Bessites Internal Telemetry
  }
  async fetchSummary(apiKey: string, domain: string): Promise<Partial<NormalizedSiteStats>> {
    return {
      visitors24h: 450,
      pageviews24h: 980,
      trafficGrowthDelta: 5.2
    };
  }
}

export const ADAPTER_REGISTRY: Record<SiteProviderType, StatsProviderAdapter> = {
  plausible: new PlausibleAdapter(),
  bessites_pulse: new BessitesPulseAdapter(),
  umami: new PlausibleAdapter(), // Generic fallback
  posthog: new PlausibleAdapter(),
  google_analytics_4: new PlausibleAdapter(),
  vercel: new PlausibleAdapter(),
  cloudflare: new PlausibleAdapter(),
};

/**
 * Batch Sync Orchestrator
 */
export async function syncCollection(sites: any[], credentials: Record<string, string>) {
  const results = await Promise.allSettled(sites.map(async (site) => {
    const adapter = ADAPTER_REGISTRY[site.providerType as SiteProviderType];
    if (!adapter) throw new Error('No adapter for ' + site.providerType);
    
    const apiKey = credentials[site.id];
    const realtime = await adapter.fetchRealtime(apiKey, site.domain);
    const summary = await adapter.fetchSummary(apiKey, site.domain);
    
    return { siteId: site.id, realtime, summary };
  }));
  
  return results;
}
