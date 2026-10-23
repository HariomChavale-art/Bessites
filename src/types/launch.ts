
import { Timestamp } from 'firebase/firestore';

export type LaunchStatus = 'pending' | 'active' | 'archived';
export type LaunchPeriod = 'daily' | 'weekly' | 'all-time';

export interface WebsiteLaunch {
  id: string;
  websiteId: string; // Reference to original submission
  normalizedDomain: string; // e.g. "bessites.store"
  creatorId: string;
  creatorName: string;
  creatorPhoto: string;
  
  title: string;
  tagline: string;
  url: string;
  logoUrl: string;
  previewImageUrl: string;
  
  // Tagging
  category: string;
  stackTags: string[];
  vibeTags: string[]; // e.g. "Minimal", "Brutalist", "Sleek"
  
  // Metrics
  upvoteCount: number;
  weightedVoteScore: number;
  commentCount: number;
  uniqueClicks: number;
  rankingScore: number;
  
  // Curation Badges (Zero Padding Standards)
  fidelityMetrics: {
    performance: number;
    accessibility: number;
    designFidelity: number;
  };
  
  // Deterministic Keys for Fast Querying
  launchDayKey: string; // YYYY-MM-DD
  launchWeekKey: string; // YYYY-WW
  
  status: LaunchStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface LaunchVote {
  userId: string;
  launchId: string;
  weight: number; // 0.25 for new accounts, 1.0 for aged
  createdAt: Timestamp;
}

export interface LaunchComment {
  id: string;
  launchId: string;
  userId: string;
  userName: string;
  userPhoto: string;
  content: string;
  parentId?: string; // For 1-level nesting
  likeCount: number;
  createdAt: Timestamp;
}
