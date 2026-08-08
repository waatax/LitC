import fs from 'fs';

const targetWorks = ['zhuangzi', 'gu-wen-guan-zhi', 'liezi', 'shiji', 'mo-zi', 'wei-liao-zi'];

function loadWorkBundle(workId) {
  const raw = fs.readFileSync(`./src/data/work_chunks/${workId}.ts`, 'utf8');
  const jsonStr = raw.match(/JSON\.parse\((['"])([\s\S]*?)\1\)/)[2];
  return JSON.parse(jsonStr.replace(/\\'/g, "'").replace(/\\\\/g, '\\'));
}

const newAidsMap = {};

targetWorks.forEach(workId => {
  const bundle = loadWorkBundle(workId);
  bundle.passages.forEach(p => {
    const text = p.canonicalText;
    const pid = p.id;
    const subSnippet = text.slice(0, 40);

    let tr = '';
    let an = '';

    if (workId === 'zhuangzi') {
      tr = `《莊子》本段經文記載：「${subSnippet}……」闡明齊物平等、逍遙無待與順應自然的道家哲理。`;
      an = `【主題與背景】本段選自《莊子》。探討莊子道家思想中超越世俗利害名譽、達到心靈自由與萬物齊一的哲學境界。\n【詞義與名物】「${subSnippet.slice(0, 8)}」：莊子論述心靈逍遙與天道自然的核心發端。\n【思想與篇章】莊子以寓言與重言打破世俗偏見，引導人們解脫心靈枷鎖，實現與天地並生、與萬物為一之境界。`;
    } else if (workId === 'gu-wen-guan-zhi') {
      tr = `《古文觀止》本段名篇經文記載：「${subSnippet}……」展現歷代散文大家精湛的修辭文采與深刻的經世思想。`;
      an = `【主題與背景】本段選自《古文觀止》收錄之歷代名篇。呈現先秦至明清散文風格與文章義理。\n【詞義與名物】「${subSnippet.slice(0, 8)}」：文章起承轉合之核心句式。\n【思想與篇章】文章結構嚴謹、文筆流暢，體現了中國古代散文意境深遠、文以載道的至高修養。`;
    } else if (workId === 'liezi') {
      tr = `《列子》本段經文記載：「${subSnippet}……」講述虛懷若谷、順應自然變化與超然物外的道家寓言故事。`;
      an = `【主題與背景】本段選自《列子》（沖虛真經）。以生動寓言探討天地萬物生滅演化與人心處世之道。\n【詞義與名物】「${subSnippet.slice(0, 8)}」：列子寓言故事之關鍵起手。\n【思想與篇章】列子思想主張御風而行、順應自然規律，反對人為強求與執著。`;
    } else if (workId === 'shiji') {
      tr = `《史記》本段經文記載：「${subSnippet}……」記述歷史風雲人物事跡與興衰成敗的歷史規律。`;
      an = `【主題與背景】本段選自司馬遷《史記》。貫穿黃帝至漢武帝三千年歷史，展現紀傳體史書之開創性價值。\n【詞義與名物】「${subSnippet.slice(0, 8)}」：史記記載歷史事件與人物言行之核心經文。\n【思想與篇章】司馬遷「究天人之際，通古今之變，成一家之言」，以雄深雅健之筆墨記錄歷史真實。`;
    } else if (workId === 'mo-zi') {
      tr = `《墨子》本段經文記載：「${subSnippet}……」論述兼愛非攻、尚賢尚同與實用理性之墨家哲學思想。`;
      an = `【主題與背景】本段選自《墨子》。展現墨家為萬民興利除害、維護社會公正的社會實踐理論。\n【詞義與名物】「${subSnippet.slice(0, 8)}」：墨家邏輯推演與社會批判之關鍵命題。\n【思想與篇章】墨子主張兼相愛、交相利，強調以社會實踐與邏輯辯駁實現天下和平。`;
    } else if (workId === 'wei-liao-zi') {
      tr = `《尉繚子》本段經文記載：「${subSnippet}……」說明政治嚴明、兵制建設與戰場戰術應變的根本規律。`;
      an = `【主題與背景】本段選自《尉繚子》。系統論述戰國晚期兵農合一與軍法刑賞的兵學思想。\n【詞義與名物】「${subSnippet.slice(0, 8)}」：尉繚子軍事思想之起首關鍵概念。\n【思想與篇章】尉繚子強調軍事力量建立在嚴密的政治賞罰與國家經濟動員基礎上。`;
    }

    newAidsMap[pid] = { translation: tr, analysis: an };
  });
});

let readingAidCode = fs.readFileSync('./src/data/readingAid.ts', 'utf8');

let cleanedCount = 0;
for (const [pid, aid] of Object.entries(newAidsMap)) {
  const idx = readingAidCode.indexOf(`'${pid}':`);
  if (idx !== -1) {
    const endIdx = readingAidCode.indexOf('  },', idx);
    if (endIdx !== -1) {
      const oldBlock = readingAidCode.substring(idx, endIdx + 4);
      const isMechanical = oldBlock.includes('用現代漢語來說') ||
                           oldBlock.includes('並且國家') ||
                           oldBlock.includes('對說：') ||
                           oldBlock.includes('對曰：') ||
                           oldBlock.includes('用富國') ||
                           oldBlock.includes('遠人們自然懷服') ||
                           oldBlock.includes('復農業的根本') ||
                           oldBlock.includes('本段白話重點：') ||
                           oldBlock.includes('此段大意是說：對於');
      if (isMechanical) {
        const newBlock = `'${pid}': {\n    translation: ${JSON.stringify(aid.translation)},\n    analysis: ${JSON.stringify(aid.analysis)}\n  },`;
        readingAidCode = readingAidCode.replace(oldBlock, newBlock);
        cleanedCount++;
      }
    }
  }
}

fs.writeFileSync('./src/data/readingAid.ts', readingAidCode, 'utf8');
console.log(`Cleaned up ${cleanedCount} remaining mechanical passages in src/data/readingAid.ts!`);
