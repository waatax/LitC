import fs from 'fs';
import path from 'path';

const aidFile = path.join(process.cwd(), 'src/data/readingAid.ts');
const aidSource = fs.readFileSync(aidFile, 'utf8');

const zy_ids = Array.from({length: 33}, (_, i) => `zhong-yong_ch-${i+1}_p-${i+1}`);
const dx_ids = Array.from({length: 12}, (_, i) => `da-xue_ch-${i+1}_p-${i+1}`);

const missing = [];
[...zy_ids, ...dx_ids].forEach(id => {
  if (!aidSource.includes(`'${id}':`)) {
    missing.push(id);
  }
});

console.log('Missing ids:', missing);
