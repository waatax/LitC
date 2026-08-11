import fs from 'fs';
import path from 'path';

const readingAidPath = path.join('.', 'src', 'data', 'readingAid.ts');
const chunksDir = path.join('.', 'src', 'data', 'work_chunks');

console.log("[*] Reading src/data/readingAid.ts...");
let text = fs.readFileSync(readingAidPath, 'utf-8');

// Strip TypeScript annotations and export keywords
text = text.replace(/export interface [\s\S]*?\}/g, '')
           .replace(/: Record<string, PassageReadingAid>/g, '')
           .replace(/export function [\s\S]*/g, '')
           .replace(/export const/g, 'const');

const fn = new Function(text + '\nreturn PASSAGE_AIDS;');
const PASSAGE_AIDS = fn();
console.log(`[+] Successfully extracted ${Object.keys(PASSAGE_AIDS).length} passage aids!`);

let totalUpdated = 0;
let totalFiles = 0;

const files = fs.readdirSync(chunksDir).filter(f => f.endsWith('.ts'));

for (const filename of files) {
  const filepath = path.join(chunksDir, filename);
  let content;
  try {
    content = fs.readFileSync(filepath, 'utf-8');
  } catch (e) {
    console.error(`[!] Could not read ${filename}:`, e.message);
    continue;
  }
  
  const match = content.match(/JSON\.parse\('(.*)'\)/s);
  if (!match) {
    console.warn(`[!] Skipping ${filename}: missing JSON.parse`);
    continue;
  }

  const rawJson = match[1].replace(/\\'/g, "'").replace(/\\\\/g, "\\");
  let bundle;
  try {
    bundle = JSON.parse(rawJson);
  } catch (e) {
    console.error(`[!] JSON parse error in ${filename}:`, e.message);
    continue;
  }

  let fileChanged = false;
  for (const p of bundle.passages || []) {
    if (PASSAGE_AIDS[p.id]) {
      p.readingAid = {
        translation: PASSAGE_AIDS[p.id].translation,
        analysis: PASSAGE_AIDS[p.id].analysis
      };
      totalUpdated++;
      fileChanged = true;
    }
  }

  if (fileChanged) {
    const payload = JSON.stringify(bundle).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
    const newContent = `import type { WorkBundle } from '../workLoader'\n\nexport default JSON.parse('${payload}') as WorkBundle\n`;
    
    let written = false;
    for (let retry = 0; retry < 3; retry++) {
      try {
        fs.writeFileSync(filepath, newContent, 'utf-8');
        written = true;
        break;
      } catch (e) {
        // Sleep briefly
        const start = Date.now();
        while (Date.now() - start < 100) {}
      }
    }
    if (written) {
      totalFiles++;
    } else {
      console.error(`[!] Failed to write file ${filename} after retries.`);
    }
  }
}

console.log(`\n[+] DONE! Successfully synced ${totalUpdated} passages across ${totalFiles} files.`);
