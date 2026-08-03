import fs from 'fs';
const worksPath = './src/data/works.ts';
const aidsPath = './src/data/readingAid.ts';
const worksText = fs.readFileSync(worksPath, 'utf8');
const get = name => {
  const m = worksText.match(new RegExp(`export const ${name}: [^=]+ = JSON\\.parse\\(decodeURIComponent\\("([^"]+)"\\)\\);`));
  if (!m) throw new Error(`Cannot parse ${name}`);
  return JSON.parse(decodeURIComponent(m[1]));
};
let works = get('works');
let chapters = get('chapters');
let passages = get('passages');
let sentences = get('sentences');
const source = JSON.parse(fs.readFileSync('./scratch/wei_liao_zi_full_source.json', 'utf8'));
const sourceByOrder = new Map(source.chapters.map(item => [item.order, item]));
const weiChapters = chapters.filter(item => item.workId === 'wei-liao-zi').sort((a, b) => a.order - b.order);
const replaceIds = new Set();
for (const chapter of weiChapters) {
  const item = sourceByOrder.get(chapter.order);
  if (!item?.text) continue;
  for (const passage of passages.filter(p => p.chapterId === chapter.id)) replaceIds.add(passage.id);
}
passages = passages.filter(item => !replaceIds.has(item.id));
sentences = sentences.filter(item => !replaceIds.has(item.passageId));
const newPassages = [];
const newSentences = [];
for (const chapter of weiChapters) {
  const item = sourceByOrder.get(chapter.order);
  if (!item?.text) continue;
  const paragraphs = item.text.split('\n').map(text => text.trim()).filter(Boolean);
  const passageId = `${chapter.id}_p-1`;
  const sentenceIds = paragraphs.map((_, index) => `${passageId}_s-${index + 1}`);
  chapter.passageIds = [passageId];
  paragraphs.forEach((canonicalText, index) => newSentences.push({ id: sentenceIds[index], passageId, order: index + 1, canonicalText }));
  newPassages.push({ id: passageId, chapterId: chapter.id, order: 1, title: `${chapter.title}（完整校訂段）`, sentenceIds, totalChars: paragraphs.join('').length, sourceRefs: [{ label: '維基文庫《尉繚子／全覽》', url: 'https://zh.wikisource.org/wiki/尉繚子/全覽', locator: chapter.title.split(' 第')[0] }] });
}
passages.push(...newPassages);
sentences.push(...newSentences);
const work = works.find(item => item.id === 'wei-liao-zi');
if (work) work.totalChars = sentences.filter(item => item.passageId.startsWith('wei-liao-zi_ch-')).reduce((sum, item) => sum + item.canonicalText.length, 0);
const encode = (name, value, type) => `export const ${name}: ${type}[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(value))}"));`;
let output = worksText.replace(/export const works: Work\[\] = JSON\.parse\(decodeURIComponent\("[^"]+"\)\);/, encode('works', works, 'Work')).replace(/export const chapters: Chapter\[\] = JSON\.parse\(decodeURIComponent\("[^"]+"\)\);/, encode('chapters', chapters, 'Chapter')).replace(/export const passages: Passage\[\] = JSON\.parse\(decodeURIComponent\("[^"]+"\)\);/, encode('passages', passages, 'Passage')).replace(/export const sentences: Sentence\[\] = JSON\.parse\(decodeURIComponent\("[^"]+"\)\);/, encode('sentences', sentences, 'Sentence'));
fs.writeFileSync(worksPath, output, 'utf8');

let aids = fs.readFileSync(aidsPath, 'utf8');
const summaries = new Map([
  ['守權', '本篇集中討論守城與防禦，重視地形、城池、器械、糧道及守將分工，主張先固其本而後待敵之變。'],
  ['十二陵', '本篇以十二種可使軍隊受挫的情勢反面立論，提醒將帥戒驕、戒亂、戒輕敵，並以制度維持軍心。'],
  ['武議', '本篇論武力的正當用途與國家財用，兼談將帥權責、農商分工、刑賞與不戰而屈人的政治目的。'],
  ['將理', '本篇從將帥執法與軍需談治軍根本，指出徇私、失察與賞罰不明會使國力與軍隊同時衰敗。'],
  ['原官', '本篇追溯官職分工與君臣職責，說明文武、內外、上下各有其位，制度清楚才能使政令不相侵奪。'],
  ['治本', '本篇以農桑、人口與財用為治國根本，主張先使百姓安業富足，再談軍備與對外用兵。'],
  ['戰權', '本篇討論戰爭中的權變與先機，重視未兆之前的準備、真假虛實的判斷，以及出兵後不失其節。'],
  ['勒卒令', '本篇規範金鼓旗幟與隊伍操練，要求指揮信號一致、進退有序，並以層級教練使全軍形成合力。'],
  ['將令', '本篇說明將帥受命與發布軍令的莊嚴，要求令出必行、將帥自持，不能以私情破壞軍法。'],
  ['踵軍令', '本篇規定踵軍、興軍與大軍的距離、糧食、會合及追擊方式，核心是出戰前先安定內部與交通。'],
  ['兵教上', '本篇詳述由伍長逐級合練至大將的操典，配合旗章、金鼓、陣列與賞罰，建立可實行的訓練流程。'],
  ['兵教下', '本篇補充教兵與臨陣的法則，要求各級明辨號令、同伍相保、進退有節，以訓練形成不疑不亂的戰力。'],
  ['兵令上', '本篇把政治教化與臨陣列陣相連，說明文武相資、進退有度，並以嚴整軍令維持戰場秩序。'],
  ['兵令下', '本篇收束軍令條文，強調違令、失伍、擅進退與臨敵不盡力皆有明確責任，軍法須貫徹到底。'],
]);
const analyses = new Map([...summaries.keys()].map(title => [title, `本篇以${title}為題，採條列、問答或令式鋪陳軍政主張；閱讀時應將具體軍制放回「政治先行、制度定勝」的全書脈絡，並留意同一術語在編制、操練與戰場中的不同功能。`]));
for (const chapter of weiChapters) {
  if (!sourceByOrder.get(chapter.order)?.text) continue;
  const key = `${chapter.id}_p-1`;
  const chapterTitle = chapter.title.split(' 第')[0];
  const re = new RegExp(`\\s*['"]${key}['"]\\s*:\\s*\\{[\\s\\S]*?\\n\\s*\\},?`, 'g');
  aids = aids.replace(re, '');
  const entry = `  '${key}': {\n    translation: ${JSON.stringify(summaries.get(chapterTitle) ?? `本篇圍繞${chapterTitle}說明軍政與用兵原則。`)},\n    analysis: ${JSON.stringify(analyses.get(chapterTitle) ?? '本篇須結合篇中文句與軍制術語閱讀，重點在辨析其主張、條件與實施方式。')}\n  },`;
  const marker = 'export function getPassageReadingAid';
  const idx = aids.indexOf(marker);
  aids = `${aids.slice(0, idx)}${entry}\n${aids.slice(idx)}`;
}
fs.writeFileSync(aidsPath, aids, 'utf8');
console.log(JSON.stringify({ replacedChapters: newPassages.length, passages: newPassages.length, sentences: newSentences.length, sourceGaps: source.missingChapters }, null, 2));
