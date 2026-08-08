import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const readingAidPath = path.join(root, 'src/data/readingAid.ts');
let aidSource = fs.readFileSync(readingAidPath, 'utf8');

console.log('Fixing mechanical replacement artifacts in readingAid.ts...');

// Fix 孫孔子 -> 孔子
aidSource = aidSource.replace(/孫孔子/g, '孔子');
// Fix 【白話翻譯】 inside string values
aidSource = aidSource.replace(/【白話翻譯】/g, '');
// Fix "所謂，"
aidSource = aidSource.replace(/所謂，/g, '所謂');

fs.writeFileSync(readingAidPath, aidSource, 'utf8');
console.log('Finished cleaning mechanical replacement artifacts.');
