import fs from 'fs';
import https from 'https';

const chaptersSpec = [
  ['reform-of-the-law', '更法'], ['order-to-cultivate-waste-lands', '墾令'], ['agriculture-and-war', '農戰'],
  ['elimination-of-strength', '去強'], ['discussion-about-the-people', '說民'], ['calculation-of-land', '算地'],
  ['opening-and-debarring', '開塞'], ['unification-of-words', '壹言'], ['establishing-laws', '錯法'],
  ['method-of-warfare', '戰法'], ['establishment-of-fundamentals', '立本'], ['military-defence', '兵守'],
  ['making-orders-strict', '靳令'], ['cultivation-of-the-right-standard', '修權'], ['encouragement-of-immigration', '徠民'],
  [null, '刑約'], ['rewards-and-punishments', '賞刑'], ['policies', '畫策'], ['within-the-borders', '境內'],
  ['weakening-the-people', '弱民'], [null, '御盜'], ['external-and-internal-affairs', '外內'],
  ['prince-and-minister', '君臣'], ['interdicts-and-encouragements', '禁使'], ['attention-to-law', '慎法'],
  ['fixing-of-rights-and-duties', '定分'],
];

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'LitC editorial corpus audit', 'Accept-Encoding': 'identity' } }, response => {
      if (response.statusCode !== 200) { reject(new Error(`${url}: HTTP ${response.statusCode}`)); response.resume(); return; }
      response.setEncoding('utf8'); let body = '';
      response.on('data', chunk => { body += chunk; }); response.on('end', () => resolve(body));
    }).on('error', reject);
  });
}

function decodeHtml(value) {
  const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
  return value.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '')
    .replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (_, entity) => {
      if (entity[0] === '#') { const hex = entity[1].toLowerCase() === 'x'; return String.fromCodePoint(Number.parseInt(entity.slice(hex ? 2 : 1), hex ? 16 : 10)); }
      return named[entity.toLowerCase()] ?? `&${entity};`;
    }).replace(/\r/g, '').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

function extractPassages(html, title) {
  const texts = [];
  for (const [, row] of html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const cell = row.match(/<td[^>]*class="ctext"[^>]*>[\s\S]*?<div id="comm\d+"><\/div>([\s\S]*?)<\/td>/i);
    if (!cell) continue;
    const text = decodeHtml(cell[1]);
    if (text && /[\u3400-\u9fff]/u.test(text)) texts.push(text);
  }
  if (!texts.length) throw new Error(`${title}: no passages found`);
  return texts;
}

function splitSentences(text) { return text.match(/[^。！？；\n]+[。！？；]?/g)?.map(v => v.trim()).filter(Boolean) ?? [text]; }

const downloaded = [];
for (const [slug, title] of chaptersSpec) {
  if (!slug) { downloaded.push({ slug, title, url: null, texts: [] }); console.log(`${title}: 存目無文`); continue; }
  const url = `https://ctext.org/shang-jun-shu/${slug}/zh`;
  const texts = extractPassages(await download(url), title);
  downloaded.push({ slug, title, url, texts });
  console.log(`${title}: ${texts.length} 段`);
}

const worksFile = 'src/data/works.ts';
let worksSource = fs.readFileSync(worksFile, 'utf8');
const encoded = [...worksSource.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)];
let [works, chapters, passages, sentences] = encoded.map(match => JSON.parse(decodeURIComponent(match[1])));
chapters = chapters.filter(chapter => chapter.workId !== 'shang-jun-shu');
passages = passages.filter(passage => !passage.id.startsWith('shang-jun-shu_'));
sentences = sentences.filter(sentence => !sentence.id.startsWith('shang-jun-shu_'));

let totalChars = 0;
const chapterIds = [];
for (const [chapterIndex, chapterData] of downloaded.entries()) {
  const chapterId = `shang-jun-shu_ch-${chapterIndex + 1}`;
  const passageIds = [];
  chapterIds.push(chapterId);
  for (const [passageIndex, canonicalText] of chapterData.texts.entries()) {
    const passageId = `${chapterId}_p-${passageIndex + 1}`;
    const sentenceIds = splitSentences(canonicalText).map((text, sentenceIndex) => {
      const id = `${passageId}_s-${sentenceIndex + 1}`;
      sentences.push({ id, passageId, order: sentenceIndex + 1, canonicalText: text, cue: text[0], chunks: [{ id: `${id}_c-1`, sentenceId: id, order: 1, text, cue: text[0] }] });
      return id;
    });
    passageIds.push(passageId); totalChars += canonicalText.length;
    passages.push({ id: passageId, chapterId, order: passageIndex + 1, canonicalText, sentenceIds, sourceRefs: [
      { label: '經文底本', edition: '中國哲學書電子化計劃《漢魏叢書》本《人物志、商子》', url: chapterData.url },
      { label: '校勘對照', edition: '嚴萬里校《商君書》、朱師轍《商君書解詁定本》及蔣禮鴻《商君書錐指》' },
    ] });
  }
  chapters.push({ id: chapterId, workId: 'shang-jun-shu', order: chapterIndex + 1, title: chapterData.title,
    subtitle: chapterData.slug ? undefined : '存目無文', difficulty: 5,
    estimatedMinutes: chapterData.texts.length ? Math.max(5, Math.ceil(chapterData.texts.reduce((n, t) => n + t.length, 0) / 250)) : 1,
    passageIds, tags: chapterData.slug ? ['法家', '商鞅', '治國'] : ['法家', '亡佚', '存目無文'] });
}

const workIndex = works.findIndex(work => work.id === 'shang-jun-shu');
works[workIndex] = { ...works[workIndex], subtitle: '商鞅及其後學',
  sourceNote: '依通行本二十六篇編次；第十六〈刑約〉、第二十一〈御盜〉存目無文，實存二十四篇。經文以中國哲學書電子化計劃《漢魏叢書》本為底本，對校嚴萬里、朱師轍及蔣禮鴻校注。', chapterIds, totalChars };
let datasetIndex = 0;
worksSource = worksSource.replace(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g, () => `JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify([works, chapters, passages, sentences][datasetIndex++]))}"))`);
fs.writeFileSync(worksFile, worksSource, 'utf8');

// Old three-chapter aids used incompatible IDs after restoring the canonical 26-chapter order.
const aidFile = 'src/data/readingAid.ts';
let aidSource = fs.readFileSync(aidFile, 'utf8');
aidSource = aidSource.replace(/\s*'shang-jun-shu_[^']+'\s*:\s*\{\s*["']?translation["']?\s*:\s*"(?:\\.|[^"\\])*",\s*["']?analysis["']?\s*:\s*"(?:\\.|[^"\\])*"\s*\},?/gs, '');
fs.writeFileSync(aidFile, aidSource, 'utf8');

const reviewFile = 'src/data/editorialReviews.json';
const editorial = JSON.parse(fs.readFileSync(reviewFile, 'utf8'));
editorial.reviews = editorial.reviews.filter(review => !review.passageId.startsWith('shang-jun-shu_'));
editorial.updatedAt = '2026-07-29';
fs.writeFileSync(reviewFile, `${JSON.stringify(editorial, null, 2)}\n`, 'utf8');

const extant = downloaded.filter(chapter => chapter.texts.length).length;
const passageCount = downloaded.reduce((n, chapter) => n + chapter.texts.length, 0);
if (downloaded.length !== 26 || extant !== 24) throw new Error(`Completeness failure: ${downloaded.length} chapters, ${extant} extant`);
console.log(`Imported 26 chapter positions (${extant} extant), ${passageCount} passages, ${totalChars} characters.`);
