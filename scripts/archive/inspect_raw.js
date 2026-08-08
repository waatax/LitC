import fs from 'fs';

const rawContent = fs.readFileSync('C:/Users/User/.gemini/antigravity/brain/94415241-e907-4a0d-ab2d-2708f581a7e2/.system_generated/steps/385/content.md', 'utf8');
const parsedRows = [];
let index = 0;
while (true) {
  index = rawContent.indexOf('<tr', index);
  if (index === -1) break;
  const endIndex = rawContent.indexOf('</tr>', index);
  if (endIndex === -1) break;
  const rowHtml = rawContent.substring(index, endIndex + 5);
  const idMatch = rowHtml.match(/id="p([0-9]+)"/i);
  const rowId = idMatch ? parseInt(idMatch[1]) : 0;
  
  const tdParts = rowHtml.split(/<td[^>]*class="ctext"[^>]*>/gi);
  if (tdParts.length >= 2) {
    const textTd = tdParts[tdParts.length - 1].split(/<\/td>/gi)[0];
    let rawChinese = textTd.split(/<br\s*\/?>/i)[0];
    rawChinese = rawChinese.replace(/<span[^>]*>.*?<\/span>/gi, '').trim();
    rawChinese = rawChinese.replace(/<[^>]+>/g, '').trim();
    
    parsedRows.push({
      id: rowId,
      chinese: rawChinese,
    });
  }
  index = endIndex + 5;
}

console.log('Total rows parsed:', parsedRows.length);
console.log('First 10 rows:');
parsedRows.slice(0, 10).forEach(r => console.log(r.id, r.chinese));

console.log('\nLooking for title rows (very short ones):');
parsedRows.filter(r => r.chinese.length < 5).forEach(r => console.log(r.id, r.chinese));

console.log('\nChecking max row ID:', Math.max(...parsedRows.map(r => r.id)));
