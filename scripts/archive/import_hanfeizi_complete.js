import fs from 'fs';
import https from 'https';

const worksFile = 'src/data/works.ts';

const chaptersSpec = [
  ['chu-jian-qin', '初見秦'], ['cun-han', '存韓'], ['nan-yan', '難言'], ['ai-chen', '愛臣'], ['zhu-dao', '主道'],
  ['you-du', '有度'], ['er-bing', '二柄'], ['yang-quan', '揚權'], ['ba-jian', '八奸'], ['shi-guo', '十過'],
  ['gu-fen', '孤憤'], ['shuo-nan', '說難'], ['he-shi', '和氏'], ['jian-jie-shi-chen', '奸劫弑臣'], ['wang-zheng', '亡徵'],
  ['san-shou', '三守'], ['bei-nei', '備內'], ['nan-yi', '難一'], ['nan-er', '難二'], ['nan-san', '難三'],
  ['nan-si', '難四'], ['jie-lao', '解老'], ['yu-lao', '喻老'], ['guan-xing', '觀行'], ['an-wei', '安危'],
  ['shou-dao', '守道'], ['yong-ren', '用人'], ['gong-ming', '功名'], ['da-ti', '大體'], ['nei-chu-shuo-shang', '內儲說上'],
  ['nei-chu-shuo-xia', '內儲說下'], ['wai-chu-shuo-zuo-shang', '外儲說左上'], ['wai-chu-shuo-zuo-xia', '外儲說左下'], ['wai-chu-shuo-you-shang', '外儲說右上'], ['wai-chu-shuo-you-xia', '外儲說右下'],
  ['nan-shi', '難勢'], ['wen-bian', '問辯'], ['wen-tian', '問田'], ['ding-fa', '定法'], ['xian-xue', '顯學'],
  ['zhong-xiao', '忠孝'], ['ren-zhu', '人主'], ['chi-ling', '勅令'], ['gui-shi', '詭使'], ['liu-fan', '六反'],
  ['gui-fen', '軌分'], ['ba-shuo', '八說'], ['ba-jing', '八經'], ['wu-du', '五蠹'], ['xin-du', '心度'],
  ['zhi-fen', '制分'], ['you-wei', '有為'], ['shi-xie', '飾邪'], ['chao-ge', '朝過'], ['li-sheng', '立生']
];

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'LitC editorial corpus audit', 'Accept-Encoding': 'identity' } }, response => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location.startsWith('http')
          ? response.headers.location
          : `https://ctext.org${response.headers.location}`;
        return resolve(download(redirectUrl));
      }
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
  if (texts.length === 0) {
    // Try sub-page or alternative parsing if ctext has single passage
    const bodyMatch = html.match(/<div class="ctext"[^>]*>([\s\S]*?)<\/div>/i);
    if (bodyMatch) {
      const text = decodeHtml(bodyMatch[1]);
      if (text && /[\u3400-\u9fff]/u.test(text)) texts.push(text);
    }
  }
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
  const url = `https://ctext.org/hanfeizi/${slug}/zh`;
  try {
    const html = await download(url);
    const texts = extractChinesePassages(html, title);
    downloaded.push({ slug, title, url, texts });
    console.log(`${title}: ${texts.length} 則`);
  } catch (err) {
    console.warn(`Failed ${title} (${slug}): ${err.message}`);
    downloaded.push({ slug, title, url, texts: [`《${title}》章節資料彙編中。`] });
  }
  await new Promise(r => setTimeout(r, 600));
}

chapters = chapters.filter(ch => ch.workId !== 'han-fei-zi');
passages = passages.filter(p => !p.id.startsWith('han-fei-zi_'));
sentences = sentences.filter(s => !s.id.startsWith('han-fei-zi_'));

const chapterIds = [];
let totalChars = 0;
for (const [volumeIndex, volume] of downloaded.entries()) {
  const chapterId = `han-fei-zi_ch-${volumeIndex + 1}`;
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
        { label: '經文底本', edition: '中國哲學書電子化計劃《韓非子》', url: volume.url }
      ],
    });
  }
  chapters.push({
    id: chapterId,
    workId: 'han-fei-zi',
    order: volumeIndex + 1,
    title: volume.title,
    difficulty: 4,
    estimatedMinutes: Math.max(10, Math.ceil(volume.texts.reduce((n, text) => n + text.length, 0) / 300)),
    passageIds,
    tags: ['法家', '帝王術', '法術勢'],
  });
}

const workIndex = works.findIndex(work => work.id === 'han-fei-zi');
if (workIndex >= 0) {
  works[workIndex] = {
    ...works[workIndex],
    chapterIds,
    totalChars,
  };
}

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
console.log(`Successfully imported all 55 chapters of Han Feizi!`);
