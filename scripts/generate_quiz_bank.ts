import fs from 'fs';
import path from 'path';

// Since this runs in tsx, we can import directly
import { works, chapters, passages, sentences } from '../src/data/works';
import { PASSAGE_AIDS } from '../src/data/readingAid';
import { WORK_DESCRIPTIONS } from '../src/data/workDescriptions';

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

const quizBank: QuizQuestion[] = [];
let idCounter = 1;

function shuffleOptions(opts: string[], correct: string): { options: string[], correctIndex: number } {
  const all = [...opts];
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

function generateType1() {
  const PARTICLES = ['之', '乎', '者', '也', '矣', '焉', '哉', '其', '於', '以', '而', '則', '乃', '與', '為'];
  const targetSentences = sentences.filter(s => s.canonicalText.length >= 8 && s.canonicalText.length <= 35);
  
  let count = 0;
  // Generate 200 fill-in-the-blank questions
  while (count < 200) {
    const s = targetSentences[Math.floor(Math.random() * targetSentences.length)];
    const text = s.canonicalText;
    
    // Find all particles in the sentence
    const foundParticles = [];
    for (let i = 0; i < text.length; i++) {
      if (PARTICLES.includes(text[i])) {
        foundParticles.push({ char: text[i], index: i });
      }
    }
    
    if (foundParticles.length === 0) continue;
    
    // Pick a random particle to mask
    const target = foundParticles[Math.floor(Math.random() * foundParticles.length)];
    const correctWord = target.char;
    const maskedText = text.substring(0, target.index) + '___' + text.substring(target.index + 1);
    
    const distractors = new Set<string>();
    while (distractors.size < 3) {
      const p = PARTICLES[Math.floor(Math.random() * PARTICLES.length)];
      if (p !== correctWord) {
        distractors.add(p);
      }
    }
    
    const { options, correctIndex } = shuffleOptions([correctWord, ...Array.from(distractors)], correctWord);
    const p = passages.find(p => p.id === s.passageId);
    
    const translation = p ? PASSAGE_AIDS[p.id]?.translation : undefined;
    let explanation = `原句為：「${text}」。\n「${correctWord}」在此處為常見的文言虛詞用法。`;
    if (translation) {
       explanation += `\n整段白話文參考：${translation}`;
    }
    
    quizBank.push({
      id: `q-${idCounter++}`,
      type: 'fill-in-blank',
      question: `請填寫古文中的缺漏字：\n「${maskedText}」`,
      options,
      correctAnswer: correctIndex,
      explanation,
      workId: p?.chapterId.split('_ch-')[0] || '',
      chapterId: p?.chapterId || '',
      passageId: s.passageId
    });
    count++;
  }
}

function generateType2() {
  const CORE_WORDS = ['仁', '義', '道', '德', '法', '禮', '善', '惡', '知', '行', '信', '聖', '賢', '智', '忠', '孝', '言', '心', '天', '命'];
  const targetSentences = sentences.filter(s => s.canonicalText.length >= 8 && s.canonicalText.length <= 35);
  
  let count = 0;
  // Generate 200 word-meaning (substantive words) questions
  let attempts = 0;
  while (count < 200 && attempts < 2000) {
    attempts++;
    const s = targetSentences[Math.floor(Math.random() * targetSentences.length)];
    const text = s.canonicalText;
    
    const foundWords = [];
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
      const p = CORE_WORDS[Math.floor(Math.random() * CORE_WORDS.length)];
      if (p !== correctWord) {
        distractors.add(p);
      }
      distAttempts++;
    }
    if(distractors.size < 3) continue;
    
    const { options, correctIndex } = shuffleOptions([correctWord, ...Array.from(distractors)], correctWord);
    const p = passages.find(p => p.id === s.passageId);
    
    const translation = p ? PASSAGE_AIDS[p.id]?.translation : undefined;
    let explanation = `原句為：「${text}」。\n「${correctWord}」為此處的關鍵實詞。`;
    if (translation) {
       explanation += `\n整段白話文參考：${translation}`;
    }
    
    quizBank.push({
      id: `q-${idCounter++}`,
      type: 'word-meaning',
      question: `請填寫這段古文中最符合文意的實詞：\n「${maskedText}」`,
      options,
      correctAnswer: correctIndex,
      explanation,
      workId: p?.chapterId.split('_ch-')[0] || '',
      chapterId: p?.chapterId || '',
      passageId: s.passageId
    });
    count++;
  }
}

