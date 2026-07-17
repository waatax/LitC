import fs from 'fs';
import path from 'path';

const filePath = 'C:/Users/User/.gemini/antigravity/brain/94415241-e907-4a0d-ab2d-2708f581a7e2/scratch/guwen_cache/part_110.html';
if (fs.existsSync(filePath)) {
  const html = fs.readFileSync(filePath, 'utf8');
  console.log("Length of part_110.html:", html.length);
  // Find <p class="calibre5"> content
  const calibre5Regex = /<p\s+class="calibre5"[\s\S]*?>([\s\S]*?)<\/p>/gi;
  const matches = [...html.matchAll(calibre5Regex)].map(m => m[1]);
  console.log("Number of calibre5 paragraphs:", matches.length);
  matches.forEach((m, idx) => {
    console.log(`Paragraph ${idx + 1} length: ${m.length}`);
    console.log(`Paragraph ${idx + 1} text:`);
    console.log(m.replace(/<[^>]*>/g, '').slice(0, 500) + '...');
    console.log(`...[EOF]...` + m.replace(/<[^>]*>/g, '').slice(-500));
  });
} else {
  console.log("File not found!");
}
