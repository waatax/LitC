import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Clean works.ts
const worksTsPath = path.join(__dirname, '../src/data/works.ts');
let worksTsContent = fs.readFileSync(worksTsPath, 'utf8');

console.log('Cleaning works.ts encoded JSON...');
worksTsContent = worksTsContent.replace(/"translationHint"\s*:\s*"此句釋義提示。"/g, '"translationHint":""');
fs.writeFileSync(worksTsPath, worksTsContent, 'utf8');
console.log('Successfully cleaned works.ts!');

// 2. Clean readingAid.ts
const readingAidPath = path.join(__dirname, '../src/data/readingAid.ts');
let readingAidContent = fs.readFileSync(readingAidPath, 'utf8');

// Update TERMS in scaffold for classical to modern translation
const termsCode = `const TERMS: Array<[RegExp, string]> = [
  [/子曰[：:]/g, '孔子說：'], [/孟子曰[：:]/g, '孟子說：'], [/莊子曰[：:]/g, '莊子說：'],
  [/君子/g, '德行高尚的人'], [/小人/g, '只顧私利的人'], [/仁/g, '仁愛'],
  [/義/g, '正義道義'], [/禮/g, '禮法分際'], [/道/g, '道理正道'],
  [/德/g, '德行修養'], [/學/g, '學習'], [/知/g, '理解知曉'], [/曰/g, '說'],
  [/焉/g, '在那裡'], [/弗/g, '不'], [/莫/g, '沒有人'], [/皆/g, '都'],
  [/故/g, '所以'], [/是以/g, '因此'], [/若/g, '如果'], [/以為/g, '認為'],
  [/百姓/g, '人民'], [/天下/g, '世人'], [/萬物/g, '各種事物'],
  [/夫/g, ''], [/昔者/g, '從前'], [/何為/g, '為什麼'], [/曷為/g, '為何'],
  [/此句釋義提示。/g, '']
];`;

const termsStart = readingAidContent.indexOf('const TERMS: Array<[RegExp, string]> = [');
if (termsStart !== -1) {
  const termsEnd = readingAidContent.indexOf('function scaffold(', termsStart);
  if (termsEnd !== -1) {
    readingAidContent = readingAidContent.slice(0, termsStart) + termsCode + '\n\n' + readingAidContent.slice(termsEnd);
  }
}

// Update getReadingAid logic to filter out placeholder strings
const getReadingAidFunc = `export function getReadingAid(sentence: Sentence, workId: string): string | undefined {
  // 1. Check if we have a passage-level translation override
  const passageAid = PASSAGE_AIDS[sentence.passageId];
  if (passageAid && passageAid.translation && !passageAid.translation.includes('此句釋義提示')) {
    const translationSentences = passageAid.translation
      .split(/(?<=[。！？])\\s*/)
      .filter(Boolean);
    
    const passageSentences = sentences.filter(s => s.passageId === sentence.passageId);
    const index = passageSentences.findIndex(s => s.id === sentence.id);
    
    if (index !== -1 && index < translationSentences.length) {
      return translationSentences[index];
    } else if (translationSentences.length > 0) {
      return translationSentences[translationSentences.length - 1];
    }
  }

  // 2. Check explicit translation hints (ignoring placeholders)
  if (sentence.translationHint && 
      sentence.translationHint !== '此句釋義提示。' && 
      !sentence.translationHint.includes('此句釋義提示') && 
      !/[a-zA-Z]{4,}/.test(sentence.translationHint)) {
    return sentence.translationHint;
  }

  return EDITED_HINTS[sentence.canonicalText] ?? scaffold(sentence.canonicalText, workId);
}`;

const getReadingAidStart = readingAidContent.indexOf('export function getReadingAid(');
if (getReadingAidStart !== -1) {
  const getReadingAidEnd = readingAidContent.indexOf('export function getPassageReadingAid(', getReadingAidStart);
  if (getReadingAidEnd !== -1) {
    readingAidContent = readingAidContent.slice(0, getReadingAidStart) + getReadingAidFunc + '\n\n' + readingAidContent.slice(getReadingAidEnd);
  }
}

fs.writeFileSync(readingAidPath, readingAidContent, 'utf8');
console.log('Successfully updated readingAid.ts to filter out placeholder hints!');
