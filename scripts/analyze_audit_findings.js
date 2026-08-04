import fs from 'fs';

const results = JSON.parse(fs.readFileSync('scratch/forensic_audit_results.json', 'utf8'));

console.log("=== WORKS WITH ECHO PROBLEM (Translation Repeats Original Text) ===\n");
const echoWorks = results.filter(r => r.Echoes > 0).sort((a, b) => b.Echoes - a.Echoes);
console.table(echoWorks.map(r => ({
  Title: r.Title,
  TotalPassages: r.Psg,
  Echoed: r.Echoes,
  EchoRate: Math.round(r.Echoes / r.Psg * 100) + '%',
  AvgLen: r.AvgLen,
  Quality: r.Quality
})));

console.log("\n=== WORKS WITH GENERIC AID TEMPLATES ===\n");
const genericWorks = results.filter(r => r['GenericAid%'] !== '0%');
console.table(genericWorks.map(r => ({
  Title: r.Title,
  TotalPassages: r.Psg,
  GenericAidRate: r['GenericAid%'],
  Quality: r.Quality
})));

console.log("\n=== WORKS WITH SHORT TEXT (Avg < 50 chars) ===\n");
const shortWorks = results.filter(r => r.AvgLen < 50 && r.Psg > 0);
console.table(shortWorks.map(r => ({
  Title: r.Title,
  TotalPassages: r.Psg,
  AvgLen: r.AvgLen,
  ShortRate: r['Short%'],
  Quality: r.Quality
})));

// Total numbers
const totalPassages = results.reduce((a, r) => a + r.Psg, 0);
const totalEchoes = results.reduce((a, r) => a + r.Echoes, 0);
console.log(`\n=== SUMMARY ===`);
console.log(`Total passages across all 51 works: ${totalPassages}`);
console.log(`Total passages where translation echoes original: ${totalEchoes} (${Math.round(totalEchoes/totalPassages*100)}%)`);
console.log(`Works with zero echoes & zero generic aids: ${results.filter(r => r.Echoes === 0 && r['GenericAid%'] === '0%').length}`);
