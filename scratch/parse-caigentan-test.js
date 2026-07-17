import fs from 'fs';

const filePath = 'C:/Users/User/.gemini/antigravity/brain/94415241-e907-4a0d-ab2d-2708f581a7e2/.system_generated/steps/385/content.md';
const content = fs.readFileSync(filePath, 'utf8');

const parsedRows = [];
let index = 0;
while (true) {
  index = content.indexOf('<tr class="result"', index);
  if (index === -1) break;
  const endIndex = content.indexOf('</tr>', index);
  if (endIndex === -1) break;
  const rowHtml = content.substring(index, endIndex + 5);
  const idMatch = rowHtml.match(/id="p([0-9]+)"/i);
  const rowId = idMatch ? idMatch[1] : '';
  const tdParts = rowHtml.split(/<td[^>]*class="ctext"[^>]*>/gi);
  if (tdParts.length >= 3) {
    const textTd = tdParts[2].split(/<\/td>/gi)[0];
    let rawChinese = textTd.split(/<br\s*\/?>/i)[0];
    rawChinese = rawChinese.replace(/<span[^>]*>.*?<\/span>/gi, '').trim();
    rawChinese = rawChinese.replace(/<[^>]+>/g, '').trim();
    if (rawChinese.length <= 4) {
      console.log(`Row ${rowId} (length ${rawChinese.length}): "${rawChinese}"`);
    }
  }
  index = endIndex + 5;
}
