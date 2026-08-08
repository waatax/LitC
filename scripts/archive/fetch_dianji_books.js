import https from 'https';

const url = 'https://www.dianji.fun/books';

const agent = new https.Agent({
  rejectUnauthorized: false
});

https.get(url, { agent }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Content Length: ${data.length}`);
    
    // Extract book links or titles using regex
    const matches = [...data.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/g)];
    console.log(`Found ${matches.length} links.`);
    
    const books = [];
    for (const match of matches) {
      const href = match[1];
      const text = match[2].trim();
      if (href.includes('/book/') || href.includes('/read/')) {
        books.push({ text, href });
      }
    }
    console.log('Books found:', books.slice(0, 30));
    
    // Save raw HTML for analysis
    import('fs').then(fs => {
      fs.default.writeFileSync('scratch/dianji_books.html', data, 'utf8');
      console.log('Saved scratch/dianji_books.html');
    });
  });
}).on('error', (err) => {
  console.error('Error fetching dianji.fun/books:', err);
});
