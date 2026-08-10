import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const markdownPath = path.resolve(__dirname, '../Literature Classic.md');
const outDir = path.resolve(__dirname, '../src/data/work_chunks');
const manifestPath = path.resolve(__dirname, '../src/data/workImportManifest.ts');
const catalogPath = path.resolve(__dirname, '../src/data/catalog.ts');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Clean old ts files
for (const entry of fs.readdirSync(outDir)) {
  if (entry.endsWith('.ts')) fs.unlinkSync(path.join(outDir, entry));
}

const markdownText = fs.readFileSync(markdownPath, 'utf-8');

// Helpers
function generateId(prefix, index) {
  return `${prefix}-${String(index).padStart(3, '0')}`;
}

function jsString(value) {
  return JSON.stringify(value)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
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
  return sentenceText.split(/([，、：])/).reduce((acc, part, i) => {
    if (i % 2 === 0) {
      if (part.trim()) acc.push(part.trim());
    } else {
      if (acc.length > 0) acc[acc.length - 1] += part;
    }
    return acc;
  }, []).filter(c => c.trim().length > 0).map((text) => ({
    id: `${sId}-c-${String(cOrder++).padStart(3, '0')}`,
    sentenceId: sId,
    order: cOrder - 1,
    text,
    cue: text[0]
  }));
}

const catalogWorksMap = new Map();
const catalogChapters = [];
let workIndex = 0;

