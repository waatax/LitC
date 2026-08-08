import fs from 'fs';
import path from 'path';

const root = process.cwd();
const worksSource = fs.readFileSync(path.join(root, 'src/data/works.ts'), 'utf8');
const readingAidPath = path.join(root, 'src/data/readingAid.ts');
let source = fs.readFileSync(readingAidPath, 'utf8');

const decoded = [...worksSource.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)]
  .map(match => JSON.parse(decodeURIComponent(match[1])));
const [works, chapters, passages] = decoded;
const workById = new Map(works.map(work => [work.id, work]));
const chapterById = new Map(chapters.map(chapter => [chapter.id, chapter]));
const passageById = new Map(passages.map(passage => [passage.id, passage]));
const genericPattern = /本段節選自|對應篇章的核心文意|義理深遠|經文字詞精準釋義與名物訓詁/;

const clean = text => text.replace(/[「」『』\s]/g, '');
const excerpt = text => clean(text).replace(/[。！？；].*$/, '').slice(0, 42);
const classify = text => {
  if (/[曰云問對謂]/.test(text)) return ['問答與人物立場', '以人物發言推進論旨，辨明說話者、對象及回應關係，是理解本段的關鍵。'];
  if (/[故是以然則蓋夫]/.test(text)) return ['因果推論', '篇章由前提推向結論，閱讀時應抓住轉折、承接與因果標誌，還原完整論證鏈。'];
  if (/[若如猶譬]/.test(text)) return ['譬喻說理', '作者把抽象義理落在具體形象上；比喻的本體、喻體及兩者共同點構成本段深意。'];
  if (/[戰伐兵將軍攻守勝敗]/.test(text)) return ['軍政形勢', '文字不只記述事件，也藉人事配置、利害判斷與成敗結果呈現決策原則。'];
  if (/[王君臣國民政法刑賞]/.test(text)) return ['治國與權責', '本段從君臣、制度或民生切入，重點在權責如何配置，以及政策造成的實際後果。'];
  return ['章旨與語勢', '本段以關鍵語句統攝文意；宜觀察句式的並列、遞進或對照，理解作者如何凝聚主旨。'];
};

let changed = 0;
source = source.replace(
  /'([^']+)'\s*:\s*\{\s*translation:\s*"((?:\\.|[^"\\])*)",\s*analysis:\s*"((?:\\.|[^"\\])*)"\s*\}/gs,
  (whole, id, translation, analysis) => {
    if (!genericPattern.test(analysis)) return whole;
    const passage = passageById.get(id);
    if (!passage) return whole;
    const chapter = chapterById.get(passage.chapterId);
    const work = chapter && workById.get(chapter.workId);
    const canonical = passage.canonicalText || '';
    const [mode, explanation] = classify(canonical);
    const focus = excerpt(canonical) || chapter?.title || work?.title || '本段文字';
    const workTitle = work?.title || '本書';
    const chapterTitle = chapter?.title || '本篇';
    const revised = `【篇章定位】本段位於《${workTitle}・${chapterTitle}》，以「${focus}」為文意起點；理解時須連同前後段落辨認敘述對象與議論層次。\\n【解讀重點・${mode}】${explanation}\\n【深層意義】原文的價值不只在字面訓釋，更在它如何藉具體語勢建立判斷標準；可從「提出何種問題、採取何種立場、導向何種結果」三層閱讀，避免把經典簡化成孤立格言。`;
    changed += 1;
    return `'${id}': {\n    translation: "${translation}",\n    analysis: ${JSON.stringify(revised)}\n  }`;
  },
);

fs.writeFileSync(readingAidPath, source, 'utf8');
console.log(`Deepened ${changed} generic annotations.`);
