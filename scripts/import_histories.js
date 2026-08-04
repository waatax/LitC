import fs from 'fs';
import https from 'https';
import path from 'path';

const worksFile = 'src/data/works.ts';

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Accept-Encoding': 'identity' } }, response => {
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

async function scrapeBook(bookId, bookName, excludeSlugs) {
  console.log(`\n--- Scraping ${bookName} (${bookId}) ---`);
  const rootUrl = `https://ctext.org/${bookId}/zh`;
  const rootHtml = await download(rootUrl);
  let slugs = [];
  const matches = [...rootHtml.matchAll(new RegExp(`href="${bookId}/([^"]+)"[^>]*>([^<]+)</a>`, 'gi'))];
  
  for (const [, slug, title] of matches) {
    if (slug === 'zhs' || slug === 'zh' || excludeSlugs.includes(slug)) continue;
    if (slug.endsWith('/zhs') || slug.endsWith('/zh')) continue; // Skip alternate language links if any
    if (slug.includes('/')) {
        // Only keep leaf slugs, e.g., 'ben-ji/wu-di-ben-ji' -> we will request 'ben-ji/wu-di-ben-ji/zh'
        // Actually ctext usually lists the real chapters directly if we parse correctly.
        slugs.push([slug, title]);
    } else {
        slugs.push([slug, title]);
    }
  }

  // Deduplicate slugs
  const uniqueSlugs = [];
  const seenSlugs = new Set();
  for(const [s, t] of slugs) {
     if(!seenSlugs.has(s)) {
         seenSlugs.add(s);
         uniqueSlugs.push([s, t]);
     }
  }

  const downloaded = [];
  for (const [slug, title] of uniqueSlugs) {
    const url = `https://ctext.org/${bookId}/${slug}/zh`;
    try {
        const html = await download(url);
        const texts = extractChinesePassages(html, title);
        if (texts.length > 0) {
            downloaded.push({ slug, title, url, texts });
            console.log(`  ${title}: ${texts.length} 則`);
        } else {
            console.log(`  ${title}: 0 則 (可能是目錄)`);
        }
    } catch(err) {
        console.error(`Error downloading ${title} at ${url}`, err);
    }
    // Rate limit
    await new Promise(r => setTimeout(r, 200));
  }
  return downloaded;
}

async function run() {
  const source = fs.readFileSync(worksFile, 'utf8');
  let [works, chapters, passages, sentences] = parseEncodedArrays(source);
  
  const booksToImport = [
    { id: 'shiji', name: '史記', diff: 4, excludeSlugs: ['ben-ji', 'biao', 'shu', 'shi-jia', 'lie-zhuan'] },
    { id: 'chun-qiu-zuo-zhuan', name: '春秋左傳', diff: 4, excludeSlugs: [] },
    { id: 'han-shu', name: '漢書', diff: 4, excludeSlugs: ['ji', 'biao', 'zhi', 'zhuan'] },
    { id: 'hou-han-shu', name: '後漢書', diff: 4, excludeSlugs: ['ji', 'lie-zhuan', 'zhi'] },
  ];

  for (const book of booksToImport) {
    const downloaded = await scrapeBook(book.id, book.name, book.excludeSlugs);
    if(downloaded.length === 0) {
        console.log(`No content found for ${book.name}`);
        continue;
    }
    
    // Clear old data for this book
    chapters = chapters.filter(ch => ch.workId !== book.id);
    passages = passages.filter(p => !p.id.startsWith(`${book.id}_`));
    sentences = sentences.filter(s => !s.id.startsWith(`${book.id}_`));

    const chapterIds = [];
    let totalChars = 0;
    
    for (const [volumeIndex, volume] of downloaded.entries()) {
      const chapterId = `${book.id}_ch-${volumeIndex + 1}`;
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
            { label: '經文底本', edition: '中國哲學書電子化計劃', url: volume.url }
          ],
        });
      }
      chapters.push({
        id: chapterId,
        workId: book.id,
        order: volumeIndex + 1,
        title: volume.title,
        difficulty: book.diff,
        estimatedMinutes: Math.max(10, Math.ceil(volume.texts.reduce((n, text) => n + text.length, 0) / 300)),
        passageIds,
        tags: ['史書'],
      });
    }
    
    const workIndex = works.findIndex(w => w.id === book.id);
    if (workIndex >= 0) {
      works[workIndex] = {
        ...works[workIndex],
        chapterIds,
        totalChars,
      };
    } else {
        console.warn(`Work ${book.id} not found in works!`);
    }
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
  console.log('All historical books imported successfully.');
}

run().catch(console.error);
