import fs from 'fs';

const readingAidSource = fs.readFileSync('src/data/readingAid.ts', 'utf8');

const TEMPLATE_PATTERNS = [
  '從往知來', '駅人與讀者闡述', '客觀規律與處世法則', '適合作為學術引申與經典背誦卡片',
  '深刻闡述', '觀歷史興衰', '客觀規律與處世法則', '適合作為學術引申與經典背誦卡片',
  '由歷史記述者與歷代史官面向後世君臣與讀者闡述',
  '修己安人、崇尚仁義與中庸之道', '觀歷史興衰、辨君臣成敗與鑑往知來', '融會思想情感、修身養性與文字聲律之美'
];

for (let i = 0; i <= 70; i++) {
  const id = `lost-book-of-zhou_ch-${i}_p-1`;
  const idx = readingAidSource.indexOf(`'${id}':`);
  if (idx !== -1) {
    const snippet = readingAidSource.substring(idx, idx + 1000);
    const isTemplate = TEMPLATE_PATTERNS.some(pat => snippet.includes(pat));
    if (isTemplate) {
      console.log(`[TEMPLATE FLAGGED] ${id}`);
      console.log(snippet.substring(0, 300));
    }
  } else {
    console.log(`[NOT FOUND] ${id}`);
  }
}
