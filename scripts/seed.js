
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

/**
 * Bessites Automated Seeding Script
 * 
 * Instructions:
 * 1. Ensure 'service-account.json' is in the root directory.
 * 2. Ensure 'data/seed.json' exists with your website data.
 * 3. Run: node scripts/seed.js
 */

const serviceAccountPath = path.join(__dirname, '../service-account.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('Error: service-account.json not found at project root.');
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const sanitizeCategory = (cat) => {
  if (!cat) return "Other";
  // Remove ampersands, slashes, and special chars for clean hierarchy as requested
  return cat.split(/[&/]/)[0].trim();
};

const formatUrl = (url) => {
  if (!url) return "";
  const baseUrl = url.split('?')[0];
  return `${baseUrl}?ref=bessites`;
};

async function seedDatabase() {
  const seedDataPath = path.join(__dirname, '../data/seed.json');
  
  if (!fs.existsSync(seedDataPath)) {
    console.error('Error: data/seed.json not found.');
    process.exit(1);
  }

  const rawData = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));
  console.log(`Loaded ${rawData.length} records from seed.json`);

  const CHUNK_SIZE = 450;
  const totalBatches = Math.ceil(rawData.length / CHUNK_SIZE);

  for (let i = 0; i < totalBatches; i++) {
    const batch = db.batch();
    const chunk = rawData.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);

    console.log(`Processing batch ${i + 1}/${totalBatches}...`);

    chunk.forEach((site) => {
      // Use URL as unique identifier to prevent duplicates during seeding
      const docId = Buffer.from(site.url).toString('base64').substring(0, 32);
      const docRef = db.collection('submissions').doc(docId);

      batch.set(docRef, {
        name: site.name,
        websiteName: site.websiteName || site.name,
        url: formatUrl(site.url),
        categories: [sanitizeCategory(site.category)],
        description: site.description,
        status: "approved", // Seeded items are auto-approved
        userId: "system-seed",
        userEmail: "registry@bessites.store",
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      // Initialize stats for each seeded site
      const statsRef = db.collection('websiteStats').doc(docId);
      batch.set(statsRef, {
        visitCount: Math.floor(Math.random() * 10), // Give some initial life
        likeCount: 0,
        saveCount: 0,
        shareCount: 0,
        ratingSum: 0,
        ratingCount: 0
      }, { merge: true });
    });

    await batch.commit();
    console.log(`Batch ${i + 1} committed successfully.`);
  }

  console.log('Seeding complete! Bessites registry is now populated.');
}

seedDatabase().catch(console.error);
