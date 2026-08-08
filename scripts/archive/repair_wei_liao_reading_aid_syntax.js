import fs from 'fs';
const path = './src/data/readingAid.ts';
let text = fs.readFileSync(path, 'utf8');
const titles = ['天官', '兵談', '制談', '戰威', '攻權'];
const translations = [
  '本篇以黃帝與梁惠王問答說明，戰爭勝負不在迷信天時，而在人事、城防、糧秣、器械與將士協同；又以彗星、背水等事例反駁把天象當成必勝條件的說法。',
  '本篇論國家用兵的根本，指出土地、人口、糧食、城郭與政治教化相互為用；軍隊必須先在朝廷完成制度與準備，將帥則須兼具謀略、威信與法度。',
  '本篇主張凡用兵先定制度，從農戰政策、爵賞刑罰到軍隊編制皆須有明確法令；使民有生產之利、戰鬥之功，國家才可持久而強。',
  '本篇分析軍威的形成：上下一心、號令必行、賞罰必信，並以將帥身先士卒和臨戰決斷建立士卒敢戰之氣。',
  '本篇討論進攻的權變，強調先制其心、先定內政，再觀敵之虛實與時機；將領須兼愛與威，集中兵力，迅速而有節制地求戰。',
];
const analyses = [
  '篇章以設問破題，連用城防、天象與古戰例作反證，核心是「人事勝天官」。閱讀時宜辨別「刑」為攻伐、「德」為守成，並注意作者將軍事後勤與道德政治並列。',
  '篇章由國力談到軍政，論證順序是資源、制度、將帥、作戰。其「戰勝於外，備主於內」把軍事勝負置於國家治理之中。',
  '本篇以反覆排比推進論旨，將農業、爵秩、刑賞與軍令組成一套動員制度；重點在令民知利害，使賞罰可預期。',
  '本篇重視心理與組織的交互作用：威不是恐嚇，而是由公平、守令、先登與將帥表率累積的共同信念。',
  '本篇所說的權是依敵我形勢調整的方法，不是任意欺詐；其論愛威並用、集中兵勢、乘隙速決，呈現法家軍政與兵家權變的結合。',
];
const entries = titles.map((title, i) => `  'wei-liao-zi_ch-${i + 1}_p-1': {\n    translation: ${JSON.stringify(translations[i])},\n    analysis: ${JSON.stringify(analyses[i])}\n  },`).join('\n');
const pattern = /\n\}\n\n\s*'wei-liao-zi_ch-1_p-1':[\s\S]*?\n\nexport function getPassageReadingAid/;
if (!pattern.test(text)) throw new Error('Malformed Wei Liao aid block not found');
text = text.replace(pattern, `\n${entries}\n}\n\nexport function getPassageReadingAid`);
fs.writeFileSync(path, text, 'utf8');
console.log('Repaired Wei Liao reading-aid object syntax.');
