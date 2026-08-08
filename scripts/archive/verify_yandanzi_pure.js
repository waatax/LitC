import fs from 'fs';

const readingAidSource = fs.readFileSync('src/data/readingAid.ts', 'utf8');

console.log('=== 《燕丹子》全 11 段真實數據驗證 ===\n');

for (let i = 1; i <= 11; i++) {
  const id = `yandanzi_ch-1_p-${i}`;
  const idx = readingAidSource.indexOf(`'${id}':`);
  if (idx !== -1) {
    const snippet = readingAidSource.substring(idx, idx + 2500);
    const transMatch = snippet.match(/translation:\s*"((?:\\.|[^"\\])*)"/);
    const analysisMatch = snippet.match(/analysis:\s*"((?:\\.|[^"\\])*)"/);
    console.log(`【段落 ${id}】`);
    console.log('  白話:', transMatch ? transMatch[1].substring(0, 40) + '...' : '未找到');
    console.log('  解析:', analysisMatch ? analysisMatch[1].replace(/\\n/g, ' / ') : '未找到');
    console.log('');
  }
}
