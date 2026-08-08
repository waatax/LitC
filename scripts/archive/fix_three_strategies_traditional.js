import fs from 'fs';
const path = './src/data/readingAid.ts';
let text = fs.readFileSync(path, 'utf8');
const replacements = new Map([['克制', '剋制'], ['群吏', '羣吏'], ['為之作', '為之製'], ['勢秘', '勢祕'], ['舍己', '捨己'], ['施于', '施於'], ['制作', '製作']]);
for (const [from, to] of replacements) text = text.replaceAll(from, to);
fs.writeFileSync(path, text, 'utf8');
console.log(JSON.stringify({ replacements: [...replacements.keys()] }, null, 2));
