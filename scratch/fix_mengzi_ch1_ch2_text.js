import fs from 'fs';
import path from 'path';

const root = process.cwd();
const worksFile = path.join(root, 'src/data/works.ts');
let worksSource = fs.readFileSync(worksFile, 'utf8');

const matches = [...worksSource.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)];
const arrays = matches.map((match) => JSON.parse(decodeURIComponent(match[1])));
const [works, chapters, passages, sentences] = arrays;

// 1. Fix meng-zi_ch-1_p-7
const p7 = passages.find(p => p.id === 'meng-zi_ch-1_p-7');
if (p7 && p7.canonicalText.includes('吾颐')) {
  p7.canonicalText = p7.canonicalText.replace('吾颐', '吾惛');
  console.log('Fixed meng-zi_ch-1_p-7: 吾颐 -> 吾惛');
}

// 2. Fix meng-zi_ch-2_p-5
const p2_5 = passages.find(p => p.id === 'meng-zi_ch-2_p-5');
if (p2_5 && p2_5.canonicalText.includes('裹糧2也')) {
  p2_5.canonicalText = p2_5.canonicalText.replace('裹糧2也', '裹糧也');
  console.log('Fixed meng-zi_ch-2_p-5: 裹糧2也 -> 裹糧也');
}

// 3. Fix meng-zi_ch-2_p-16
const p2_16 = passages.find(p => p.id === 'meng-zi_ch-2_p-16');
if (p2_16 && p2_16.canonicalText.includes('為，去聲。沮，慈呂反。')) {
  const commentStr = '為，去聲。沮，慈呂反。尼，女乙反。焉，於虔反。克，樂正子名。沮尼，皆止之之意也。言人之行，必有人使之者。其止，必有人尼之者。然其所以行所以止，則固有天命，而非此人所能使，亦非此人所能尼也。然則我之不遇，豈臧倉之所能為哉？此章言聖賢之出處，關時運之盛衰。乃天命之所為，非人力之可及。';
  p2_16.canonicalText = p2_16.canonicalText.replace(commentStr, '').trim();
  console.log('Fixed meng-zi_ch-2_p-16: removed interlinear Zhu Xi comment!');
}

// Re-encode works.ts
const newEncoded = arrays.map(arr => encodeURIComponent(JSON.stringify(arr)));
let newWorksSource = worksSource;
matches.forEach((m, idx) => {
  newWorksSource = newWorksSource.replace(m[1], newEncoded[idx]);
});
fs.writeFileSync(worksFile, newWorksSource, 'utf8');
console.log('Successfully cleaned works.ts text for Mengzi Ch1 & Ch2!');
