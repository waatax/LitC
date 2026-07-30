import fs from 'fs';
import path from 'path';

const aidFile = path.join(process.cwd(), 'src/data/readingAid.ts');
const aidSource = fs.readFileSync(aidFile, 'utf8');

const mapMatch = aidSource.match(/export const PASSAGE_AIDS[^{]*=\{([\s\S]*)\};/);
if (!mapMatch) {
  console.log("Could not find PASSAGE_AIDS map!");
  process.exit(1);
}

const mapContent = mapMatch[1];
const entryRegex = /'([^']+)':\s*\{\s*translation:\s*("([^"\\]|\\.)*"),\s*analysis:\s*("([^"\\]|\\.)*")\s*\}/g;

const translations = new Map();
let match;
while ((match = entryRegex.exec(mapContent)) !== null) {
  const id = match[1];
  const tr = JSON.parse(match[2]);
  if (translations.has(tr)) {
    console.log(`Duplicate translation found between ${translations.get(tr)} and ${id}!`);
  } else {
    translations.set(tr, id);
  }
}
