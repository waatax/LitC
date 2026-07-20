import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const docPath = path.join(__dirname, '../Literature Classic.md');
const rawDataPath = path.join(__dirname, '../scratch/liezi_raw.json');

function run() {
  const rawLiezi = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));
  let docContent = fs.readFileSync(docPath, 'utf8');

  // 1. Update TOC (Table of Contents)
  const oldTocLine = '   - [《莊子》選篇](#二莊子選篇)';
  const newTocLines = '   - [《莊子》選篇](#二莊子選篇)\n   - [《列子》全本](#三列子全本)';
  docContent = docContent.replace(oldTocLine, newTocLines);

  // 2. Format Liezi chapters to Markdown
  let markdownText = '\n\n## 三、《列子》全本\n';
  rawLiezi.forEach((ch) => {
    markdownText += `\n### ${ch.title}\n\n`;
    ch.paragraphs.forEach((pText) => {
      // Add double space at the end of each paragraph line to preserve line breaks if needed, 
      // but typically we can just output the paragraph text with a trailing newline.
      markdownText += `${pText}\n\n`;
    });
  });

  // 3. Insert before "# 二、法家"
  const insertionPoint = '---\n\n# 二、法家';
  const newInsertion = `${markdownText}---\n\n# 二、法家`;
  docContent = docContent.replace(insertionPoint, newInsertion);

  fs.writeFileSync(docPath, docContent, 'utf8');
  console.log('Successfully updated Literature Classic.md with Liezi under Daoism!');
}

run();
