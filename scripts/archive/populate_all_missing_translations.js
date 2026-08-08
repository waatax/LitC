import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readingAidPath = path.join(__dirname, '../src/data/readingAid.ts');
let readingAidContent = fs.readFileSync(readingAidPath, 'utf8');

// Dictionary of explicit translations for identified remaining sentences
const extraSentenceTranslations = {
  '故子墨子曰：「不可以不勸愛人者，此也。': '所以墨子說：「不能不勉勵人們相親相愛，原因就在這裡。」',
  '興來醉倒落花前，天地即為衾枕。': '興致來時在落花前醉倒，天地就當作我的被褥與枕頭。',
  '機息坐忘盤石上，古今盡屬蜉蝣。': '巧心機慮熄滅後盤坐在大石上坐忘，古往今來的一切都像蜉蝣般短暫。',
  '陰謀怪習、異行奇能，俱是涉世的禍胎。': '陰險的謀劃、怪異的習慣、離奇的行為與奇特的技能，都是處世惹禍的根源。',
  '只一個庸德庸行，便可以完混沌而招和平。': '只有保持平凡的德行與平實的言行，才能保全純真本性而招致和平。'
};

// Add helper to handle generic translation for remaining sentences without raw scaffold prefix
const genericTranslations = {
  '陰謀怪習': '陰險的計謀與怪異的習慣。',
  '異行奇能': '離奇的行為與特殊的才能。',
  '庸德庸行': '平凡平實的德行與行為。',
  '完混沌': '保全原始純真的本性。',
  '招和平': '招致安寧和平。'
};

// Append EDITED_HINTS additions into readingAid.ts
let hintsAddition = '\n// Additional sentence-level vernacular translations\n';
Object.entries(extraSentenceTranslations).forEach(([key, val]) => {
  hintsAddition += `PASSAGE_AIDS['${key}'] = { translation: "${val}", analysis: "" };\n`;
});

// Update EDITED_HINTS inside readingAid.ts if present or add to PASSAGE_AIDS
const passageAidsInsertPos = readingAidContent.indexOf('const PASSAGE_AIDS: Record<string, PassageReadingAid> = {');

if (passageAidsInsertPos !== -1) {
  let additionStr = '';
  Object.entries(extraSentenceTranslations).forEach(([k, v]) => {
    additionStr += `  '${k}': { translation: "${v}", analysis: "專屬句意解析。" },\n`;
  });
  readingAidContent = readingAidContent.slice(0, passageAidsInsertPos + 57) + '\n' + additionStr + readingAidContent.slice(passageAidsInsertPos + 57);
}

fs.writeFileSync(readingAidPath, readingAidContent, 'utf8');
console.log('Successfully populated missing vernacular translations into readingAid.ts!');
