const fs = require('node:fs')

const source = fs.readFileSync('data_sources/works.ts', 'utf8')

function extract(name) {
  const match = source.match(new RegExp(`export const ${name} = JSON\\.parse\\(('(?:\\\\.|[^'\\\\])*')\\)`))
  if (!match) throw new Error(`Unable to extract ${name} from data_sources/works.ts`)
  return JSON.parse(Function(`"use strict"; return ${match[1]}`)())
}

function asJsonParse(value) {
  const json = JSON.stringify(value)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
  return `JSON.parse('${json}')`
}

const CANONICAL_ORDER = [
  // 儒家 (Confucianism)
  'lun-yu',
  'meng-zi',
  'da-xue',
  'zhong-yong',
  'xunzi',
  'yi-jing',
  'shu-jing',
  'shi-jing',
  'li-ji',
  'chun-qiu',

  // 道家 (Daoism)
  'dao-de-jing',
  'zhuangzi',
  'liezi',
  'wenzi',
  'wenshi-zhenjing',

  // 法家 (Legalism)
  'han-fei-zi',
  'shang-jun-shu',
  'shen-bu-hai',
  'shenzi',
  'jian-zhu-ke-shu',
  'guanzi',

  // 墨家 (Mohism)
  'mo-zi',

  // 兵家 (Military)
  'art-of-war',
  'wu-zi',
  'si-ma-fa',
  'three-strategies',
  'wei-liao-zi',
  'liu-tao',

  // 史書 (Histories)
  'shiji',
  'chun-qiu-zuo-zhuan',
  'zhan-guo-ce',
  'yan-tie-lun',
  'yandanzi',
  'xijing-zaji',
  'lost-book-of-zhou',
  'guo-yu',
  'yanzi-chun-qiu',
  'wu-yue-chun-qiu',
  'yue-jue-shu',
  'lie-nv-zhuan',
  'guliang-zhuan',
  'gongyang-zhuan',
  'han-shu',
  'hou-han-shu',
  'qian-han-ji',
  'dong-guan-han-ji',
  'zhushu-jinian',
  'mutianzi-zhuan',
  'gu-san-fen',

  // 文學 (Literature)
  'gu-wen-guan-zhi',
  'cai-gen-tan'
];

const subtitles = {
  'dao-de-jing': '老子',
  'zhuangzi': '南華真經',
  'liezi': '沖虛至德真經',
  'shang-jun-shu': '商鞅及其後學',
  'mo-zi': '墨翟及墨家後學',
  'art-of-war': '孫武',
  'wu-zi': '吳起',
  'three-strategies': '黃石公三略',
  'liu-tao': '太公兵法',
  'zhan-guo-ce': '劉向編定',
  'xunzi': '荀況著',
  'cai-gen-tan': '洪應明',
  'yanzi-chun-qiu': '晏嬰'
};

const rawWorks = extract('works')
const works = rawWorks
  .map(w => {
    let title = w.title;
    if (!title.startsWith('《')) {
      title = `《${title}》`;
    }
    return {
      ...w,
      title,
      ...(subtitles[w.id] && !w.subtitle ? { subtitle: subtitles[w.id] } : {})
    };
  })
  .sort((a, b) => {
    const idxA = CANONICAL_ORDER.indexOf(a.id);
    const idxB = CANONICAL_ORDER.indexOf(b.id);
    return (idxA >= 0 ? idxA : 999) - (idxB >= 0 ? idxB : 999);
  });

const chapters = extract('chapters').map(({ passageIds: _passageIds, ...chapter }) => chapter)
const output = `// Generated lightweight library index. Run: node scripts/generate_catalog.cjs\n` +
  `import type { Work, Chapter } from '../types/content'\n\n` +
  `export const catalogWorks = ${asJsonParse(works)} as Work[]\n` +
  `export const catalogChapters = ${asJsonParse(chapters)} as Chapter[]\n`

fs.writeFileSync('src/data/catalog.ts', output, 'utf8')
console.log(`Generated catalog: ${works.length} works, ${chapters.length} chapters, ${output.length} bytes`)
