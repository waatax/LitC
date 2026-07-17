import fs from 'fs';
import path from 'path';

const dictUrl = 'https://raw.githubusercontent.com/BYVoid/OpenCC/master/data/dictionary/STCharacters.txt';
const outputPath = 'C:/Users/User/.gemini/antigravity/brain/94415241-e907-4a0d-ab2d-2708f581a7e2/scratch/s2t.json';

async function main() {
  console.log(`Downloading dictionary from ${dictUrl}...`);
  try {
    const res = await fetch(dictUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    
    const lines = text.split('\n');
    const mapping = {};
    
    for (const line of lines) {
      if (!line.trim()) continue;
      const parts = line.split('\t');
      if (parts.length >= 2) {
        const sChar = parts[0];
        // Take the first traditional character mapping if multiple exist
        const tChars = parts[1].split(' ');
        mapping[sChar] = tChars[0];
      }
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(mapping, null, 2), 'utf8');
    console.log(`Saved Simplified-to-Traditional map with ${Object.keys(mapping).length} characters!`);
  } catch (e) {
    console.error("Failed to compile s2t map:", e);
  }
}

main();
