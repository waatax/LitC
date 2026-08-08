import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const docPath = path.join(__dirname, '../Literature Classic.md');
const rawDataPath = path.join(__dirname, '../scratch/daodejing_raw.json');

function run() {
  const rawDaoDeJing = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));
  let docContent = fs.readFileSync(docPath, 'utf8');

  // 1. Update TOC (Table of Contents)
  docContent = docContent.replace('[《道德經》選章](#一道德經選章)', '[《道德經》全本](#一道德經全本)');

  // 2. Format Dao De Jing chapters to Markdown
  let markdownText = '## 一、《道德經》全本\n\n';
  rawDaoDeJing.forEach((ch) => {
    markdownText += `### 第${ch.chapterNum}段\n\n${ch.text}\n\n`;
  });

  // 3. Replace the section in the document
  // We want to find the text between "# 一、道家" and "## 二、《莊子》選篇"
  // Let's find the indices of these headings
  const startHeading = '# 一、道家\n';
  const startIndex = docContent.indexOf(startHeading);
  if (startIndex === -1) {
    console.error('Error: Could not find start heading');
    return;
  }
  
  const endHeading = '## 二、《莊子》選篇';
  const endIndex = docContent.indexOf(endHeading);
  if (endIndex === -1) {
    console.error('Error: Could not find end heading');
    return;
  }

  // The part to replace starts after "# 一、道家\n" and ends before "## 二、《莊子》選篇"
  const prefix = docContent.substring(0, startIndex + startHeading.length + 1);
  const suffix = docContent.substring(endIndex);
  
  const updatedDocContent = prefix + markdownText + suffix;

  fs.writeFileSync(docPath, updatedDocContent, 'utf8');
  console.log('Successfully updated Literature Classic.md with all 81 chapters of Dao De Jing!');
}

run();
