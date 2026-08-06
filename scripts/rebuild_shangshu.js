import fs from 'fs';
import https from 'https';
import path from 'path';
import { execSync } from 'child_process';

const worksTsPath = 'src/data/works.ts';
const chunksDir = 'src/data/sentence_chunks';

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'curl/8.4.0', 'Accept': '*/*' } }, response => {
      console.log(`GET ${url} -> ${response.statusCode}`);
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location.startsWith('http')
          ? response.headers.location
          : `https://ctext.org${response.headers.location}`;
        console.log(`Redirecting to ${redirectUrl}`);
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
  let dumped = false;
  for (const [, row] of rows) {
    if (!dumped && row.includes('id="comm')) {
       console.log("Found row with comm:", row);
       dumped = true;
    }
    const cell = row.match(/<td[^>]*class="ctext"[^>]*>[\s\S]*?<div id="comm\d+"><\/div>([\s\S]*?)<\/td>/i);
    if (!cell) continue;
    const text = decodeHtml(cell[1]);
    if (text && /[\u3400-\u9fff]/u.test(text)) texts.push(text);
  }
  if (texts.length === 0) {
    const bodyMatch = html.match(/<div class="ctext"[^>]*>([\s\S]*?)<\/div>/i);
    if (bodyMatch) {
      const text = decodeHtml(bodyMatch[1]);
      if (text && /[\u3400-\u9fff]/u.test(text)) texts.push(text);
    }
  }
  return texts;
}

function extract(file, name) {
  const source = fs.readFileSync(file, 'utf8');
  const prefix = `export const ${name} = JSON.parse('`;
  const start = source.indexOf(prefix);
  if (start < 0) return [];
  const payloadStart = start + prefix.length;
  let end = source.indexOf("') as ", payloadStart);
  if (end < 0) end = source.indexOf("')", payloadStart);
  if (end < 0) return [];
  const literal = `'${source.slice(payloadStart, end)}'`;
  return JSON.parse(new Function(`"use strict"; return ${literal}`)());
}

