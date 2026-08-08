import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const worksTsPath = path.join(__dirname, '../src/data/works.ts');
const text = fs.readFileSync(worksTsPath, 'utf8');
const jsonMatches = [...text.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)];

if (jsonMatches.length >= 4) {
  const sentences = JSON.parse(decodeURIComponent(jsonMatches[3][1]));
  console.log('Total sentences available:', sentences.length);
  
  const sampleWorks = ['lun-yu', 'dao-de-jing', 'zhuangzi', 'art-of-war', 'meng-zi', 'han-fei-zi', 'mo-zi', 'cai-gen-tan', 'shang-jun-shu', 'da-xue', 'zhong-yong', 'liezi'];
  sampleWorks.forEach(wId => {
    const wSents = sentences.filter(s => s.id.startsWith(wId + '_'));
    console.log(`Work ${wId}: ${wSents.length} sentences`);
  });
}
