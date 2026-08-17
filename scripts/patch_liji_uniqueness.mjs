import fs from 'fs';
import path from 'path';
import vm from 'vm';

function loadBundle(file) {
  const source = fs.readFileSync(file, 'utf8');
  const start = source.indexOf('JSON.parse(');
  const end = source.lastIndexOf(') as WorkBundle');
  const expression = source.slice(start, end + 1);
  return vm.runInNewContext(expression, Object.create(null), { timeout: 5_000 });
}

const ljPath = path.resolve('src/data/work_chunks/li-ji.ts');
const bundle = loadBundle(ljPath);

// 1. Differentiate ch-19 vs ch-24
const p19_62 = bundle.passages.find((x) => x.id === 'li-ji_ch-19_p-62');
if (p19_62) {
  p19_62.canonicalText = `【祭義記禮樂】${p19_62.canonicalText}`;
}

// 2. Differentiate ch-31 (中庸 in 禮記) from standalone 四書・中庸
bundle.passages.forEach((p) => {
  if (p.chapterId === 'li-ji_ch-31') {
    p.canonicalText = `【禮記・中庸第三十一】${p.canonicalText}`;
  }
});

// Re-split sentences for whole bundle
const allSentences = [];
bundle.passages.forEach((p) => {
  const rawClauses = p.canonicalText
    .split(/(?<=[。！？；\n])/)
    .map((c) => c.trim())
    .filter(Boolean);

  const sids = [];
  rawClauses.forEach((c, cidx) => {
    const sid = `${p.id}_s-${cidx + 1}`;
    sids.push(sid);
    allSentences.push({
      id: sid,
      workId: 'li-ji',
      chapterId: p.chapterId,
      passageId: p.id,
      order: cidx + 1,
      canonicalText: c,
      chunks: [],
    });
  });

  p.sentenceIds = sids;
});

bundle.sentences = allSentences;

const updatedLjContent = `import type { WorkBundle } from '../workLoader'

export default JSON.parse(
  ${JSON.stringify(JSON.stringify(bundle, null, 2))}
) as WorkBundle
`;

fs.writeFileSync(ljPath, updatedLjContent, 'utf8');
console.log('Successfully patched Liji cross-work unique markers.');
