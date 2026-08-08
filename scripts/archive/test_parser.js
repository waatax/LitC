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
console.log(parsedRows.filter(r => r.chinese.length < 10).map(r => r.id + ': ' + r.chinese));
