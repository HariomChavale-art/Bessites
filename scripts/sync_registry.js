
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

/**
 * @fileOverview High-Fidelity JSON Importer for Bessites.
 * Synchronizes 1000 websites and 530 interests with Firestore.
 * Performs deduplication and system reporting.
 */

const serviceAccountPath = path.join(__dirname, '../service-account.json');
if (!fs.existsSync(serviceAccountPath)) {
  console.error('Error: service-account.json missing at root.');
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const JSON_URL = "https://drive.google.com/uc?export=view&id=1wm0TA0sczER6yiB29ALGJ1EEpjVaKNl1";

async function runSync() {
  console.log('Initiating high-velocity registry synchronization...');

  // 1. Fetch JSON
  let rawData;
  try {
    const response = await fetch(JSON_URL);
    rawData = await response.json();
    console.log(`Successfully fetched ${rawData.length} entries from remote ledger.`);
  } catch (err) {
    console.error('Fetch Failure:', err.message);
    return;
  }

  // 2. Fetch Existing URLs for Deduplication
  console.log('Synchronizing existing data nodes for deduplication...');
  const existingUrls = new Set();
  const snapshot = await db.collection('submissions').get();
  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.url) existingUrls.add(data.url.toLowerCase().trim());
  });

  // 3. Process and Deduplicate
  const uniqueSites = [];
  const allInterests = new Set();
  let duplicateCount = 0;

  rawData.forEach(site => {
    const normalizedUrl = site.url?.toLowerCase().trim();
    if (existingUrls.has(normalizedUrl)) {
      duplicateCount++;
      return;
    }

    // Capture unique interests
    if (site.interest) allInterests.add(site.interest);
    if (Array.isArray(site.interests)) site.interests.forEach(i => allInterests.add(i));

    uniqueSites.push({
      ...site,
      status: "approved",
      userId: "system-import",
      userEmail: "bessitesofficial@gmail.com",
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    existingUrls.add(normalizedUrl);
  });

  console.log(`Processing complete. Deduplicated: ${duplicateCount} | Ready for import: ${uniqueSites.length}`);

  // 4. Batch Import to Firestore
  const CHUNK_SIZE = 400;
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < uniqueSites.length; i += CHUNK_SIZE) {
    const chunk = uniqueSites.slice(i, i + CHUNK_SIZE);
    const batch = db.batch();

    chunk.forEach(site => {
      const docId = Buffer.from(site.url).toString('base64').substring(0, 32);
      const subRef = db.collection('submissions').doc(docId);
      const statsRef = db.collection('websiteStats').doc(docId);

      batch.set(subRef, site, { merge: true });
      batch.set(statsRef, {
        visitCount: Math.floor(Math.random() * 5),
        likeCount: 0,
        saveCount: 0,
        shareCount: 0,
        ratingSum: site.rating || 0,
        ratingCount: site.rating ? 1 : 0,
        lastPreviewUpdate: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    });

    try {
      await batch.commit();
      successCount += chunk.length;
      console.log(`Batch [${i / CHUNK_SIZE + 1}] committed successfully.`);
    } catch (err) {
      failCount += chunk.length;
      console.error(`Batch [${i / CHUNK_SIZE + 1}] failed:`, err.message);
    }
  }

  // 5. Final Report
  console.log('\n--- REGISTRY SYNC REPORT ---');
  console.log(`Total Sites in Registry Now: ${existingUrls.size}`);
  console.log(`Newly Imported: ${successCount}`);
  console.log(`Failed Imports: ${failCount}`);
  console.log(`Total Unique Interests Tracked: ${allInterests.size}`);
  console.log('----------------------------\n');
}

runSync().catch(console.error);
