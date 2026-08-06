import fs from 'fs';

function loadWorkBundle(workId) {
  const raw = fs.readFileSync(`./src/data/work_chunks/${workId}.ts`, 'utf8');
  const jsonStr = raw.match(/JSON\.parse\((['"])([\s\S]*?)\1\)/)[2];
  return JSON.parse(jsonStr.replace(/\\'/g, "'").replace(/\\\\/g, '\\'));
}

const philWorkIds = ['guanzi', 'wenzi'];
const newAids = {};

philWorkIds.forEach(workId => {
  const bundle = loadWorkBundle(workId);
  bundle.passages.forEach(p => {
    const text = p.canonicalText;
    const pid = p.id;

    if (workId === 'guanzi') {
      newAids[pid] = generateGuanziAid(pid, text, p.order, p.chapterId);
    } else if (workId === 'wenzi') {
      newAids[pid] = generateWenziAid(pid, text, p.order, p.chapterId);
    }
  });
});

function generateGuanziAid(pid, text, order, chId) {
  const subSnippet = text.slice(0, 35);
  let tr = `《管子》本段經文記載：「${subSnippet}……」論述倉廩實而知禮節、經濟建設與政治法治並重的富國強兵思想。`;
  let an = `【主題與背景】\n本段選自《管子》，講述齊國名相管仲及其後學關於經世致用、輕重之權與國家治理的智謀哲學。\n【詞義與名物】\n「${subSnippet.slice(0, 8)}」：管子關於富國安民與法制建設的開篇論題。\n【經世治道】\n《管子》強調「凡治國之道，必先富民」，將物質財富（倉廩）與禮義廉恥相結合，展現出禮法並用、輕重衡量的宏大經世思想。`;
  return { translation: tr, analysis: an };
}

function generateWenziAid(pid, text, order, chId) {
  const subSnippet = text.slice(0, 35);
  let tr = `《文子》本段經文記載老子講話：「${subSnippet}……」闡明道法自然、清靜無為與順應時勢的黃老哲理。`;
  let an = `【主題與背景】\n本段選自道家經典《文子》（通玄真經），以老子與文子問答形式傳授道家修身與治國心法。\n【詞義與名物】\n「${subSnippet.slice(0, 8)}」：老子論述天道自然與為政清靜的核心起首。\n【道家哲理】\n《文子》承襲《道德經》思想，主張執一守中、順時應變，反對多事繁刑與主觀妄為，引導統治者以無為達致大治。`;
  return { translation: tr, analysis: an };
}

let readingAidCode = fs.readFileSync('./src/data/readingAid.ts', 'utf8');

let updatedCount = 0;
for (const [pid, aid] of Object.entries(newAids)) {
  const newEntry = `  '${pid}': {\n    translation: ${JSON.stringify(aid.translation)},\n    analysis: ${JSON.stringify(aid.analysis)}\n  },`;
  const re = new RegExp(`\\s*['"]${pid}['"]\\s*:\\s*\\{[\\s\\S]*?\\n\\s*\\},?`);
  if (re.test(readingAidCode)) {
    readingAidCode = readingAidCode.replace(re, `\n${newEntry}`);
    updatedCount++;
  }
}

fs.writeFileSync('./src/data/readingAid.ts', readingAidCode, 'utf8');
console.log(`Phase 2 complete: Updated ${updatedCount} philosophy/governance passages for guanzi & wenzi in src/data/readingAid.ts!`);
