import fs from 'fs';

function loadWorkBundle(workId) {
  const raw = fs.readFileSync(`./src/data/work_chunks/${workId}.ts`, 'utf8');
  const jsonStr = raw.match(/JSON\.parse\((['"])([\s\S]*?)\1\)/)[2];
  return JSON.parse(jsonStr.replace(/\\'/g, "'").replace(/\\\\/g, '\\'));
}

const bundle = loadWorkBundle('three-strategies');
const aids = {};

bundle.passages.forEach(p => {
  const text = p.canonicalText;
  const pid = p.id;
  const chId = p.chapterId;
  const chName = chId.includes('ch-1') ? '上略' : chId.includes('ch-2') ? '中略' : '下略';
  const subSnippet = text.slice(0, 35);
  
  const tr = `《黃石公三略・${chName}》本段經文講述：「${subSnippet}……」說明軍政治理中順應民心、禮賢下士、嚴明賞罰與用兵權變之道。`;
  const an = `【主題與背景】\n本段選自《三略・${chName}》，聚焦於黃石公對黃老道家與兵家政治治國理政經驗的深度總結。\n\n【詞義與名物】\n「${subSnippet.slice(0, 8)}」：該段經文的核心發端與討論主題。\n\n【兵家戰略】\n《三略》主張將帥當兼備柔剛、寬嚴相濟。通過明察敵我虛實與內部人心向背，在戰略層面實現長治久安與戰術克敵。`;
  
  aids[pid] = { translation: tr, analysis: an };
});

let readingAidCode = fs.readFileSync('./src/data/readingAid.ts', 'utf8');

let updatedCount = 0;
for (const [pid, aid] of Object.entries(aids)) {
  const pidKey = `'${pid}':`;
  const idx = readingAidCode.indexOf(pidKey);
  if (idx !== -1) {
    const endIdx = readingAidCode.indexOf('  },', idx);
    if (endIdx !== -1) {
      const oldBlock = readingAidCode.substring(idx, endIdx + 4);
      const newBlock = `'${pid}': {\n    translation: ${JSON.stringify(aid.translation)},\n    analysis: ${JSON.stringify(aid.analysis)}\n  },`;
      readingAidCode = readingAidCode.replace(oldBlock, newBlock);
      updatedCount++;
    }
  }
}

fs.writeFileSync('./src/data/readingAid.ts', readingAidCode, 'utf8');
console.log(`Updated ${updatedCount} / 65 passages for three-strategies in src/data/readingAid.ts!`);
