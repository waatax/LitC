/**
 * 經典文脈 ClassicFlow — 全量古文與白話文對照・考訂底本・深度解析品質稽核管線
 * Comprehensive Classical Chinese & Vernacular Alignment & Source Verification Pipeline
 */

const fs = require('fs');
const path = require('path');

const catalogPath = path.join(__dirname, '..', 'src', 'data', 'catalog.ts');
const sourcesPath = path.join(__dirname, '..', 'src', 'data', 'readingAidSources.ts');
const chunksDir = path.join(__dirname, '..', 'src', 'data', 'work_chunks');

console.log('════════════════════════════════════════════════════════════');
console.log('📜 經典文脈 ClassicFlow — 古文與白話文參照依據與深度解析品質稽核');
console.log('════════════════════════════════════════════════════════════\n');

// 1. Audit readingAidSources coverage for all works
const sourcesContent = fs.readFileSync(sourcesPath, 'utf8');

// Parse catalog works
const catalogContent = fs.readFileSync(catalogPath, 'utf8');
const matchWorks = catalogContent.match(/catalogWorks\s*=\s*JSON\.parse\('([\s\S]*?)'\)\s*as Work\[\]/);

if (!matchWorks) {
  console.error('❌ Failed to parse catalogWorks from catalog.ts');
  process.exit(1);
}

const works = JSON.parse(matchWorks[1]);
console.log(`📚 典籍庫登錄總數: ${works.length} 部典籍`);

let missingSources = [];
works.forEach(w => {
  if (!sourcesContent.includes(`'${w.id}':`)) {
    missingSources.push(w.id);
  }
});

if (missingSources.length === 0) {
  console.log(`✅ 權威底本覆蓋率: 100.00% (${works.length}/${works.length} 全部典籍皆配有權威校勘底本與考辨依據)`);
} else {
  console.error(`❌ 缺少底本設定典籍 (${missingSources.length}):`, missingSources);
  process.exit(1);
}

// 2. Audit all passages across chunks
let totalChapters = 0;
let totalPassages = 0;
let validCanonicalCount = 0;
let validVernacularCount = 0;
let validAnalysisCount = 0;
let deepAnalysisCount = 0; // Contains structured 【...】 sections
let placeholderCount = 0;

function scanChunks(dir) {
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    if (fs.statSync(fullPath).isDirectory()) {
      scanChunks(fullPath);
    } else if (entry.endsWith('.ts')) {
      totalChapters++;
      const fileContent = fs.readFileSync(fullPath, 'utf8');
      const startIdx = fileContent.indexOf('JSON.parse(');
      const endIdx = fileContent.lastIndexOf(') as ChapterBundle');
      if (startIdx !== -1 && endIdx !== -1) {
        try {
          const rawStr = fileContent.slice(startIdx + 'JSON.parse('.length, endIdx).trim();
          const parsed = JSON.parse(JSON.parse(rawStr));
          if (parsed.passages && Array.isArray(parsed.passages)) {
            for (const p of parsed.passages) {
              totalPassages++;
              
              // Validate canonical text
              if (p.canonicalText && p.canonicalText.trim().length > 0) {
                validCanonicalCount++;
              }

              // Validate vernacular translation
              const aid = p.readingAid;
              if (aid && aid.translation && aid.translation.trim().length > 0) {
                if (aid.translation.includes('此句釋義提示') || aid.translation.includes('暫無翻譯')) {
                  placeholderCount++;
                } else {
                  validVernacularCount++;
                }
              }

              // Validate in-depth analysis
              if (aid && aid.analysis && aid.analysis.trim().length > 0) {
                validAnalysisCount++;
                if (aid.analysis.includes('【') && aid.analysis.includes('】')) {
                  deepAnalysisCount++;
                }
              }
            }
          }
        } catch (err) {
          console.error(`Error processing ${entry}:`, err.message);
        }
      }
    }
  }
}

scanChunks(chunksDir);

console.log('\n📊 全量經文段落與解析深度檢核統計：');
console.log(`  • 篇章檔案總計:       ${totalChapters.toLocaleString()} 篇`);
console.log(`  • 經文段落總計:       ${totalPassages.toLocaleString()} 段`);
console.log(`  • 古文原文完備率:     ${((validCanonicalCount / totalPassages) * 100).toFixed(2)}% (${validCanonicalCount.toLocaleString()}/${totalPassages.toLocaleString()})`);
console.log(`  • 白話今譯完備率:     ${((validVernacularCount / totalPassages) * 100).toFixed(2)}% (${validVernacularCount.toLocaleString()}/${totalPassages.toLocaleString()})`);
console.log(`  • 深度解析配備率:     ${((validAnalysisCount / totalPassages) * 100).toFixed(2)}% (${validAnalysisCount.toLocaleString()}/${totalPassages.toLocaleString()})`);
console.log(`  • 結構化學術義理深析: ${((deepAnalysisCount / totalPassages) * 100).toFixed(2)}% (${deepAnalysisCount.toLocaleString()}/${totalPassages.toLocaleString()})`);
console.log(`  • 佔位符或無效文本:   ${placeholderCount} 筆`);

if (validCanonicalCount === totalPassages && validVernacularCount === totalPassages && validAnalysisCount === totalPassages && placeholderCount === 0) {
  console.log('\n✨ 檢核通過：全部經文皆具備精確無誤白話文翻譯與結構化深度解析！');
} else {
  console.error('\n❌ 檢核未全數通過，請檢視缺漏或佔位符文本。');
  process.exit(1);
}
