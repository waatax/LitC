import fs from 'fs';

const worksFile = 'src/data/works.ts';
let c = fs.readFileSync(worksFile, 'utf8');

if (!c.includes('import { passagesPart1 }')) {
  c = c.replace(/import type \{[^}]+\} from '\.\.\/types\/content'/, "$&\nimport { passagesPart1 } from './sentence_chunks/passages_part1'\nimport { passagesPart2 } from './sentence_chunks/passages_part2'");
}

c = c.replace(/export const works = JSON\.parse\('([^]+?)'\)(?: as any)?/, "export const works = JSON.parse('$1') as Work[]");
c = c.replace(/export const chapters = JSON\.parse\('([^]+?)'\)(?: as any)?/, "export const chapters = JSON.parse('$1') as Chapter[]");

fs.writeFileSync(worksFile, c, 'utf8');
console.log('Fixed works.ts types and imports');
