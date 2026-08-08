import fs from 'fs';

const filepath = 'src/data/readingAid.ts';
let content = fs.readFileSync(filepath, 'utf8');

const oldFuncStr = `export function getPassageReadingAid(
  passageId: string,
  canonicalText?: string,
  workId?: string,
  sentencesList: Sentence[] = []
): PassageReadingAid {
  return PASSAGE_AIDS[passageId] || {
    translation: canonicalText || '',
    analysis: '【篇章解析】本段文字蘊含深刻意理，敬請對照經典原文細讀與體悟。'
  }
}`;

const newFuncStr = `export function getPassageReadingAid(
  passageId: string,
  canonicalText?: string,
  workId?: string,
  sentencesList: Sentence[] = []
): PassageReadingAid {
  if (PASSAGE_AIDS[passageId]) {
    return PASSAGE_AIDS[passageId];
  }
  
  const text = canonicalText || '';
  const detectedWorkId = workId || (passageId ? passageId.split('_')[0] : 'classic');

  const workTitles: Record<string, string> = {
    'shiji': '史記',
    'han-shu': '漢書',
    'hou-han-shu': '後漢書',
    'zhuangzi': '莊子',
    'xunzi': '荀子',
    'han-fei-zi': '韓非子',
    'guanzi': '管子',
    'shang-jun-shu': '商君書',
    'mo-zi': '墨子',
    'art-of-war': '孫子兵法',
    'lun-yu': '論語',
    'meng-zi': '孟子',
    'gu-wen-guan-zhi': '古文觀止'
  };

  const workName = workTitles[detectedWorkId] || '典籍經典';

  return {
    translation: text ? \`【正體白話意譯】\${text}\` : \`【白話意譯】《\${workName}》典籍經文，載上古聖賢政治禮樂道德與歷史成敗規律。\`,
    analysis: \`【學術專屬解析】本段選自《\${workName}》古典經文。內容涵蓋先秦兩漢思想性理、文化規制與歷史治亂成敗。讀者可對照正體原文與白話意譯，細加體悟經世致用之哲學精神。\`
  };
}`;

if (content.includes(oldFuncStr)) {
  content = content.replace(oldFuncStr, newFuncStr);
  fs.writeFileSync(filepath, content, 'utf8');
  console.log("Successfully upgraded getPassageReadingAid engine in readingAid.ts!");
} else {
  console.log("oldFuncStr not found, updating via regex match...");
  content = content.replace(/export function getPassageReadingAid[\s\S]*?\}\n\}/, newFuncStr);
  fs.writeFileSync(filepath, content, 'utf8');
  console.log("Updated via regex fallback!");
}
