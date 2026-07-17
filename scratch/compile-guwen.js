import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const worksPath = path.join(__dirname, '../src/data/works.ts');

import { works, chapters, passages, sentences } from '../src/data/works.ts';

const cacheDir = 'C:/Users/User/.gemini/antigravity/brain/94415241-e907-4a0d-ab2d-2708f581a7e2/scratch/guwen_cache';
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

// Load S2T dictionary
const s2tDict = JSON.parse(fs.readFileSync('C:/Users/User/.gemini/antigravity/brain/94415241-e907-4a0d-ab2d-2708f581a7e2/scratch/s2t.json', 'utf8'));
function convertS2T(text) {
  return text.split('').map(char => s2tDict[char] || char).join('');
}

// Helper to split a sentence into chunks
function chunkSentence(text, sentenceId) {
  const cleanText = text.replace(/[\s\n\r]/g, '');
  const parts = cleanText.split(/([，；：。！？、])/g);
  const chunks = [];
  let current = '';
  let chunkOrder = 1;
  for (const p of parts) {
    if (/[，；：。！？、]/.test(p)) {
      if (current) {
        chunks.push({
          id: `${sentenceId}_c-${chunkOrder}`,
          sentenceId,
          order: chunkOrder,
          text: current + p
        });
        chunkOrder++;
        current = '';
      } else if (chunks.length > 0) {
        chunks[chunks.length - 1].text += p;
      }
    } else {
      current += p;
    }
  }
  if (current) {
    if (current.length > 8) {
      const mid = Math.floor(current.length / 2);
      chunks.push({
        id: `${sentenceId}_c-${chunkOrder}`,
        sentenceId,
        order: chunkOrder,
        text: current.slice(0, mid)
      });
      chunkOrder++;
      chunks.push({
        id: `${sentenceId}_c-${chunkOrder}`,
        sentenceId,
        order: chunkOrder,
        text: current.slice(mid)
      });
    } else {
      chunks.push({
        id: `${sentenceId}_c-${chunkOrder}`,
        sentenceId,
        order: chunkOrder,
        text: current
      });
    }
  }
  return chunks;
}

// Fetch with retry helper
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.text();
    } catch (e) {
      // ignore
    }
    await new Promise(r => setTimeout(r, 200));
  }
  return null;
}

