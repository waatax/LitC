import fs from 'fs';

const worksPath = 'src/data/works.ts';
const aidPath = 'src/data/readingAid.ts';
const worksSource = fs.readFileSync(worksPath, 'utf8');
let aidSource = fs.readFileSync(aidPath, 'utf8');
const [, , passages] = [...worksSource.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)]
  .map(match => JSON.parse(decodeURIComponent(match[1])));

const entryPattern = /  '([^']+)'\s*:\s*\{\s*translation:\s*"((?:\\.|[^"\\])*)",\s*analysis:\s*"((?:\\.|[^"\\])*)"\s*\},?/gs;
const oldEntries = new Map();
for (const match of aidSource.matchAll(entryPattern)) {
  if (match[1].startsWith('wenzi_')) oldEntries.set(match[1], { translation: match[2], analysis: match[3] });
}

// The former ten-chapter import omitted Fu Yan and Dao De. Chapters formerly
// numbered 4–10 are the received chapters now numbered 6–12.
const migrated = new Map();
for (const [id, aid] of oldEntries) {
  const match = id.match(/^wenzi_ch-(\d+)(_p-\d+)$/);
  if (!match) continue;
  const oldChapter = Number(match[1]);
  if (oldChapter <= 3) migrated.set(id, aid);
  else if (oldChapter <= 10) migrated.set(`wenzi_ch-${oldChapter + 2}${match[2]}`, aid);
}

const unescape = value => {
  try { return JSON.parse(`"${value}"`); } catch { return value; }
};
const modernize = text => text
  .replace(/老子曰[：:]/g, '老子說：')
  .replace(/文子問曰?[：:]/g, '文子問：')
  .replace(/是以/g, '因此').replace(/故/g, '所以').replace(/夫/g, '')
  .replace(/無/g, '沒有').replace(/弗/g, '不').replace(/莫/g, '沒有人')
  .replace(/皆/g, '都').replace(/百姓/g, '人民').replace(/天下/g, '天下人')
  .replace(/何以/g, '憑什麼').replace(/何為/g, '為什麼').replace(/謂之/g, '稱作')
  .replace(/者/g, '的人').replace(/焉/g, '於此').replace(/矣/g, '了')
  .replace(/；/g, '；').replace(/，+/g, '，').trim();

const themes = {
  4: ['慎言與修身', '〈符言〉集中討論言語、名聲、謀略與德行的關係。讀解時要注意外在聲名與內在實德的對照，以及「先自勝而後勝人」的反身要求。'],
  5: ['道德與治世', '〈道德〉把道家的無為、守分與謙下落實到治國及人倫。讀解時宜辨認「道」作為根本原則、「德」作為具體實踐，以及政治成敗之間的因果鏈。'],
};

for (const passage of passages.filter(item => /^wenzi_ch-[45]_/.test(item.id))) {
  const chapterNo = Number(passage.chapterId.match(/ch-(\d+)/)?.[1]);
  const [title, note] = themes[chapterNo];
  const focus = passage.canonicalText.replace(/[「」『』\s]/g, '').split(/[。；！？]/)[0].slice(0, 36);
  migrated.set(passage.id, {
    translation: modernize(passage.canonicalText),
    analysis: `【篇旨・${title}】${note}\\n【本段焦點】原文由「${focus}」展開，應依說話者、論題與結論三層梳理，不宜只摘取單句。\\n【閱讀方法】先找出正反對照與因果轉折，再觀察作者如何由個人修養推及群體秩序；這正是《文子》把老子思想轉化為治身、治國之學的特色。`,
  });
}

aidSource = aidSource.replace(entryPattern, (whole, id) => id.startsWith('wenzi_') ? '' : whole);
const marker = '};\n\n\nconst TERMS';
const serialized = [...migrated.entries()].sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true })).map(([id, aid]) =>
  `  '${id}': {\n    translation: ${JSON.stringify(unescape(aid.translation))},\n    analysis: ${JSON.stringify(unescape(aid.analysis))}\n  },`
).join('\n');
if (!aidSource.includes(marker)) throw new Error('Unable to locate PASSAGE_AIDS closing marker.');
aidSource = aidSource.replace(marker, `\n${serialized}\n};\n\n\nconst TERMS`);
fs.writeFileSync(aidPath, aidSource, 'utf8');
console.log(`Rebuilt ${migrated.size} Wenzi reading aids for the twelve-chapter edition.`);
