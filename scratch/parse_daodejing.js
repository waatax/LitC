import fs from 'fs';
const html = fs.readFileSync('./scratch/dao-de-jing.html', 'utf8');

const chapters = [];
for (let i = 1; i <= 81; i++) {
  const trId = `n${11591 + i}`;
  const index = html.indexOf(`tr id="${trId}"`);
  if (index === -1) {
    console.log(`Warning: ${trId} not found`);
    continue;
  }
  const endIndex = html.indexOf('</tr>', index);
  if (endIndex === -1) {
    console.log(`Warning: end of ${trId} not found`);
    continue;
  }
  const rowHtml = html.substring(index, endIndex + 5);
  
  // Find ctext cell
  const ctextStart = rowHtml.indexOf('<td class="ctext"');
  if (ctextStart === -1) {
    console.log(`Warning: ctext cell in ${trId} not found`);
    continue;
  }
  const ctextCellStart = rowHtml.indexOf('>', ctextStart) + 1;
  const ctextCellEnd = rowHtml.indexOf('</td>', ctextCellStart);
  let text = rowHtml.substring(ctextCellStart, ctextCellEnd);
  
  // Clean tags
  text = text.replace(/<span[^>]*>[\s\S]*?<\/span>/gi, '');
  text = text.replace(/<a[^>]*>[\s\S]*?<\/a>/gi, '');
  text = text.replace(/<[^>]+>/g, '');
  text = text.trim();
  
  chapters.push({
    chapterNum: i,
    text: text
  });
}

console.log('Parsed chapters count:', chapters.length);
console.log('Chapter 1:', chapters[0]);
console.log('Chapter 21:', chapters[20]);
console.log('Chapter 81:', chapters[80]);

fs.writeFileSync('./scratch/daodejing_raw.json', JSON.stringify(chapters, null, 2), 'utf8');
