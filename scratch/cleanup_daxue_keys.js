import fs from 'fs';
import path from 'path';

const root = process.cwd();
const aidFile = path.join(root, 'src/data/readingAid.ts');
let aidSource = fs.readFileSync(aidFile, 'utf8');

// Remove old Daxue keys like 'da-xue_ch-2_p-2', 'da-xue_ch-3_p-3', 'da-xue_ch-4_p-4', 'da-xue_ch-5_p-5', 'da-xue_ch-6_p-6', 'da-xue_ch-7_p-7', 'da-xue_ch-8_p-8', 'da-xue_ch-9_p-9', 'da-xue_ch-10_p-10', 'da-xue_ch-11_p-11'
const oldKeys = ['da-xue_ch-2_p-2', 'da-xue_ch-3_p-3', 'da-xue_ch-4_p-4', 'da-xue_ch-5_p-5', 'da-xue_ch-6_p-6', 'da-xue_ch-7_p-7', 'da-xue_ch-8_p-8', 'da-xue_ch-9_p-9', 'da-xue_ch-10_p-10', 'da-xue_ch-11_p-11'];

oldKeys.forEach(k => {
  const pattern = new RegExp(`'${k}'\\s*:\\s*\\{[^\\}]+\\},?\\n?`, 'g');
  aidSource = aidSource.replace(pattern, '');
});

let written = false;
for (let attempt = 1; attempt <= 5; attempt++) {
  try {
    fs.writeFileSync(aidFile, aidSource, 'utf8');
    written = true;
    console.log(`Successfully cleaned up old Daxue keys!`);
    break;
  } catch (err) {
    console.log(`Attempt ${attempt} failed: ${err.message}. Retrying...`);
    const end = Date.now() + 500;
    while (Date.now() < end) {}
  }
}
