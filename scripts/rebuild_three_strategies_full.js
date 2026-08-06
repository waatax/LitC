import fs from 'fs';

function splitSentences(text) {
  const parts = text.match(/[^。！？；\n]+[。！？；]?/g)?.map(s => s.trim()).filter(Boolean) ?? [];
  return parts.length ? parts : [text];
}

const wikiText = fs.readFileSync('scratch/san_lue_wiki.txt', 'utf8');
const lines = wikiText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

const rawChapters = [
  { title: '上略', text: [] },
  { title: '中略', text: [] },
  { title: '下略', text: [] }
];

let currentChapter = 0;
for (const line of lines) {
  if (line === '中略') { currentChapter = 1; continue; }
  if (line === '下略') { currentChapter = 2; continue; }
  if (line.includes('此秦朝作品在全世界都属于公有领域')) continue;
  if (line.includes('检索自')) break;
  
  if (line.length > 5) {
    rawChapters[currentChapter].text.push(line);
  }
}

const workId = 'three-strategies';
const workBundle = {
  work: {
    id: workId,
    schoolId: 'military',
    title: '三略',
    genreStrategy: 'parallel',
    sourceNote: '版本來源自通行本及校勘附記。',
    chapterIds: [],
    totalChars: 0
  },
  chapters: [],
  passages: [],
  sentences: []
};

let totalChars = 0;

for (const [chIndex, chData] of rawChapters.entries()) {
  const chapterId = `${workId}_ch-${chIndex + 1}`;
  workBundle.work.chapterIds.push(chapterId);
  
  const passageIds = [];
  
  for (const [pIndex, paragraphText] of chData.text.entries()) {
    const passageId = `${chapterId}_p-${pIndex + 1}`;
    passageIds.push(passageId);
    
    const sentenceIds = [];
    const sents = splitSentences(paragraphText);
    for (const [sIndex, sText] of sents.entries()) {
      const sentenceId = `${passageId}_s-${sIndex + 1}`;
      sentenceIds.push(sentenceId);
      
      workBundle.sentences.push({
        id: sentenceId,
        passageId,
        order: sIndex + 1,
        canonicalText: sText,
        cue: sText[0],
        chunks: [{ id: `${sentenceId}_c-1`, sentenceId, order: 1, text: sText, cue: sText[0] }]
      });
    }
    
    totalChars += paragraphText.length;
    
    workBundle.passages.push({
      id: passageId,
      chapterId,
      order: pIndex + 1,
      canonicalText: paragraphText,
      sentenceIds,
      sourceRefs: [
        { label: '經文底本', edition: '《武經七書》本《黃石公三略》' }
      ]
    });
  }
  
  workBundle.chapters.push({
    id: chapterId,
    workId,
    order: chIndex + 1,
    title: chData.title,
    difficulty: 4,
    estimatedMinutes: 10,
    passageIds,
    tags: ['兵家', '三略']
  });
}

workBundle.work.totalChars = totalChars;

const tsCode = `import type { WorkBundle } from '../workLoader'\n\nexport default JSON.parse('${JSON.stringify(workBundle).replace(/'/g, "\\'")}') as WorkBundle\n`;

fs.writeFileSync('src/data/work_chunks/three-strategies.ts', tsCode, 'utf8');
console.log('Successfully rebuilt three-strategies.ts with ' + workBundle.passages.length + ' passages.');
