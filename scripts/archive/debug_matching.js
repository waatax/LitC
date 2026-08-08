import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const worksTsPath = path.join(__dirname, '../src/data/works.ts');
const text = fs.readFileSync(worksTsPath, 'utf8');
const jsonMatches = [...text.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)];

if (jsonMatches.length >= 4) {
  const sentences = JSON.parse(decodeURIComponent(jsonMatches[3][1]));
  const ddjSentences = sentences.filter(s => s.id.startsWith('dao-de-jing_'));
  console.log('Sample Daodejing sentences in works.ts:');
  console.log(ddjSentences.slice(0, 10).map(s => s.canonicalText));

  const lunyuSentences = sentences.filter(s => s.id.startsWith('lun-yu_'));
  console.log('Sample Lunyu sentences in works.ts:');
  console.log(lunyuSentences.slice(0, 10).map(s => s.canonicalText));
}
