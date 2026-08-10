import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { WORK_DESCRIPTIONS } from '../src/data/workDescriptions';
import type { Work, Chapter, Passage, Sentence } from '../src/types/content';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type QuestionType = 'fill-in-blank' | 'word-meaning' | 'analysis' | 'background' | 'translation';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  workId: string;
  chapterId: string;
  passageId: string;
}

// Placeholder blacklist
const PLACEHOLDER_PATTERNS = [
  /本段經文記載古代典籍中的重要思想論述與歷史事件/,
  /這是一段來自/,
  /展現先秦至漢代思想家的深刻智慧/,
  /本段記述歷史風雲人物事跡/,
  /史實記載：/,
  /段落編號：/,
  /【深度校正版翻譯】這是一段經過虛擬國學大師重新校訂/,
  /本段典籍核心大意在於闡述現代維度的價值理念/,
  /古漢語核心意象與經典表達/,
  /在《.*?》的典章論述中，指出上古時期的聖賢君王恪守禮法/,
  /^\(待擴充\)$/,
  /^此句釋義提示/
];

function isCleanText(text?: string): boolean {
  if (!text || text.trim().length < 10) return false;
  for (const pattern of PLACEHOLDER_PATTERNS) {
    if (pattern.test(text)) return false;
  }
  return true;
}

// 1. Load all work chunks
const workChunksDir = path.resolve(__dirname, '../src/data/work_chunks');
const allWorks: Work[] = [];
const allChapters: Chapter[] = [];
const allPassages: Passage[] = [];
const allSentences: Sentence[] = [];

const chunkFiles = fs.readdirSync(workChunksDir).filter(f => f.endsWith('.ts'));

for (const file of chunkFiles) {
  const filePath = path.join(workChunksDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const match = content.match(/export default JSON\.parse\('(.*?)'\)/);
  if (!match) continue;

  const jsonStr = match[1]
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, '\\')
    .replace(/\\u2028/g, '\u2028')
    .replace(/\\u2029/g, '\u2029');

  try {
    const bundle = JSON.parse(jsonStr);
    if (bundle.work) allWorks.push(bundle.work);
    if (bundle.chapters) allChapters.push(...bundle.chapters);
    if (bundle.passages) allPassages.push(...bundle.passages);
    if (bundle.sentences) allSentences.push(...bundle.sentences);
  } catch (err) {
    console.error(`Failed to parse chunk ${file}:`, err);
  }
}

console.log(`Loaded ${allWorks.length} works, ${allChapters.length} chapters, ${allPassages.length} passages, ${allSentences.length} sentences.`);

const quizBank: QuizQuestion[] = [];
let idCounter = 1;

function shuffleOptions(opts: string[], correct: string): { options: string[], correctIndex: number } {
  // Ensure options are strictly unique
  const uniqueOpts = Array.from(new Set(opts));
  if (uniqueOpts.length < 4) {
    throw new Error(`Options set has fewer than 4 unique items: ${JSON.stringify(opts)}`);
  }
  const all = [...uniqueOpts].slice(0, 4);
  // Fisher-Yates shuffle
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return {
    options: all,
    correctIndex: all.indexOf(correct)
  };
}

// 1. Fill-in-the-blank questions
function generateType1() {
  const PARTICLES = ['之', '乎', '者', '也', '矣', '焉', '哉', '其', '於', '以', '而', '則', '乃', '與', '為'];
  const targetSentences = allSentences.filter(s => s.canonicalText.length >= 8 && s.canonicalText.length <= 45);

  let count = 0;
  let attempts = 0;
  while (count < 200 && attempts < 5000) {
    attempts++;
    const s = targetSentences[Math.floor(Math.random() * targetSentences.length)];
    const text = s.canonicalText;

    const foundParticles: { char: string; index: number }[] = [];
    for (let i = 0; i < text.length; i++) {
      if (PARTICLES.includes(text[i])) {
        foundParticles.push({ char: text[i], index: i });
      }
    }
    if (foundParticles.length === 0) continue;

    const target = foundParticles[Math.floor(Math.random() * foundParticles.length)];
    const correctWord = target.char;
    const maskedText = text.substring(0, target.index) + '___' + text.substring(target.index + 1);

    const distractors = new Set<string>();
    let distAttempts = 0;
    while (distractors.size < 3 && distAttempts < 50) {
      const p = PARTICLES[Math.floor(Math.random() * PARTICLES.length)];
      if (p !== correctWord) {
        distractors.add(p);
      }
      distAttempts++;
    }
    if (distractors.size < 3) continue;

    const { options, correctIndex } = shuffleOptions([correctWord, ...Array.from(distractors)], correctWord);
    const p = allPassages.find(p => p.id === s.passageId);
    const translation = p?.readingAid?.translation;
    const cleanTrans = isCleanText(translation) ? translation : undefined;

    let explanation = `原句為：「${text}」。\n「${correctWord}」在此處為常見的文言虛詞用法。`;
    if (cleanTrans) {
      explanation += `\n白話文釋義參考：${cleanTrans}`;
    }

    const workId = p?.chapterId.split('-ch-')[0].split('_ch-')[0] || '';

    quizBank.push({
      id: `q-${idCounter++}`,
      type: 'fill-in-blank',
      question: `請填寫古文中的缺漏字：\n「${maskedText}」`,
      options,
      correctAnswer: correctIndex,
      explanation,
      workId,
      chapterId: p?.chapterId || '',
      passageId: s.passageId
    });
    count++;
  }
}

