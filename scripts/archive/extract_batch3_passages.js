import fs from 'fs';

const worksSource = fs.readFileSync('src/data/works.ts', 'utf8');
const passMatch = worksSource.match(/export const passages: Passage\[\] = JSON\.parse\(decodeURIComponent\("([^"]+)"\)\);/);
const readingAidSource = fs.readFileSync('src/data/readingAid.ts', 'utf8');

const TEMPLATE_PATTERNS = [
  '從往知來', '駅人與讀者闡述', '客觀規律與處世法則', '適合作為學術引申與經典背誦卡片',
  '深刻闡述', '觀歷史興衰', '客觀規律與處世法則', '適合作為學術引申與經典背誦卡片',
  '由歷史記述者與歷代史官面向後世君臣與讀者闡述',
  '修己安人、崇尚仁義與中庸之道', '觀歷史興衰、辨君臣成敗與鑑往知來', '融會思想情感、修身養性與文字聲律之美',
  '讀者宜結合上下文體會作者的主張'
];

if (passMatch) {
  const jsonStr = decodeURIComponent(passMatch[1]);
  const passages = JSON.parse(jsonStr);

  const neededPassages = passages.filter(p => {
    const idKey = `'${p.id}':`;
    const idx = readingAidSource.indexOf(idKey);
    if (idx === -1) return true;
    const snippet = readingAidSource.substring(idx, idx + 1000);
    return TEMPLATE_PATTERNS.some(pat => snippet.includes(pat));
  });

  console.log(`Extracted ${neededPassages.length} passages for Batch 3 (Grand Finale).`);

  const summary = {};
  neededPassages.forEach(p => {
    const prefix = p.id.split('_ch-')[0];
    summary[prefix] = (summary[prefix] || 0) + 1;
  });
  console.log('Breakdown by work:', summary);

  fs.writeFileSync('scratch/batch3_passages_dump.json', JSON.stringify(neededPassages, null, 2), 'utf8');
}
