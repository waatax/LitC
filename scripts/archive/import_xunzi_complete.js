import fs from 'fs';
import https from 'https';

const worksFile = 'src/data/works.ts';

const chaptersSpec = [
  ['quan-xue', '勸學'],
  ['xiu-shen', '修身'],
  ['bu-gou', '不苟'],
  ['rong-ru', '榮辱'],
  ['fei-xiang', '非相'],
  ['fei-shi-er-zi', '非十二子'],
  ['zhong-ni', '仲尼'],
  ['ru-xiao', '儒效'],
  ['wang-zhi', '王制'],
  ['fu-guo', '富國'],
  ['wang-ba', '王霸'],
  ['jun-dao', '君道'],
  ['chen-dao', '臣道'],
  ['zhi-shi', '致士'],
  ['yi-bing', '議兵'],
  ['qiang-guo', '強國'],
  ['tian-lun', '天論'],
  ['zheng-lun', '正論'],
  ['li-lun', '禮論'],
  ['yue-lun', '樂論'],
  ['jie-bi', '解蔽'],
  ['zheng-ming', '正名'],
  ['xing-e', '性惡'],
  ['jun-zi', '君子'],
  ['cheng-xiang', '成相'],
  ['fu', '賦'],
  ['da-lve', '大略'],
  ['you-zuo', '宥坐'],
  ['zi-dao', '子道'],
  ['fa-xing', '法行'],
  ['ai-gong', '哀公'],
  ['yao-wen', '堯問']
];

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'LitC editorial corpus audit', 'Accept-Encoding': 'identity' } }, response => {
      if (response.statusCode !== 200) {
        reject(new Error(`${url}: HTTP ${response.statusCode}`));
        response.resume();
        return;
      }
      response.setEncoding('utf8');
      let body = '';
      response.on('data', chunk => { body += chunk; });
      response.on('end', () => resolve(body));
    }).on('error', reject);
  });
}

function decodeHtml(value) {
  const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
  return value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (_, entity) => {
      if (entity[0] === '#') {
        const hex = entity[1].toLowerCase() === 'x';
        return String.fromCodePoint(Number.parseInt(entity.slice(hex ? 2 : 1), hex ? 16 : 10));
      }
      return named[entity.toLowerCase()] ?? `&${entity};`;
    })
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function extractChinesePassages(html, title) {
  const rows = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
  const texts = [];
  for (const [, row] of rows) {
    const cell = row.match(/<td[^>]*class="ctext"[^>]*>[\s\S]*?<div id="comm\d+"><\/div>([\s\S]*?)<\/td>/i);
    if (!cell) continue;
    const text = decodeHtml(cell[1]);
    if (text && /[\u3400-\u9fff]/u.test(text)) texts.push(text);
  }
  if (texts.length === 0) throw new Error(`${title}: no Chinese passages found`);
  return texts;
}

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

const downloaded = [];
for (const [slug, title] of chaptersSpec) {
  const url = `https://ctext.org/xunzi/${slug}/zh`;
  const html = await download(url);
  const texts = extractChinesePassages(html, title);
  downloaded.push({ slug, title, url, texts });
  console.log(`${title}: ${texts.length} 則`);
}

// Add or update Xunzi work entry if missing
let workIndex = works.findIndex(work => work.id === 'xunzi');
if (workIndex < 0) {
  works.push({
    id: 'xunzi',
    title: '荀子',
    subtitle: '荀況著',
    author: '荀況',
    era: '戰國',
    description: '荀子為戰國末期儒家集大成者，主張「性惡論」、重禮法、尚賢能。全書三十二篇。',
    difficulty: 4,
    chapterIds: [],
    totalChars: 0,
    tags: ['儒家', '禮治', '性惡論']
  });
  workIndex = works.length - 1;
}

chapters = chapters.filter(ch => ch.workId !== 'xunzi');
passages = passages.filter(p => !p.id.startsWith('xunzi_'));
sentences = sentences.filter(s => !s.id.startsWith('xunzi_'));

const chapterIds = [];
let totalChars = 0;
for (const [volumeIndex, volume] of downloaded.entries()) {
  const chapterId = `xunzi_ch-${volumeIndex + 1}`;
  const passageIds = [];
  chapterIds.push(chapterId);
  for (const [passageIndex, canonicalText] of volume.texts.entries()) {
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
        { label: '經文底本', edition: '中國哲學書電子化計劃《荀子》', url: volume.url }
      ],
    });
  }
  chapters.push({
    id: chapterId,
    workId: 'xunzi',
    order: volumeIndex + 1,
    title: volume.title,
    difficulty: 4,
    estimatedMinutes: Math.max(10, Math.ceil(volume.texts.reduce((n, text) => n + text.length, 0) / 300)),
    passageIds,
    tags: ['儒家', '性惡論', '禮樂'],
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
console.log(`Successfully imported all 32 chapters of Xunzi!`);
