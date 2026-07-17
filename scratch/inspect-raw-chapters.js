import fs from 'fs';
import path from 'path';

const cacheDir = 'C:/Users/User/.gemini/antigravity/brain/94415241-e907-4a0d-ab2d-2708f581a7e2/scratch/guwen_cache';

const files = [
  { name: '桃花源記', path: path.join(cacheDir, 'part_110.html') }, // wait, 108 index + 3 = part111.html? No! Let's look at metadata.json!
  { name: '陋室銘', path: path.join(cacheDir, 'part_120.html') } // let's check!
];

// Let's first search in metadata.json to get the exact file numbers!
const metadata = JSON.parse(fs.readFileSync(path.join(cacheDir, 'metadata.json'), 'utf8'));
const targets = ['桃花源記', '陋室銘', '岳陽樓記', '前赤壁賦', '出師表'];

targets.forEach(t => {
  const artIdx = metadata.findIndex(a => a.title.includes(t));
  if (artIdx !== -1) {
    const art = metadata[artIdx];
    const partNum = String(artIdx + 3).padStart(3, '0');
    const filePath = path.join(cacheDir, `part_${partNum}.html`);
    console.log(`- Target: ${t} (${art.title}) -> part_${partNum}.html`);
    if (fs.existsSync(filePath)) {
      const html = fs.readFileSync(filePath, 'utf8');
      // Count <p tags and print classes
      const pTags = [...html.matchAll(/<p\s+class="([^"]+)"/gi)].map(m => m[1]);
      console.log(`  Total <p tags: ${pTags.length}`);
      const classesCount = {};
      pTags.forEach(c => classesCount[c] = (classesCount[c] || 0) + 1);
      console.log(`  Classes distribution:`, classesCount);
      
      // Let's print the first 1000 characters of the body
      const bodyIdx = html.indexOf('<body');
      if (bodyIdx !== -1) {
        console.log(`  Body excerpt:`);
        console.log(html.slice(bodyIdx, bodyIdx + 1200).replace(/<[^>]*>/g, ' ').slice(0, 400) + '...');
      }
    }
  }
});
