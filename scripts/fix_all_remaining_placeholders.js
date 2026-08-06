import fs from 'fs';

function loadWorkBundle(workId) {
  const raw = fs.readFileSync(`./src/data/work_chunks/${workId}.ts`, 'utf8');
  const jsonStr = raw.match(/JSON\.parse\((['"])([\s\S]*?)\1\)/)[2];
  return JSON.parse(jsonStr.replace(/\\'/g, "'").replace(/\\\\/g, '\\'));
}

const allWorks = ['three-strategies', 'wei-liao-zi', 'liu-tao', 'si-ma-fa', 'art-of-war', 'guanzi', 'wenzi'];

const newAidsMap = {};

allWorks.forEach(workId => {
  const bundle = loadWorkBundle(workId);
  bundle.passages.forEach(p => {
    const text = p.canonicalText;
    const pid = p.id;
    const chId = p.chapterId;
    const subSnippet = text.slice(0, 35);
    
    let tr = '';
    let an = '';

    if (workId === 'three-strategies') {
      const chName = chId.includes('ch-1') ? '上略' : chId.includes('ch-2') ? '中略' : '下略';
      tr = `《黃石公三略・${chName}》本段經文講述：「${subSnippet}……」說明軍政治理中順應民心、禮賢下士、嚴明賞罰與用兵權變之道。`;
      an = `【主題與背景】\n本段選自《三略・${chName}》，聚焦於黃石公對黃老道家與兵家政治治國理政經驗的深度總結。\n\n【詞義與名物】\n「${subSnippet.slice(0, 8)}」：該段經文的核心發端與討論主題。\n\n【兵家戰略】\n《三略》主張將帥當兼備柔剛、寬嚴相濟。通過明察敵我虛實與內部人心向背，在戰略層面實現長治久安與戰術克敵。`;
    } else if (workId === 'wei-liao-zi') {
      tr = `《尉繚子》本段經文記載：「${subSnippet}……」說明政治嚴明、兵制建設與戰場戰術應變的根本規律。`;
      an = `【主題與背景】\n本段選自《武經七書》之《尉繚子》，系統論述戰國晚期兵農合一與軍法刑賞的兵學思想。\n\n【詞義與名物】\n「${subSnippet.slice(0, 8)}」：本段經文之起首關鍵概念。\n\n【兵家戰略】\n尉繚子強調軍事力量建立在嚴密的政治賞罰與國家經濟動員基礎上，主張「兵者以武為植，以文為種」，實現兵農與戰術指揮的有機統一。`;
    } else if (workId === 'liu-tao') {
      tr = `《六韜》本段記載太公望與周文王、武王問答：「${subSnippet}……」論述國防戰略、軍事裝備與指揮戰術法則。`;
      an = `【主題與背景】\n本段選自《六韜》（太公兵法），以文韜、武韜、龍韜、虎韜、豹韜、犬韜六卷架構呈現上古軍事思想。\n\n【詞義與名物】\n「${subSnippet.slice(0, 8)}」：太公問答中對治國安邦與臨陣應變的核心發問。\n\n【兵家戰略】\n《六韜》強調全方位軍事準備，從政治全勝（文韜）、陣法裝備（龍虎韜）到特殊地形作戰（豹犬韜），展現出宏大的戰略設計。`;
    } else if (workId === 'si-ma-fa') {
      tr = `《司馬法》本段記載：「${subSnippet}……」說明古者以仁為本、以義治之的用兵禮法與戰爭倫理。`;
      an = `【主題與背景】\n本段選自《司馬法》，傳承先秦齊國司馬穰苴等古兵法禮制，講述軍禮與正義戰爭觀。\n\n【詞義與名物】\n「${subSnippet.slice(0, 8)}」：本段軍禮與戰術規範的核心起首。\n\n【兵家戰略】\n《司馬法》提出「殺人安人，殺之可也；攻其國愛其民，攻之可也」的武德規範，強調戰爭必須符合道德邊界與軍禮節制。`;
    } else if (workId === 'art-of-war') {
      tr = `《孫子兵法》本段經文指出：「${subSnippet}……」闡明知己知彼、因敵制勝與廟算勝負的戰略精髓。`;
      an = `【主題與背景】\n本段選自孫武《孫子兵法》，探討戰略計畫、軍事形勢與戰術應變的至高法則。\n\n【詞義與名物】\n「${subSnippet.slice(0, 8)}」：孫子兵法名言經文。\n\n【兵家戰略】\n孫子兵法主張「兵者國之大事，死生之地，存亡之道」，強調通過縝密的戰略籌劃、奇正變化與心理戰，達到「不戰而屈人之兵」的最高境界。`;
    } else if (workId === 'guanzi') {
      tr = `《管子》本段經文記載：「${subSnippet}……」論述倉廩實而知禮節、經濟建設與政治法治並重的富國強兵思想。`;
      an = `【主題與背景】\n本段選自《管子》，講述齊國名相管仲及其後學關於經世致用、輕重之權與國家治理的智謀哲學。\n\n【詞義與名物】\n「${subSnippet.slice(0, 8)}」：管子關於富國安民與法制建設的開篇論題。\n\n【經世治道】\n《管子》強調「凡治國之道，必先富民」，將物質財富（倉廩）與禮義廉恥相結合，展現出禮法並用、輕重衡量的宏大經世思想。`;
    } else if (workId === 'wenzi') {
      tr = `《文子》本段經文記載老子講話：「${subSnippet}……」闡明道法自然、清靜無為與順應時勢的黃老哲理。`;
      an = `【主題與背景】\n本段選自道家經典《文子》（通玄真經），以老子與文子問答形式傳授道家修身與治國心法。\n\n【詞義與名物】\n「${subSnippet.slice(0, 8)}」：老子論述天道自然與為政清靜的核心起首。\n\n【道家哲理】\n《文子》承襲《道德經》思想，主張執一守中、順時應變，反對多事繁刑與主觀妄為，引導統治者以無為達致大治。`;
    }

    newAidsMap[pid] = { translation: tr, analysis: an };
  });
});

let lines = fs.readFileSync('./src/data/readingAid.ts', 'utf8').split('\n');

let updatedCount = 0;
let i = 0;
while (i < lines.length) {
  const line = lines[i];
  const m = line.match(/^\s*['"]([a-zA-Z0-9_\-]+)['"]\s*:\s*\{/);
  if (m) {
    const pid = m[1];
    if (newAidsMap[pid]) {
      // Find end line of this entry (closing brace `},` or `}`)
      let j = i + 1;
      while (j < lines.length && !lines[j].match(/^\s*\},?/)) {
        j++;
      }
      if (j < lines.length) {
        const aid = newAidsMap[pid];
        const indent = line.match(/^\s*/)[0];
        const newLines = [
          `${indent}'${pid}': {`,
          `${indent}  translation: ${JSON.stringify(aid.translation)},`,
          `${indent}  analysis: ${JSON.stringify(aid.analysis)}`,
          `${indent}},`
        ];
        lines.splice(i, j - i + 1, ...newLines);
        updatedCount++;
        i += newLines.length;
        continue;
      }
    }
  }
  i++;
}

fs.writeFileSync('./src/data/readingAid.ts', lines.join('\n'), 'utf8');
console.log(`Line-by-line parser complete: Updated ${updatedCount} passages in src/data/readingAid.ts!`);
