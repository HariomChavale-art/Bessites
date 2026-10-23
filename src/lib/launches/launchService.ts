
import { 
  getFirestore, 
  doc, 
  runTransaction, 
  serverTimestamp, 
  Timestamp,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  startAfter,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { WebsiteLaunch, LaunchVote, LaunchPeriod } from '@/types/launch';

/**
 * Normalizes a URL to a canonical domain key.
 */
export const normalizeUrl = (url: string): string => {
  try {
    const u = new URL(url.toLowerCase().trim());
    return u.hostname.replace('www.', '') + u.pathname.replace(/\/$/, '');
  } catch {
    return url.replace('https://', '').replace('http://', '').split('/')[0];
  }
};

/**
 * Composite Ranking Algorithm (Anti-Gaming)
 * Score = (Upvotes * Weight + Comments * 2 + Clicks * 1.5) / (AgeInHours + 2)^1.8
 */
export const calculateRankingScore = (launch: WebsiteLaunch): number => {
  const ageInHours = (Date.now() - launch.createdAt.toMillis()) / 3600000;
  const engagement = (launch.weightedVoteScore * 10) + (launch.commentCount * 2) + (launch.uniqueClicks * 1.5);
  return engagement / Math.pow(ageInHours + 2, 1.8);
};

export class LaunchService {
  private db = getFirestore();

  /**
   * Atomic Website Launch
   */
  async launchWebsite(launchData: Omit<WebsiteLaunch, 'id' | 'upvoteCount' | 'rankingScore' | 'weightedVoteScore' | 'commentCount' | 'uniqueClicks' | 'createdAt' | 'updatedAt'>) {
    const domain = normalizeUrl(launchData.url);
    const domainHash = Buffer.from(domain).toString('base64').substring(0, 32);

    return runTransaction(this.db, async (transaction) => {
      const domainRef = doc(this.db, 'launchedDomains', domainHash);
      const domainSnap = await transaction.get(domainRef);

      if (domainSnap.exists()) {
        throw new Error('This website has already been launched on Bessites.');
      }

      const launchRef = doc(collection(this.db, 'launches'));
      const now = serverTimestamp();

      transaction.set(domainRef, { 
        launchId: launchRef.id, 
        normalizedDomain: domain, 
        createdAt: now 
      });

      transaction.set(launchRef, {
        ...launchData,
        id: launchRef.id,
        normalizedDomain: domain,
        upvoteCount: 1, // Self-vote
        weightedVoteScore: 1.0,
        commentCount: 0,
        uniqueClicks: 0,
        rankingScore: 1.0,
        createdAt: now,
        updatedAt: now,
      });

      return launchRef.id;
    });
  }

  /**
   * Optimistic Vote Toggle
   */
  async toggleVote(launchId: string, userId: string, isAgedAccount: boolean) {
    const voteId = `${launchId}_${userId}`;
    const voteRef = doc(this.db, 'votes', voteId);
    const launchRef = doc(this.db, 'launches', launchId);
    const weight = isAgedAccount ? 1.0 : 0.25;

    return runTransaction(this.db, async (transaction) => {
      const voteSnap = await transaction.get(voteRef);
      const launchSnap = await transaction.get(launchRef);

      if (!launchSnap.exists()) throw new Error('Launch not found');
      
      const currentData = launchSnap.data() as WebsiteLaunch;
      const increment = voteSnap.exists() ? -1 : 1;
      const scoreIncrement = increment * weight;

      if (voteSnap.exists()) {
        transaction.delete(voteRef);
      } else {
        transaction.set(voteRef, { launchId, userId, weight, createdAt: serverTimestamp() });
      }

      const updatedLaunch = {
        ...currentData,
        upvoteCount: Math.max(0, currentData.upvoteCount + increment),
        weightedVoteScore: Math.max(0, currentData.weightedVoteScore + scoreIncrement),
      };

      transaction.update(launchRef, {
        upvoteCount: updatedLaunch.upvoteCount,
        weightedVoteScore: updatedLaunch.weightedVoteScore,
        rankingScore: calculateRankingScore(updatedLaunch),
        updatedAt: serverTimestamp()
      });
    });
  }

  /**
   * Fetch Leaderboard
   */
  async getLeaderboard(period: LaunchPeriod, category?: string, lastDoc?: QueryDocumentSnapshot) {
    const launchesRef = collection(this.db, 'launches');
    let q = query(launchesRef, where('status', '==', 'active'));

    if (period === 'daily') {
      const today = new Date().toISOString().split('T')[0];
      q = query(q, where('launchDayKey', '==', today));
    }
    
    if (category && category !== 'All') {
      q = query(q, where('category', '==', category));
    }

    q = query(q, orderBy('rankingScore', 'desc'), limit(20));

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    return getDocs(q);
  }
}
