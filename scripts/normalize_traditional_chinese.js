import fs from 'fs';
import path from 'path';
import OpenCC from 'opencc-js';

const root = process.cwd();
const toTraditional = OpenCC.ConverterFactory(...OpenCC.Locale.from.cn);

const convertBounded = (text) => {
  const protectedTerms = [
    '干戚',
    '羣后', '群后', '高后', '皇后', '后土', '后稷', '后羿',
    '蒙蔽', '欺蒙', '私占', '獨占', '私欲', '嚴萬里', '里社', '里有書社', '鄉里', '尸襲',
    '盜跖', '使跖可信', '定制', '群臣', '坐床', '局限', '考核', '才可', '游處',
    '田里', '命令才行', '政事才有常規', '只是', '才是', '雖跖', '萬里土地',
    '了解', '公布', '群鴨', '鴨群', '愈治愈亂', '才不會',
    '只靠', '只採納', '只照', '只積', '只燒', '只顯耀',
    '范吉射', '范氏', '干辛', '段干木',
    '核算', '只看', '欲望', '吃了', '給父母吃', '給君主吃', '凶禍', '吉凶',
    '數以萬里', '數千里', '數百里', '三百里', '三里的', '七里的',
    '廣衍數於萬，不勝而辟',
    '免攻伐并兼', '禹征三苗', '征三苗', '三處「于」', '于／於',
    '疲困', '只說',
    '才去做', '才有用', '河川谷地', '「于」', '「于民」',
    '群百工', '吃飯', '以斗斟酌', '斗以酌', '辟風寒', '「辟」', '「于是」', '于是／於是',
    '游者愛佼', '「凶」', '凶、餽', '凶饑', '凶歉', '凶年', '凶荒', '征討', '《群書治要》',
    '朱干', '朱干玉鏚', '鬱郁', '鬱郁乎', '羣辟',
  ];
  const placeholders = new Map();
  protectedTerms.forEach((term, index) => {
    const placeholder = `__LITC_CLASSICAL_${index}__`;
    if (text.includes(term)) {
      text = text.replaceAll(term, placeholder);
      placeholders.set(placeholder, term);
    }
  });
  let result = '';
  for (let offset = 0; offset < text.length; offset += 400) {
    result += toTraditional(text.slice(offset, offset + 400));
  }
  for (const [placeholder, term] of placeholders) {
    result = result.replaceAll(placeholder, term);
  }
  return result;
};

const targets = [
  'src/data/readingAid.ts',
  'src/data/workDescriptions.ts',
  'src/data/schools.ts',
  'src/data/editorialReviews.json',
  'src/data/quiz_bank.ts',
  'src/App.vue',
];

const chunkDir = path.join(root, 'src/data/work_chunks');
if (fs.existsSync(chunkDir)) {
  for (const f of fs.readdirSync(chunkDir)) {
    if (f.endsWith('.ts')) targets.push(path.join('src/data/work_chunks', f));
  }
}

for (const directory of ['src/components', 'src/views']) {
  const absoluteDirectory = path.join(root, directory);
  if (!fs.existsSync(absoluteDirectory)) continue;
  for (const name of fs.readdirSync(absoluteDirectory)) {
    if (/\.(?:ts|vue)$/.test(name)) targets.push(path.join(directory, name));
  }
}

for (const relativePath of [...new Set(targets)]) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) continue;
  const text = fs.readFileSync(fullPath, 'utf8');
  const lines = text.split(/\r?\n/);
  let changed = false;
  const newLines = lines.map((line) => {
    const converted = convertBounded(line);
    if (converted !== line) changed = true;
    return converted;
  });
  if (changed) {
    for (let retry = 0; retry < 5; retry++) {
      try {
        fs.writeFileSync(fullPath, newLines.join('\n'), 'utf8');
        console.log(`Line-by-line normalized: ${relativePath}`);
        break;
      } catch (e) {
        const start = Date.now();
        while (Date.now() - start < 200) {}
      }
    }
  }
}

console.log("Traditional Chinese normalization completed.");
