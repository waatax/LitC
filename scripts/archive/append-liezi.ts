import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const worksPath = path.join(__dirname, '../src/data/works.ts');
const rawDataPath = path.join(__dirname, '../scratch/liezi_raw.json');

// Helper for sentence and chunk splitting
function splitSentences(text) {
  const regex = /[^。；！？\r\n]+[。；！？]+/g;
  let matches = text.match(regex);
  if (!matches) {
    return [text.trim()].filter(Boolean);
  }
  return matches.map(m => m.trim()).filter(Boolean);
}

function splitChunks(sentenceText, sentenceId) {
  const parts = sentenceText.split(/([，、：；。！？])/g).filter(Boolean);
  let tempChunks = [];
  let current = "";
  
  for (const part of parts) {
    current += part;
    if (/[，、：；。！？]/.test(part) || current.length >= 4) {
      tempChunks.push(current);
      current = "";
    }
  }
  if (current) {
    if (tempChunks.length > 0) {
      tempChunks[tempChunks.length - 1] += current;
    } else {
      tempChunks.push(current);
    }
  }

  let finalChunks = [];
  for (let chunk of tempChunks) {
    if (chunk.length > 10) {
      const mid = Math.floor(chunk.length / 2);
      finalChunks.push(chunk.substring(0, mid));
      finalChunks.push(chunk.substring(mid));
    } else {
      finalChunks.push(chunk);
    }
  }

  return finalChunks.map((text, idx) => ({
    id: `${sentenceId}_c-${idx + 1}`,
    sentenceId,
    order: idx + 1,
    text,
    cue: text[0],
  }));
}

async function run() {
  // Load raw parsed Liezi paragraphs
  const rawLiezi = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));

  // Import existing works.ts data
  // Since works.ts might be in uncompressed TS format (after my previous run) or in compressed format,
  // we can import it. But wait, importing a massive TS file might crash Node if it tries to parse types,
  // or it might succeed because Node's type stripper is fast. Let's just import it dynamically.
  const { works, chapters, passages, sentences } = await import('../src/data/works.ts');

  // Let's filter out any existing 'liezi' work, so we can clean rebuild/re-append it
  const filteredWorks = works.filter(w => w.id !== 'liezi');
  const filteredChapters = chapters.filter(c => c.workId !== 'liezi');
  const filteredPassages = passages.filter(p => !p.id.startsWith('liezi_'));
  const filteredSentences = sentences.filter(s => !s.id.startsWith('liezi_'));

  const updatedWorks = [...filteredWorks];
  const updatedChapters = [...filteredChapters];
  const updatedPassages = [...filteredPassages];
  const updatedSentences = [...filteredSentences];

  const workId = 'liezi';
  const chapterIds = [];
  let totalChars = 0;

  // Process Liezi chapters
  rawLiezi.forEach((chData, chIdx) => {
    const chapterId = `${workId}_ch-${chIdx + 1}`;
    chapterIds.push(chapterId);

    const passageIds = [];
    let chapterTextLength = 0;

    chData.paragraphs.forEach((pText, pIdx) => {
      const passageId = `${chapterId}_p-${pIdx + 1}`;
      passageIds.push(passageId);

      // Character count
      const pureText = pText.replace(/[，。；！？、：\s（）『』「」“”]/g, '');
      chapterTextLength += pureText.length;
      totalChars += pureText.length;

      const sentenceTexts = splitSentences(pText);
      const sentenceIds = [];

      sentenceTexts.forEach((sText, sIdx) => {
        const sentenceId = `${passageId}_s-${sIdx + 1}`;
        sentenceIds.push(sentenceId);

        const chunks = splitChunks(sText, sentenceId);

        updatedSentences.push({
          id: sentenceId,
          passageId,
          order: sIdx + 1,
          canonicalText: sText,
          chunks,
          translationHint: '此句釋義提示。',
          tags: []
        });
      });

      updatedPassages.push({
        id: passageId,
        chapterId,
        order: pIdx + 1,
        canonicalText: pText,
        sentenceIds,
        sourceRefs: [{ label: "通行本", edition: "中哲會/維基文庫" }]
      });
    });

    updatedChapters.push({
      id: chapterId,
      workId,
      order: chIdx + 1,
      title: chData.title,
      difficulty: 2,
      estimatedMinutes: Math.max(1, Math.round(chapterTextLength / 100)),
      passageIds,
      tags: []
    });
  });

  // Push new work
  updatedWorks.push({
    id: workId,
    schoolId: 'daoism',
    title: '列子',
    subtitle: '沖虛至德真經',
    genreStrategy: 'narrative',
    sourceNote: '版本來源自通行本（晉張湛注《沖虛至德真經》）及校勘附記。',
    chapterIds,
    totalChars
  });

  // Helper to stringify & encode to bypass TypeScript Map size limit
  const encodeData = (data) => {
    return `JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(data))}"))`;
  };

  // Write updated works.ts in compressed URI-encoded JSON form
  const worksTsContent = `// ─────────────────────────────────────────────────
// 經典文脈 ClassicFlow — 典籍內容資料庫
// 自動生成於: ${new Date().toISOString()} (已壓縮以防止 TypeScript 內存超限)
// ─────────────────────────────────────────────────
import type { Work, Chapter, Passage, Sentence } from '../types/content'

export const works: Work[] = ${encodeData(updatedWorks)};

export const chapters: Chapter[] = ${encodeData(updatedChapters)};

export const passages: Passage[] = ${encodeData(updatedPassages)};

export const sentences: Sentence[] = ${encodeData(updatedSentences)};
`;

  fs.writeFileSync(worksPath, worksTsContent, 'utf8');
  console.log(`Successfully appended Liezi in compressed format! Total works: ${updatedWorks.length}, Total chapters: ${updatedChapters.length}`);
}

run().catch(console.error);
