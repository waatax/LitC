import fs from 'fs';

const worksToScrape = [
  // Legalism (法家)
  { id: 'shen-bu-hai', schoolId: 'legalism', title: '申不害', tocUrl: 'https://ctext.org/shen-bu-hai/zh' },
  { id: 'shenzi', schoolId: 'legalism', title: '慎子', tocUrl: 'https://ctext.org/shenzi/zh' },
  { id: 'jian-zhu-ke-shu', schoolId: 'legalism', title: '諫逐客書', tocUrl: 'https://ctext.org/jian-zhu-ke-shu/zh' },
  { id: 'guanzi', schoolId: 'legalism', title: '管子', tocUrl: 'https://ctext.org/guanzi/zh', maxChapters: 4 },

  // Military (兵家)
  { id: 'art-of-war', schoolId: 'military', title: '孫子兵法', tocUrl: 'https://ctext.org/art-of-war/zh' },
  { id: 'wu-zi', schoolId: 'military', title: '吳子', tocUrl: 'https://ctext.org/wu-zi/zh' },
  { id: 'si-ma-fa', schoolId: 'military', title: '司馬法', tocUrl: 'https://ctext.org/si-ma-fa/zh' },
  { id: 'three-strategies', schoolId: 'military', title: '三略', tocUrl: 'https://ctext.org/three-strategies/zh' },
  { id: 'wei-liao-zi', schoolId: 'military', title: '尉繚子', tocUrl: 'https://ctext.org/wei-liao-zi/zh', maxChapters: 5 },
  { id: 'liu-tao', schoolId: 'military', title: '六韜', tocUrl: 'https://ctext.org/liu-tao/zh', maxChapters: 5 },

  // History (史書)
  { id: 'shiji', schoolId: 'histories', title: '史記', tocUrl: 'https://ctext.org/shiji/zh', maxChapters: 3 },
  { id: 'chun-qiu-zuo-zhuan', schoolId: 'histories', title: '春秋左傳', tocUrl: 'https://ctext.org/chun-qiu-zuo-zhuan/zh', maxChapters: 2 },
  { id: 'zhan-guo-ce', schoolId: 'histories', title: '戰國策', tocUrl: 'https://ctext.org/zhan-guo-ce/zh', maxChapters: 3 },
  { id: 'yan-tie-lun', schoolId: 'histories', title: '鹽鐵論', tocUrl: 'https://ctext.org/yan-tie-lun/zh', maxChapters: 5 },
  { id: 'yandanzi', schoolId: 'histories', title: '燕丹子', tocUrl: 'https://ctext.org/yandanzi/zh' },
  { id: 'xijing-zaji', schoolId: 'histories', title: '西京雜記', tocUrl: 'https://ctext.org/xijing-zaji/zh', maxChapters: 2 },
  { id: 'lost-book-of-zhou', schoolId: 'histories', title: '逸周書', tocUrl: 'https://ctext.org/lost-book-of-zhou/zh', maxChapters: 2 },
  { id: 'guo-yu', schoolId: 'histories', title: '國語', tocUrl: 'https://ctext.org/guo-yu/zh', maxChapters: 2 },
  { id: 'yanzi-chun-qiu', schoolId: 'histories', title: '晏子春秋', tocUrl: 'https://ctext.org/yanzi-chun-qiu/zh', maxChapters: 2 },
  { id: 'wu-yue-chun-qiu', schoolId: 'histories', title: '吳越春秋', tocUrl: 'https://ctext.org/wu-yue-chun-qiu/zh', maxChapters: 2 },
  { id: 'yue-jue-shu', schoolId: 'histories', title: '越絕書', tocUrl: 'https://ctext.org/yue-jue-shu/zh', maxChapters: 2 },
  { id: 'lie-nv-zhuan', schoolId: 'histories', title: '列女傳', tocUrl: 'https://ctext.org/lie-nv-zhuan/zh', maxChapters: 2 },
  { id: 'guliang-zhuan', schoolId: 'histories', title: '春秋穀梁傳', tocUrl: 'https://ctext.org/guliang-zhuan/zh', maxChapters: 2 },
  { id: 'gongyang-zhuan', schoolId: 'histories', title: '春秋公羊傳', tocUrl: 'https://ctext.org/gongyang-zhuan/zh', maxChapters: 2 },
  { id: 'han-shu', schoolId: 'histories', title: '漢書', tocUrl: 'https://ctext.org/han-shu/zh', maxChapters: 2 },
  { id: 'hou-han-shu', schoolId: 'histories', title: '後漢書', tocUrl: 'https://ctext.org/hou-han-shu/zh', maxChapters: 2 },
  { id: 'qian-han-ji', schoolId: 'histories', title: '前漢紀', tocUrl: 'https://ctext.org/qian-han-ji/zh', maxChapters: 2 },
  { id: 'dong-guan-han-ji', schoolId: 'histories', title: '東觀漢記', tocUrl: 'https://ctext.org/dong-guan-han-ji/zh', maxChapters: 2 },
  { id: 'zhushu-jinian', schoolId: 'histories', title: '竹書紀年', tocUrl: 'https://ctext.org/zhushu-jinian/zh', maxChapters: 2 },
  { id: 'mutianzi-zhuan', schoolId: 'histories', title: '穆天子傳', tocUrl: 'https://ctext.org/mutianzi-zhuan/zh', maxChapters: 2 },
  { id: 'gu-san-fen', schoolId: 'histories', title: '古三墳', tocUrl: 'https://ctext.org/gu-san-fen/zh', maxChapters: 2 }
];

function cleanParagraphText(cellHtml) {
  let text = cellHtml;
  // Remove spans (like English translation, annotation links)
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

      // Check if this page contains text rows directly
      const hasTextDirectly = html.includes('<td class="ctext"');

      if (hasTextDirectly) {
        console.log(`- Page contains text directly. Parsing paragraphs...`);
        const paragraphs = parseTextFromHtml(html);
        console.log(`- Extracted ${paragraphs.length} paragraphs`);
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
        // Parse TOC sub-links
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

          // Must look like "work_id/sub_slug" or similar relative URL
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
            // Construct absolute URL
            const absUrl = href.startsWith('http') ? href : `https://ctext.org/${href}`;
            subLinks.push({ title, url: absUrl });
          }
        }

        console.log(`- Found ${subLinks.length} sub-links.`);
        let linksToFetch = subLinks;
        if (work.maxChapters && subLinks.length > work.maxChapters) {
          linksToFetch = subLinks.slice(0, work.maxChapters);
          console.log(`- Truncated to first ${work.maxChapters} chapters.`);
        }

        const chapters = [];
        for (const link of linksToFetch) {
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

  fs.writeFileSync('./scratch/classics_extracted.json', JSON.stringify(output, null, 2), 'utf8');
  console.log('\nSuccessfully saved all scraped works to scratch/classics_extracted.json!');
}

scrape();
