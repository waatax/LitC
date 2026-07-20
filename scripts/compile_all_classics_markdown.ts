import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const docPath = path.join(__dirname, '../Literature Classic.md');
const rawDataPath = path.join(__dirname, '../scratch/classics_extracted.json');

function run() {
  const scrapedData = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));
  let docContent = fs.readFileSync(docPath, 'utf8');

  // 1. Generate TOC for new works
  const newToc = `## 目錄

1. [道家](#一道家)
   - [《道德經》全本](#一道德經全本)
   - [《莊子》選篇](#二莊子選篇)
   - [《列子》全本](#三列子全本)
2. [法家](#二法家)
   - [《韓非子》選篇](#一韓非子選篇)
   - [《商君書》選篇](#二商君書選篇)
   - [《申不害》全本](#三申不害全本)
   - [《慎子》全本](#四慎子全本)
   - [《諫逐客書》全本](#五諫逐客書全本)
   - [《管子》選篇](#六管子選篇)
3. [墨家](#三墨家)
   - [《墨子》選篇](#一墨子選篇)
4. [兵家](#四兵家)
   - [《孫子兵法》全本](#一孫子兵法全本)
   - [《吳子》全本](#二吳子全本)
   - [《六韜》選篇](#三六韜選篇)
   - [《司馬法》全本](#四司馬法全本)
   - [《尉繚子》選篇](#五尉繚子選篇)
   - [《三略》全本](#六三略全本)
5. [史書](#五史書)
   - [《史記》選篇](#一史記選篇)
   - [《春秋左傳》選篇](#二春秋左傳選篇)
   - [《逸周書》選篇](#三逸周書選篇)
   - [《國語》選篇](#四國語選篇)
   - [《晏子春秋》選篇](#五晏子春秋選篇)
   - [《吳越春秋》選篇](#六吳越春秋選篇)
   - [《越絕書》選篇](#七越絕書選篇)
   - [《戰國策》選篇](#八戰國策選篇)
   - [《鹽鐵論》選篇](#九鹽鐵論選篇)
   - [《列女傳》選篇](#十列女傳選篇)
   - [《春秋穀梁傳》選篇](#十一春秋穀梁傳選篇)
   - [《春秋公羊傳》選篇](#十二春秋公羊傳選篇)
   - [《漢書》選篇](#十三漢書選篇)
   - [《後漢書》選篇](#十四後漢書選篇)
   - [《前漢紀》選篇](#十五前漢紀選篇)
   - [《東觀漢記》選篇](#十六東觀漢記選篇)
   - [《竹書紀年》選篇](#十七竹書紀年選篇)
   - [《穆天子傳》選篇](#十八穆天子傳選篇)
   - [《古三墳》選篇](#十九古三墳選篇)
   - [《燕丹子》全本](#二十燕丹子全本)
   - [《西京雜記》選篇](#二十一西京雜記選篇)
6. [版本與校勘附記](#六版本與校勘附記)`;

  // Replace TOC
  const tocStart = docContent.indexOf('## 目錄');
  const tocEnd = docContent.indexOf('---', tocStart);
  if (tocStart !== -1 && tocEnd !== -1) {
    docContent = docContent.substring(0, tocStart) + newToc + '\n' + docContent.substring(tocEnd);
  }

  // 2. Generate Markdown sections for new works
  const legalismWorks = scrapedData.filter(w => w.schoolId === 'legalism');
  const militaryWorks = scrapedData.filter(w => w.schoolId === 'military');
  const historyWorks = scrapedData.filter(w => w.schoolId === 'histories');

  // Insert Legalism works under "## 二、法家"
  // Find where "# 二、法家" is, and we'll append the new works right before "# 三、墨家" (or "---" before "# 三、墨家")
  let legalismMarkdown = '';
  legalismWorks.forEach((work, wIdx) => {
    // Determine number (1: Hanfeizi, 2: Shangjunshu, so new ones start from 3)
    const numStr = ['三', '四', '五', '六'][wIdx];
    const suffix = work.chapters.length > 1 ? '選篇' : '全本';
    legalismMarkdown += `\n## ${numStr}、《${work.title}》${suffix}\n`;
    
    work.chapters.forEach((ch) => {
      legalismMarkdown += `\n### ${ch.title}\n\n`;
      ch.paragraphs.forEach((pText) => {
        legalismMarkdown += `${pText}\n\n`;
      });
    });
  });

  const mohistStart = docContent.indexOf('# 三、墨家');
  const dividerBeforeMohist = docContent.lastIndexOf('---', mohistStart);
  if (dividerBeforeMohist !== -1) {
    docContent = docContent.substring(0, dividerBeforeMohist) + legalismMarkdown + '---\n\n' + docContent.substring(mohistStart);
  }

  // 3. Generate Military and History Markdown
  let militaryMarkdown = '\n# 四、兵家\n';
  const numChinese = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '二十一'];
  militaryWorks.forEach((work, wIdx) => {
    const suffix = work.chapters.length > 1 && work.chapters.length <= 5 ? '選篇' : (work.chapters.length === 1 ? '全本' : '全本');
    militaryMarkdown += `\n## ${numChinese[wIdx]}、《${work.title}》${suffix}\n`;
    work.chapters.forEach((ch) => {
      militaryMarkdown += `\n### ${ch.title}\n\n`;
      ch.paragraphs.forEach((pText) => {
        militaryMarkdown += `${pText}\n\n`;
      });
    });
  });

  let historyMarkdown = '\n# 五、史書\n';
  historyWorks.forEach((work, wIdx) => {
    const suffix = work.chapters.length > 1 && work.chapters.length <= 5 ? '選篇' : (work.chapters.length === 1 ? '全本' : '全本');
    historyMarkdown += `\n## ${numChinese[wIdx]}、《${work.title}》${suffix}\n`;
    work.chapters.forEach((ch) => {
      historyMarkdown += `\n### ${ch.title}\n\n`;
      ch.paragraphs.forEach((pText) => {
        historyMarkdown += `${pText}\n\n`;
      });
    });
  });

  // 4. Insert Military and History before "# 四、版本與校勘附記" (now # 六、版本與校勘附記)
  // Let's replace "# 四、版本與校勘附記" with the new sections + the updated heading
  const footerHeadingIndex = docContent.indexOf('# 四、版本與校勘附記');
  if (footerHeadingIndex !== -1) {
    const prefix = docContent.substring(0, footerHeadingIndex);
    const suffix = docContent.substring(footerHeadingIndex).replace('# 四、版本與校勘附記', '# 六、版本與校勘附記');
    
    docContent = prefix + militaryMarkdown + '---\n' + historyMarkdown + '---\n\n' + suffix;
  }

  fs.writeFileSync(docPath, docContent, 'utf8');
  console.log('Successfully updated Literature Classic.md with all new classics under Legalism, Military, and History!');
}

run();
