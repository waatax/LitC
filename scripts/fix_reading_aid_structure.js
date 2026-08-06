import fs from 'fs';

let code = fs.readFileSync('./src/data/readingAid.ts', 'utf8');

// Find where READING_AID_SOURCES begins
const sourcesIdx = code.indexOf('export const READING_AID_SOURCES: Record<string, { edition: string; note: string }> = {');

if (sourcesIdx !== -1) {
  // Extract everything from export const READING_AID_SOURCES onwards
  const beforeSources = code.slice(0, sourcesIdx);
  const afterSources = code.slice(sourcesIdx);

  // Extract all passage entries that were mistakenly appended after READING_AID_SOURCES
  const passagesMatch = afterSources.match(/(\s+'[a-zA-Z0-9_-]+':\s*\{[\s\S]*?\},?)+/);

  if (passagesMatch) {
    const appendedPassages = passagesMatch[0];

    // Remove the appended passages from afterSources
    let cleanSources = afterSources.replace(appendedPassages, '');
    
    // Ensure cleanSources closes properly
    if (!cleanSources.includes('  }\n};')) {
      cleanSources = `export const READING_AID_SOURCES: Record<string, { edition: string; note: string }> = {
  default: {
    edition: '經典文脈整理本（參校中華書局、國學網底本）',
    note: '本篇譯文與解析由「經典文脈」學術團隊精心校對，融會古今注疏與現代詮釋。'
  }
};
`;
    }

    // Insert the appended passages right before `export function getSentenceTranslation` or right before the end of PASSAGE_AIDS
    const passageAidsEnd = beforeSources.indexOf('\nexport function getSentenceTranslation');
    if (passageAidsEnd !== -1) {
      const cleanPassageAids = beforeSources.slice(0, passageAidsEnd) + '\n' + appendedPassages + '\n};\n';
      const cleanFuncs = beforeSources.slice(passageAidsEnd);
      code = cleanPassageAids + '\n' + cleanFuncs + '\n' + cleanSources;
    }
  }
}

fs.writeFileSync('./src/data/readingAid.ts', code, 'utf8');
console.log('Fixed readingAid.ts structure!');
