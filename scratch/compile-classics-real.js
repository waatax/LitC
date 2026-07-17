import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const worksPath = path.join(__dirname, '../src/data/works.ts');

import { works, chapters, passages, sentences } from '../src/data/works.ts';

const cacheDir = 'C:/Users/User/.gemini/antigravity/brain/94415241-e907-4a0d-ab2d-2708f581a7e2/scratch/ctext_cache';

const lunyuChapters = [
  { slug: 'xue-er-di-yi', name: '學而第一' },
  { slug: 'wei-zheng-di-er', name: '為政第二' },
  { slug: 'ba-yi-di-san', name: '八佾第三' },
  { slug: 'li-ren-di-si', name: '里仁第四' },
  { slug: 'gong-ye-chang-di-wu', name: '公冶長第五' },
  { slug: 'yong-ye-di-liu', name: '雍也第六' },
  { slug: 'shu-er-di-qi', name: '述而第七' },
  { slug: 'tai-bo-di-ba', name: '泰伯第八' },
  { slug: 'zi-han-di-jiu', name: '子罕第九' },
  { slug: 'xiang-dang-di-shi', name: '鄉黨第十' },
  { slug: 'xian-jin-di-shi-yi', name: '先進第十一' },
  { slug: 'yan-yuan-di-shi-er', name: '顏淵第十二' },
  { slug: 'zi-lu-di-shi-san', name: '子路第十三' },
  { slug: 'xian-wen-di-shi-si', name: '憲問第十四' },
  { slug: 'wei-ling-gong-di-shi-wu', name: '衛靈公第十五' },
  { slug: 'ji-shi-di-shi-liu', name: '季氏第十六' },
  { slug: 'yang-huo-di-shi-qi', name: '陽貨第十七' },
  { slug: 'wei-zi-di-shi-ba', name: '微子第十八' },
  { slug: 'zi-zhang-di-shi-jiu', name: '子張第十九' },
  { slug: 'yao-yue-di-er-shi', name: '堯曰第二十' }
];

const mengziChapters = [
  { slug: 'liang-hui-wang-zhang-ju-shang', name: '梁惠王上' },
  { slug: 'liang-hui-wang-zhang-ju-xia', name: '梁惠王下' },
  { slug: 'gong-sun-chou-zhang-ju-shang', name: '公孫丑上' },
  { slug: 'gong-sun-chou-zhang-ju-xia', name: '公孫丑下' },
  { slug: 'teng-wen-gong-zhang-ju-shang', name: '滕文公上' },
  { slug: 'teng-wen-gong-zhang-ju-xia', name: '滕文公下' },
  { slug: 'li-lou-zhang-ju-shang', name: '離婁上' },
  { slug: 'li-lou-zhang-ju-xia', name: '離婁下' },
  { slug: 'wan-zhang-zhang-ju-shang', name: '萬章上' },
  { slug: 'wan-zhang-zhang-ju-xia', name: '萬章下' },
  { slug: 'gao-zi-zhang-ju-shang', name: '告子上' },
  { slug: 'gao-zi-zhang-ju-xia', name: '告子下' },
  { slug: 'jin-xin-zhang-ju-shang', name: '盡心上' },
  { slug: 'jin-xin-zhang-ju-xia', name: '盡心下' }
];

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

const compiledChapters = [];
const compiledPassages = [];
const compiledSentences = [];

// ── 1. PARSE GREAT LEARNING (大學) ──
console.log("Parsing 大學...");
const daxueHtml = fs.readFileSync(path.join(cacheDir, 'daxue.html'), 'utf8');
const daxueRowRegex = /<tr id="n([0-9]+)">[\s\S]*?<td class="ctext">([\s\S]*?)<\/td><\/tr>/g;
const daxueRows = [...daxueHtml.matchAll(daxueRowRegex)];

let daxueChIndex = 1;
let daxuePIndex = 1;
let daxueSIndex = 1;

let currentDaxueChapter = {
  id: `da-xue_ch-${daxueChIndex}`,
  workId: 'da-xue',
  order: daxueChIndex,
  title: daxueChIndex === 1 ? '經一章' : `傳${daxueChIndex - 1}章`,
  difficulty: 2,
  estimatedMinutes: 2,
  passageIds: [],
  tags: []
};

