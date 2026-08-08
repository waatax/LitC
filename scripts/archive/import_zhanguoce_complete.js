import fs from 'fs';
import https from 'https';

const worksFile = 'src/data/works.ts';

const volumes = [
  ['dong-zhou', '東周'], ['xi-zhou', '西周'],
  ['qin-yi', '秦一'], ['qin-er', '秦二'], ['qin-san', '秦三'], ['qin-si', '秦四'], ['qin-wu', '秦五'],
  ['qi-yi', '齊一'], ['qi-er', '齊二'], ['qi-san', '齊三'], ['qi-si', '齊四'], ['qi-wu', '齊五'], ['qi-liu', '齊六'],
  ['chu-yi', '楚一'], ['chu-er', '楚二'], ['chu-san', '楚三'], ['chu-si', '楚四'],
  ['zhao-yi', '趙一'], ['zhao-er', '趙二'], ['zhao-san', '趙三'], ['zhao-si', '趙四'],
  ['wei-yi', '魏一'], ['wei-er', '魏二'], ['wei-san', '魏三'], ['wei-si', '魏四'],
  ['han-yi', '韓一'], ['han-er', '韓二'], ['han-san', '韓三'],
  ['yan-yi', '燕一'], ['yan-er', '燕二'], ['yan-san', '燕三'],
  ['song-wei', '宋衛'], ['zhong-shan', '中山'],
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

function extractChinesePassages(html, volumeTitle) {
  const rows = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
  const texts = [];
  for (const [, row] of rows) {
    const cell = row.match(/<td[^>]*class="ctext"[^>]*>[\s\S]*?<div id="comm\d+"><\/div>([\s\S]*?)<\/td>/i);
    if (!cell) continue;
    const text = decodeHtml(cell[1]);
    if (text && /[\u3400-\u9fff]/u.test(text)) texts.push(text);
  }
  if (texts.length === 0) throw new Error(`${volumeTitle}: no Chinese passages found`);
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
const oldReadingIdsByText = new Map(
  passages.filter(p => p.id.startsWith('zhan-guo-ce_')).map(p => [p.canonicalText, p.id]),
);

const downloaded = [];
for (const [slug, title] of volumes) {
  const url = `https://ctext.org/zhan-guo-ce/${slug}/zh`;
  const html = await download(url);
  const texts = extractChinesePassages(html, title);
  downloaded.push({ slug, title, url, texts });
  console.log(`${title}: ${texts.length} 則`);
}

chapters = chapters.filter(ch => ch.workId !== 'zhan-guo-ce');
passages = passages.filter(p => !p.id.startsWith('zhan-guo-ce_'));
sentences = sentences.filter(s => !s.id.startsWith('zhan-guo-ce_'));

const chapterIds = [];
let totalChars = 0;
for (const [volumeIndex, volume] of downloaded.entries()) {
  const chapterId = `zhan-guo-ce_ch-${volumeIndex + 1}`;
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
        { label: '經文底本', edition: '中國哲學書電子化計劃《士禮居叢書》本《戰國策》', url: volume.url },
        { label: '校勘對照', edition: '《欽定四庫全書》本《戰國策》、維基文庫鮑彪注本、何建章《戰國策注釋》' },
      ],
    });
  }
  chapters.push({
    id: chapterId,
    workId: 'zhan-guo-ce',
    order: volumeIndex + 1,
    title: volume.title,
    difficulty: 4,
    estimatedMinutes: Math.max(10, Math.ceil(volume.texts.reduce((n, text) => n + text.length, 0) / 300)),
    passageIds,
    tags: ['史書', '國別體', '縱橫家'],
  });
}

const workIndex = works.findIndex(work => work.id === 'zhan-guo-ce');
if (workIndex < 0) throw new Error('Missing zhan-guo-ce work');
works[workIndex] = {
  ...works[workIndex],
  subtitle: '劉向編定',
  sourceNote: '以中國哲學書電子化計劃《士禮居叢書》本為經文底本，對校《欽定四庫全書》本、鮑彪注本及何建章《戰國策注釋》。全書依通行本十二國、三十三卷編次。',
  chapterIds,
  totalChars,
};

if (downloaded.length !== 33 || chapterIds.length !== 33) throw new Error('Incomplete 33-volume import');
if (passages.some(p => p.id.startsWith('zhan-guo-ce_') && !p.sourceRefs?.length)) throw new Error('Missing source references');

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

const newPassageCount = downloaded.reduce((count, volume) => count + volume.texts.length, 0);
const retainedEastCount = downloaded[0].texts.filter(text => oldReadingIdsByText.has(text)).length;
console.log(`Imported 33 volumes, ${newPassageCount} passages, ${totalChars} characters.`);
console.log(`Existing reading-aid text matches retained for later remap audit: ${retainedEastCount}/${downloaded[0].texts.length}.`);
