
export type SiteProviderType = 'bessites_pulse' | 'plausible' | 'umami' | 'posthog' | 'google_analytics_4' | 'vercel' | 'cloudflare';

export interface NormalizedSiteStats {
  liveVisitors: number;
  visitors24h: number;
  pageviews24h: number;
  bounceRate: number;
  avgDurationSec: number;
  ttfbMs: number;
  uptimePercent: number;
  sslDaysRemaining: number;
  bessitesReferrals24h: number;
  bessitesConversionRate: number;
  trafficGrowthDelta: number; // Percentage
}

export interface CollectionSite {
  id: string;
  ownerId: string;
  domain: string;
  name: string;
  providerType: SiteProviderType;
  status: 'healthy' | 'warning' | 'error' | 'syncing';
  tags: string[];
  publicVerifiedBadgeEnabled: boolean;
  lastSyncedAt: any; // Firestore Timestamp
  currentSummaryStats: NormalizedSiteStats;
  bessitesLaunchId?: string;
}

export interface MetricBucket {
  timestamp: any;
  visitors: number;
  pageviews: number;
  ttfbMs: number;
  revenueCents?: number;
}

export interface CollectionAlert {
  id: string;
  siteId: string;
  siteName: string;
  type: 'traffic_spike' | 'downtime' | 'ssl_expiry' | 'milestone';
  message: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: any;
  read: boolean;
}
