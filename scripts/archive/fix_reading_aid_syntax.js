import fs from 'fs';

const filepath = 'src/data/readingAid.ts';
let content = fs.readFileSync(filepath, 'utf8');

// Remove line 23667 `}\n` right before `'xunzi_ch-17_p-1'`
content = content.replace(/},\n\n  'xunzi_ch-17_p-1'/g, ',\n  \'xunzi_ch-17_p-1\'');

// Ensure `}\n\nexport function getPassageReadingAid` is placed after `xunzi_ch-17_p-17`
content = content.replace(/  'xunzi_ch-17_p-17': \{[\s\S]*?\},\nexport function/g, (match) => {
  return match.replace('\nexport function', '\n};\n\nexport function');
});

fs.writeFileSync(filepath, content, 'utf8');
console.log("Fixed readingAid.ts syntax!");
