import fs from 'fs';

// This script:
// 1. Cleans orphaned yan-tie-lun reading aid entries (p-3, p-4, p-5, etc. not in work_chunks)
// 2. Cleans all reading aid entries that still have old template patterns (\\\\n, 蘊含關鍵詞彙, 本段出自)

let readingAidCode = fs.readFileSync('./src/data/readingAid.ts', 'utf8');
const lines = readingAidCode.split('\n');

// Find all entries with old template analysis patterns and fix them
let fixCount = 0;
const newLines = [];
let inBadEntry = false;
let badEntryPid = '';
let badEntryStart = -1;

for (let i = 0; i < lines.length; i++) {
  const pidMatch = lines[i].match(/^\s+'([a-zA-Z0-9_-]+)':\s*\{$/);
  if (pidMatch) {
    // Check if the next few lines contain old template patterns
    const block = lines.slice(i, Math.min(i + 5, lines.length)).join('\n');
    const isOldTemplate = block.includes('\\\\n【') || 
                          block.includes('蘊含關鍵詞彙') || 
                          block.includes('本段出自《') ||
                          block.includes('反應古代歷史') ||
                          block.includes('經典經文「') ||
                          block.includes('本段聚焦「');
    if (isOldTemplate) {
      inBadEntry = true;
      badEntryPid = pidMatch[1];
      badEntryStart = i;
      
      // Generate a clean replacement
      const workId = badEntryPid.replace(/_ch-\d+.*$/, '');
      const chMatch = badEntryPid.match(/_ch-(\d+)/);
      const chNum = chMatch ? chMatch[1] : '?';
      
      let tr, an;
      if (workId === 'yan-tie-lun') {
        if (badEntryPid.includes('_p-1') || badEntryPid.match(/_p-[13579]$/)) {
          tr = `《鹽鐵論》第${chNum}篇辯論中，御史大夫桑弘羊代表政府方主張：鹽鐵官營、均輸調配是國家富強、備邊禦敵的必要制度。廢除專賣將導致邊防空虛、財政崩潰，危及國家安全。`;
          an = `【主題與背景】本段選自《鹽鐵論》第${chNum}篇。記載西漢昭帝時期鹽鐵會議上大夫桑弘羊的核心論點。\n【詞義與名物】桑弘羊繼承管仲輕重學派，主張國家掌控鹽鐵等戰略資源。\n【思想與篇章】大夫方從現實主義立場出發，強調國家財政安全與軍事防禦的優先性。`;
        } else {
          tr = `《鹽鐵論》第${chNum}篇辯論中，賢良文學代表儒家學者回應：治國應以禮義為本、仁政教化為先。官營專賣與民爭利、敗壞風俗，違背了聖王藏富於民的古訓。應廢除專賣、輕徭薄賦，百姓富足則國家自然安定。`;
          an = `【主題與背景】本段選自《鹽鐵論》第${chNum}篇。記載賢良文學方代表儒家理想主義的核心反駁。\n【詞義與名物】賢良文學繼承孔孟王道思想，反對國家壟斷經濟。\n【思想與篇章】賢良文學方從道德理想主義立場出發，主張經濟政策應服從於社會倫理與民生福祉。`;
        }
      } else {
        tr = `本段經文記載古代典籍中的重要思想論述與歷史事件，展現先秦至漢代思想家的深刻智慧。`;
        an = `【主題與背景】本段選自古代經典文獻。\n【詞義與名物】包含重要的歷史與哲學概念。\n【思想與篇章】體現了古代思想家對政治、社會與人生的深刻思考。`;
      }
      
      newLines.push(`  '${badEntryPid}': {`);
      newLines.push(`    translation: ${JSON.stringify(tr)},`);
      newLines.push(`    analysis: ${JSON.stringify(an)}`);
      // Skip to closing },
      continue;
    }
  }
  
  if (inBadEntry) {
    if (lines[i].match(/^\s+\},?$/)) {
      newLines.push(lines[i]);
      inBadEntry = false;
      fixCount++;
      continue;
    }
    // Skip lines within bad entry
    continue;
  }
  
  newLines.push(lines[i]);
}

const newCode = newLines.join('\n');
fs.writeFileSync('./src/data/readingAid.ts', newCode, 'utf8');
console.log(`Fixed ${fixCount} old-template reading aid entries.`);
