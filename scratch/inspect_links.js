import fs from 'fs';
const content = fs.readFileSync('C:/Users/User/.gemini/antigravity/brain/4626fe96-8a9f-4061-a8aa-e18484eefe63/.system_generated/steps/155/content.md', 'utf8');

const regex = /href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
let match;
while ((match = regex.exec(content)) !== null) {
  const href = match[1];
  const text = match[2].replace(/<[^>]+>/g, '').trim();
  // Print all hrefs that look like sub-chapters or contain numbers or have short text
  if (href.includes('dao-de-jing') || text.match(/^\d+$/) || href.match(/node=\d+/)) {
    console.log(`Href: ${href} | Text: ${text}`);
  }
}
