import fs from 'fs';
import path from 'path';

const reportPath = 'C:/Users/User/.gemini/antigravity/brain/2c9cf475-88e0-4fca-8dbe-bd40e3571734/web_validation_report.md';
const dbPath = path.resolve('Literature Classic.md');

const reportText = fs.readFileSync(reportPath, 'utf8');
let dbText = fs.readFileSync(dbPath, 'utf8');

const blocks = reportText.split('File: Literature Classic.md').slice(1);
const replacements = [];

for (let block of blocks) {
  const searchMatch = block.match(/Search String:\s*(.*?)\r?\nReplacement:\s*(.*?)\r?\nRationale:/s);
  if (searchMatch) {
    let from = searchMatch[1].trim();
    let to = searchMatch[2].trim();
    
    if (from.length > 0 && from !== to) {
      replacements.push({ from, to });
    }
  }
}

console.log(`Parsed ${replacements.length} replacement rules.`);

let appliedCount = 0;
for (let r of replacements) {
  if (dbText.includes(r.from)) {
    dbText = dbText.replace(r.from, r.to);
    appliedCount++;
  } else {
    console.log(`[Warning] Could not find exact string in DB:\n"${r.from}"`);
  }
}

console.log(`Successfully applied ${appliedCount} out of ${replacements.length} replacements.`);

if (process.argv.includes('--apply')) {
  fs.writeFileSync(dbPath, dbText, 'utf8');
  console.log('Saved applied changes to Literature Classic.md');
} else {
  console.log('Dry run complete. Use --apply to save changes.');
}