// Parse
const workBlocks = markdownText.split(/(?=^##\s)/m);
for (const wBlock of workBlocks) {
  const wMatch = wBlock.match(/^##\s*(.+)/);
  if (!wMatch) continue;
  
  if (!wMatch[1].match(/^[一二三四五六七八九十]+、/)) continue; // Only process the classics
  
  workIndex++;
  const workTitle = wMatch[1].replace(/^[一二三四五六七八九十]+、/, '').replace('全本', '').replace('選篇', '').trim();
  
  // Mapping titles to readable IDs, school and genre strategy
  const mapping = {
    // 道家 (Daoism)
    '道德經': ['dao-de-jing', 'daoism', 'rhythmic'],
    '莊子': ['zhuangzi', 'daoism', 'parallel'],
    '列子': ['liezi', 'daoism', 'narrative'],
    '文子': ['wenzi', 'daoism', 'rhythmic'],
    '文始真經': ['wenshi-zhenjing', 'daoism', 'rhythmic'],

    // 法家 (Legalism)
    '韓非子': ['han-fei-zi', 'legalism', 'argumentative'],
    '商君書': ['shang-jun-shu', 'legalism', 'argumentative'],
    '申不害': ['shen-bu-hai', 'legalism', 'argumentative'],
    '慎子': ['shenzi', 'legalism', 'argumentative'],
    '諫逐客書': ['jian-zhu-ke-shu', 'legalism', 'argumentative'],
    '管子': ['guanzi', 'legalism', 'argumentative'],

    // 墨家 (Mohism)
    '墨子': ['mo-zi', 'mohism', 'parallel'],

    // 兵家 (Military)
    '孫子兵法': ['art-of-war', 'military', 'parallel'],
    '吳子': ['wu-zi', 'military', 'parallel'],
    '司馬法': ['si-ma-fa', 'military', 'parallel'],
    '三略': ['three-strategies', 'military', 'parallel'],
    '尉繚子': ['wei-liao-zi', 'military', 'parallel'],
    '六韜': ['liu-tao', 'military', 'parallel'],

    // 史書 (Histories)
    '史記': ['shiji', 'histories', 'parallel'],
    '春秋左傳': ['chun-qiu-zuo-zhuan', 'histories', 'parallel'],
    '戰國策': ['zhan-guo-ce', 'histories', 'parallel'],
    '鹽鐵論': ['yan-tie-lun', 'histories', 'parallel'],
    '燕丹子': ['yandanzi', 'histories', 'parallel'],
    '西京雜記': ['xijing-zaji', 'histories', 'parallel'],
    '逸周書': ['lost-book-of-zhou', 'histories', 'parallel'],
    '國語': ['guo-yu', 'histories', 'parallel'],
    '晏子春秋': ['yanzi-chun-qiu', 'histories', 'narrative'],
    '吳越春秋': ['wu-yue-chun-qiu', 'histories', 'parallel'],
    '越絕書': ['yue-jue-shu', 'histories', 'parallel'],
    '列女傳': ['lie-nv-zhuan', 'histories', 'parallel'],
    '春秋穀梁傳': ['guliang-zhuan', 'histories', 'parallel'],
    '春秋公羊傳': ['gongyang-zhuan', 'histories', 'parallel'],
    '穀梁傳': ['guliang-zhuan', 'histories', 'parallel'],
    '公羊傳': ['gongyang-zhuan', 'histories', 'parallel'],
    '漢書': ['han-shu', 'histories', 'parallel'],
    '後漢書': ['hou-han-shu', 'histories', 'parallel'],
    '前漢紀': ['qian-han-ji', 'histories', 'parallel'],
    '東觀漢記': ['dong-guan-han-ji', 'histories', 'parallel'],
    '竹書紀年': ['zhushu-jinian', 'histories', 'parallel'],
    '穆天子傳': ['mutianzi-zhuan', 'histories', 'parallel'],
    '古三墳': ['gu-san-fen', 'histories', 'parallel'],

    // 儒家 (Confucianism)
    '論語': ['lun-yu', 'confucianism', 'rhythmic'],
    '孟子': ['meng-zi', 'confucianism', 'argumentative'],
    '荀子': ['xunzi', 'confucianism', 'argumentative'],
    '大學': ['da-xue', 'confucianism', 'argumentative'],
    '中庸': ['zhong-yong', 'confucianism', 'argumentative'],
    '禮記': ['li-ji', 'confucianism', 'argumentative'],
    '詩經': ['shi-jing', 'confucianism', 'parallel'],
    '尚書': ['shu-jing', 'confucianism', 'narrative'],
    '易經': ['yi-jing', 'confucianism', 'parallel'],
    '春秋': ['chun-qiu', 'confucianism', 'narrative'],

    // 文學 (Literature)
    '古文觀止': ['gu-wen-guan-zhi', 'literature', 'parallel'],
    '菜根譚': ['cai-gen-tan', 'literature', 'rhythmic']
  };

  const subtitles = {
    'dao-de-jing': '老子',
    'zhuangzi': '南華真經',
    'liezi': '沖虛至德真經',
    'shang-jun-shu': '商鞅及其後學',
    'mo-zi': '墨翟及墨家後學',
    'art-of-war': '孫武',
    'wu-zi': '吳子兵法',
    'three-strategies': '黃石公三略',
    'liu-tao': '太公兵法',
    'zhan-guo-ce': '劉向編定',
    'xunzi': '荀況著',
    'cai-gen-tan': '洪應明',
    'yanzi-chun-qiu': '晏嬰'
  };

  let workId = generateId('work', workIndex);
  let schoolId = 'literature';
  let genreStrategy = 'narrative';

  for (const [key, val] of Object.entries(mapping).sort((a, b) => b[0].length - a[0].length)) {
    if (workTitle.includes(key)) {
      workId = val[0];
      schoolId = val[1];
      genreStrategy = val[2];
      break;
    }
  }

  let bundle = catalogWorksMap.get(workId);
  if (!bundle) {
    bundle = {
      work: {
        id: workId,
        schoolId,
        title: workTitle,
        ...(subtitles[workId] ? { subtitle: subtitles[workId] } : {}),
        genreStrategy,
        sourceNote: 'Processed via new ETL pipeline',
        chapterIds: [],
        totalChars: 0
      },
      chapters: [],
      passages: [],
      sentences: []
    };
    catalogWorksMap.set(workId, bundle);
  }
  const work = bundle.work;
  
  const chapterBlocks = wBlock.split(/(?=^###\s)/m);
  let chapterIndex = bundle.chapters.length;
  
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
      difficulty: chapterTitle.length > 5 ? 3 : 2,
      estimatedMinutes: 5,
      passageIds: [],
      tags: []
    };
    
    // Parse the new markdown tags
    const yuanwenMatch = cBlock.match(/【(?:原文|經文)】\s*([\s\S]*?)(?=\n【|$)/);
    const baihuawenMatch = cBlock.match(/【白話文】\s*([\s\S]*?)(?=\n【|$)/);
    const jiexiMatch = cBlock.match(/【解析】\s*([\s\S]*?)(?=\n【|$)/);
    
    if (yuanwenMatch) {
      const canonicalText = yuanwenMatch[1].replace(/[\r\n]+/g, '').trim();
      const translation = baihuawenMatch ? baihuawenMatch[1].trim() : '(待擴充)';
      const analysis = jiexiMatch ? jiexiMatch[1].trim() : '(待擴充)';
      
      work.totalChars += canonicalText.replace(/\s/g, '').length;
      
      const passageId = `${chapterId}-p-01`;
      chapter.passageIds.push(passageId);
      
      const passage = {
        id: passageId,
        chapterId,
        order: 1,
        canonicalText,
        sentenceIds: [],
        sourceRefs: [{ label: "通行本", edition: "Antigravity Corpus" }],
        readingAid: { translation, analysis }
      };
      
      const sentenceTexts = splitSentences(canonicalText);
      let sOrder = 1;
      
      for (const sText of sentenceTexts) {
        const sentenceId = `${passageId}-s-${String(sOrder).padStart(3, '0')}`;
        passage.sentenceIds.push(sentenceId);
        
        const chunks = splitChunks(sText, sentenceId);
        
        bundle.sentences.push({
          id: sentenceId,
          passageId,
          order: sOrder,
          canonicalText: sText,
          chunks,
          tags: []
        });
        
        sOrder++;
      }
      bundle.passages.push(passage);
    }
    bundle.chapters.push(chapter);
    catalogChapters.push(chapter);
  }
}

const catalogWorks = [];
for (const bundle of catalogWorksMap.values()) {
  if (bundle.chapters.length > 0) {
    catalogWorks.push(bundle.work);
    const content = `import type { WorkBundle } from '../workLoader'\n\nexport default JSON.parse('${jsString(bundle)}') as WorkBundle\n`;
    fs.writeFileSync(path.join(outDir, `${bundle.work.id}.ts`), content, 'utf8');
  }
}

// Generate Manifest
const loaderEntries = catalogWorks
  .map(work => `  '${work.id}': () => import('./work_chunks/${work.id}'),`)
  .join('\n');
const manifest = `// Generated by scripts/compile_database.mjs\nexport const workImports = {\n${loaderEntries}\n} as const\n`;
fs.writeFileSync(manifestPath, manifest, 'utf8');

// Generate Catalog
const catalogContent = `// Generated by scripts/compile_database.mjs
import type { Work, Chapter } from '../types/content'

export const catalogWorks = JSON.parse('${jsString(catalogWorks)}') as Work[]
export const catalogChapters = JSON.parse('${jsString(catalogChapters)}') as Chapter[]
`;
fs.writeFileSync(catalogPath, catalogContent, 'utf8');

console.log(`Successfully compiled ${catalogWorks.length} works and ${catalogChapters.length} chapters.`);