for (const row of daxueRows) {
  const cell = row[2];
  const spans = [...cell.matchAll(/<span class="original">([\s\S]*?)<\/span>/g)].map(m => m[1].replace(/<[^>]*>/g, '').trim());
  
  if (spans.length === 0) continue;
  
  const textContent = spans.join('');
  if (textContent.startsWith('右經一章') || textContent.includes('右傳之')) {
    if (currentDaxueChapter.passageIds.length > 0) {
      compiledChapters.push(currentDaxueChapter);
      daxueChIndex++;
      currentDaxueChapter = {
        id: `da-xue_ch-${daxueChIndex}`,
        workId: 'da-xue',
        order: daxueChIndex,
        title: `傳${daxueChIndex - 1}章`,
        difficulty: 2,
        estimatedMinutes: 2,
        passageIds: [],
        tags: []
      };
    }
    continue;
  }
  
  const passageId = `da-xue_ch-${daxueChIndex}_p-${daxuePIndex}`;
  const passageSentenceIds = [];
  
  for (const span of spans) {
    const sentencesList = span.split(/(?<=[。；！？])/g).map(s => s.trim()).filter(Boolean);
    for (const sText of sentencesList) {
      const sentenceId = `da-xue_ch-${daxueChIndex}_p-${daxuePIndex}_s-${daxueSIndex}`;
      const chunks = chunkSentence(sText, sentenceId);
      
      compiledSentences.push({
        id: sentenceId,
        passageId,
        order: daxueSIndex,
        canonicalText: sText,
        chunks,
        tags: []
      });
      passageSentenceIds.push(sentenceId);
      daxueSIndex++;
    }
  }
  
  if (passageSentenceIds.length > 0) {
    compiledPassages.push({
      id: passageId,
      chapterId: currentDaxueChapter.id,
      order: daxuePIndex,
      canonicalText: spans.join('\n'),
      sentenceIds: passageSentenceIds,
      sourceRefs: []
    });
    currentDaxueChapter.passageIds.push(passageId);
    daxuePIndex++;
  }
}
if (currentDaxueChapter.passageIds.length > 0) {
  compiledChapters.push(currentDaxueChapter);
}

// Update estimated minutes for Daxue chapters
compiledChapters.forEach(c => {
  if (c.workId === 'da-xue') {
    const pIds = c.passageIds;
    const passes = compiledPassages.filter(p => pIds.includes(p.id));
    const chars = passes.map(p => p.canonicalText).join('').replace(/[，。；！？、：\s（）『』「」]/g, '').length;
    c.estimatedMinutes = Math.max(1, Math.ceil(chars / 300));
  }
});

// ── 2. PARSE DOCTRINE OF THE MEAN (中庸) ──
console.log("Parsing 中庸...");
const zyHtml = fs.readFileSync(path.join(cacheDir, 'zhongyong.html'), 'utf8');
const zyRowRegex = /<tr id="n([0-9]+)">[\s\S]*?<td class="ctext">([\s\S]*?)<\/td><\/tr>/g;
const zyRows = [...zyHtml.matchAll(zyRowRegex)];

let zyChIndex = 1;
let zyPIndex = 1;
let zySIndex = 1;

for (const row of zyRows) {
  const cell = row[2];
  const spans = [...cell.matchAll(/<span class="original">([\s\S]*?)<\/span>/g)].map(m => m[1].replace(/<[^>]*>/g, '').trim());
  
  if (spans.length === 0) continue;
  
  const textContent = spans.join('');
  if (textContent.startsWith('右') || textContent.includes('子程子曰')) {
    continue;
  }
  
  const chapterId = `zhong-yong_ch-${zyChIndex}`;
  const passageId = `zhong-yong_ch-${zyChIndex}_p-${zyPIndex}`;
  const passageSentenceIds = [];
  
  for (const span of spans) {
    const sentencesList = span.split(/(?<=[。；！？])/g).map(s => s.trim()).filter(Boolean);
    for (const sText of sentencesList) {
      const sentenceId = `zhong-yong_ch-${zyChIndex}_p-${zyPIndex}_s-${zySIndex}`;
      const chunks = chunkSentence(sText, sentenceId);
      
      compiledSentences.push({
        id: sentenceId,
        passageId,
        order: zySIndex,
        canonicalText: sText,
        chunks,
        tags: []
      });
      passageSentenceIds.push(sentenceId);
      zySIndex++;
    }
  }
  
  if (passageSentenceIds.length > 0) {
    const chars = spans.join('').replace(/[，。；！？、：\s（）『』「」]/g, '').length;
    compiledChapters.push({
      id: chapterId,
      workId: 'zhong-yong',
      order: zyChIndex,
      title: `第${zyChIndex}章`,
      difficulty: 2,
      estimatedMinutes: Math.max(1, Math.ceil(chars / 300)),
      passageIds: [passageId],
      tags: []
    });
    
    compiledPassages.push({
      id: passageId,
      chapterId,
      order: zyPIndex,
      canonicalText: spans.join('\n'),
      sentenceIds: passageSentenceIds,
      sourceRefs: []
    });
    
    zyChIndex++;
    zyPIndex++;
  }
}

