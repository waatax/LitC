import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const markdownPath = path.resolve(__dirname, '../Literature Classic.md');
const outputPath = path.resolve(__dirname, '../public/content.json');

const markdownText = fs.readFileSync(markdownPath, 'utf-8');

// Data arrays
const works = [];
const chapters = [];
const passages = [];

// Helpers
function generateId(prefix, index) {
  return `${prefix}-${String(index).padStart(3, '0')}`;
}

function splitSentences(text) {
  return text.split(/([。！？；])/).reduce((acc, part, i) => {
    if (i % 2 === 0) {
      if (part.trim()) acc.push(part.trim());
    } else {
      if (acc.length > 0) acc[acc.length - 1] += part;
    }
    return acc;
  }, []).filter(s => s.trim().length > 0);
}

function splitChunks(sentenceText, sId) {
  let cOrder = 1;
  return sentenceText.split(/([，、])/).reduce((acc, part, i) => {
    if (i % 2 === 0) {
      if (part.trim()) acc.push(part.trim());
    } else {
      if (acc.length > 0) acc[acc.length - 1] += part;
    }
    return acc;
  }, []).filter(c => c.trim().length > 0).map((text) => ({
    id: `${sId}-c-${String(cOrder++).padStart(3, '0')}`,
    sentenceId: sId,
    order: cOrder,
    text,
    cue: text[0]
  }));
}

function parseMarkdown() {
  const workBlocks = markdownText.split(/(?=^##\s)/m);
  let workIndex = 0;
  
  for (const wBlock of workBlocks) {
    const wMatch = wBlock.match(/^##\s*(.+)/);
    if (!wMatch) continue;
    
    if (!wMatch[1].match(/^[一二三四五六七八九十]+、/)) continue;
    
    workIndex++;
    const workId = generateId('work', workIndex);
    const workTitle = wMatch[1].replace(/^[一二三四五六七八九十]+、/, '').trim();
    
    let genreStrategy = 'narrative';
    let schoolId = 'literature';
    
    if (workTitle.includes('道德經')) { genreStrategy = 'rhythmic'; schoolId = 'daoism'; }
    if (workTitle.includes('莊子')) { genreStrategy = 'narrative'; schoolId = 'daoism'; }
    if (workTitle.includes('韓非子') || workTitle.includes('商君書')) { genreStrategy = 'argumentative'; schoolId = 'legalism'; }
    if (workTitle.includes('墨子')) { genreStrategy = 'parallel'; schoolId = 'mohism'; }
    
    const work = {
      id: workId,
      schoolId,
      title: workTitle,
      genreStrategy,
      sourceNote: 'Parsed from Literature Classic.md',
      chapterIds: [],
      totalChars: 0
    };
    works.push(work);
    
    const chapterBlocks = wBlock.split(/(?=^###\s)/m);
    let chapterIndex = 0;
    
    for (const cBlock of chapterBlocks) {
      const cMatch = cBlock.match(/^###\s*(.+)/);
      if (!cMatch) continue;
      
      chapterIndex++;
      const chapterId = `${workId}-ch-${String(chapterIndex).padStart(3, '0')}`;
      const chapterTitle = cMatch[1].trim();
      
      work.chapterIds.push(chapterId);
      
      const chapter = {
        id: chapterId,
        workId,
        order: chapterIndex,
        title: chapterTitle,
        difficulty: 3,
        estimatedMinutes: 5,
        passageIds: [],
        tags: []
      };
      chapters.push(chapter);
      
      const yuanwenMatch = cBlock.match(/【(?:原文|經文)】\s*([\s\S]*?)(?=\n【|$)/);
      const baihuawenMatch = cBlock.match(/【白話文】\s*([\s\S]*?)(?=\n【|$)/);
      const jiexiMatch = cBlock.match(/【解析】\s*([\s\S]*?)(?=\n【|$)/);
      
      if (yuanwenMatch) {
        const canonicalText = yuanwenMatch[1].trim();
        const translation = baihuawenMatch ? baihuawenMatch[1].trim() : '';
        const analysis = jiexiMatch ? jiexiMatch[1].trim() : '';
        
        work.totalChars += canonicalText.replace(/\s/g, '').length;
        
        const passageId = `${chapterId}-p-01`;
        chapter.passageIds.push(passageId);
        
        const passage = {
          id: passageId,
          chapterId,
          order: 1,
          canonicalText,
          sentenceIds: [],
          sourceRefs: [],
          readingAid: {
            translation,
            analysis
          }
        };
        
        // Split passage into sentences
        const sentenceTexts = splitSentences(canonicalText);
        let sOrder = 1;
        // Sentences are embedded in Passage for some reason or they are separate?
        // In the original types: Sentence is separate table or what?
        // Wait, the UI loads chapter, passage, sentence from Dexie.
        // I will just put sentences inside passage as a separate array for the JSON, and Dexie can import it.
        // Wait, the types say `passage` has `sentenceIds`. So `sentences` must be a separate array in JSON.
      }
    }
  }
}

// ... wait, instead of rewriting the parser to match Dexie, I should just check how the UI actually imports data in `src/stores` or `src/data`
