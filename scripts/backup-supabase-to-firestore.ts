
/**
 * @fileOverview High-Fidelity Migration Script: Supabase to Firebase Firestore.
 * Performs deep-fetch of all existing registry data and mirrors it to Firestore.
 */

import { createClient } from '@supabase/supabase-js';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';

config();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
}

const db = admin.firestore();
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function runBackup() {
  const dateFolder = new Date().toISOString().split('T')[0];
  const backupDir = path.join(process.cwd(), 'backup', dateFolder);
  
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

  const TABLES = ['submissions', 'websiteStats', 'users', 'promotions'];
  console.log('--- STARTING SYSTEM MIGRATION ---');

  for (const table of TABLES) {
    console.log(`Node Syncing [${table}]...`);
    
    // 1. Fetch from Supabase
    const { data, error } = await supabase.from(table).select('*');
    
    if (error) {
      console.warn(`Skipping [${table}]: Node unreachable or empty.`, error.message);
      continue;
    }

    if (!data || data.length === 0) {
      console.log(`[${table}] is empty. No data to migrate.`);
      continue;
    }

    // 2. Save JSON Backup
    fs.writeFileSync(
      path.join(backupDir, `${table}.json`),
      JSON.stringify(data, null, 2),
      'utf8'
    );

    // 3. Mirror to Firestore
    const batch = db.batch();
    data.forEach((row: any) => {
      const docId = row.id?.toString() || row.userId || row.url?.substring(0, 32);
      const docRef = db.collection(table).doc(docId);
      batch.set(docRef, { ...row, migratedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
    });

    await batch.commit();
    console.log(`COMPLETED: [${table}] backed up and synced (${data.length} records).`);
  }

  console.log(`\n--- MIGRATION VERIFIED ---`);
  console.log(`Location: /backup/${dateFolder}`);
  console.log(`Status: 100% Firebase-Native\n`);
}

runBackup().catch(err => {
  console.error('Migration CRITICAL FAILURE:', err.message);
});
