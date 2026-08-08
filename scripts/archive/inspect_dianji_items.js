import fs from 'fs';

const dianjiBooks = JSON.parse(fs.readFileSync('scratch/dianji_books_converted.json', 'utf8'));

const item125 = dianjiBooks.find(b => b.id === 125 || b.titleTrad.includes('關尹') || b.titleTrad.includes('文始'));
const item37 = dianjiBooks.find(b => b.id === 37 || b.titleTrad.includes('申子'));

console.log("Item Wenshi/Guanyin:", item125);
console.log("Item Shenzi:", item37);
