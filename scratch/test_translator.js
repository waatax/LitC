import fs from 'fs';

const worksSource = fs.readFileSync('./src/data/works.ts', 'utf8');
const aidSource = fs.readFileSync('./src/data/readingAid.ts', 'utf8');

const encoded = [...worksSource.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)]
  .map((match) => JSON.parse(decodeURIComponent(match[1])));

const [works, chapters, passages, sentences] = encoded;
const chapterMap = new Map(chapters.map(c => [c.id, c]));
const workMap = new Map(works.map(w => [w.id, w]));

const aidPattern = /'([^']+)'\s*:\s*\{\s*translation:\s*"((?:\\.|[^"\\])*)",\s*analysis:\s*"((?:\\.|[^"\\])*)"\s*\}/gs;
const aids = new Map();
for (const match of aidSource.matchAll(aidPattern)) {
  aids.set(match[1], { translation: match[2], analysis: match[3] });
}

function translateClassicalText(text, workId, workTitle, chTitle) {
  let t = text;

  // Speaker & dialogue replacements
  t = t.replace(/子曰[：:]/g, '孔子說：')
       .replace(/孟子曰[：:]/g, '孟子說：')
       .replace(/莊子曰[：:]/g, '莊子說：')
       .replace(/老子曰[：:]/g, '老子說：')
       .replace(/墨子曰[：:]/g, '墨子說：')
       .replace(/孫子曰[：:]/g, '孫子說：')
       .replace(/韓非子曰[：:]/g, '韓非說：')
       .replace(/惠子曰[：:]/g, '惠子說：')
       .replace(/荀子曰[：:]/g, '荀子說：')
       .replace(/公曰[：:]/g, '國君說：')
       .replace(/王曰[：:]/g, '大王說：')
       .replace(/對曰[：:]/g, '回答說：')
       .replace(/諫曰[：:]/g, '進諫說：')
       .replace(/曰[：:]/g, '說：');

  // Grammar particles & words
  const subMap = [
    [/是以/g, '因此'],
    [/是以/g, '所以'],
    [/故曰/g, '所以說'],
    [/故/g, '所以'],
    [/焉/g, '在其中'],
    [/弗/g, '不'],
    [/莫不/g, '無不'],
    [/莫/g, '沒有誰'],
    [/皆/g, '都'],
    [/苟/g, '如果'],
    [/誠/g, '確實'],
    [/安/g, '哪裡'],
    [/孰/g, '誰'],
    [/奚/g, '為何'],
    [/胡/g, '為什麼'],
    [/惡/g, '哪裡'],
    [/若夫/g, '至於'],
    [/若/g, '如果'],
    [/以為/g, '認為'],
    [/天下/g, '世間/天下'],
    [/萬物/g, '萬事萬物'],
    [/百姓/g, '人民百姓'],
    [/昔者/g, '從前'],
    [/何為/g, '為什麼'],
    [/曷為/g, '為何'],
    [/不亦(.*?)乎/g, '不也是$1嗎'],
    [/何(.*?)之有/g, '有什麼$1呢'],
    [/者(.*?)也/g, '所謂$1就是'],
  ];

  for (const [pat, rep] of subMap) {
    t = t.replace(pat, rep);
  }

  // Final cleanup of punctuation
  t = t.replace(/，+/g, '，').replace(/。+/g, '。').replace(/；+/g, '；');
  return t;
}

// Test sample
const samplePassage = passages.find(p => p.id === 'art-of-war_ch-1_p-1');
if (samplePassage) {
  console.log('Original Art of War P1:', samplePassage.canonicalText);
  console.log('Translated:', translateClassicalText(samplePassage.canonicalText, 'art-of-war', '孫子兵法', '計篇'));
}
