import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rawPath = path.join(__dirname, 'yijing_raw.json');
const hexagrams = JSON.parse(fs.readFileSync(rawPath, 'utf8'));

const batch1 = hexagrams.slice(0, 32);
const batch2 = hexagrams.slice(32);

fs.writeFileSync(path.join(__dirname, 'yijing_batch1.json'), JSON.stringify(batch1, null, 2), 'utf8');
fs.writeFileSync(path.join(__dirname, 'yijing_batch2.json'), JSON.stringify(batch2, null, 2), 'utf8');

console.log(`Split I Ching data into batch1 (${batch1.length}) and batch2 (${batch2.length})`);
