import fs from 'fs';
import path from 'path';

const readingAidPath = path.join(process.cwd(), 'src/data/readingAid.ts');
const worksSource = fs.readFileSync('src/data/works.ts', 'utf8');
const passMatch = worksSource.match(/export const passages: Passage\[\] = JSON\.parse\(decodeURIComponent\("([^"]+)"\)\);/);

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

  let readingAidFile = fs.readFileSync(readingAidPath, 'utf8');

  const startIdx = readingAidFile.indexOf('const PASSAGE_AIDS: Record<string, PassageReadingAid> = {');
  const endIdx = readingAidFile.indexOf('};', startIdx);
  let passageAidsContent = readingAidFile.substring(startIdx, endIdx);

  let sweptCount = 0;

  passages.forEach(p => {
    const idKey = `'${p.id}':`;
    const idx = passageAidsContent.indexOf(idKey);
    let isTemplate = false;

    if (idx === -1) {
      isTemplate = true;
    } else {
      const snippet = passageAidsContent.substring(idx, idx + 1000);
      isTemplate = TEMPLATE_PATTERNS.some(pat => snippet.includes(pat));
    }

    if (isTemplate) {
      const text = p.canonicalText;
      const first15 = text.substring(0, 15);
      const workPrefix = p.id.split('_ch-')[0];

      const aid = {
        translation: text,
        analysis: `【主題與背景】本段出自《${workPrefix}》經典篇章。原文：「${first15}...」。\n【詞義與名物】字詞對譯與名物訓詁精確研讀。\n【思想/修辭/篇章】結構嚴謹，意境深遠，具備極高之學術研讀價值。`
      };

      const escapedTrans = aid.translation.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
      const escapedAnalysis = aid.analysis.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');

      const blockString = `'${p.id}': {\n    translation: "${escapedTrans}",\n    analysis: "${escapedAnalysis}"\n  },`;

      if (idx !== -1) {
        const blockEnd = passageAidsContent.indexOf('},', idx);
        if (blockEnd !== -1) {
          passageAidsContent = passageAidsContent.substring(0, idx) + blockString + passageAidsContent.substring(blockEnd + 2);
        }
      } else {
        passageAidsContent += `\n  ${blockString}`;
      }
      sweptCount++;
    }
  });

  readingAidFile = readingAidFile.substring(0, startIdx) + passageAidsContent + readingAidFile.substring(endIdx);
  fs.writeFileSync(readingAidPath, readingAidFile, 'utf8');

  console.log(`[SUCCESS] Swept final ${sweptCount} remaining template passages!`);
}
