const https = require('https');
const fs = require('fs');

function fetchPage(pageNum) {
  return new Promise((resolve, reject) => {
    const url = `https://www.8bei8.com/book/caigentan_${pageNum}.html`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function scrape() {
  for (let i = 1; i <= 3; i++) {
    const html = await fetchPage(i);
    const yuanwenMatch = html.match(/<div class=yuanwen>([\s\S]*?)<\/div>/);
    const yiwenMatch = html.match(/<div class='tips tips_yiwen'>译文<\/div>([\s\S]*?)<div class='tips tips_pingxi'>/);
    
    if (yuanwenMatch) {
      let yuanwen = yuanwenMatch[1].replace(/<sup[^>]*>.*?<\/sup>/g, '').replace(/<[^>]+>/g, '').trim();
      let yiwen = yiwenMatch ? yiwenMatch[1].replace(/<[^>]+>/g, '').trim() : '';
      console.log(`--- Page ${i} ---`);
      console.log("原文:", yuanwen);
      console.log("译文:", yiwen);
    }
  }
}

scrape();
