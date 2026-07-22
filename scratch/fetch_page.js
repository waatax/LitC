import fs from 'fs';

async function fetchPage() {
  const url = 'https://ctext.org/dao-de-jing/zh';
  console.log(`Fetching ${url}...`);
  const res = await fetch(url);
  const text = await res.text();
  fs.writeFileSync('./scratch/dao-de-jing.html', text, 'utf8');
  console.log(`Saved ${text.length} bytes to scratch/dao-de-jing.html`);
}

fetchPage();
