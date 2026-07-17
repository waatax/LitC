import fs from 'fs';
import path from 'path';

const cacheDir = 'C:/Users/User/.gemini/antigravity/brain/94415241-e907-4a0d-ab2d-2708f581a7e2/scratch/guwen_cache';
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.text();
      console.warn(`HTTP error ${res.status} for ${url}, retry ${i + 1}`);
    } catch (e) {
      console.warn(`Fetch error for ${url}: ${e.message}, retry ${i + 1}`);
    }
    await new Promise(r => setTimeout(r, 500));
  }
  throw new Error(`Failed to fetch ${url} after ${retries} retries`);
}

async function main() {
  const volumes = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const articlesMetadata = [];

  for (const vol of volumes) {
    const url = `http://www.xn--5rtnx620bw5s.tw/f/f${vol}/f${vol}.htm`;
    const cacheFile = path.join(cacheDir, `index_vol_${vol}.html`);
    let html = '';

    if (fs.existsSync(cacheFile)) {
      html = fs.readFileSync(cacheFile, 'utf8');
    } else {
      console.log(`Fetching index for Volume ${vol}...`);
      try {
        html = await fetchWithRetry(url);
        fs.writeFileSync(cacheFile, html, 'utf8');
        await new Promise(r => setTimeout(r, 200));
      } catch (e) {
        console.error(`Failed to fetch index for Vol ${vol}:`, e.message);
        continue;
      }
    }

    // Extract links like <td><a href="01.htm">鄭伯克段于鄢</a></td>
    // and author info like <td>左傳 ‧ 隱公三年</td>
    const tableRegex = /<table[\s\S]*?>([\s\S]*?)<\/table>/i;
    const tableMatch = html.match(tableRegex);
    if (!tableMatch) {
      console.warn(`No table found in Volume ${vol}`);
      continue;
    }

    const trRegex = /<tr>([\s\S]*?)<\/tr>/gi;
    const trMatches = [...tableMatch[1].matchAll(trRegex)];
    
    let volArticleCount = 0;
    for (const tr of trMatches) {
      const rowContent = tr[1];
      const linkMatch = rowContent.match(/<a\s+href="([0-9a-zA-Z_-]+\.htm)">([\s\S]*?)<\/a>/i);
      if (!linkMatch) continue;

      const file = linkMatch[1];
      const title = linkMatch[2].replace(/<[^>]*>/g, '').trim();

      // Extract author (usually in the next td)
      const tds = [...rowContent.matchAll(/<td[\s\S]*?>([\s\S]*?)<\/td>/gi)].map(m => m[1].replace(/<[^>]*>/g, '').trim());
      const author = tds[tds.length - 1] || '未知';

      articlesMetadata.push({
        volume: vol,
        file,
        title,
        author,
        url: `http://www.xn--5rtnx620bw5s.tw/f/f${vol}/${file}`
      });
      volArticleCount++;
    }
    console.log(`Volume ${vol}: Found ${volArticleCount} articles`);
  }

  fs.writeFileSync(
    path.join(cacheDir, 'metadata.json'),
    JSON.stringify(articlesMetadata, null, 2),
    'utf8'
  );

  console.log(`=== METADATA COMPILATION COMPLETED ===`);
  console.log(`Total Guwen Guanzhi articles found: ${articlesMetadata.length}`);
}

main();
