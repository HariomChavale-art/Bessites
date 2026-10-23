
import { 
  getFirestore, 
  doc, 
  collection, 
  runTransaction, 
  serverTimestamp, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  setDoc,
  increment,
  deleteDoc
} from 'firebase/firestore';
import { StackDocument, StackItemDocument, StackTag } from '@/types/stacks';

export class StackService {
  private db = getFirestore();

  async createStack(userId: string, data: Partial<StackDocument>, items: Partial<StackItemDocument>[]) {
    const stackRef = doc(collection(this.db, 'stacks'));
    const now = serverTimestamp();

    await runTransaction(this.db, async (transaction) => {
      // 1. Create Stack Main Doc
      transaction.set(stackRef, {
        ...data,
        id: stackRef.id,
        creatorId: userId,
        upvoteCount: 0,
        saveCount: 0,
        forkCount: 0,
        itemsCount: items.length,
        createdAt: now,
        updatedAt: now,
      });

      // 2. Add Sub-Items
      items.forEach((item, index) => {
        const itemRef = doc(collection(this.db, `stacks/${stackRef.id}/items`));
        transaction.set(itemRef, {
          ...item,
          id: itemRef.id,
          stackId: stackRef.id,
          orderIndex: index,
          addedAt: now
        });
      });
    });

    return stackRef.id;
  }

  async toggleUpvote(stackId: string, userId: string) {
    const voteId = `${stackId}_${userId}`;
    const voteRef = doc(this.db, 'stackVotes', voteId);
    const stackRef = doc(this.db, 'stacks', stackId);

    await runTransaction(this.db, async (transaction) => {
      const voteSnap = await transaction.get(voteRef);
      if (voteSnap.exists()) {
        transaction.delete(voteRef);
        transaction.update(stackRef, { upvoteCount: increment(-1) });
      } else {
        transaction.set(voteRef, { stackId, userId, createdAt: serverTimestamp() });
        transaction.update(stackRef, { upvoteCount: increment(1) });
      }
    });
  }

  async forkStack(originalStackId: string, userId: string, newCreatorSnapshot: any) {
    const originalRef = doc(this.db, 'stacks', originalStackId);
    const itemsRef = collection(this.db, `stacks/${originalStackId}/items`);
    
    const snap = await getDocs(query(itemsRef, orderBy('orderIndex', 'asc')));
    const originalStack = (await getDocs(query(collection(this.db, 'stacks'), where('id', '==', originalStackId)))).docs[0].data() as StackDocument;

    const newStackId = await this.createStack(userId, {
      ...originalStack,
      title: `${originalStack.title} (Remix)`,
      creatorId: userId,
      creatorSnapshot: newCreatorSnapshot,
      forkedFromId: originalStackId,
      upvoteCount: 0,
      saveCount: 0,
      forkCount: 0
    }, snap.docs.map(d => d.data() as StackItemDocument));

    await updateDoc(originalRef, { forkCount: increment(1) });
    return newStackId;
  }
}

// Minimal utility to mimic scraping for the UI
export const getUrlMetadata = async (url: string) => {
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    return {
      title: domain.split('.')[0].toUpperCase(),
      favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
      domain: domain
    };
  } catch {
    return { title: 'New System', favicon: '', domain: 'unknown' };
  }
};
