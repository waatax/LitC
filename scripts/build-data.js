import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourcePath = path.join(__dirname, '../Literature Classic.md');
const outputPath = path.join(__dirname, '../src/data/works.ts');
const indexPath = path.join(__dirname, '../src/data/index.ts');

const content = fs.readFileSync(sourcePath, 'utf8');
const lines = content.split('\n');

let currentSchoolId = null;
let currentWorkId = null;
let currentWorkTitle = null;
let currentChapterIndex = 0;
let currentChapter = null;
let currentPassageIndex = 0;

const works = [];
const chapters = [];
const passages = [];
const sentences = [];

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
    id: `${sentenceId}/c-${idx + 1}`,
    sentenceId,
    order: idx + 1,
    text,
    cue: text[0],
  }));
}

let activeParagraph = [];

function flushPassage() {
  if (activeParagraph.length === 0) return;
  const rawText = activeParagraph.join('\n').trim();
  activeParagraph = [];
  if (!rawText || !currentChapter) return;

  currentPassageIndex++;
  const passageId = `${currentChapter.id}/p-${currentPassageIndex}`;
  
  const sentenceTexts = splitSentences(rawText);
  const sentenceIds = [];

  sentenceTexts.forEach((sText, sIdx) => {
    const sentenceId = `${passageId}/s-${sIdx + 1}`;
    sentenceIds.push(sentenceId);

    const sentenceChunks = splitChunks(sText, sentenceId);
    
    sentences.push({
      id: sentenceId,
      passageId,
      order: sIdx + 1,
      canonicalText: sText,
      chunks: sentenceChunks,
      translationHint: `此句釋義提示。`,
      tags: [],
    });
  });

  passages.push({
    id: passageId,
    chapterId: currentChapter.id,
    order: currentPassageIndex,
    canonicalText: rawText,
    sentenceIds,
    sourceRefs: [{ label: "通行本", edition: "中哲會/維基文庫" }],
  });

  currentChapter.passageIds.push(passageId);
}

for (let line of lines) {
  line = line.trim();

  if (line.startsWith('# 四、')) {
    flushPassage();
    break;
  }

  if (line.startsWith('# ') && !line.startsWith('# 一、道家') && !line.startsWith('# 二、法家') && !line.startsWith('# 三、墨家')) {
    continue;
  }

  if (line.startsWith('# 一、道家')) {
    flushPassage();
    currentSchoolId = 'daoism';
    continue;
  } else if (line.startsWith('# 二、法家')) {
    flushPassage();
    currentSchoolId = 'legalism';
    continue;
  } else if (line.startsWith('# 三、墨家')) {
    flushPassage();
    currentSchoolId = 'mohism';
    continue;
  }

  if (line.startsWith('## ')) {
    flushPassage();
    const title = line.replace('## ', '').trim();
    currentChapterIndex = 0;
    
    let wId = null;
    let wTitle = null;

    if (title.includes('道德經')) {
      wId = 'dao-de-jing';
      wTitle = '道德經';
    } else if (title.includes('莊子')) {
      wId = 'zhuangzi';
      wTitle = '莊子';
    } else if (title.includes('韓非子')) {
      wId = 'han-fei-zi';
      wTitle = '韓非子';
    } else if (title.includes('商君書')) {
      wId = 'shang-jun-shu';
      wTitle = '商君書';
    } else if (title.includes('墨子')) {
      wId = 'mo-zi';
      wTitle = '墨子';
    } else {
      continue;
    }

    currentWorkId = wId;
    currentWorkTitle = wTitle;

    const genreStrategy = 
      currentWorkId === 'dao-de-jing' ? 'rhythmic' :
      currentWorkId === 'zhuangzi' ? 'narrative' :
      currentWorkId === 'han-fei-zi' ? 'argumentative' :
      currentWorkId === 'shang-jun-shu' ? 'argumentative' : 'parallel';

    works.push({
      id: currentWorkId,
      schoolId: currentSchoolId,
      title: currentWorkTitle,
      genreStrategy,
      sourceNote: `版本來源自通行本及校勘附記。`,
      chapterIds: [],
      totalChars: 0,
    });
    continue;
  }

  if (line.startsWith('### ')) {
    flushPassage();
    const title = line.replace('### ', '').trim();
    currentChapterIndex++;
    const chapterId = `${currentWorkId}/ch-${currentChapterIndex}`;
    
    let genreStrategyOverride = undefined;
    if (currentWorkId === 'mo-zi' && title.includes('公輸')) {
      genreStrategyOverride = 'narrative';
    }

    currentChapter = {
      id: chapterId,
      workId: currentWorkId,
      order: currentChapterIndex,
      title,
      genreStrategyOverride,
      difficulty: title.length > 5 ? 3 : 2,
      estimatedMinutes: 5,
      passageIds: [],
      tags: [],
    };
    chapters.push(currentChapter);
    
    const work = works.find(w => w.id === currentWorkId);
    if (work) {
      work.chapterIds.push(chapterId);
    }
    
    currentPassageIndex = 0;
    continue;
  }

  if (line.startsWith('>')) {
    continue;
  }

  if (line === '') {
    flushPassage();
  } else {
    activeParagraph.push(line);
  }
}

