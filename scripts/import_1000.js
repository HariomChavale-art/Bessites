
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

/**
 * @fileOverview High-Fidelity XLSX Importer for Bessites.
 * Reads the project root /1000-websites.xlsx and updates the project registry.
 */

async function runImport() {
  const filePath = path.join(__dirname, '../1000-websites.xlsx');
  
  if (!fs.existsSync(filePath)) {
    console.error('CRITICAL: /1000-websites.xlsx not found in project root.');
    process.exit(1);
  }

  console.log('Synchronizing discovery registry from XLSX...');

  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Parse all columns: name, url, category, description
  const rawData = XLSX.utils.sheet_to_json(worksheet);
  
  const mappedData = rawData.map((item, index) => ({
    title: item.name || item.title || `Asset ${index}`,
    url: item.url || '',
    description: item.description || 'Verified digital asset in the Bessites registry.',
    category: item.category || 'Discovery'
  })).filter(item => item.url && item.url.startsWith('http'));

  const outputDir = path.join(__dirname, '../src/data');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  fs.writeFileSync(
    path.join(outputDir, 'allSites.json'),
    JSON.stringify(mappedData, null, 2),
    'utf8'
  );

  console.log(`COMPLETED: Loaded ${mappedData.length}/1000 sites successfully.`);
}

runImport().catch(err => {
  console.error('Import Failure:', err.message);
  process.exit(1);
});
