import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const extractedPath = path.join(__dirname, 'classics_extracted.json');
const rawData = JSON.parse(fs.readFileSync(extractedPath, 'utf8'));

// 1. Han Feizi + Shang Jun Shu + Mozi
const han_shang_mo = [
  ...rawData['han-fei-zi'],
  ...rawData['shang-jun-shu'],
  ...rawData['mo-zi']
];
fs.writeFileSync(path.join(__dirname, 'batch_han_shang_mo.json'), JSON.stringify(han_shang_mo, null, 2), 'utf8');

// 2. Cai Gen Tan Ch1 & Ch2
const cgt_ch1_ch2 = rawData['cai-gen-tan'].filter(p => p.passageId.startsWith('cai-gen-tan_ch-1_') || p.passageId.startsWith('cai-gen-tan_ch-2_'));
fs.writeFileSync(path.join(__dirname, 'batch_caigentan_ch1_ch2.json'), JSON.stringify(cgt_ch1_ch2, null, 2), 'utf8');

// 3. Cai Gen Tan Ch3
const cgt_ch3 = rawData['cai-gen-tan'].filter(p => p.passageId.startsWith('cai-gen-tan_ch-3_'));
fs.writeFileSync(path.join(__dirname, 'batch_caigentan_ch3.json'), JSON.stringify(cgt_ch3, null, 2), 'utf8');

// 4. Cai Gen Tan Ch4
const cgt_ch4 = rawData['cai-gen-tan'].filter(p => p.passageId.startsWith('cai-gen-tan_ch-4_'));
fs.writeFileSync(path.join(__dirname, 'batch_caigentan_ch4.json'), JSON.stringify(cgt_ch4, null, 2), 'utf8');

// 5. Cai Gen Tan Ch5 (Split into 4 batches)
const cgt_ch5 = rawData['cai-gen-tan'].filter(p => p.passageId.startsWith('cai-gen-tan_ch-5_'));
const size = 60;
for (let i = 0; i < 4; i++) {
  const start = i * size;
  const end = (i === 3) ? cgt_ch5.length : (i + 1) * size;
  const batch = cgt_ch5.slice(start, end);
  fs.writeFileSync(path.join(__dirname, `batch_caigentan_ch5_${i+1}.json`), JSON.stringify(batch, null, 2), 'utf8');
}

console.log('Batches written successfully:');
console.log(`- batch_han_shang_mo.json: ${han_shang_mo.length} passages`);
console.log(`- batch_caigentan_ch1_ch2.json: ${cgt_ch1_ch2.length} passages`);
console.log(`- batch_caigentan_ch3.json: ${cgt_ch3.length} passages`);
console.log(`- batch_caigentan_ch4.json: ${cgt_ch4.length} passages`);
for (let i = 0; i < 4; i++) {
  const len = fs.readdirSync(__dirname).filter(f => f === `batch_caigentan_ch5_${i+1}.json`).length;
  console.log(`- batch_caigentan_ch5_${i+1}.json created`);
}
