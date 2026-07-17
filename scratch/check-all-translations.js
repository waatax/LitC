import fs from 'fs';
import path from 'path';

const cacheDir = 'C:/Users/User/.gemini/antigravity/brain/94415241-e907-4a0d-ab2d-2708f581a7e2/scratch/guwen_cache';
const metadata = JSON.parse(fs.readFileSync(path.join(cacheDir, 'metadata.json'), 'utf8'));

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.text();
    } catch (e) {
      // ignore and retry
    }
    await new Promise(r => setTimeout(r, 200));
  }
  return null;
}

async function main() {
  let hasTranslationCount = 0;
  let missingTranslationCount = 0;
  const missingList = [];

  console.log("Checking all 222 articles for translations...");
  
  for (let i = 0; i < metadata.length; i++) {
    const art = metadata[i];
    const filename = `art_${art.volume}_${art.file}`;
    const filePath = path.join(cacheDir, filename);
    let html = '';

    if (fs.existsSync(filePath)) {
      html = fs.readFileSync(filePath, 'utf8');
    } else {
      console.log(`[${i+1}/222] Fetching ${art.title}...`);
      html = await fetchWithRetry(art.url);
      if (html) {
        fs.writeFileSync(filePath, html, 'utf8');
        await new Promise(r => setTimeout(r, 100));
      } else {
        console.error(`Failed to fetch ${art.title}`);
        continue;
      }
    }

    const hasTranslation = html.includes('白話翻譯') || html.includes('譯文') || html.includes('白話譯文');
    if (hasTranslation) {
      hasTranslationCount++;
    } else {
      missingTranslationCount++;
      missingList.push({
        volume: art.volume,
        file: art.file,
        title: art.title,
        url: art.url
      });
    }
  }

  console.log(`\n=== RESULTS ===`);
  console.log(`Total Articles: ${metadata.length}`);
  console.log(`With Translation: ${hasTranslationCount}`);
  console.log(`Missing Translation: ${missingTranslationCount}`);

  fs.writeFileSync(
    path.join(cacheDir, 'missing_translations.json'),
    JSON.stringify(missingList, null, 2),
    'utf8'
  );

  console.log("Saved missing translations list to missing_translations.json");
}

main();
