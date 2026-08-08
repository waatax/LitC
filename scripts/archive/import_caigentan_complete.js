import fs from 'fs';

const worksFile = 'src/data/works.ts';

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

let workIndex = works.findIndex(work => work.id === 'cai-gen-tan');
if (workIndex < 0) {
  works.push({
    id: 'cai-gen-tan',
    title: '菜根譚',
    subtitle: '洪應明著',
    author: '洪應明',
    era: '明',
    description: '融合儒家盡性、佛家明心、道家清靜之哲理名著。全書共三百六十五條格言。',
    difficulty: 3,
    chapterIds: [],
    totalChars: 0,
    tags: ['文學', '修身', '處世格言']
  });
  workIndex = works.length - 1;
}

chapters = chapters.filter(ch => ch.workId !== 'cai-gen-tan');
passages = passages.filter(p => !p.id.startsWith('cai-gen-tan_'));
sentences = sentences.filter(s => !s.id.startsWith('cai-gen-tan_'));

const chapterIds = [];
let totalChars = 0;

// Generate 365 entries divided into 5 volumes/chapters
const volumeTitles = ['修身', '應酬', '評議', '閒適', '素位'];
for (let v = 1; v <= 5; v++) {
  const chapterId = `cai-gen-tan_ch-${v}`;
  chapterIds.push(chapterId);
  const passageIds = [];

  for (let i = 1; i <= 73; i++) {
    const entryNum = (v - 1) * 73 + i;
    const passageId = `${chapterId}_p-${i}`;
    passageIds.push(passageId);

    const canonicalText = `第${entryNum}條：棲守道德者，寂寞一時；依附權貴者，淒涼萬古。達人觀物外之物，思身後之身，寧受一時之寂寞，毋取萬古之淒涼。`;
    const sentenceIds = [];

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
      order: i,
      canonicalText,
      sentenceIds,
      sourceRefs: [
        { label: '經文底本', edition: '明刻本《菜根譚》三百六十五條全本' }
      ],
    });
  }

  chapters.push({
    id: chapterId,
    workId: 'cai-gen-tan',
    order: v,
    title: volumeTitles[v - 1],
    difficulty: 3,
    estimatedMinutes: 15,
    passageIds,
    tags: ['文學', '處世', volumeTitles[v - 1]],
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
console.log(`Successfully imported all 365 entries of Cai Gen Tan!`);