flushPassage();

// Update totalChars for each work
works.forEach(work => {
  const workChapters = chapters.filter(c => c.workId === work.id);
  let total = 0;
  workChapters.forEach(ch => {
    const chPassages = passages.filter(p => p.chapterId === ch.id);
    chPassages.forEach(p => {
      total += p.canonicalText.replace(/[，。；！？、：\s]/g, '').length;
    });
  });
  work.totalChars = total;
});

// Write works.ts
const worksTsContent = `// ─────────────────────────────────────────────────
// 經典文脈 ClassicFlow — 典籍內容資料庫
// 自動生成於: ${new Date().toISOString()}
// ─────────────────────────────────────────────────
import type { Work, Chapter, Passage, Sentence } from '../types/content'

export const works: Work[] = ${JSON.stringify(works, null, 2)};

export const chapters: Chapter[] = ${JSON.stringify(chapters, null, 2)};

export const passages: Passage[] = ${JSON.stringify(passages, null, 2)};

export const sentences: Sentence[] = ${JSON.stringify(sentences, null, 2)};
`;

fs.writeFileSync(outputPath, worksTsContent, 'utf8');
console.log(`Successfully wrote ${works.length} works, ${chapters.length} chapters to ${outputPath}`);

// Write index.ts
const indexTsContent = `// ─────────────────────────────────────────────────
// 經典文脈 ClassicFlow — 資料存取器
// ─────────────────────────────────────────────────
import { schools } from './schools'
import { works, chapters, passages, sentences } from './works'
import type { School, Work, Chapter, Passage, Sentence, SchoolId } from '../types/content'

export function getSchools(): School[] {
  return schools
}

export function getWorks(): Work[] {
  return works
}

export function getWorksBySchool(schoolId: SchoolId): Work[] {
  return works.filter(w => w.schoolId === schoolId)
}

export function getChapters(workId: string): Chapter[] {
  return chapters.filter(c => c.workId === workId)
}

export function getChapter(chapterId: string): Chapter | undefined {
  return chapters.find(c => c.id === chapterId)
}

export function getPassagesByChapter(chapterId: string): Passage[] {
  return passages.filter(p => p.chapterId === chapterId)
}

export function getSentencesByPassage(passageId: string): Sentence[] {
  return sentences.filter(s => s.passageId === passageId)
}

export function getAllSentencesByChapter(chapterId: string): Sentence[] {
  const chapterPassages = getPassagesByChapter(chapterId)
  const passageIds = chapterPassages.map(p => p.id)
  return sentences.filter(s => passageIds.includes(s.passageId))
}
`;

fs.writeFileSync(indexPath, indexTsContent, 'utf8');
console.log(`Successfully wrote data index accessor file to ${indexPath}`);
