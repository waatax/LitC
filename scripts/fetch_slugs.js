import https from 'https';

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'LitC editorial corpus audit', 'Accept-Encoding': 'identity' } }, response => {
      if (response.statusCode !== 200) {
        reject(new Error(`${url}: HTTP ${response.statusCode}`));
        response.resume();
        return;
      }
      response.setEncoding('utf8');
      let body = '';
      response.on('data', chunk => { body += chunk; });
      response.on('end', () => resolve(body));
    }).on('error', reject);
  });
}

async function run() {
  const books = ['shiji', 'chun-qiu-zuo-zhuan', 'han-shu', 'hou-han-shu'];
  for (const book of books) {
    console.log(`Fetching ${book}...`);
    try {
      const html = await download(`https://ctext.org/${book}/zh`);
      const matches = [...html.matchAll(new RegExp(`href="${book}/([^"]+)"[^>]*>([^<]+)</a>`, 'gi'))];
      const slugs = [];
      const seen = new Set();
      for (const [, slug, title] of matches) {
        if (!seen.has(slug)) {
          seen.add(slug);
          slugs.push([slug, title]);
        }
      }
      console.log(`Found ${slugs.length} chapters for ${book}.`);
      console.log(slugs.slice(0, 5));
    } catch (e) {
      console.error(e);
    }
  }
}

run();
