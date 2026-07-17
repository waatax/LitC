import fs from 'fs';
import path from 'path';

const cacheDir = 'C:/Users/User/.gemini/antigravity/brain/94415241-e907-4a0d-ab2d-2708f581a7e2/scratch/guwen_cache';
const metadata = JSON.parse(fs.readFileSync(path.join(cacheDir, 'metadata.json'), 'utf8'));

// Pick 5 test articles
const testArticles = [
  metadata[0],               // Vol 1 Art 1 (鄭伯克段于鄢)
  metadata[30],              // Vol 2 Art 13
  metadata[75],              // Vol 4 Art 17
  metadata[120],             // Vol 7 Art 13
  metadata[221]              // Vol 12 Art 18 (the very last one)
];

async function main() {
  for (const art of testArticles) {
    const filename = `art_${art.volume}_${art.file}`;
    const filePath = path.join(cacheDir, filename);
    let html = '';

    if (fs.existsSync(filePath)) {
      html = fs.readFileSync(filePath, 'utf8');
    } else {
      console.log(`Downloading ${art.title} (Vol ${art.volume})...`);
      try {
        const res = await fetch(art.url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        html = await res.text();
        fs.writeFileSync(filePath, html, 'utf8');
        await new Promise(r => setTimeout(r, 200));
      } catch (e) {
        console.error(`Failed to download ${art.title}:`, e.message);
        continue;
      }
    }

    // Clean up HTML comments, whitespace, script tags
    let body = html.replace(/<script[\s\S]*?<\/script>/gi, '')
                   .replace(/<!--[\s\S]*?-->/g, '')
                   .replace(/\r\n/g, '\n')
                   .replace(/\r/g, '\n');

    // Find the starting point of the article text
    // The title usually matches e.g. "卷一 ‧ 鄭伯克段于鄢" or just the chapter title
    // Let's find where the body text starts. 
    // In these pages, the content is in paragraph-like lines in a div or center or just raw in the body.
    // Let's split by lines/paragraphs. Typically, paragraphs are separated by <p> or <br> or double newlines.
    // Let's look at the raw HTML output of some pages to see how the text is structured.
    console.log(`\n--- Article: ${art.title} (Vol ${art.volume}) ---`);
    
    // Let's check if there is a heading "白話翻譯"
    const splitIndex = body.indexOf('白話翻譯');
    if (splitIndex === -1) {
      console.warn(`No "白話翻譯" heading found for ${art.title}!`);
      // Print first 1000 characters of clean text to inspect
      console.log(body.replace(/<[^>]*>/g, '').slice(0, 1000));
      continue;
    }

    const originalPart = body.slice(0, splitIndex);
    const translationPart = body.slice(splitIndex);

    // Extract paragraphs. Paragraphs in Hanchuan Caolu are usually plain lines of text separated by <p> or <br> or \n\n.
    // Let's extract all non-empty text lines that don't look like menus or headers.
    function extractParagraphs(text) {
      // Replace <br> and <p> with newlines, then strip tags
      const cleanText = text.replace(/<(p|br|div|tr|td)[\s\S]*?>/gi, '\n')
                            .replace(/<[^>]*>/g, '');
      
      return cleanText.split('\n')
                      .map(line => line.trim())
                      .filter(line => {
                        if (!line) return false;
                        if (line.includes('首頁') || line.includes('總集類') || line.includes('古文觀止')) return false;
                        if (line.includes('白話翻譯') || line.includes('下篇') || line.includes('上篇')) return false;
                        if (line.startsWith('卷') && line.includes('‧')) return false;
                        return line.length > 5; // Skip very short header/footer lines
                      });
    }

    const origParas = extractParagraphs(originalPart);
    const transParas = extractParagraphs(translationPart);

    console.log(`Original paragraphs: ${origParas.length}`);
    console.log(`Translation paragraphs: ${transParas.length}`);
    
    if (origParas.length !== transParas.length) {
      console.log(`⚠️ MISMATCH! Original count: ${origParas.length}, Translation count: ${transParas.length}`);
    } else {
      console.log(`✅ MATCH! Count: ${origParas.length}`);
    }
  }
}

main();
