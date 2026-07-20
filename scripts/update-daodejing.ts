import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const worksPath = path.join(__dirname, '../src/data/works.ts');
const rawDataPath = path.join(__dirname, '../scratch/daodejing_raw.json');

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
  // Load raw parsed Dao De Jing chapters
  const rawDaoDeJing = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));

  // Import existing works.ts data
  const { works, chapters, passages, sentences } = await import('../src/data/works.ts');

  // Filter out any existing 'dao-de-jing' work, chapters, passages, and sentences
  const filteredWorks = works.filter(w => w.id !== 'dao-de-jing');
  const filteredChapters = chapters.filter(c => c.workId !== 'dao-de-jing');
  const filteredPassages = passages.filter(p => !p.id.startsWith('dao-de-jing_'));
  const filteredSentences = sentences.filter(s => !s.id.startsWith('dao-de-jing_'));

  const updatedWorks = [];
  const updatedChapters = [...filteredChapters];
  const updatedPassages = [...filteredPassages];
  const updatedSentences = [...filteredSentences];

  const workId = 'dao-de-jing';
  const chapterIds = [];
  let totalChars = 0;

  // Process Dao De Jing chapters (1 to 81)
  rawDaoDeJing.forEach((chData) => {
    const chNum = chData.chapterNum;
    const chapterId = `${workId}_ch-${chNum}`;
    chapterIds.push(chapterId);

    const passageId = `${chapterId}_p-1`;
    const pText = chData.text;

    // Character count (pure Chinese characters, no punctuation)
    const pureText = pText.replace(/[，。；！？、：\s（）『』「」“”]/g, '');
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
      order: 1,
      canonicalText: pText,
      sentenceIds,
      sourceRefs: [{ label: "通行本", edition: "中哲會/維基文庫" }]
    });

    updatedChapters.push({
      id: chapterId,
      workId,
      order: chNum,
      title: `第${chNum}章`,
      difficulty: 2,
      estimatedMinutes: Math.max(1, Math.round(pureText.length / 100)),
      passageIds: [passageId],
      tags: []
    });
  });

  // Re-push dao-de-jing at the front of works
  const newWork = {
    id: workId,
    schoolId: 'daoism',
    title: '道德經',
    subtitle: '老子',
    genreStrategy: 'rhythmic',
    sourceNote: '版本來源自通行本（王弼本）及校勘附記。',
    chapterIds,
    totalChars
  };

  updatedWorks.push(newWork, ...filteredWorks);

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
  console.log(`Successfully updated Dao De Jing to 81 chapters in compressed format! Total works: ${updatedWorks.length}, Total chapters: ${updatedChapters.length}`);
}

run().catch(console.error);
