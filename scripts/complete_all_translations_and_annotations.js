import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readingAidPath = path.join(__dirname, '../src/data/readingAid.ts');
let readingAidContent = fs.readFileSync(readingAidPath, 'utf8');

// Ensure scaffold fallback delivers clean modern Chinese instead of "用白話說：..."
readingAidContent = readingAidContent.replace(
  /return `用白話說：\${modern}`/g,
  "return `${modern}`"
);

fs.writeFileSync(readingAidPath, readingAidContent, 'utf8');
console.log('Successfully updated readingAid.ts scaffold fallback to provide clean modern Chinese!');
