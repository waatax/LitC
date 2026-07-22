import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const readingAidPath = path.join(__dirname, '../src/data/readingAid.ts');

// 1. Read existing PASSAGE_AIDS from readingAid.ts
const fileContent = fs.readFileSync(readingAidPath, 'utf8');
const startMatch = fileContent.indexOf('const PASSAGE_AIDS: Record<string, PassageReadingAid> = {');
if (startMatch === -1) {
  throw new Error("Could not find PASSAGE_AIDS start in readingAid.ts");
}
const nextBlockStart = fileContent.indexOf('const EDITED_HINTS');
if (nextBlockStart === -1) {
  throw new Error("Could not find EDITED_HINTS start in readingAid.ts");
}
// Search backwards from nextBlockStart to find the closing '}' of PASSAGE_AIDS
const endMatch = fileContent.lastIndexOf('}', nextBlockStart);
if (endMatch === -1 || endMatch < startMatch) {
  throw new Error("Could not find PASSAGE_AIDS end in readingAid.ts");
}

const passageAidsBlock = fileContent.substring(startMatch, endMatch + 1); // include the closing '}'
// Evaluate the block to get the object in memory
let PASSAGE_AIDS = {};
try {
  PASSAGE_AIDS = eval('(function(){ \n' + 
    passageAidsBlock.replace(': Record<string, PassageReadingAid>', '') + 
    '; return PASSAGE_AIDS; \n})()');
} catch (e) {
  console.error("Failed to parse existing PASSAGE_AIDS using eval:", e);
}

console.log(`Parsed ${Object.keys(PASSAGE_AIDS).length} existing passage aids.`);

// 2. Load and merge translated files
const translationFiles = [
  'translated_han_shang_mo.json',
  'translated_caigentan_ch1_ch2.json',
  'translated_caigentan_ch3.json',
  'translated_caigentan_ch4.json',
  'translated_caigentan_ch5_1.json',
  'translated_caigentan_ch5_2.json',
  'translated_caigentan_ch5_3.json',
  'translated_caigentan_ch5_4.json'
];

let mergedCount = 0;
for (const file of translationFiles) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      for (const [key, value] of Object.entries(data)) {
        PASSAGE_AIDS[key] = value;
        mergedCount++;
      }
      console.log(`Merged ${Object.keys(data).length} entries from ${file}`);
    } catch (e) {
      console.error(`Error reading/parsing ${file}:`, e);
    }
  } else {
    console.warn(`File not found: ${file}`);
  }
}

console.log(`Total passage aids after merge: ${Object.keys(PASSAGE_AIDS).length} (merged ${mergedCount} new entries).`);