// 2. Word-meaning questions
function generateType2() {
  const CORE_WORDS = [
    '仁', '義', '道', '德', '法', '禮', '善', '惡', '知', '行', '信',
    '聖', '賢', '智', '忠', '孝', '言', '心', '天', '命', '勢', '術',
    '志', '誠', '和', '政', '君', '臣', '民'
  ];
  const targetSentences = allSentences.filter(s => s.canonicalText.length >= 8 && s.canonicalText.length <= 45);

  let count = 0;
  let attempts = 0;
  while (count < 200 && attempts < 5000) {
    attempts++;
    const s = targetSentences[Math.floor(Math.random() * targetSentences.length)];
    const text = s.canonicalText;

    const foundWords: { char: string; index: number }[] = [];
    for (let i = 0; i < text.length; i++) {
      if (CORE_WORDS.includes(text[i])) {
        foundWords.push({ char: text[i], index: i });
      }
    }
    if (foundWords.length === 0) continue;

    const target = foundWords[Math.floor(Math.random() * foundWords.length)];
    const correctWord = target.char;
    const maskedText = text.substring(0, target.index) + '___' + text.substring(target.index + 1);

    const distractors = new Set<string>();
    let distAttempts = 0;
    while (distractors.size < 3 && distAttempts < 50) {
      const w = CORE_WORDS[Math.floor(Math.random() * CORE_WORDS.length)];
      if (w !== correctWord) {
        distractors.add(w);
      }
      distAttempts++;
    }
    if (distractors.size < 3) continue;

    const { options, correctIndex } = shuffleOptions([correctWord, ...Array.from(distractors)], correctWord);
    const p = allPassages.find(p => p.id === s.passageId);
    const translation = p?.readingAid?.translation;
    const cleanTrans = isCleanText(translation) ? translation : undefined;

    let explanation = `原句為：「${text}」。\n「${correctWord}」為此處的關鍵實詞，體現了古代文言語意的核心意涵。`;
    if (cleanTrans) {
      explanation += `\n白話文釋義參考：${cleanTrans}`;
    }

    const workId = p?.chapterId.split('-ch-')[0].split('_ch-')[0] || '';

    quizBank.push({
      id: `q-${idCounter++}`,
      type: 'word-meaning',
      question: `請填寫這段古文中最符合文意的實詞：\n「${maskedText}」`,
      options,
      correctAnswer: correctIndex,
      explanation,
      workId,
      chapterId: p?.chapterId || '',
      passageId: s.passageId
    });
    count++;
  }
}

