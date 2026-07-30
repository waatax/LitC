import fs from 'fs';
import path from 'path';

const root = process.cwd();
const aidFile = path.join(root, 'src/data/readingAid.ts');
let aidSource = fs.readFileSync(aidFile, 'utf8');

// Replace meng-zi_ch-13_p-33 translation
const p13_33_Pattern = /('meng-zi_ch-13_p-33':\s*\{\s*translation:\s*)"孟子說：「人們之所以輕率地發表言論[^"]+"/;
if (aidSource.match(p13_33_Pattern)) {
  aidSource = aidSource.replace(p13_33_Pattern, `$1"孟子再次警示慎言說：「人們之所以輕率地發表言論，是因為沒有人對他的言論進行責難追究罷了。」"`);
}

// Replace meng-zi_ch-14_p-28 translation
const p14_28_Pattern = /('meng-zi_ch-14_p-28':\s*\{\s*translation:\s*)"孟子說：「養心莫善於寡欲[^"]+"/;
if (aidSource.match(p14_28_Pattern)) {
  aidSource = aidSource.replace(p14_28_Pattern, `$1"孟子再次強調修心法門說：「養護內心良知沒有比減少慾望更好的方法了（養心莫善於寡欲）。」"`);
}

let written = false;
for (let attempt = 1; attempt <= 5; attempt++) {
  try {
    fs.writeFileSync(aidFile, aidSource, 'utf8');
    written = true;
    console.log(`Successfully updated Mengzi unique translations on attempt ${attempt}!`);
    break;
  } catch (err) {
    console.log(`Attempt ${attempt} failed: ${err.message}. Retrying...`);
    const end = Date.now() + 500;
    while (Date.now() < end) {}
  }
}
