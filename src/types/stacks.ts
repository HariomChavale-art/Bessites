
import { Timestamp } from 'firebase/firestore';

export type StackTag = '100% Free' | 'Less Ads' | 'Zero Ads' | 'Easy to Use' | 'Fast' | 'No Signup' | 'Open Source';

export interface StackItemSummary {
  id: string;
  title: string;
  faviconUrl: string;
  domain: string;
}

export interface StackDocument {
  id: string;
  slug: string;
  title: string;
  description: string;
  creatorId: string;
  creatorSnapshot: {
    username: string;
    displayName: string;
    avatarUrl?: string;
    founderNumber?: number;
  };
  isPublic: boolean;
  isStaffPick: boolean;
  category: string;
  tags: StackTag[];
  itemsCount: number;
  previewItems: StackItemSummary[]; // Denormalized top 5 for feed rendering
  upvoteCount: number;
  saveCount: number;
  forkCount: number;
  forkedFromId?: string;
  badges: {
    isFullyFree: boolean;
    isAdFree: boolean;
    isNoSignup: boolean;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface StackItemDocument {
  id: string;
  stackId: string;
  websiteUrl: string;
  normalizedDomain: string;
  bessitesDirectoryId?: string;
  title: string;
  description: string;
  curatorNote?: string;
  faviconUrl: string;
  previewImageUrl?: string;
  isFree: boolean;
  hasAds: boolean;
  requiresLogin: boolean;
  orderIndex: number;
  addedAt: Timestamp;
}