// 3. Format the PASSAGE_AIDS object back to TypeScript string
let passageAidsStr = 'const PASSAGE_AIDS: Record<string, PassageReadingAid> = {\n';
for (const [key, value] of Object.entries(PASSAGE_AIDS)) {
  // Clean up translation/analysis fields
  const cleanTranslation = value.translation.replace(/\r/g, '').replace(/"/g, '\\"').replace(/\n/g, '\\n');
  const cleanAnalysis = value.analysis.replace(/\r/g, '').replace(/"/g, '\\"').replace(/\n/g, '\\n');
  
  passageAidsStr += `  '${key}': {\n`;
  passageAidsStr += `    translation: "${cleanTranslation}",\n`;
  passageAidsStr += `    analysis: "${cleanAnalysis}",\n`;
  passageAidsStr += `  },\n`;
}
passageAidsStr += '}';

// 4. Update the readingAid.ts file
let newContent = fileContent.substring(0, startMatch) + passageAidsStr + fileContent.substring(endMatch + 2);

// Let's also check if we need to add the import of `chapters` and `sentences` at the top
if (!newContent.includes("import { chapters, sentences } from './works'")) {
  newContent = `import { chapters, sentences } from './works'\n` + newContent;
}

// 5. Rewrite getPassageReadingAid and getReadingAid to support dynamic checks
// Let's replace getReadingAid first
const getReadingAidStart = newContent.indexOf('export function getReadingAid(');
const getReadingAidEnd = newContent.indexOf('}', getReadingAidStart + 30); // approximate end, wait, we must be careful with bracket matching

// Instead of matching brackets in regex, let's replace the whole bottom part from getReadingAid to the end of the file!
// Let's see what is currently at the bottom of readingAid.ts:
// export function getReadingAid...
// export function getPassageReadingAid...
// export const READING_AID_SOURCES = ...
// We can just write a clean replacement for that whole segment.
// Let's view the segment from getReadingAid onwards to verify.
// In our previous view_file, it was:
// 1116: export function getReadingAid(sentence: Sentence, workId: string): string | undefined {
// ...
// 1149: ]

const getReadingAidIndex = newContent.indexOf('export function getReadingAid(');
if (getReadingAidIndex === -1) {
  throw new Error("Could not find getReadingAid in readingAid.ts");
}

const updatedBottomContent = `export function getReadingAid(sentence: Sentence, workId: string): string | undefined {
  // 1. Check if we have a passage-level translation override
  const passageAid = PASSAGE_AIDS[sentence.passageId];
  if (passageAid && passageAid.translation) {
    const translationSentences = passageAid.translation
      .split(/(?<=[。！？])\\s*/)
      .filter(Boolean);
    
    const passageSentences = sentences.filter(s => s.passageId === sentence.passageId);
    const index = passageSentences.findIndex(s => s.id === sentence.id);
    
    if (index !== -1 && index < translationSentences.length) {
      return translationSentences[index];
    } else if (translationSentences.length > 0) {
      return index === 0 ? passageAid.translation : '';
    }
  }

  // 2. Original fallback
  if (sentence.translationHint && sentence.translationHint !== '此句釋義提示。' && !/[a-zA-Z]{4,}/.test(sentence.translationHint)) return sentence.translationHint;
  if (workId !== 'dao-de-jing' && workId !== 'zhuangzi' &&
      !['da-xue', 'zhong-yong', 'lun-yu', 'meng-zi', 'yi-jing', 'shu-jing', 'shi-jing', 'li-ji', 'chun-qiu'].includes(workId)) return sentence.translationHint;
  return EDITED_HINTS[sentence.canonicalText] ?? scaffold(sentence.canonicalText, workId);
}

export function getPassageReadingAid(
  passageId: string,
  canonicalText: string,
  workId: string,
  sentencesList: Sentence[] = [],
): PassageReadingAid {
  const edited = PASSAGE_AIDS[passageId];
  if (edited) return edited;

  const translation = sentencesList
    .map(sentence => getReadingAid(sentence, workId))
    .filter((hint): hint is string => Boolean(hint))
    .join('\\n');

  if (workId === 'gu-wen-guan-zhi') {
    const chapterId = passageId.split('_p-')[0];
    const chapter = chapters.find(c => c.id === chapterId);
    const title = chapter ? chapter.title : '';
    const tags = chapter ? chapter.tags : [];
    const source = tags.find(t => !t.startsWith('卷')) || '';
    
    let analysis = \`《\${title}》選自《\${source}》，為《古文觀止》收錄之歷代名篇散文。本段展現了經典文學在思想、情感與文字之美上的高度融合，讀者宜體會作者的修辭章法與核心寄託。\`;
    
    if (chapterId === 'gu-wen-guan-zhi_ch-108') {
      analysis = "陶淵明代表作《桃花源記》。描繪了一個無剝削、無戰亂的理想社會，寄託了詩人對現實的不滿與對美好生活的嚮往，文風優美自然。";
    } else if (chapterId === 'gu-wen-guan-zhi_ch-117') {
      analysis = "劉禹錫代表作《陋室銘》。以極富聲律之美的駢文安貧樂道、潔身自好。通過對居室簡陋但德行馨香的描寫，抒發君子獨立特行的志節。";
    } else if (chapterId === 'gu-wen-guan-zhi_ch-158') {
      analysis = "范仲淹代表作《岳陽樓記》。論述遷客騷人的覽物之情，進而提出『先天下之憂而憂，後天下之樂而樂』的思想，是古代文人愛國憂民的最高典範。";
    } else if (chapterId === 'gu-wen-guan-zhi_ch-192') {
      analysis = "蘇軾代表作《前赤壁賦》。作於黃州貶謫時期，與客泛舟赤壁，在主客問答中交融儒釋道哲學，探討宇宙自然之『變與不變』，最終達到曠達灑脫的解脫境界。";
    } else if (chapterId === 'gu-wen-guan-zhi_ch-103' || chapterId === 'gu-wen-guan-zhi_ch-104') {
      analysis = "諸葛亮名篇《出師表》。字裡行間流露著報答先帝殊遇、北伐中原的忠誠赤膽。文中規勸後主開張聖聽、親賢臣遠小人，文風真摯感人。";
    }
    
    return {
      translation: translation || scaffold(canonicalText, workId),
      analysis
    };
  }

  const school = workId === 'dao-de-jing' || workId === 'zhuangzi' ? '道家'
    : ['han-fei-zi', 'shang-jun-shu'].includes(workId) ? '法家'
    : workId === 'mo-zi' ? '墨家' : '儒家';
  return {
    translation: translation || scaffold(canonicalText, workId),
    analysis: \`\${school}解析：本段須放在前後文一併理解；先辨明說話者、對象與關鍵概念，再看作者如何提出主張、理由或比喻。\`,
  };
}

export const READING_AID_SOURCES = [
  { label: '使用者指定的經典輔讀索引', url: 'http://www.xn--5rtnx620bw5s.tw/f/f01/02.htm' },
  { label: '中國哲學書電子化計劃（原典校讀）', url: 'https://ctext.org/' },
  { label: '臺灣華文電子書庫《四書白話句解》', url: 'https://taiwanebook.ncl.edu.tw/zh-tw/book/FJU-E312062A/reader' },
];
`;

newContent = newContent.substring(0, getReadingAidIndex) + updatedBottomContent;

fs.writeFileSync(readingAidPath, newContent, 'utf8');
console.log(`Successfully merged translations and updated functions in ${readingAidPath}`);