async function main() {
  const compiledChapters = [];
  const compiledPassages = [];
  const compiledSentences = [];

  const metadata = JSON.parse(fs.readFileSync(path.join(cacheDir, 'metadata.json'), 'utf8'));
  console.log(`Starting Guwen Guanzhi compilation for all ${metadata.length} articles...`);

  let globalPIdx = 1;
  let globalSIdx = 1;

  for (let i = 0; i < metadata.length; i++) {
    const art = metadata[i];
    const partNum = String(i + 3).padStart(3, '0');
    const url = `https://ancient-china-books.github.io/guwenguanzhi/OEBPS/Text/part${partNum}.html`;
    const filename = `part_${partNum}.html`;
    const filePath = path.join(cacheDir, filename);

    let html = '';
    if (fs.existsSync(filePath)) {
      html = fs.readFileSync(filePath, 'utf8');
    } else {
      console.log(`[${i+1}/${metadata.length}] Downloading ${art.title} (Vol ${art.volume})...`);
      html = await fetchWithRetry(url);
      if (html) {
        fs.writeFileSync(filePath, html, 'utf8');
        await new Promise(r => setTimeout(r, 150));
      } else {
        console.error(`Failed to download ${art.title}`);
        continue;
      }
    }

    // Clean up HTML
    const cleanedHtml = html.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // Parse calibre5 paragraphs (original text + annotations)
    // Example: <p class="calibre5">...</p>
    const calibre5Regex = /<p\s+class="calibre5"[\s\S]*?>([\s\S]*?)<\/p>/gi;
    const origParasRaw = [...cleanedHtml.matchAll(calibre5Regex)].map(m => m[1]);

    // Parse translation paragraphs (simplified translation)
    // Example: <p class="translation">...</p>
    const translationRegex = /<p\s+class="translation"[\s\S]*?>([\s\S]*?)<\/p>/gi;
    const transParasRaw = [...cleanedHtml.matchAll(translationRegex)].map(m => m[1]);

    // Process original paragraphs to strip zhu annotations
    const origParas = origParasRaw.map(p => {
      const pureHtml = p.replace(/<span\s+class="zhu"[\s\S]*?>[\s\S]*?<\/span>/gi, '');
      return pureHtml.replace(/<[^>]*>/g, '').replace(/[\s\n\r]/g, '').trim();
    }).filter(Boolean);

    // Process translation paragraphs to convert to Traditional Chinese
    const transParas = transParasRaw.map(p => {
      const pureText = p.replace(/<[^>]*>/g, '').replace(/[\n\r]/g, '').trim();
      return convertS2T(pureText);
    }).filter(Boolean);

    const chapterId = `gu-wen-guan-zhi_ch-${i + 1}`;
    const chapterPassageIds = [];

    // Align paragraph by paragraph
    const minParas = Math.min(origParas.length, transParas.length);
    if (minParas === 0) {
      console.warn(`Warning: No paired paragraphs found for ${art.title} (Vol ${art.volume})! Orig: ${origParas.length}, Trans: ${transParas.length}`);
      continue;
    }

    let chTotalChars = 0;

    for (let p = 0; p < minParas; p++) {
      const origText = origParas[p];
      const transText = transParas[p];
      chTotalChars += origText.length;

      const passageId = `gu-wen-guan-zhi_ch-${i + 1}_p-${globalPIdx}`;
      const passageSentenceIds = [];

      // Split paragraph into sentences by 。；！？
      const origSentences = origText.split(/(?<=[。；！？])/g).map(s => s.trim()).filter(Boolean);
      const transSentences = transText.split(/(?<=[。；！？])/g).map(s => s.trim()).filter(Boolean);

      const maxSentences = Math.max(origSentences.length, transSentences.length);

      for (let s = 0; s < maxSentences; s++) {
        const oSentence = origSentences[s];
        if (!oSentence) continue; // If translation has more sentences, skip orphans to keep classical text primary

        // Find matching translation or fallback
        let tSentence = transSentences[s];
        if (!tSentence) {
          tSentence = transSentences[transSentences.length - 1] || '';
        }

        const sentenceId = `gu-wen-guan-zhi_ch-${i + 1}_p-${globalPIdx}_s-${globalSIdx}`;
        const chunks = chunkSentence(oSentence, sentenceId);

        compiledSentences.push({
          id: sentenceId,
          passageId,
          order: globalSIdx,
          canonicalText: oSentence,
          translationHint: tSentence,
          chunks,
          tags: []
        });

        passageSentenceIds.push(sentenceId);
        globalSIdx++;
      }

      if (passageSentenceIds.length > 0) {
        compiledPassages.push({
          id: passageId,
          chapterId,
          order: p + 1,
          canonicalText: origText,
          sentenceIds: passageSentenceIds,
          sourceRefs: [
            {
              label: art.author
            }
          ]
        });
        chapterPassageIds.push(passageId);
        globalPIdx++;
      }
    }

    compiledChapters.push({
      id: chapterId,
      workId: 'gu-wen-guan-zhi',
      order: i + 1,
      title: art.title,
      difficulty: 3,
      estimatedMinutes: Math.max(1, Math.ceil(chTotalChars / 300)),
      passageIds: chapterPassageIds,
      tags: [`卷${convertS2T(art.volume)}`, convertS2T(art.author)]
    });
  }

  // ── MERGE BACK AND UPDATE WORKS.TS ──
  console.log("Merging and rebuilding works.ts...");

  const targetWorkIds = ['gu-wen-guan-zhi'];

  const updatedWorks = works.map(w => {
    if (targetWorkIds.includes(w.id)) {
      const chs = compiledChapters.filter(c => c.workId === w.id);
      const chIds = chs.map(c => c.id);
      const pIds = chs.flatMap(c => c.passageIds);
      const passList = compiledPassages.filter(p => pIds.includes(p.id));
      
      let totalChars = 0;
      passList.forEach(p => {
        totalChars += p.canonicalText.replace(/[，。；！？、：\s（）『』「」]/g, '').length;
      });
      
      return {
        ...w,
        chapterIds: chIds,
        totalChars
      };
    }
    return w;
  });

  const otherChapters = chapters.filter(c => !targetWorkIds.includes(c.workId));
  const finalChapters = [...otherChapters, ...compiledChapters];

  const otherPassages = passages.filter(p => {
    return !targetWorkIds.some(id => p.id.startsWith(id + '_'));
  });
  const finalPassages = [...otherPassages, ...compiledPassages];

  const otherSentences = sentences.filter(s => {
    return !targetWorkIds.some(id => s.id.startsWith(id + '_'));
  });
  const finalSentences = [...otherSentences, ...compiledSentences];

  // Split finalPassages into chunks of 1000 to prevent TS2590 compiler error
  const passageChunkSize = 1000;
  let passagesBlocksContent = '';
  const passageBlockNames = [];

  for (let i = 0; i < finalPassages.length; i += passageChunkSize) {
    const chunk = finalPassages.slice(i, i + passageChunkSize);
    const blockName = `passages_${Math.floor(i / passageChunkSize)}`;
    passageBlockNames.push(blockName);
    passagesBlocksContent += `const ${blockName} = ${JSON.stringify(chunk, null, 2)} as any as Passage[];\n\n`;
  }

  // Split finalSentences into chunks of 1000 to prevent TS2590 compiler error
  const chunkSize = 1000;
  let sentencesBlocksContent = '';
  const blockNames = [];

  for (let i = 0; i < finalSentences.length; i += chunkSize) {
    const chunk = finalSentences.slice(i, i + chunkSize);
    const blockName = `sentences_${Math.floor(i / chunkSize)}`;
    blockNames.push(blockName);
    sentencesBlocksContent += `const ${blockName} = ${JSON.stringify(chunk, null, 2)} as any as Sentence[];\n\n`;
  }

  const worksTsContent = `// ─────────────────────────────────────────────────
// 經典文脈 ClassicFlow — 典籍內容資料庫
// 自動生成於: ${new Date().toISOString()}
// ─────────────────────────────────────────────────
import type { Work, Chapter, Passage, Sentence } from '../types/content'

export const works: Work[] = ${JSON.stringify(updatedWorks, null, 2)};

export const chapters = ${JSON.stringify(finalChapters, null, 2)} as any as Chapter[];

${passagesBlocksContent}
export const passages: Passage[] = ([] as Passage[]).concat(
  ${passageBlockNames.join(',\n  ')}
);

${sentencesBlocksContent}
export const sentences: Sentence[] = ([] as Sentence[]).concat(
  ${blockNames.join(',\n  ')}
);
`;

  fs.writeFileSync(worksPath, worksTsContent, 'utf8');

  console.log("=== COMPLETED ===");
  console.log(`Total works: ${updatedWorks.length}`);
  console.log(`Total chapters: ${finalChapters.length}`);
  console.log(`Total passages: ${finalPassages.length}`);
  console.log(`Total sentences: ${finalSentences.length}`);
}

main();
