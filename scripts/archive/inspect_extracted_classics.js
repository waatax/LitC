import fs from 'fs';
const data = JSON.parse(fs.readFileSync('scratch/classics_extracted.json', 'utf8'));
console.log(data.map(item => ({ id: item.id, title: item.title, chapterCount: item.chapters?.length })));
