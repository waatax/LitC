import fs from 'fs';
const content = fs.readFileSync('./scratch/dao-de-jing.html', 'utf8');

const regex = /<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
let match;
const links = [];
while ((match = regex.exec(content)) !== null) {
  const href = match[1];
  const text = match[2].replace(/<[^>]+>/g, '').trim();
  // Filter for links like "dao-de-jing/.../zh" or similar
  if (href.includes('dao-de-jing') && text.length > 0 && text !== '道德經' && text !== 'English' && text !== '简体') {
    links.push({ text, href });
  }
}
console.log('Total links:', links.length);
console.log('Sample links:', links.slice(0, 10));
console.log('Last links:', links.slice(links.length - 10));
