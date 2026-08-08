import fs from 'fs';
import path from 'path';

const reportPath = path.resolve('corpus_audit_report.md');
const dbPath = path.resolve('Literature Classic.md');

const reportText = fs.readFileSync(reportPath, 'utf8');
const dbText = fs.readFileSync(dbPath, 'utf8');

const lines = reportText.split('\n');
const replacements = [];

// Flexible parsing logic to accommodate different agents' outputs
const regexes = [
  /原文[**]*：?\s*\`?([^\`➔]+)\`?\s*➔\s*[**]*(?:建議|修正)[**]*：?\s*\`?([^\`\n]+)\`?/,
  /原文：(.*?)➔\s*建議：(.*)/,
  /修正「(.*?)」➔「(.*?)」/,
  /修正「(.*?)」為「(.*?)」/,
  /「(.*?)」➔「(.*?)」/
];

for (let line of lines) {
  let matched = false;
  for (let regex of regexes) {
    const m = line.match(regex);
    if (m) {
      let from = m[1].replace(/^[「『\`\s]+|[」』\`\s]+$/g, '').trim();
      let to = m[2].replace(/^[「『\`\s]+|[」』\`\s]+$/g, '').trim();
      
      // Some agents output markdown bold like **原文**
      from = from.replace(/\*\*/g, '');
      to = to.replace(/\*\*/g, '');
      
      if (from.length > 0 && to.length > 0 && from !== to) {
        replacements.push({ from, to });
        matched = true;
        break;
      }
    }
  }
}

// Special edge cases reported by Zhuangzi agent
if (reportText.includes('（之）')) replacements.push({from: '（之）', to: ''});
if (reportText.includes('（其）')) replacements.push({from: '（其）', to: ''});
if (reportText.includes('（利）')) replacements.push({from: '（利）', to: ''});
if (reportText.includes('（龜）')) replacements.push({from: '（龜）', to: ''});
if (reportText.includes('（身）')) replacements.push({from: '（身）', to: ''});
if (reportText.includes('（舜曰...')) replacements.push({from: '（舜曰天下之大，又存息焉，辭天下而無所假。）', to: ''});
if (reportText.includes('（行之以五德...')) replacements.push({from: '（行之以五德，應之以自然，然後得其所。）', to: ''});


console.log(`Parsed ${replacements.length} replacement rules.`);

let modifiedDb = dbText;
let appliedCount = 0;

for (let r of replacements) {
  if (modifiedDb.includes(r.from)) {
    // Only replace if it exists
    modifiedDb = modifiedDb.replace(r.from, r.to);
    appliedCount++;
  } else {
    console.log(`[Warning] Could not find exact string in DB: "${r.from}"`);
  }
}

console.log(`Successfully applied ${appliedCount} out of ${replacements.length} replacements.`);

if (process.argv.includes('--apply')) {
  fs.writeFileSync(dbPath, modifiedDb, 'utf8');
  console.log('Saved applied changes to Literature Classic.md');
} else {
  console.log('Dry run complete. Use --apply to save changes.');
}
