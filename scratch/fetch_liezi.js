import fs from 'fs';

const chaptersInfo = [
  { id: 'tian-rui', title: '天瑞', url: 'https://ctext.org/liezi/tian-rui/zh' },
  { id: 'huang-di', title: '黃帝', url: 'https://ctext.org/liezi/huang-di/zh' },
  { id: 'zhou-mu-wang', title: '周穆王', url: 'https://ctext.org/liezi/zhou-mu-wang/zh' },
  { id: 'zhong-ni', title: '仲尼', url: 'https://ctext.org/liezi/zhong-ni/zh' },
  { id: 'tang-wen', title: '湯問', url: 'https://ctext.org/liezi/tang-wen/zh' },
  { id: 'li-ming', title: '力命', url: 'https://ctext.org/liezi/li-ming/zh' },
  { id: 'yang-zhu', title: '楊朱', url: 'https://ctext.org/liezi/yang-zhu/zh' },
  { id: 'shuo-fu', title: '說符', url: 'https://ctext.org/liezi/shuo-fu/zh' }
];

async function fetchAndParse() {
  const result = [];
  for (const ch of chaptersInfo) {
    console.log(`Fetching ${ch.title}...`);
    try {
      const res = await fetch(ch.url);
      const html = await res.text();
      
      // Parse the HTML to find all ctext elements
      // Typically ctext paragraphs are in <td class="ctext">...</td>
      const ctextMatches = [];
      let index = 0;
      while (true) {
        index = html.indexOf('<td class="ctext"', index);
        if (index === -1) break;
        const endIndex = html.indexOf('</td>', index);
        if (endIndex === -1) break;
        const cellHtml = html.substring(index, endIndex + 5);
        
        // Extract text inside the cell, ignoring spans or links
        // We want the main text. On ctext, the Chinese text is usually before any <br> or inside a specific tag.
        // Let's strip tags
        let text = cellHtml.replace(/<td[^>]*>/i, '').replace(/<\/td>/i, '');
        // Remove spans (like English translation translation, annotation links)
        text = text.replace(/<span[^>]*>[\s\S]*?<\/span>/gi, '');
        text = text.replace(/<a[^>]*>[\s\S]*?<\/a>/gi, '');
        // Remove any other tags
        text = text.replace(/<[^>]+>/g, '');
        text = text.trim();
        
        if (text) {
          ctextMatches.push(text);
        }
        
        index = endIndex + 5;
      }
      
      console.log(`Parsed ${ctextMatches.length} paragraphs for ${ch.title}`);
      result.push({
        id: ch.id,
        title: ch.title,
        paragraphs: ctextMatches
      });
      // Add a small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      console.error(`Error fetching ${ch.title}:`, err);
    }
  }
  
  fs.writeFileSync('./scratch/liezi_raw.json', JSON.stringify(result, null, 2), 'utf8');
  console.log('Successfully saved to scratch/liezi_raw.json');
}

fetchAndParse();
