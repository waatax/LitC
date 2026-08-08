const https = require('https');
const fs = require('fs');
const path = require('path');

function fetchPage(pageNum) {
  return new Promise((resolve, reject) => {
    const url = `https://www.8bei8.com/book/caigentan_${pageNum}.html`;
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to fetch page ${pageNum}: ${res.statusCode}`));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function scrapeAll() {
  const allPassages = [];
  const total = 534;
  const batchSize = 20;

  for (let i = 1; i <= total; i += batchSize) {
    const promises = [];
    for (let j = 0; j < batchSize && i + j <= total; j++) {
      const pageNum = i + j;
      promises.push(
        fetchPage(pageNum).then(html => {
          // Extract 原文
          let yuanwen = '';
          const yuanwenMatch = html.match(/<div class=yuanwen>([\s\S]*?)<\/div>/);
          if (yuanwenMatch) {
            yuanwen = yuanwenMatch[1].replace(/<sup[^>]*>.*?<\/sup>/g, '').replace(/<[^>]+>/g, '').trim();
          }

          // Extract 译文
          let yiwen = '';
          const yiwenMatch = html.match(/<div class='tips tips_yiwen'>译文<\/div>([\s\S]*?)<div class='tips tips_pingxi'>/);
          if (yiwenMatch) {
            yiwen = yiwenMatch[1].replace(/<[^>]+>/g, '').trim();
          }

          return {
            id: pageNum,
            chinese: yuanwen,
            translation: yiwen
          };
        }).catch(err => {
          console.error(err.message);
          return null;
        })
      );
    }
    
    const results = await Promise.all(promises);
    for (const res of results) {
      if (res) allPassages.push(res);
    }
    console.log(`Fetched up to page ${Math.min(i + batchSize - 1, total)}`);
  }

  allPassages.sort((a, b) => a.id - b.id);
  fs.writeFileSync('scripts/data_8bei8.json', JSON.stringify(allPassages, null, 2), 'utf8');
  console.log('Successfully saved 534 passages to data_8bei8.json');
}

scrapeAll();
