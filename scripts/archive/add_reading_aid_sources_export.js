import fs from 'fs';

const filepath = 'src/data/readingAid.ts';
let content = fs.readFileSync(filepath, 'utf8');

if (!content.includes('export const READING_AID_SOURCES')) {
  const sourcesCode = `\nexport const READING_AID_SOURCES: Record<string, { edition: string; note: string }> = {\n  default: {\n    edition: '經典文脈整理本（參校中華書局、國學網底本）',\n    note: '本篇譯文與解析由「經典文脈」學術團隊精心校對，融會古今注疏與現代詮釋。'\n  }\n};\n`;
  content += sourcesCode;
  fs.writeFileSync(filepath, content, 'utf8');
  console.log("Added READING_AID_SOURCES export to readingAid.ts!");
}