// ── 3. PARSE ANALECTS (論語) ──
console.log("Parsing 論語...");
lunyuChapters.forEach((ch, chIdx) => {
  const chNumber = chIdx + 1;
  const filePath = path.join(cacheDir, `lunyu_${ch.slug}.html`);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }
  const html = fs.readFileSync(filePath, 'utf8');
  const rowRegex = /<tr id="n([0-9]+)">[\s\S]*?<td class="ctext">([\s\S]*?)<\/td><\/tr>/g;
  const rows = [...html.matchAll(rowRegex)];
  
  const chapterId = `lun-yu_ch-${chNumber}`;
  const chapterPassageIds = [];
  let pIdx = 1;
  let sIdx = 1;
  let chChars = 0;
  
  for (const row of rows) {
    const cell = row[2];
    const spans = [...cell.matchAll(/<span class="original">([\s\S]*?)<\/span>/g)].map(m => m[1].replace(/<[^>]*>/g, '').trim());
    if (spans.length === 0) continue;
    
    const passageId = `lun-yu_ch-${chNumber}_p-${pIdx}`;
    const passageSentenceIds = [];
    
    for (const span of spans) {
      chChars += span.replace(/[，。；！？、：\s（）『』「」]/g, '').length;
      const sentencesList = span.split(/(?<=[。；！？])/g).map(s => s.trim()).filter(Boolean);
      for (const sText of sentencesList) {
        const sentenceId = `lun-yu_ch-${chNumber}_p-${pIdx}_s-${sIdx}`;
        const chunks = chunkSentence(sText, sentenceId);
        
        compiledSentences.push({
          id: sentenceId,
          passageId,
          order: sIdx,
          canonicalText: sText,
          chunks,
          tags: []
        });
        passageSentenceIds.push(sentenceId);
        sIdx++;
      }
    }
    
    if (passageSentenceIds.length > 0) {
      compiledPassages.push({
        id: passageId,
        chapterId,
        order: pIdx,
        canonicalText: spans.join('\n'),
        sentenceIds: passageSentenceIds,
        sourceRefs: []
      });
      chapterPassageIds.push(passageId);
      pIdx++;
    }
  }
  
  compiledChapters.push({
    id: chapterId,
    workId: 'lun-yu',
    order: chNumber,
    title: ch.name,
    difficulty: 2,
    estimatedMinutes: Math.max(1, Math.ceil(chChars / 300)),
    passageIds: chapterPassageIds,
    tags: []
  });
});

// ── 4. PARSE MENCIUS (孟子) ──
console.log("Parsing 孟子...");
mengziChapters.forEach((ch, chIdx) => {
  const chNumber = chIdx + 1;
  const filePath = path.join(cacheDir, `mengzi_${ch.slug}.html`);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }
  const html = fs.readFileSync(filePath, 'utf8');
  const rowRegex = /<tr id="n([0-9]+)">[\s\S]*?<td class="ctext">([\s\S]*?)<\/td><\/tr>/g;
  const rows = [...html.matchAll(rowRegex)];
  
  const chapterId = `meng-zi_ch-${chNumber}`;
  const chapterPassageIds = [];
  let pIdx = 1;
  let sIdx = 1;
  let chChars = 0;
  
  for (const row of rows) {
    const cell = row[2];
    const spans = [...cell.matchAll(/<span class="original">([\s\S]*?)<\/span>/g)].map(m => m[1].replace(/<[^>]*>/g, '').trim());
    if (spans.length === 0) continue;
    
    const passageId = `meng-zi_ch-${chNumber}_p-${pIdx}`;
    const passageSentenceIds = [];
    
    for (const span of spans) {
      chChars += span.replace(/[，。；！？、：\s（）『』「」]/g, '').length;
      const sentencesList = span.split(/(?<=[。；！？])/g).map(s => s.trim()).filter(Boolean);
      for (const sText of sentencesList) {
        const sentenceId = `meng-zi_ch-${chNumber}_p-${pIdx}_s-${sIdx}`;
        const chunks = chunkSentence(sText, sentenceId);
        
        compiledSentences.push({
          id: sentenceId,
          passageId,
          order: sIdx,
          canonicalText: sText,
          chunks,
          tags: []
        });
        passageSentenceIds.push(sentenceId);
        sIdx++;
      }
    }
    
    if (passageSentenceIds.length > 0) {
      compiledPassages.push({
        id: passageId,
        chapterId,
        order: pIdx,
        canonicalText: spans.join('\n'),
        sentenceIds: passageSentenceIds,
        sourceRefs: []
      });
      chapterPassageIds.push(passageId);
      pIdx++;
    }
  }
  
  compiledChapters.push({
    id: chapterId,
    workId: 'meng-zi',
    order: chNumber,
    title: ch.name,
    difficulty: 3,
    estimatedMinutes: Math.max(1, Math.ceil(chChars / 300)),
    passageIds: chapterPassageIds,
    tags: []
  });
});

// ── 5. MERGE BACK AND UPDATE WORKS.TS ──
console.log("Merging and rebuilding works.ts...");

const targetWorkIds = ['da-xue', 'zhong-yong', 'lun-yu', 'meng-zi'];

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

export const passages = ${JSON.stringify(finalPassages, null, 2)} as any as Passage[];

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
