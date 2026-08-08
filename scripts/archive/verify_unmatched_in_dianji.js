import fs from 'fs';
import * as OpenCC from 'opencc-js';

const converter = OpenCC.Converter({ from: 'cn', to: 'tw' });
const dianjiBooks = JSON.parse(fs.readFileSync('scratch/dianji_books_converted.json', 'utf8'));

const aliases = [
  { name: '文始真經', keywords: ['文始', '關尹', '關尹子'] },
  { name: '申不害', keywords: ['申不害', '申子'] },
  { name: '諫逐客書', keywords: ['諫逐客', '李斯'] }
];

console.log("=== Searching Aliases in Dianji.fun 2,471 Books Catalog ===");

for (const item of aliases) {
  console.log(`\nSearching for LitC Work: 《${item.name}》...`);
  const matches = dianjiBooks.filter(b => 
    item.keywords.some(k => b.titleTrad.includes(k) || (b.authorTrad && b.authorTrad.includes(k)))
  );
  
  if (matches.length > 0) {
    console.log(`Found ${matches.length} matching entries in Dianji.fun:`);
    matches.forEach(m => {
      console.log(`- ID ${m.id}: 《${m.titleTrad}》 | 朝代: ${m.dynastyTrad} | 作者: ${m.authorTrad}`);
    });
  } else {
    console.log(`No direct match found for keywords: ${item.keywords.join(', ')}`);
  }
}
