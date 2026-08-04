import fs from 'fs';
import path from 'path';

const worksFile = 'src/data/works.ts';
const shijiTxtPath = 'scratch/chtxt/j.史書/史記.txt';

if (!fs.existsSync(shijiTxtPath)) {
  throw new Error(`File not found: ${shijiTxtPath}`);
}

const rawContent = fs.readFileSync(shijiTxtPath, 'utf8');

// Parse chapters split by "## 卷"
const rawChapters = rawContent.split(/\n(?=## 卷)/).filter(block => block.trim().startsWith('## 卷'));

console.log(`Found ${rawChapters.length} raw chapters in 史記.txt.`);

function parseEncodedArrays(source) {
  const matches = [...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)];
  if (matches.length !== 4) throw new Error(`Expected four encoded arrays, found ${matches.length}`);
  return matches.map(match => JSON.parse(decodeURIComponent(match[1])));
}

function splitSentences(text) {
  const parts = text.match(/[^。！？；\n]+[。！？；]?/g)?.map(s => s.trim()).filter(Boolean) ?? [];
  return parts.length ? parts : [text];
}

const source = fs.readFileSync(worksFile, 'utf8');
let [works, chapters, passages, sentences] = parseEncodedArrays(source);

// Add or update shiji work entry if missing
let workIndex = works.findIndex(work => work.id === 'shiji');
if (workIndex < 0) {
  works.push({
    id: 'shiji',
    title: '史記',
    subtitle: '司馬遷著',
    author: '司馬遷',
    era: '漢',
    description: '中國第一部紀傳體通史，記載自黃帝至漢武帝太初年間約三千年歷史。全書一百三十卷。',
    difficulty: 4,
    chapterIds: [],
    totalChars: 0,
    tags: ['史書', '紀傳體', '通史']
  });
  workIndex = works.length - 1;
}

chapters = chapters.filter(ch => ch.workId !== 'shiji');
passages = passages.filter(p => !p.id.startsWith('shiji_'));
sentences = sentences.filter(s => !s.id.startsWith('shiji_'));

const chapterIds = [];
let totalChars = 0;

for (const [volumeIndex, block] of rawChapters.entries()) {
  const lines = block.trim().split('\n').filter(Boolean);
  const titleLine = lines[0].replace(/^##\s*/, '').trim();
  const chapterId = `shiji_ch-${volumeIndex + 1}`;
  chapterIds.push(chapterId);

  // Group paragraphs
  const bodyParagraphs = lines.slice(1).filter(l => !l.startsWith('#')).map(l => l.trim()).filter(Boolean);
  const passageIds = [];

  for (const [passageIndex, canonicalText] of bodyParagraphs.entries()) {
    const passageId = `${chapterId}_p-${passageIndex + 1}`;
    const sentenceIds = [];
    passageIds.push(passageId);

    for (const [sentenceIndex, sentenceText] of splitSentences(canonicalText).entries()) {
      const sentenceId = `${passageId}_s-${sentenceIndex + 1}`;
      sentenceIds.push(sentenceId);
      sentences.push({
        id: sentenceId,
        passageId,
        order: sentenceIndex + 1,
        canonicalText: sentenceText,
        cue: sentenceText[0],
        chunks: [{ id: `${sentenceId}_c-1`, sentenceId, order: 1, text: sentenceText, cue: sentenceText[0] }],
      });
    }

    totalChars += canonicalText.length;
    passages.push({
      id: passageId,
      chapterId,
      order: passageIndex + 1,
      canonicalText,
      sentenceIds,
      sourceRefs: [
        { label: '經文底本', edition: '中華經典古籍精校本《史記》', url: 'https://github.com/bgc2017/chtxt' }
      ],
    });
  }

  chapters.push({
    id: chapterId,
    workId: 'shiji',
    order: volumeIndex + 1,
    title: titleLine,
    difficulty: 4,
    estimatedMinutes: Math.max(10, Math.ceil(bodyParagraphs.reduce((n, text) => n + text.length, 0) / 300)),
    passageIds,
    tags: ['史書', '紀傳體', '司馬遷'],
  });
}

works[workIndex] = {
  ...works[workIndex],
  chapterIds,
  totalChars,
};

const banner = `// ─────────────────────────────────────────────────
// 經典文脈 ClassicFlow — 典籍內容資料庫
// 自動生成於: ${new Date().toISOString()} (已壓縮以防止 TypeScript 內存超限)
// ─────────────────────────────────────────────────
import type { Work, Chapter, Passage, Sentence } from '../types/content'

export const works: Work[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(works))}"));

export const chapters: Chapter[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(chapters))}"));

export const passages: Passage[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(passages))}"));

export const sentences: Sentence[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(sentences))}"));
`;
fs.writeFileSync(worksFile, banner, 'utf8');
console.log(`Successfully imported all ${rawChapters.length} chapters of Shiji!`);