function generateType5() {
  const pIds = Object.keys(PASSAGE_AIDS);
  let count = 0;
  // Generate 200 translation questions
  while(count < 200) {
    const pid = pIds[Math.floor(Math.random() * pIds.length)];
    const p = passages.find(x => x.id === pid);
    if (!p) continue;
    
    const correctTrans = PASSAGE_AIDS[pid].translation;
    if (!correctTrans || correctTrans.length < 15) continue;
    
    const workId = p.chapterId.split('_ch-')[0];
    const sameWorkPassages = passages.filter(x => x.chapterId.startsWith(workId) && x.id !== pid && PASSAGE_AIDS[x.id]?.translation);
    
    // Find school name
    const schoolName = WORK_DESCRIPTIONS[workId]?.schoolName;
    const sameSchoolWorks = Object.keys(WORK_DESCRIPTIONS).filter(id => WORK_DESCRIPTIONS[id].schoolName === schoolName);
    
    const distractors = new Set<string>();
    let attempts = 0;
    while (distractors.size < 3 && attempts < 50) {
      let rpid = '';
      if (sameWorkPassages.length > 3 && attempts < 15) {
        rpid = sameWorkPassages[Math.floor(Math.random() * sameWorkPassages.length)].id;
      } else if (schoolName && sameSchoolWorks.length > 0 && attempts < 30) {
        // Fallback to same school
        const rw = sameSchoolWorks[Math.floor(Math.random() * sameSchoolWorks.length)];
        const schoolPassages = passages.filter(x => x.chapterId.startsWith(rw) && PASSAGE_AIDS[x.id]?.translation);
        if (schoolPassages.length > 0) {
            rpid = schoolPassages[Math.floor(Math.random() * schoolPassages.length)].id;
        } else {
            rpid = pIds[Math.floor(Math.random() * pIds.length)];
        }
      } else {
        rpid = pIds[Math.floor(Math.random() * pIds.length)];
      }
      
      if (rpid !== pid && PASSAGE_AIDS[rpid]?.translation && PASSAGE_AIDS[rpid].translation.length > 10) {
        distractors.add(PASSAGE_AIDS[rpid].translation);
      }
      attempts++;
    }
    
    if (distractors.size < 3) continue;
    
    const { options, correctIndex } = shuffleOptions([correctTrans, ...Array.from(distractors)], correctTrans);
    
    quizBank.push({
      id: `q-${idCounter++}`,
      type: 'translation',
      question: `請問以下古文的正確白話文釋義為何？\n「${p.canonicalText.substring(0, 60)}${p.canonicalText.length > 60 ? '...' : ''}」`,
      options,
      correctAnswer: correctIndex,
      explanation: PASSAGE_AIDS[pid].analysis || "正確翻譯如選項所示。",
      workId: p.chapterId.split('_ch-')[0],
      chapterId: p.chapterId,
      passageId: p.id
    });
    count++;
  }
}

function generateType3() {
  const pIds = Object.keys(PASSAGE_AIDS).filter(id => PASSAGE_AIDS[id].analysis && PASSAGE_AIDS[id].analysis.length > 20);
  let count = 0;
  // Generate 150 analysis questions
  while(count < 150) {
    const pid = pIds[Math.floor(Math.random() * pIds.length)];
    const p = passages.find(x => x.id === pid);
    if (!p) continue;
    
    let correctAnalysis = PASSAGE_AIDS[pid].analysis.split('\\n')[0].replace(/【.*?】/g, '').trim();
    if (correctAnalysis.length < 10) continue;
    
    // Try to get distractors of similar length
    const distractors = new Set<string>();
    let attempts = 0;
    while (distractors.size < 3 && attempts < 50) {
      const rpid = pIds[Math.floor(Math.random() * pIds.length)];
      if (rpid !== pid) {
        let dAnalysis = PASSAGE_AIDS[rpid].analysis.split('\\n')[0].replace(/【.*?】/g, '').trim();
        if (dAnalysis && Math.abs(dAnalysis.length - correctAnalysis.length) < 60) {
           distractors.add(dAnalysis);
        }
      }
      attempts++;
    }
    if (distractors.size < 3) continue;
    
    const { options, correctIndex } = shuffleOptions([correctAnalysis, ...Array.from(distractors)], correctAnalysis);
    
    quizBank.push({
      id: `q-${idCounter++}`,
      type: 'analysis',
      question: `針對以下段落，何者是最符合其思想或章旨的解析？\n「${p.canonicalText.substring(0, 60)}${p.canonicalText.length > 60 ? '...' : ''}」`,
      options,
      correctAnswer: correctIndex,
      explanation: PASSAGE_AIDS[pid].analysis.replace(/\\n/g, '\n'),
      workId: p.chapterId.split('_ch-')[0],
      chapterId: p.chapterId,
      passageId: p.id
    });
    count++;
  }
}

function generateType4() {
  let count = 0;
  // Generate 150 background questions
  while(count < 150) {
    const work = works[Math.floor(Math.random() * works.length)];
    const desc = WORK_DESCRIPTIONS[work.id];
    if (!desc) continue;
    
    const isAuthorQ = Math.random() > 0.5;
    let correct = '';
    let distractors = new Set<string>();
    let question = '';
    
    if (isAuthorQ) {
      correct = desc.author;
      question = `《${work.title}》的作者或輯者是誰？`;
      let attempts = 0;
      while(distractors.size < 3 && attempts < 50) {
         const rw = works[Math.floor(Math.random() * works.length)];
         const rwDesc = WORK_DESCRIPTIONS[rw.id];
         if (rwDesc && rwDesc.author && rwDesc.author !== correct && rwDesc.author !== '不詳') distractors.add(rwDesc.author);
         attempts++;
      }
    } else {
      correct = desc.period;
      question = `《${work.title}》的成書時代為何？`;
      let attempts = 0;
      while(distractors.size < 3 && attempts < 50) {
         const rw = works[Math.floor(Math.random() * works.length)];
         const rwDesc = WORK_DESCRIPTIONS[rw.id];
         if (rwDesc && rwDesc.period && rwDesc.period !== correct && rwDesc.period !== '不詳') distractors.add(rwDesc.period);
         attempts++;
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
      explanation: desc.introduction.substring(0, 200) + '...',
      workId: work.id,
      chapterId: work.chapterIds[0] || '',
      passageId: ''
    });
    count++;
  }
}

async function run() {
  console.log("Generating Quiz Bank...");
  generateType1(); // 200
  generateType2(); // 200
  generateType5(); // 200
  generateType3(); // 150
  generateType4(); // 150
  
  // Total = 900 questions
  console.log(`Generated ${quizBank.length} questions.`);
  
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
  console.log("Saved to src/data/quiz_bank.ts");
}

run();
