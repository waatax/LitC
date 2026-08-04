import fs from 'fs';
import * as OpenCC from 'opencc-js';

const converter = OpenCC.Converter({ from: 'cn', to: 'tw' });

async function run() {
  console.log("=== Cross-Referencing Dianji.fun Corpus with LitC ===");
  const dianjiBooks = JSON.parse(fs.readFileSync('scratch/dianji_books_converted.json', 'utf8'));
  console.log(`Loaded ${dianjiBooks.length} books from dianji.fun (100% Traditional Chinese converted).`);
  
  const worksTs = fs.readFileSync('src/data/works.ts', 'utf8');
  const jsonEncodedMatch = worksTs.match(/decodeURIComponent\(["']([^"']+)["']\)/);
  
  if (!jsonEncodedMatch) {
    console.error("Could not find json encoded works array");
    return;
  }
  
  const litcWorks = JSON.parse(decodeURIComponent(jsonEncodedMatch[1]));
  console.log(`LitC active works count: ${litcWorks.length}`);
  
  let matchCount = 0;
  const matchedList = [];
  const missingInDianji = [];
  
  for (const work of litcWorks) {
    const titleTrad = converter(work.title);
    const match = dianjiBooks.find(b => b.titleTrad.includes(titleTrad) || titleTrad.includes(b.titleTrad));
    
    if (match) {
      matchCount++;
      matchedList.push({
        litcId: work.id,
        litcTitle: work.title,
        dianjiTitle: match.titleTrad,
        author: match.authorTrad,
        dynasty: match.dynastyTrad,
        dianjiSummary: match.summaryTrad
      });
    } else {
      missingInDianji.push({ litcId: work.id, title: work.title });
    }
  }
  
  console.log(`\n==================================================`);
  console.log(`Cross-reference Summary: ${matchCount}/${litcWorks.length} LitC works matched in Dianji.fun 2,471 catalog.`);
  console.log(`==================================================\n`);
  
  console.log("Matched Works Sample (first 15):");
  matchedList.slice(0, 15).forEach(m => {
    console.log(`- [${m.litcTitle}] <=> Dianji.fun: 《${m.dianjiTitle}》 (${m.dynasty} · ${m.author})`);
  });

  if (missingInDianji.length > 0) {
    console.log(`\nLitC Special Collections (not found in Dianji.fun top catalog):`, missingInDianji.map(m => m.title));
  }

  fs.writeFileSync('scratch/cross_reference_report.json', JSON.stringify({ matchCount, totalLitc: litcWorks.length, matchedList, missingInDianji }, null, 2), 'utf8');
  console.log("\nSaved scratch/cross_reference_report.json");
}

run();
