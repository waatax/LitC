import fs from 'fs';

const docPath = './Literature Classic.md';
const rawDataPath = './scratch/wenzi_wenshi.json';

function run() {
  const scrapedData = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));
  let docContent = fs.readFileSync(docPath, 'utf8');

  // 1. Update TOC (Table of Contents)
  // We want to add:
  //    - [《文子》全本](#四文子全本)
  //    - [《文始真經》全本](#五文始真經全本)
  // after 《列子》全本
  const targetToc = '- [《列子》全本](#三列子全本)';
  const tocIdx = docContent.indexOf(targetToc);
  if (tocIdx !== -1) {
    const endOfLine = docContent.indexOf('\n', tocIdx);
    const prefix = docContent.substring(0, endOfLine + 1);
    const suffix = docContent.substring(endOfLine + 1);
    const newTocEntries = `   - [《文子》全本](#四文子全本)\n   - [《文始真經》全本](#五文始真經全本)\n`;
    docContent = prefix + newTocEntries + suffix;
  }

  // 2. Generate Markdown sections for Wenzi and Wenshi Zhenjing
  let markdownText = '';
  const numChinese = ['四', '五'];
  scrapedData.forEach((work, wIdx) => {
    markdownText += `\n## ${numChinese[wIdx]}、《${work.title}》全本\n`;
    work.chapters.forEach((ch) => {
      markdownText += `\n### ${ch.title}\n\n`;
      ch.paragraphs.forEach((pText) => {
        markdownText += `${pText}\n\n`;
      });
    });
  });

  // 3. Insert before "# 二、法家"
  const legalismHeading = '# 二、法家';
  const targetIndex = docContent.indexOf(legalismHeading);
  if (targetIndex !== -1) {
    // Find the separator "---" before "# 二、法家"
    const dividerIndex = docContent.lastIndexOf('---', targetIndex);
    if (dividerIndex !== -1) {
      const prefix = docContent.substring(0, dividerIndex);
      const suffix = docContent.substring(dividerIndex);
      docContent = prefix + markdownText + suffix;
    }
  }

  fs.writeFileSync(docPath, docContent, 'utf8');
  console.log('Successfully updated Literature Classic.md with Wenzi & Wenshi Zhenjing!');
}

run();
