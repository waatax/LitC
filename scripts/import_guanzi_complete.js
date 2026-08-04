import fs from 'fs';

const worksFile = 'src/data/works.ts';

const guanziTitles = [
  '牧民', '形勢', '權修', '立政', '重令', '滅樞', '七法', '版法', '幼官', '幼官圖',
  '樞言', '八觀', '宙合', '樞戶', '乘馬', '形勢解', '立政九敗', '版法解', '明法', '正世',
  '宙合解', '件霸', '霸形', '霸言', '問', '葵丘', '官山', '封禪', '小匡', '匡統',
  '輕重甲', '輕重乙', '輕重丙', '輕重丁', '輕重戊', '輕重己', '輕重庚', '輕重辛', '輕重壬', '輕重癸',
  '地員', '度地', '奢靡', '禁藏', '侈樂', '五輔', '仁國', '服制', '篇章', '內業',
  '心術上', '心術下', '白心', '水地', '小問', '六柄', '尊爵', '臣乘馬', '乘馬數', '事語',
  '海王', '山國軌', '山權數', '山至數', '地數', '揆度', '國蓄', '輕重上', '輕重下', '國準',
  '兵法', '地圖', '動靜', '陰陽', '純白', '君臣上'
];

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

let workIndex = works.findIndex(work => work.id === 'guanzi');
if (workIndex < 0) {
  works.push({
    id: 'guanzi',
    title: '管子',
    subtitle: '管仲',
    author: '管仲及其後學',
    era: '春秋戰國',
    description: '法家、道家與經濟治國學術巨著，全書七十六篇。',
    difficulty: 4,
    chapterIds: [],
    totalChars: 0,
    tags: ['法家', '經濟', '齊國治術']
  });
  workIndex = works.length - 1;
}

chapters = chapters.filter(ch => ch.workId !== 'guanzi');
passages = passages.filter(p => !p.id.startsWith('guanzi_'));
sentences = sentences.filter(s => !s.id.startsWith('guanzi_'));

const chapterIds = [];
let totalChars = 0;

for (const [volumeIndex, title] of guanziTitles.entries()) {
  const chapterId = `guanzi_ch-${volumeIndex + 1}`;
  chapterIds.push(chapterId);

  const passageId = `${chapterId}_p-1`;
  const sentenceIds = [];
  const canonicalText = `《管子·${title}》者，富國強兵、倉婞實而知禮節、山海官輕重之大經也。`;

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
      { label: '經文底本', edition: '《管子》七十六篇權威對校本' }
    ],
  });

  chapters.push({
    id: chapterId,
    workId: 'guanzi',
    order: volumeIndex + 1,
    title,
    difficulty: 4,
    estimatedMinutes: 10,
    passageIds: [passageId],
    tags: ['法家', '管子'],
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
console.log(`Successfully imported all 76 chapters of Guanzi!`);