// 3. Translation questions
function generateType5() {
  // Only select passages with clean translations
  const eligiblePassages = allPassages.filter(p => isCleanText(p.readingAid?.translation));
  console.log(`Eligible passages for translation quiz: ${eligiblePassages.length}`);

  let count = 0;
  let attempts = 0;
  while (count < 200 && attempts < 5000) {
    attempts++;
    const p = eligiblePassages[Math.floor(Math.random() * eligiblePassages.length)];
    const correctTrans = p.readingAid!.translation.trim();
    if (correctTrans.length < 15) continue;

    const workId = p.chapterId.split('-ch-')[0].split('_ch-')[0];
    const sameSchoolWorks = allWorks.filter(w => w.schoolId === allWorks.find(x => x.id === workId)?.schoolId).map(w => w.id);

    const distractors = new Set<string>();
    let distAttempts = 0;
    while (distractors.size < 3 && distAttempts < 100) {
      distAttempts++;
      let candidate: Passage | undefined;
      if (distAttempts < 30) {
        // Try same school
        const schoolPassages = eligiblePassages.filter(ep => ep.id !== p.id && sameSchoolWorks.some(sw => ep.chapterId.startsWith(sw)));
        if (schoolPassages.length > 0) {
          candidate = schoolPassages[Math.floor(Math.random() * schoolPassages.length)];
        }
      }
      if (!candidate) {
        candidate = eligiblePassages[Math.floor(Math.random() * eligiblePassages.length)];
      }

      if (candidate && candidate.id !== p.id && candidate.readingAid?.translation) {
        const dTrans = candidate.readingAid.translation.trim();
        if (dTrans !== correctTrans && dTrans.length >= 15 && !distractors.has(dTrans)) {
          distractors.add(dTrans);
        }
      }
    }

    if (distractors.size < 3) continue;

    const { options, correctIndex } = shuffleOptions([correctTrans, ...Array.from(distractors)], correctTrans);

    quizBank.push({
      id: `q-${idCounter++}`,
      type: 'translation',
      question: `請問以下古文的正確白話文釋義為何？\n「${p.canonicalText.substring(0, 60)}${p.canonicalText.length > 60 ? '...' : ''}」`,
      options,
      correctAnswer: correctIndex,
      explanation: isCleanText(p.readingAid?.analysis) ? p.readingAid!.analysis : `正確翻譯如選項所示：「${correctTrans}」。`,
      workId,
      chapterId: p.chapterId,
      passageId: p.id
    });
    count++;
  }
}

// 4. Analysis questions
function generateType3() {
  const eligiblePassages = allPassages.filter(p => isCleanText(p.readingAid?.analysis));
  console.log(`Eligible passages for analysis quiz: ${eligiblePassages.length}`);

  let count = 0;
  let attempts = 0;
  while (count < 150 && attempts < 5000) {
    attempts++;
    const p = eligiblePassages[Math.floor(Math.random() * eligiblePassages.length)];
    const fullAnalysis = p.readingAid!.analysis.trim();
    
    // Extract first coherent analysis paragraph
    let cleanAnalysis = fullAnalysis.split('\n')[0].replace(/【.*?】/g, '').trim();
    if (cleanAnalysis.length < 15) {
      const parts = fullAnalysis.split('\n').map(x => x.replace(/【.*?】/g, '').trim()).filter(x => x.length >= 15);
      if (parts.length > 0) cleanAnalysis = parts[0];
      else continue;
    }

    const distractors = new Set<string>();
    let distAttempts = 0;
    while (distractors.size < 3 && distAttempts < 100) {
      distAttempts++;
      const candidate = eligiblePassages[Math.floor(Math.random() * eligiblePassages.length)];
      if (candidate && candidate.id !== p.id && candidate.readingAid?.analysis) {
        let dAnalysis = candidate.readingAid.analysis.split('\n')[0].replace(/【.*?】/g, '').trim();
        if (dAnalysis.length < 15) {
          const parts = candidate.readingAid.analysis.split('\n').map(x => x.replace(/【.*?】/g, '').trim()).filter(x => x.length >= 15);
          if (parts.length > 0) dAnalysis = parts[0];
        }
        if (dAnalysis && dAnalysis !== cleanAnalysis && !distractors.has(dAnalysis)) {
          distractors.add(dAnalysis);
        }
      }
    }

    if (distractors.size < 3) continue;

    const { options, correctIndex } = shuffleOptions([cleanAnalysis, ...Array.from(distractors)], cleanAnalysis);
    const workId = p.chapterId.split('-ch-')[0].split('_ch-')[0];

    quizBank.push({
      id: `q-${idCounter++}`,
      type: 'analysis',
      question: `針對以下段落，何者是最符合其思想或章旨的解析？\n「${p.canonicalText.substring(0, 60)}${p.canonicalText.length > 60 ? '...' : ''}」`,
      options,
      correctAnswer: correctIndex,
      explanation: fullAnalysis,
      workId,
      chapterId: p.chapterId,
      passageId: p.id
    });
    count++;
  }
}

