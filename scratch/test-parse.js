import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourcePath = path.join(__dirname, '../Literature Classic.md');
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
const chunks = [];

function splitSentences(text) {
  const regex = /[^。；！？\r\n]+[。；！？]+/g;
  let matches = text.match(regex);
  if (!matches) {
    return [text.trim()].filter(Boolean);
  }
  return matches.map(m => m.trim()).filter(Boolean);
}

function splitChunks(sentenceText, sentenceId) {
  // Split by sub-punctuation
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

  // Split any chunk that is too long
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
      translationHint: `對應譯文提示（章節：${currentChapter.title}）`,
      tags: [],
    });
    
    chunks.push(...sentenceChunks);
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

  // Stop parsing when reaching references or end section
  if (line.startsWith('# 四、')) {
    flushPassage();
    break;
  }

  // School Level 1 Header
  if (line.startsWith('# ') && !line.startsWith('# 一、道家') && !line.startsWith('# 二、法家') && !line.startsWith('# 三、墨家')) {
    // Other headers, skip or stop
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

  // Work Level 2 Header
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

  // Chapter Level 3 Header
  if (line.startsWith('### ')) {
    flushPassage();
    const title = line.replace('### ', '').trim();
    currentChapterIndex++;
    const chapterId = `${currentWorkId}/ch-${currentChapterIndex}`;
    
    // Check for override
    let genreStrategyOverride = undefined;
    if (currentWorkId === 'mo-zi' && title.includes('公輸')) {
      genreStrategyOverride = 'narrative'; // Override as per Master Plan
    }

    currentChapter = {
      id: chapterId,
      workId: currentWorkId,
      order: currentChapterIndex,
      title,
      genreStrategyOverride,
      difficulty: title.length > 5 ? 3 : 2, // Simple heuristic for difficulty
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

  // Skip comments inside literature markdown
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

console.log("Parsed summary:");
console.log("Works:", works.length, works.map(w => w.id));
console.log("Chapters:", chapters.length);
console.log("Passages:", passages.length);
console.log("Sentences:", sentences.length);
console.log("Chunks:", chunks.length);
