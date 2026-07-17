import { chapters, passages, sentences } from '../src/data/works.ts';

const targets = [
  { id: 'gu-wen-guan-zhi_ch-108', name: '桃花源記' },
  { id: 'gu-wen-guan-zhi_ch-117', name: '陋室銘' },
  { id: 'gu-wen-guan-zhi_ch-158', name: '岳陽樓記' },
  { id: 'gu-wen-guan-zhi_ch-192', name: '前赤壁賦' },
  { id: 'gu-wen-guan-zhi_ch-103', name: '前出師表' },
  { id: 'gu-wen-guan-zhi_ch-104', name: '後出師表' }
];

targets.forEach(t => {
  const ch = chapters.find(c => c.id === t.id);
  if (!ch) {
    console.log(`- ${t.name} (${t.id}): Not found in chapters!`);
    return;
  }
  const chPassages = passages.filter(p => ch.passageIds.includes(p.id));
  const chSentences = sentences.filter(s => chPassages.some(p => p.sentenceIds.includes(s.id)));
  
  console.log(`- ${t.name} (${t.id}):`);
  console.log(`  Title: ${ch.title}`);
  console.log(`  Passages count: ${chPassages.length}`);
  console.log(`  Sentences count: ${chSentences.length}`);
  if (chPassages.length > 0) {
    console.log(`  First passage text: "${chPassages[0].canonicalText.slice(0, 100)}..."`);
  }
});
