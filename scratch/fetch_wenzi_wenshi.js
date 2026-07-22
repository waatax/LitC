import fs from 'fs';

const worksToScrape = [
  { id: 'wenzi', schoolId: 'daoism', title: '文子', tocUrl: 'https://ctext.org/wenzi/zh' },
  { id: 'wenshi-zhenjing', schoolId: 'daoism', title: '文始真經', tocUrl: 'https://ctext.org/wenshi-zhenjing/zh' }
];

function cleanParagraphText(cellHtml) {
  let text = cellHtml;
  text = text.replace(/<span[^>]*>[\s\S]*?<\/span>/gi, '');
  text = text.replace(/<a[^>]*>[\s\S]*?<\/a>/gi, '');
  text = text.replace(/<[^>]+>/g, '');
  text = text.trim();
  return text;
}

function parseTextFromHtml(html) {
  const paragraphs = [];
  let index = 0;
  while (true) {
    index = html.indexOf('<td class="ctext"', index);
    if (index === -1) break;
    const endIndex = html.indexOf('</td>', index);
    if (endIndex === -1) break;
    const cellHtml = html.substring(index, endIndex + 5);
    const cleaned = cleanParagraphText(cellHtml);
    if (cleaned) {
      paragraphs.push(cleaned);
    }
    index = endIndex + 5;
  }
  return paragraphs;
}

async function scrape() {
  const output = [];

  for (const work of worksToScrape) {
    console.log(`\nProcessing work: ${work.title} (${work.id})...`);
    try {
      const res = await fetch(work.tocUrl);
      const html = await res.text();

      // Check if page contains text rows directly
      const hasTextDirectly = html.includes('<td class="ctext"');

      if (hasTextDirectly) {
        console.log(`- Page contains text directly. Parsing paragraphs...`);
        const paragraphs = parseTextFromHtml(html);
        output.push({
          id: work.id,
          title: work.title,
          schoolId: work.schoolId,
          sourceUrl: work.tocUrl,
          chapters: [
            {
              title: work.title,
              paragraphs
            }
          ]
        });
      } else {
        console.log(`- Page is TOC. Parsing chapter sub-links...`);
        const regex = /<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
        let match;
        const subLinks = [];
        const seenHrefs = new Set();

        while ((match = regex.exec(html)) !== null) {
          const href = match[1];
          const title = match[2].replace(/<[^>]+>/g, '').trim();
          
          const lowerTitle = title.toLowerCase();
          const isHelperLink = 
            lowerTitle === '简体' || 
            lowerTitle === 'english' || 
            lowerTitle === '繁体' || 
            lowerTitle === '显示各种版本' || 
            lowerTitle === '顯示各種版本' || 
            lowerTitle === '登入' || 
            lowerTitle === '顯示相似段落' ||
            lowerTitle === '打開字典' ||
            lowerTitle === '顯示影印本' ||
            lowerTitle === '顯示注釋' ||
            lowerTitle === work.title.toLowerCase() ||
            href.includes('account.pl') ||
            href.includes('dictionary.pl') ||
            href.includes('photo.pl') ||
            href.includes('resource.pl');

          if (
            href.includes(work.id) &&
            title.length > 0 &&
            !isHelperLink &&
            !seenHrefs.has(href) &&
            !href.includes('search') &&
            !href.includes('wiki') &&
            !href.includes('forum') &&
            !href.includes('library')
          ) {
            seenHrefs.add(href);
            const absUrl = href.startsWith('http') ? href : `https://ctext.org/${href}`;
            subLinks.push({ title, url: absUrl });
          }
        }

        console.log(`- Found ${subLinks.length} sub-links.`);
        const chapters = [];
        for (const link of subLinks) {
          console.log(`  - Fetching chapter: ${link.title} (${link.url})...`);
          try {
            const chRes = await fetch(link.url);
            const chHtml = await chRes.text();
            const paragraphs = parseTextFromHtml(chHtml);
            console.log(`    - Extracted ${paragraphs.length} paragraphs`);
            if (paragraphs.length > 0) {
              chapters.push({
                title: link.title,
                paragraphs
              });
            }
            await new Promise(r => setTimeout(r, 1000));
          } catch (e) {
            console.error(`    - Error fetching chapter:`, e.message);
          }
        }

        output.push({
          id: work.id,
          title: work.title,
          schoolId: work.schoolId,
          sourceUrl: work.tocUrl,
          chapters
        });
      }
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      console.error(`- Error processing work:`, err.message);
    }
  }

  fs.writeFileSync('./scratch/wenzi_wenshi.json', JSON.stringify(output, null, 2), 'utf8');
  console.log('\nSuccessfully saved works to scratch/wenzi_wenshi.json!');
}

scrape();
