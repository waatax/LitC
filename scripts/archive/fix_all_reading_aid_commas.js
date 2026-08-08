import fs from 'fs';

const filepath = 'src/data/readingAid.ts';
let content = fs.readFileSync(filepath, 'utf8');

// Replace any closing brace followed by a key without a comma
content = content.replace(/\}\s*\n\s*['"]([a-zA-Z0-9_-]+)['"]\s*:/g, '},\n  \'$1\':');

fs.writeFileSync(filepath, content, 'utf8');
console.log("Fixed object entry commas in readingAid.ts!");
