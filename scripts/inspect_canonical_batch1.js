import fs from 'fs';
import path from 'path';

const worksSource = fs.readFileSync('src/data/works.ts', 'utf8');
const encoded = [...worksSource.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)]
  .map((match) => JSON.parse(decodeURIComponent(match[1])));
const [works, chapters, passages] = encoded;

const targetWorks = ['zhuangzi', 'han-fei-zi', 'shang-jun-shu', 'mo-zi'];

const result = {};

for (const workId of targetWorks) {
  const wChs = chapters.filter(c => c.workId === workId);
  result[workId] = [];
  for (const ch of wChs) {
    const chPassages = passages.filter(p => p.chapterId === ch.id);
    for (const p of chPassages) {
      result[workId].push({
        id: p.id,
        chapterTitle: ch.title,
        canonicalText: p.canonicalText
      });
    }
  }
}

fs.writeFileSync('scratch/canonical_batch1.json', JSON.stringify(result, null, 2), 'utf8');
console.log('Saved canonical texts for Zhuangzi, Han Feizi, Shangjun Shu, Mozi to scratch/canonical_batch1.json');
