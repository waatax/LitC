import fs from 'fs';
const content = fs.readFileSync('C:/Users/User/.gemini/antigravity/brain/4626fe96-8a9f-4061-a8aa-e18484eefe63/.system_generated/steps/155/content.md', 'utf8');

const regex = /href="([^"]+)"/g;
let match;
const hrefs = [];
while ((match = regex.exec(content)) !== null) {
  hrefs.push(match[1]);
}
console.log('Total hrefs:', hrefs.length);
console.log('Sample hrefs:', hrefs.slice(0, 100));
