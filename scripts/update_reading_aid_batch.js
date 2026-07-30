import fs from 'fs';
import path from 'path';

const readingAidPath = path.join(process.cwd(), 'src/data/readingAid.ts');

export function applyUpdates(updatesMap) {
  let content = fs.readFileSync(readingAidPath, 'utf8');
  let updatedCount = 0;

  for (const [id, data] of Object.entries(updatesMap)) {
    const searchRegex = new RegExp(`'${id}'\\s*:\\s*\\{\\s*translation:\\s*"((?:\\\\.|[^"\\\\])*)",\\s*analysis:\\s*"((?:\\\\.|[^"\\\\])*)"\\s*\\}`, 's');
    
    const escapedTrans = data.translation.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
    const escapedAnalysis = data.analysis.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');

    if (searchRegex.test(content)) {
      content = content.replace(searchRegex, `'${id}': {\n    translation: "${escapedTrans}",\n    analysis: "${escapedAnalysis}"\n  }`);
      updatedCount++;
    } else {
      console.warn(`[WARN] Passage ID '${id}' not found in readingAid.ts!`);
    }
  }

  fs.writeFileSync(readingAidPath, content, 'utf8');
  console.log(`[SUCCESS] Updated ${updatedCount} passages in readingAid.ts cleanly!`);
  return updatedCount;
}

if (process.argv[2]) {
  const jsonPath = path.resolve(process.argv[2]);
  if (fs.existsSync(jsonPath)) {
    const updates = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    applyUpdates(updates);
  }
}
