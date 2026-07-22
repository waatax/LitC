import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function run() {
  console.log('Fetching raw I Ching data...');
  try {
    const ichingRes = await fetch('https://raw.githubusercontent.com/john-walks-slow/open-iching/main/iching/iching.json');
    const xiangRes = await fetch('https://raw.githubusercontent.com/john-walks-slow/open-iching/main/ichuan/xiang.json');
    
    if (!ichingRes.ok || !xiangRes.ok) {
      throw new Error(`Failed to fetch raw files: iching=${ichingRes.status}, xiang=${xiangRes.status}`);
    }
    
    const iching = await ichingRes.json();
    const xiang = await xiangRes.json();
    
    // We want to map each of the 64 hexagrams
    const hexagrams = iching.map(h => {
      const daxiangKey = `iching__${h.id}`;
      const daxiang = xiang[daxiangKey] || '';
      return {
        id: h.id,
        name: h.name,
        symbol: h.symbol,
        scripture: h.scripture,
        daxiang: daxiang
      };
    });
    
    const outputPath = path.join(__dirname, 'yijing_raw.json');
    fs.writeFileSync(outputPath, JSON.stringify(hexagrams, null, 2), 'utf8');
    console.log(`Saved raw I Ching data to ${outputPath}. Total hexagrams: ${hexagrams.length}`);
  } catch (e) {
    console.error('Failed to prepare I Ching raw data:', e);
  }
}

run();
