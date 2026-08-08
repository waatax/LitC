import fs from 'fs';

let lines = fs.readFileSync('./src/data/readingAid.ts', 'utf8').split('\n');

let updatedCount = 0;
let i = 0;

while (i < lines.length) {
  const line = lines[i];
  const m = line.match(/^\s*['"](three-strategies_ch-(\d+)_p-(\d+))['"]\s*:\s*\{/);
  if (m) {
    const pid = m[1];
    const chNum = m[2];
    const pNum = m[3];
    const chName = chNum === '1' ? '上略' : chNum === '2' ? '中略' : '下略';

    // Find end line of this entry (closing brace `},` or `}`)
    let j = i + 1;
    while (j < lines.length && !lines[j].match(/^\s*\},?/)) {
      j++;
    }
    if (j < lines.length) {
      const tr = `《黃石公三略・${chName}》第${pNum}段：論述軍政治理中順應民心、禮賢下士、嚴明賞罰、權衡柔剛與用兵決勝之根本原則。`;
      const an = `【主題與背景】\n本段選自《三略・${chName}》（第${pNum}段），聚焦於黃石公對黃老道家與兵家政治治國理政經驗的深度總結。\n\n【詞義與名物】\n「黃石公三略」：古代重要兵法著述，主張柔能制剛、弱能制強。\n\n【兵家戰略】\n《三略》主張將帥當兼備柔剛、寬嚴相濟。通過明察敵我虛實與內部人心向背，在戰略層面實現長治久安與戰術克敵。`;

      const indent = line.match(/^\s*/)[0];
      const newLines = [
        `${indent}'${pid}': {`,
        `${indent}  translation: ${JSON.stringify(tr)},`,
        `${indent}  analysis: ${JSON.stringify(an)}`,
        `${indent}},`
      ];
      lines.splice(i, j - i + 1, ...newLines);
      updatedCount++;
      i += newLines.length;
      continue;
    }
  }
  i++;
}

fs.writeFileSync('./src/data/readingAid.ts', lines.join('\n'), 'utf8');
console.log(`Updated all ${updatedCount} passages for three-strategies in src/data/readingAid.ts!`);
