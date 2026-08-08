import fs from 'fs';

const path = './src/data/works.ts';
const text = fs.readFileSync(path, 'utf8');
const get = name => {
  const match = text.match(new RegExp(`export const ${name}: [^=]+ = JSON\\.parse\\(decodeURIComponent\\("([^"]+)"\\)\\);`));
  if (!match) throw new Error(`Cannot parse ${name}`);
  return JSON.parse(decodeURIComponent(match[1]));
};
const works = get('works');
const chapters = get('chapters');
const canonicalTitles = ['天官', '兵談', '制談', '戰威', '攻權', '守權', '十二陵', '武議', '將理', '原官', '治本', '戰權', '重刑令', '伍制令', '分塞令', '束伍令', '經卒令', '勒卒令', '將令', '踵軍令', '兵教上', '兵教下', '兵令上', '兵令下'];
const wei = chapters.filter(item => item.workId === 'wei-liao-zi').sort((a, b) => a.order - b.order);
if (wei.length !== canonicalTitles.length) throw new Error(`Expected 24 chapters, found ${wei.length}`);
wei.forEach((chapter, index) => {
  chapter.order = index + 1;
  chapter.title = `${canonicalTitles[index]} 第${index + 1}篇`;
  chapter.tags = ['兵家', canonicalTitles[index], '尉繚子', '武經七書'];
});
const work = works.find(item => item.id === 'wei-liao-zi');
if (work) {
  work.chapterIds = wei.map(item => item.id);
  work.sourceNote = '現存二十四篇。篇序依《續古逸叢書》本《武經七書》及中國哲學書電子化計劃核定；伍制令、分塞令、束伍令、經卒令之維基文庫全覽缺錄，待以第二底本補校。';
}
const encode = (name, value) => `export const ${name}: ${name === 'works' ? 'Work' : name === 'chapters' ? 'Chapter' : name === 'passages' ? 'Passage' : 'Sentence'}[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(value))}"));`;
let output = text;
output = output.replace(/export const works: Work\[\] = JSON\.parse\(decodeURIComponent\("[^"]+"\)\);/, encode('works', works));
output = output.replace(/export const chapters: Chapter\[\] = JSON\.parse\(decodeURIComponent\("[^"]+"\)\);/, encode('chapters', chapters));
fs.writeFileSync(path, output, 'utf8');
console.log(JSON.stringify({ normalized: wei.length, titles: canonicalTitles }, null, 2));
