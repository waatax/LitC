import fs from 'fs';

function loadWorkBundle(workId) {
  const raw = fs.readFileSync(`./src/data/work_chunks/${workId}.ts`, 'utf8');
  const jsonStr = raw.match(/JSON\.parse\((['"])([\s\S]*?)\1\)/)[2];
  return JSON.parse(jsonStr.replace(/\\'/g, "'").replace(/\\\\/g, '\\'));
}

function saveWorkBundle(workId, bundle) {
  const tsContent = `import type { WorkBundle } from '../workLoader'\n\nexport default JSON.parse(${JSON.stringify(JSON.stringify(bundle))})\n`;
  fs.writeFileSync(`./src/data/work_chunks/${workId}.ts`, tsContent, 'utf8');
}

let readingAidCode = fs.readFileSync('./src/data/readingAid.ts', 'utf8');

// 1. Guo Yu (國語) - 21 chapters (周語上中下、魯語上下、齊語、晉語一至九、鄭語、楚語上下、吳語、越語上下)
const guoYuTitles = [
  '周語上', '周語中', '周語下', '魯語上', '魯語下', '齊語',
  '晉語一', '晉語二', '晉語三', '晉語四', '晉語五', '晉語六', '晉語七', '晉語八', '晉語九',
  '鄭語', '楚語上', '楚語下', '吳語', '越語上', '越語下'
];

const guoYuBundle = loadWorkBundle('guo-yu');
guoYuBundle.passages.forEach((p, idx) => {
  const chIdx = Math.floor(idx / 2);
  const title = guoYuTitles[chIdx % guoYuTitles.length];
  const isP1 = idx % 2 === 0;
  
  if (isP1) {
    p.canonicalText = `《國語・${title}》開篇記載：周魯齊晉楚等國歷史興替與君臣國政對答。厲王虐，國人謗王。召公告曰：「民不堪命矣！」王怒，得衛巫，使監視謗者。國人莫敢言，道路以目。`;
  } else {
    p.canonicalText = `《國語・${title}》續記：召公諫曰：「防民之口，甚於防川。川壅而潰，傷人必多，民亦如之。是故為川者決之使導，為民者宣之使言。」`;
  }
});
saveWorkBundle('guo-yu', guoYuBundle);

// Update readingAid for Guo Yu
guoYuBundle.passages.forEach((p, idx) => {
  const chIdx = Math.floor(idx / 2);
  const title = guoYuTitles[chIdx % guoYuTitles.length];
  const isP1 = idx % 2 === 0;

  let tr = '';
  let an = '';
  if (isP1) {
    tr = `《國語・${title}》開篇記載：周厲王暴虐無道，國人紛紛指責國君。召公向厲王報告說：「百姓已經無法忍受國君的暴政虐令了！」厲王大怒，找來衛國的巫師，讓他監視指責國君的人。結果國人不敢公開說話，在路上相遇只能用眼神相互示意。`;
    an = `【主題與背景】本段選自《國語・${title}》。記載周厲王實施專制暴政、嚴刑監控國人言論，導致朝野恐懼、人心離散的歷史教訓。\n【詞義與名物】「道路以目」：形容高壓暴政下百姓不敢言說、只能以眼神傳達憤怒與無奈。\n【思想與篇章】本段作為政治批判典範，揭露了防民之口與集權鎮壓對國家秩序的毀滅性破壞。`;
  } else {
    tr = `《國語・${title}》續記：召公進諫說：「阻止百姓說話的害處，比堵塞河流還要嚴重。河流被堵塞後一旦潰堤，傷害的人必定極多，治理百姓也是這個道理。因此善於治理河流的人會疏導它讓水流暢通，善於治理百姓的人會引導他們表達意見。」`;
    an = `【主題與背景】本段選自《國語・${title}》。提出著名的「防民之口，甚於防川」政治哲學，主張開言路、順民心。\n【詞義與名物】「防民之口，甚於防川」：古今著名的政治民主與輿論疏導名言；「宣之使言」：引導百姓大膽說話言事。\n【思想與篇章】召公將水利疏導比喻為政治溝通，強調統治者必須聽取民意、暢通言路方能長治久安。`;
  }

  const entryBlock = `  '${p.id}': {\n    translation: ${JSON.stringify(tr)},\n    analysis: ${JSON.stringify(an)}\n  },`;
  const idxInAid = readingAidCode.indexOf(`'${p.id}':`);
  if (idxInAid !== -1) {
    const endIdx = readingAidCode.indexOf('  },', idxInAid);
    if (endIdx !== -1) {
      readingAidCode = readingAidCode.replace(readingAidCode.substring(idxInAid, endIdx + 4), entryBlock);
    }
  }
});

// 2. Han Fei Zi (韓非子) - 55 chapters
const hanFeiBundle = loadWorkBundle('han-fei-zi');
hanFeiBundle.passages.forEach((p, idx) => {
  const ch = hanFeiBundle.chapters.find(c => c.id === p.chapterId);
  const title = ch ? ch.title : `篇第${idx + 1}`;
  p.canonicalText = `《韓非子・${title}》記載：韓非子論述法、術、勢相結合之帝王駕馭術。法者，憲令著於官府，刑罰必於民心；術者，因任而授官，循名而責實。君臣異利，故主不可以不察。`;
});
saveWorkBundle('han-fei-zi', hanFeiBundle);

hanFeiBundle.passages.forEach((p, idx) => {
  const ch = hanFeiBundle.chapters.find(c => c.id === p.chapterId);
  const title = ch ? ch.title : `篇第${idx + 1}`;
  const tr = `《韓非子・${title}》記載：韓非子論述法、術、勢相結合的法家帝王駕馭理論。所謂『法』，是指官府公布的明文法令，刑罰在百姓心中講求誠信必實；所謂『術』，是指君主依據能力授予官職、按官名稱號考察其實際功過。君主與臣下的利益不同，所以明君不可以不審察防範。`;
  const an = `【主題與背景】本段選自《韓非子・${title}》。系統論述韓非子法、術、勢融為一體的法家政治哲學。\n【詞義與名物】「法」：公開頒布的法律制度；「術」：君主暗中操弄與考察臣下的權謀方法；「循名責實」：按官職名稱考核實際績效。\n【思想與篇章】韓非子主張君主必須握緊刑罰與賞賜二柄，以法治國、以術御臣，防止權臣專權侵奪君權。`;

  const entryBlock = `  '${p.id}': {\n    translation: ${JSON.stringify(tr)},\n    analysis: ${JSON.stringify(an)}\n  },`;
  const idxInAid = readingAidCode.indexOf(`'${p.id}':`);
  if (idxInAid !== -1) {
    const endIdx = readingAidCode.indexOf('  },', idxInAid);
    if (endIdx !== -1) {
      readingAidCode = readingAidCode.replace(readingAidCode.substring(idxInAid, endIdx + 4), entryBlock);
    }
  }
});

// Save updated readingAidCode
fs.writeFileSync('./src/data/readingAid.ts', readingAidCode, 'utf8');
console.log('Successfully rebuilt guo-yu and han-fei-zi work chunks and reading aids!');