// 5. Background questions
function generateType4() {
  const eligibleWorks = allWorks.filter(w => WORK_DESCRIPTIONS[w.id] && WORK_DESCRIPTIONS[w.id].author && WORK_DESCRIPTIONS[w.id].author !== '不詳');

  let count = 0;
  let attempts = 0;
  while (count < 150 && attempts < 5000) {
    attempts++;
    const work = eligibleWorks[Math.floor(Math.random() * eligibleWorks.length)];
    const desc = WORK_DESCRIPTIONS[work.id];
    if (!desc) continue;

    const isAuthorQ = Math.random() > 0.5;
    let correct = '';
    const distractors = new Set<string>();
    let question = '';

    if (isAuthorQ) {
      correct = desc.author;
      question = `《${work.title.replace(/[《》]/g, '')}》的作者或主要輯錄者是誰？`;
      let distAttempts = 0;
      while (distractors.size < 3 && distAttempts < 50) {
        distAttempts++;
        const rw = eligibleWorks[Math.floor(Math.random() * eligibleWorks.length)];
        const rwDesc = WORK_DESCRIPTIONS[rw.id];
        if (rwDesc && rwDesc.author && rwDesc.author !== correct && rwDesc.author !== '不詳' && !distractors.has(rwDesc.author)) {
          distractors.add(rwDesc.author);
        }
      }
    } else {
      correct = desc.period;
      question = `《${work.title.replace(/[《》]/g, '')}》的主要成書時代為何？`;
      let distAttempts = 0;
      while (distractors.size < 3 && distAttempts < 50) {
        distAttempts++;
        const rw = eligibleWorks[Math.floor(Math.random() * eligibleWorks.length)];
        const rwDesc = WORK_DESCRIPTIONS[rw.id];
        if (rwDesc && rwDesc.period && rwDesc.period !== correct && rwDesc.period !== '不詳' && !distractors.has(rwDesc.period)) {
          distractors.add(rwDesc.period);
        }
      }
    }

    if (distractors.size < 3) continue;

    const { options, correctIndex } = shuffleOptions([correct, ...Array.from(distractors)], correct);

    quizBank.push({
      id: `q-${idCounter++}`,
      type: 'background',
      question,
      options,
      correctAnswer: correctIndex,
      explanation: desc.introduction ? desc.introduction.substring(0, 250) + '...' : `《${work.title}》為古代重要經典文獻。`,
      workId: work.id,
      chapterId: work.chapterIds[0] || '',
      passageId: ''
    });
    count++;
  }
}

// Execution and Validation Gate
async function run() {
  console.log("Generating Quiz Bank...");
  generateType1(); // 200
  generateType2(); // 200
  generateType5(); // 200
  generateType3(); // 150
  generateType4(); // 150

  console.log(`Generated ${quizBank.length} questions.`);

  // Strict Validation Gate
  let errorCount = 0;
  for (const q of quizBank) {
    if (q.options.length !== 4) {
      console.error(`Question ${q.id} has ${q.options.length} options!`);
      errorCount++;
    }
    const uniqueOptions = new Set(q.options);
    if (uniqueOptions.size !== 4) {
      console.error(`Question ${q.id} has duplicate options:`, q.options);
      errorCount++;
    }
    if (q.correctAnswer < 0 || q.correctAnswer >= 4) {
      console.error(`Question ${q.id} invalid correct answer: ${q.correctAnswer}`);
      errorCount++;
    }
    for (const opt of q.options) {
      if (!isCleanText(opt) && q.type === 'translation') {
        console.error(`Question ${q.id} option contains placeholder text:`, opt);
        errorCount++;
      }
    }
  }

  if (errorCount > 0) {
    throw new Error(`Quiz Bank validation failed with ${errorCount} errors!`);
  }

  console.log("✅ All questions passed strict 4-unique-options and quality validation gate!");

  const content = `// Auto-generated Quiz Bank
export type QuestionType = 'fill-in-blank' | 'word-meaning' | 'analysis' | 'background' | 'translation';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  workId: string;
  chapterId: string;
  passageId: string;
}

export const quizBank: QuizQuestion[] = ${JSON.stringify(quizBank, null, 2)};
`;

  fs.writeFileSync('src/data/quiz_bank.ts', content, 'utf8');
  console.log("Saved to src/data/quiz_bank.ts successfully!");
}

run();
