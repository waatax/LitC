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
  // Metadata for linking back
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

function getRandomPassages(excludeId: string, count: number) {
  const pool = passages.filter(p => p.id !== excludeId && p.canonicalText.length > 20);
  const result: any[] = [];
  for (let i = 0; i < count; i++) {
    result.push(pool[Math.floor(Math.random() * pool.length)]);
  }
  return result;
}

function getRandomWorks(excludeId: string, count: number) {
  const pool = works.filter(w => w.id !== excludeId);
  const result: any[] = [];
  for (let i = 0; i < count; i++) {
    result.push(pool[Math.floor(Math.random() * pool.length)]);
  }
  return result;
}

function generateType1() {
  const targetSentences = sentences.filter(s => s.canonicalText.length >= 10 && s.canonicalText.length <= 25);
  for (let i = 0; i < 200; i++) {
    const s = targetSentences[Math.floor(Math.random() * targetSentences.length)];
    const text = s.canonicalText;
    // Extract a 2-4 character chunk
    const startIndex = Math.floor(Math.random() * (text.length - 4));
    const blankLength = 2 + Math.floor(Math.random() * 2); // 2 or 3
    const correctWord = text.substring(startIndex, startIndex + blankLength);
    const maskedText = text.substring(0, startIndex) + '___' + text.substring(startIndex + blankLength);
    
    // Distractors
    const distractors = new Set<string>();
    while (distractors.size < 3) {
      const rs = targetSentences[Math.floor(Math.random() * targetSentences.length)].canonicalText;
      if (rs.length >= blankLength) {
        const rStart = Math.floor(Math.random() * (rs.length - blankLength));
        const distractor = rs.substring(rStart, rStart + blankLength);
        if (distractor !== correctWord && !/[。，？！]/.test(distractor)) {
          distractors.add(distractor);
        }
      }
    }
    
    const { options, correctIndex } = shuffleOptions([correctWord, ...Array.from(distractors)], correctWord);
    
    const p = passages.find(p => p.id === s.passageId);
    
    quizBank.push({
      id: `q-${idCounter++}`,
      type: 'fill-in-blank',
      question: `請填寫古文中的缺漏字：\n「${maskedText}」`,
      options,
      correctAnswer: correctIndex,
      explanation: `原句為：「${text}」`,
      workId: p?.chapterId.split('_ch-')[0] || '',
      chapterId: p?.chapterId || '',
      passageId: s.passageId
    });
  }
}

function generateType5() {
  const pIds = Object.keys(PASSAGE_AIDS);
  for (let i = 0; i < 200; i++) {
    const pid = pIds[Math.floor(Math.random() * pIds.length)];
    const p = passages.find(x => x.id === pid);
    if (!p) continue;
    
    const correctTrans = PASSAGE_AIDS[pid].translation;
    if (!correctTrans || correctTrans.length < 10) continue;
    
    const distractors = new Set<string>();
    while (distractors.size < 3) {
      const rpid = pIds[Math.floor(Math.random() * pIds.length)];
      if (rpid !== pid) {
        distractors.add(PASSAGE_AIDS[rpid].translation);
      }
    }
    
    const { options, correctIndex } = shuffleOptions([correctTrans, ...Array.from(distractors)], correctTrans);
    
    quizBank.push({
      id: `q-${idCounter++}`,
      type: 'translation',
      question: `請問以下古文的正確白話文釋義為何？\n「${p.canonicalText.substring(0, 50)}${p.canonicalText.length > 50 ? '...' : ''}」`,
      options,
      correctAnswer: correctIndex,
      explanation: PASSAGE_AIDS[pid].analysis,
      workId: p.chapterId.split('_ch-')[0],
      chapterId: p.chapterId,
      passageId: p.id
    });
  }
}

function generateType3() {
  const pIds = Object.keys(PASSAGE_AIDS).filter(id => PASSAGE_AIDS[id].analysis && PASSAGE_AIDS[id].analysis.length > 20);
  for (let i = 0; i < 100; i++) {
    const pid = pIds[Math.floor(Math.random() * pIds.length)];
    const p = passages.find(x => x.id === pid);
    if (!p) continue;
    
    const correctAnalysis = PASSAGE_AIDS[pid].analysis.split('\\n')[0].replace(/【.*?】/g, '').trim() || "這是本篇的核心精神。";
    if (correctAnalysis.length < 5) continue;
    
    const distractors = new Set<string>();
    while (distractors.size < 3) {
      const rpid = pIds[Math.floor(Math.random() * pIds.length)];
      if (rpid !== pid) {
        const dAnalysis = PASSAGE_AIDS[rpid].analysis.split('\\n')[0].replace(/【.*?】/g, '').trim() || "其他經典的洞察。";
        distractors.add(dAnalysis);
      }
    }
    
    const { options, correctIndex } = shuffleOptions([correctAnalysis, ...Array.from(distractors)], correctAnalysis);
    
    quizBank.push({
      id: `q-${idCounter++}`,
      type: 'analysis',
      question: `針對以下段落，何者是最符合其思想或章旨的解析？\n「${p.canonicalText.substring(0, 50)}${p.canonicalText.length > 50 ? '...' : ''}」`,
      options,
      correctAnswer: correctIndex,
      explanation: PASSAGE_AIDS[pid].analysis.substring(0, 150) + '...',
      workId: p.chapterId.split('_ch-')[0],
      chapterId: p.chapterId,
      passageId: p.id
    });
  }
}

function generateType4() {
  for (let i = 0; i < 100; i++) {
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
      while(distractors.size < 3) {
         const rw = works[Math.floor(Math.random() * works.length)];
         const rwDesc = WORK_DESCRIPTIONS[rw.id];
         if (rwDesc && rwDesc.author !== correct) distractors.add(rwDesc.author);
      }
    } else {
      correct = desc.period;
      question = `《${work.title}》的成書時代為何？`;
      while(distractors.size < 3) {
         const rw = works[Math.floor(Math.random() * works.length)];
         const rwDesc = WORK_DESCRIPTIONS[rw.id];
         if (rwDesc && rwDesc.period !== correct) distractors.add(rwDesc.period);
      }
    }
    
    const { options, correctIndex } = shuffleOptions([correct, ...Array.from(distractors)], correct);
    
    quizBank.push({
      id: `q-${idCounter++}`,
      type: 'background',
      question,
      options,
      correctAnswer: correctIndex,
      explanation: desc.introduction.substring(0, 100) + '...',
      workId: work.id,
      chapterId: work.chapterIds[0] || '',
      passageId: ''
    });
  }
}

async function run() {
  console.log("Generating Quiz Bank...");
  generateType1();
  generateType5();
  generateType3();
  generateType4();
  
  // We should have around 500 questions
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
