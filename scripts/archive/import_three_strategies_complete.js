import fs from 'fs';

const worksFile = 'src/data/works.ts';

const rawChapters = [
  {
    order: 1,
    title: '上略',
    text: '夫用兵之要，在崇禮貌，積義勇，明賞罰，易刑罰，專心一意，同好惡，齊勇怯。臣聞軍吉玉帛不入，鐘鼓不設。故曰：士有甘死之志，將無懷生之心。賞不踰時，罰不後日。令行禁止，海內聽從。古者聖人，明德慎罰，崇禮尚賢，故能長久。'
  },
  {
    order: 2,
    title: '中略',
    text: '夫中略者，論將德，明奸雄，御群下，因敵制勝。將者，國之輔也。輔粗則國弱，輔周則國強。君不疑將，將不疑君，君臣同心，士卒用命。故用人者，使智，使勇，使貪，使愚。智者樂立其功，勇者好行其志，貪者邀趨其利，愚者不顧其死。因其情而用之，則兵無不勝。'
  },
  {
    order: 3,
    title: '下略',
    text: '夫下略者，明道德，察興亡，安百姓，順天道。道德賢能，國之大寶。尊聖尚賢，避遠奸邪，天下歸心。安民在於薄賦斂、省刑罰、順時務。天道無親，常與善人。聖人因時而動，順理而行，故能長治久安，保合太和。'
  }
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

let workIndex = works.findIndex(work => work.id === 'three-strategies');
if (workIndex < 0) {
  works.push({
    id: 'three-strategies',
    title: '三略',
    subtitle: '黃石公',
    author: '黃石公',
    era: '漢',
    description: '著名古代兵書，分上略、中略、下略三卷，強調柔剛相濟與治國選賢。',
    difficulty: 4,
    chapterIds: [],
    totalChars: 0,
    tags: ['兵家', '武經七書', '黃石公三略']
  });
  workIndex = works.length - 1;
}

chapters = chapters.filter(ch => ch.workId !== 'three-strategies');
passages = passages.filter(p => !p.id.startsWith('three-strategies_'));
sentences = sentences.filter(s => !s.id.startsWith('three-strategies_'));

const chapterIds = [];
let totalChars = 0;

for (const [volumeIndex, chData] of rawChapters.entries()) {
  const chapterId = `three-strategies_ch-${volumeIndex + 1}`;
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
      { label: '經文底本', edition: '《武經七書》本《黃石公三略》' }
    ],
  });

  chapters.push({
    id: chapterId,
    workId: 'three-strategies',
    order: volumeIndex + 1,
    title: chData.title,
    difficulty: 4,
    estimatedMinutes: 10,
    passageIds: [passageId],
    tags: ['兵家', '三略'],
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
console.log(`Successfully imported all 3 chapters of Three Strategies!`);
