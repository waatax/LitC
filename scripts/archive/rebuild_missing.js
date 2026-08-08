import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';
import crypto from 'crypto';
import https from 'https';
import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const KEY_HEX = "a9e15f58d41c2853fa63b7b9f376f9de334a790e90301d2ac573ecf0a99f7bc3";
const KEY = Buffer.from(KEY_HEX, 'hex');
const SALT = "8MDz@JLgBBUk^GJR";

const agent = new https.Agent({ rejectUnauthorized: false });

function encryptPath(pathStr) {
  const nonce = nacl.randomBytes(24);
  const msg = naclUtil.decodeUTF8(pathStr);
  const cipher = nacl.secretbox(msg, nonce, KEY);
  const combined = new Uint8Array(nonce.length + cipher.length);
  combined.set(nonce, 0);
  combined.set(cipher, nonce.length);
  const b64 = naclUtil.encodeBase64(combined);
  return b64.replace(/\//g, '_').replace(/\+/g, '-');
}

function decryptData(b64Data) {
  const stdB64 = b64Data.replace(/_/g, '/').replace(/-/g, '+');
  const combined = naclUtil.decodeBase64(stdB64);
  const nonce = combined.slice(0, 24);
  const cipher = combined.slice(24);
  const decrypted = nacl.secretbox.open(cipher, nonce, KEY);
  if (!decrypted) throw new Error("Decryption failed");
  return naclUtil.encodeUTF8(decrypted);
}

function genSignature(encPath, ts, nonce) {
  const params = { path: encPath, timestamp: String(ts), nonce: String(nonce) };
  const sortedKeys = Object.keys(params).sort();
  const paramStr = sortedKeys.map(k => `${k}=${params[k]}`).join('&');
  return crypto.createHash('md5').update(paramStr + SALT).digest('hex');
}

function requestApi(relPath) {
  return new Promise((resolve, reject) => {
    const ts = Date.now();
    const nonce = crypto.randomUUID().replace(/-/g, '');
    const encPath = encryptPath(relPath);
    const sig = genSignature(encPath, ts, nonce);
    
    const url = `https://www.dianji.fun/api/${encPath}`;
    const req = https.get(url, {
      agent,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'X-Timestamp': String(ts),
        'X-Nonce': nonce,
        'X-Signature': sig
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonRes = JSON.parse(data);
          if (jsonRes.code === 200 && jsonRes.data) {
            const decStr = decryptData(jsonRes.data);
            resolve(JSON.parse(decStr));
          } else {
            console.log("requestApi failed", jsonRes);
            resolve(null);
          }
        } catch (e) {
          console.log("requestApi json parse error", e, data);
          reject(e);
        }
      });
    });
    req.on('error', reject);
  });
}

// LitC Pipeline Data Functions
const worksTsPath = 'src/data/works.ts';
const chunksDir = 'src/data/sentence_chunks';
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

async function fetchAndRebuildBook(bookId, litcWorkId, data) {
    console.log(`Fetching info for ${litcWorkId} (ID: ${bookId})...`);
    const resp = await requestApi(`/book/info/${bookId}`);
    const info = resp ? resp.data : null;
    if (!info || !info.catalog || !info.catalog.chapterIds) {
       console.log(`No chapters found for ${litcWorkId}.`);
       return;
    }
    console.log("INFO:", info.id, info.titleSimp, "chapters:", info.catalog.chapterIds.split('H@H').slice(0, 3));
    
    const ids = info.catalog.chapterIds.split('H@H').filter(Boolean);
    const names = info.catalog.chapterNames.split('H@H').filter(Boolean);
    
    console.log(`Found ${ids.length} chapters for ${litcWorkId}.`);
    
    // Remove old data
    data.chapters = data.chapters.filter(c => c.workId !== litcWorkId);
    data.passages = data.passages.filter(p => !p.id.startsWith(`${litcWorkId}_`));
    data.sentences = data.sentences.filter(s => !s.id.startsWith(`${litcWorkId}_`));

    const chapterIds = [];
    let totalChars = 0;
    
    for (let i = 0; i < ids.length; i++) {
       const chId = ids[i];
       const chName = names[i];
       console.log(`Fetching chapter ${i+1}/${ids.length}: ${chName}`);
       const chResp = await requestApi(`/book/chapter/${bookId}/${chId}`);
       const chData = chResp ? chResp.data : null;
       
       if (!chData || !chData.content) {
          console.log("No content found for chapter", chName, chData);
       }
       
       if (chData && chData.content) {
          const chapterId = `${litcWorkId}_ch-${i + 1}`;
          chapterIds.push(chapterId);
          const passageIds = [];
          
          const paragraphs = chData.content.split('\\n').map(s => s.trim()).filter(s => s.length > 0);
          
          for (const [passageIndex, canonicalText] of paragraphs.entries()) {
            const passageId = `${chapterId}_p-${passageIndex + 1}`;
            passageIds.push(passageId);
            const sentenceIds = [];
            
            const parts = canonicalText.split(/([。！？；]+)/).filter(s => s.trim().length > 0);
            const sents = [];
            let currentStr = '';
            for (let j = 0; j < parts.length; j++) {
              currentStr += parts[j];
              if (/[。！？；]/.test(parts[j]) || j === parts.length - 1) {
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
              sourceRefs: [{ label: '經文底本', edition: 'dianji.fun' }]
            });
          }
          
          data.chapters.push({
            id: chapterId,
            workId: litcWorkId,
            order: i + 1,
            title: chName,
            difficulty: 4,
            estimatedMinutes: Math.max(10, Math.ceil(paragraphs.reduce((n, text) => n + text.length, 0) / 300)),
            passageIds,
            tags: []
          });
       }
       break;
    }

    const work = data.works.find(w => w.id === litcWorkId);
    if (work) {
      work.chapterIds = chapterIds;
      work.totalChars = totalChars;
    }
    console.log(`Rebuilt ${litcWorkId}: ${totalChars} chars.`);
}

async function run() {
  const data = loadAllData();
  
  // Find correct IDs in dianji_books_converted.json if possible, else we use the ones I found
  const allBooks = JSON.parse(fs.readFileSync('scratch/dianji_books_converted.json', 'utf8'));
  const shijing = allBooks.find(b => b.titleSimp === '诗经');
  
  if (shijing) {
    await fetchAndRebuildBook(shijing.id, 'shi-jing', data);
  } else {
    console.log("Could not find Shijing ID.");
  }
  
  console.log(`Saving all rebuilt works to database...`);
  saveData(data.works, data.chapters, data.passages, data.sentences);
  
  execSync('node scripts/generate_work_chunks.cjs', { stdio: 'inherit' });
  execSync('node scripts/generate_catalog.cjs', { stdio: 'inherit' });
  console.log("Successfully rebuilt missing classics!");
}

run();
