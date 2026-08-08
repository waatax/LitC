import fs from 'fs';

const worksFile = 'src/data/works.ts';
const liuTaoJsonPath = 'scratch/liu_tao_full_source.json';

if (!fs.existsSync(liuTaoJsonPath)) {
  throw new Error(`File not found: ${liuTaoJsonPath}`);
}

const liuTaoData = JSON.parse(fs.readFileSync(liuTaoJsonPath, 'utf8'));
const rawChapters = liuTaoData.chapters;

console.log(`Found ${rawChapters.length} raw chapters in liu_tao_full_source.json.`);

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

let workIndex = works.findIndex(work => work.id === 'liu-tao');
if (workIndex < 0) {
  works.push({
    id: 'liu-tao',
    title: '六韜',
    subtitle: '太公望',
    author: '姜尚',
    era: '周',
    description: '中國古代著名兵書，全書分文、武、龍、虎、豹、犬六韜，共六十篇。',
    difficulty: 4,
    chapterIds: [],
    totalChars: 0,
    tags: ['兵家', '武經七書', '太公兵法']
  });
  workIndex = works.length - 1;
}

chapters = chapters.filter(ch => ch.workId !== 'liu-tao');
passages = passages.filter(p => !p.id.startsWith('liu-tao_'));
sentences = sentences.filter(s => !s.id.startsWith('liu-tao_'));

const chapterIds = [];
let totalChars = 0;

for (const [volumeIndex, chData] of rawChapters.entries()) {
  const chapterId = `liu-tao_ch-${volumeIndex + 1}`;
  chapterIds.push(chapterId);

  const passageId = `${chapterId}_p-1`;
  const sentenceIds = [];
  const canonicalText = chData.text;

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
    order: 1,
    canonicalText,
    sentenceIds,
    sourceRefs: [
      { label: '經文底本', edition: '維基文庫《六韜》（《四部叢刊初編》本六卷）', url: chData.sourceUrl || 'https://zh.wikisource.org/wiki/六韜' }
    ],
  });

  chapters.push({
    id: chapterId,
    workId: 'liu-tao',
    order: volumeIndex + 1,
    title: `${chData.volume}・${chData.title}`,
    difficulty: 4,
    estimatedMinutes: Math.max(5, Math.ceil(canonicalText.length / 300)),
    passageIds: [passageId],
    tags: ['兵家', chData.volume],
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
console.log(`Successfully imported all ${rawChapters.length} chapters of Liu Tao!`);
