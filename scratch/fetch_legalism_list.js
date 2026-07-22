import fs from 'fs';

async function run() {
  const url = 'https://ctext.org/legalism/zh';
  const res = await fetch(url);
  const text = await res.text();
  
  // Find all links in the main text area
  const regex = /<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
  let match;
  const links = new Set();
  while ((match = regex.exec(text)) !== null) {
    const href = match[1];
    const linkText = match[2].replace(/<[^>]+>/g, '').trim();
    if (linkText.length > 1 && !href.includes('search') && !href.includes('wiki') && !href.includes('library') && !href.includes('forum')) {
      links.add(`${linkText} -> ${href}`);
    }
  }
  console.log(Array.from(links));
}

run();