function loadAllData() {
  const source = fs.readFileSync(worksTsPath, 'utf8');
  const worksMatch = source.match(/export const works = JSON\.parse\('(.+)'\)/);
  const chMatch = source.match(/export const chapters = JSON\.parse\('(.+)'\)/);
  
  const works = worksMatch ? JSON.parse(worksMatch[1].replace(/\\'/g, "'").replace(/\\\\/g, "\\")) : [];
  const chapters = chMatch ? JSON.parse(chMatch[1].replace(/\\'/g, "'").replace(/\\\\/g, "\\")) : [];
  
  const p1 = extract('src/data/sentence_chunks/passages_part1.ts', 'passagesPart1');
  const p2 = extract('src/data/sentence_chunks/passages_part2.ts', 'passagesPart2');
  const passages = [...p1, ...p2];
  
  let sentences = [];
  for (let i = 1; i <= 8; i++) {
    sentences = sentences.concat(extract(`src/data/sentence_chunks/part${i}.ts`, `sentencesPart${i}`));
  }
  
  return { works, chapters, passages, sentences };
}

function saveData(works, chapters, passages, sentences) {
  const pChunkSize = Math.ceil(passages.length / 2);
  for (let i = 0; i < 2; i++) {
    const pChunk = passages.slice(i * pChunkSize, (i + 1) * pChunkSize);
    const pContent = `// Auto-generated passages chunk part ${i + 1}\nimport type { Passage } from '../../types/content';\nexport const passagesPart${i + 1} = JSON.parse('${JSON.stringify(pChunk).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}') as Passage[];\n`;
    fs.writeFileSync(path.join(chunksDir, `passages_part${i + 1}.ts`), pContent, 'utf8');
  }

  const NUM_CHUNKS = 8;
  const chunkSize = Math.ceil(sentences.length / NUM_CHUNKS);
  const chunkImports = [];
  const chunkNames = [];
  for (let i = 0; i < NUM_CHUNKS; i++) {
    const chunkSentences = sentences.slice(i * chunkSize, (i + 1) * chunkSize);
    const chunkContent = `// Auto-generated sentence chunk part ${i + 1}\nimport type { Sentence } from '../../types/content';\nexport const sentencesPart${i + 1} = JSON.parse('${JSON.stringify(chunkSentences).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}') as Sentence[];\n`;
    fs.writeFileSync(path.join(chunksDir, `part${i + 1}.ts`), chunkContent, 'utf8');
    chunkImports.push(`import { sentencesPart${i + 1} } from './sentence_chunks/part${i + 1}'`);
    chunkNames.push(`...sentencesPart${i + 1}`);
  }

  const worksTsNew = `// ─────────────────────────────────────────────────\n// 經典文脈 ClassicFlow — 典籍內容資料庫 (Chunked for GitHub <50MB limit)\n// ─────────────────────────────────────────────────\nimport type { Work, Chapter, Passage, Sentence } from '../types/content'\nimport { passagesPart1 } from './sentence_chunks/passages_part1'\nimport { passagesPart2 } from './sentence_chunks/passages_part2'\n${chunkImports.join('\n')}\n\nexport const works = JSON.parse('${JSON.stringify(works).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}') as Work[];\n\nexport const chapters = JSON.parse('${JSON.stringify(chapters).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}') as Chapter[];\n\nexport const passages: Passage[] = [\n  ...passagesPart1,\n  ...passagesPart2,\n];\n\nexport const sentences: Sentence[] = [\n  ${chunkNames.join(',\n  ')}\n];\n`;
  fs.writeFileSync(worksTsPath, worksTsNew, 'utf8');
}

async function rebuildShangshu() {
  const data = loadAllData();
  
  console.log("Fetching Shangshu chapters from CText...");
  const html = await download('https://ctext.org/shang-shu/zh');
  const regex = new RegExp(`href="shang-shu/([^"]+)"[^>]*>([^<]+)</a>`, 'g');
  const chaptersSpec = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    if (match[1] !== 'zh' && !match[1].includes('#')) {
       chaptersSpec.push({ slug: match[1], title: match[2] });
    }
  }
  
  const uniqueSpecs = [];
  const seen = new Set();
  for (const c of chaptersSpec) {
     if (!seen.has(c.slug)) {
        seen.add(c.slug);
        uniqueSpecs.push(c);
     }
  }
  
  // Filter out any non-chapter pages (like zhs)
  const validSpecs = uniqueSpecs.filter(c => c.slug !== 'zhs');
  
  console.log(`Found ${validSpecs.length} chapters.`);

  const downloaded = [];
  for (const { slug, title } of validSpecs) {
    const url = `https://ctext.org/shang-shu/${slug}`;
    try {
      const chHtml = await download(url);
      const texts = extractChinesePassages(chHtml, title);
      downloaded.push({ slug, title, url, texts });
      console.log(`${title}: ${texts.length} 則`);
    } catch (err) {
      console.warn(`Failed ${title} (${slug}): ${err.message}`);
    }
    await new Promise(r => setTimeout(r, 600));
  }

  console.log("Removing old Shangshu data...");
  const workId = 'shu-jing';
  data.chapters = data.chapters.filter(c => c.workId !== workId);
  data.passages = data.passages.filter(p => !p.id.startsWith(`${workId}_`));
  data.sentences = data.sentences.filter(s => !s.id.startsWith(`${workId}_`));

  const chapterIds = [];
  let totalChars = 0;
  
  for (const [volumeIndex, volume] of downloaded.entries()) {
    const chapterId = `${workId}_ch-${volumeIndex + 1}`;
    chapterIds.push(chapterId);
    const passageIds = [];
    
    for (const [passageIndex, canonicalText] of volume.texts.entries()) {
      const passageId = `${chapterId}_p-${passageIndex + 1}`;
      passageIds.push(passageId);
      const sentenceIds = [];
      
      const parts = canonicalText.split(/([。！？；]+)/).filter(s => s.trim().length > 0);
      const sents = [];
      let currentStr = '';
      for (let i = 0; i < parts.length; i++) {
        currentStr += parts[i];
        if (/[。！？；]/.test(parts[i]) || i === parts.length - 1) {
          sents.push(currentStr);
          currentStr = '';
        }
      }
      
      for (const [sentenceIndex, sentenceText] of sents.entries()) {
        const sentenceId = `${passageId}_s-${sentenceIndex + 1}`;
        sentenceIds.push(sentenceId);
        data.sentences.push({
          id: sentenceId,
          passageId,
          order: sentenceIndex + 1,
          canonicalText: sentenceText,
          chunks: [[sentenceText, 'zh-Hant']]
        });
        totalChars += sentenceText.length;
      }
      
      data.passages.push({
        id: passageId,
        chapterId,
        order: passageIndex + 1,
        canonicalText,
        sentenceIds,
        sourceRefs: [{ label: '經文底本', edition: '中國哲學書電子化計劃《尚書》', url: volume.url }]
      });
    }
    
    data.chapters.push({
      id: chapterId,
      workId,
      order: volumeIndex + 1,
      title: volume.title,
      difficulty: 4,
      estimatedMinutes: Math.max(10, Math.ceil(volume.texts.reduce((n, text) => n + text.length, 0) / 300)),
      passageIds,
      tags: ['儒家', '政書', '上古史']
    });
  }

  const work = data.works.find(w => w.id === workId);
  if (work) {
    work.chapterIds = chapterIds;
    work.totalChars = totalChars;
  }
  
  console.log(`Saving Shangshu: ${totalChars} chars.`);
  saveData(data.works, data.chapters, data.passages, data.sentences);
  
  execSync('node scripts/generate_work_chunks.cjs', { stdio: 'inherit' });
  execSync('node scripts/generate_catalog.cjs', { stdio: 'inherit' });
  console.log("Successfully rebuilt Shangshu!");
}

rebuildShangshu().catch(console.error);
