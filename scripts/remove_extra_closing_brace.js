import fs from 'fs';

const filepath = 'src/data/readingAid.ts';
let content = fs.readFileSync(filepath, 'utf8');

// Replace `}\n},` with `},\n`
content = content.replace(/\}\n\},/g, '},\n');

fs.writeFileSync(filepath, content, 'utf8');
console.log("Successfully removed extra closing brace in readingAid.ts!");
